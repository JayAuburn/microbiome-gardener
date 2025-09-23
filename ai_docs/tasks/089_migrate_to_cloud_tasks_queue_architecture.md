# Migrate RAG Processor to Cloud Tasks Queue Architecture

> **Task Complexity:** 🔴 COMPLEX TASK  
> **Sections Used:** 1,3,4,6,8,10,11,17 (~800 lines)

---

## 1. Task Overview

### Task Title
**Title:** Migrate RAG Processor from HTTP EventArc to Pure Cloud Tasks Queue Architecture

### Goal Statement
**Goal:** Completely eliminate the 429 "no available instance" errors by replacing the current HTTP-based EventArc system with a robust Cloud Tasks queue architecture that provides graceful backpressure handling, automatic retries, and perfect scalability.

**Problem Being Solved:**
- **Current Issue:** EventArc → HTTP calls directly to Cloud Run instances cause 429 errors when max_instances is reached
- **Root Cause:** No queuing mechanism - events are lost when all instances are busy
- **Impact:** Service outages when processing 3+ documents simultaneously

**Solution:** 
- **New Architecture:** EventArc → Cloud Tasks Queue → Cloud Run task processors
- **Benefits:** Unlimited queuing, automatic retries, graceful degradation, zero lost events

---

## 3. Strategic Analysis & Solution Options

### Current Architecture Problems
1. **Direct HTTP Calls**: EventArc → Cloud Run HTTP endpoint (no buffering)
2. **Hard Instance Limits**: max_instances=5 → 6th request = 429 error
3. **Lost Events**: 429 errors mean EventArc notifications are permanently lost
4. **No Retry Logic**: Failed processing attempts aren't automatically retried
5. **All-or-Nothing**: System either processes immediately or fails completely

### Target Architecture Benefits
1. **Event Queuing**: EventArc → Cloud Tasks queue → unlimited buffering
2. **Graceful Scaling**: 100 uploads = 100 queued tasks, processed at available capacity  
3. **Automatic Retries**: Failed tasks retry with exponential backoff (3 attempts by default)
4. **Dead Letter Queues**: Permanently failed tasks captured for investigation
5. **Perfect Backpressure**: System degrades gracefully instead of failing

### Architecture Comparison

#### Current (HTTP-based)
```
File Upload → EventArc → HTTP POST → Cloud Run Instance
                                   ↓ (if max instances hit)
                                429 Error = LOST EVENT
```

#### New (Queue-based)  
```
File Upload → EventArc → Cloud Tasks Queue → Cloud Run Task Processor
                                      ↓ (queue management)
                              Automatic queuing, retries, backpressure
```

---

## 4. Technical Requirements

### Infrastructure Changes Required

#### Google Cloud APIs
- ✅ **Already Enabled**: `eventarc.googleapis.com`, `run.googleapis.com`
- 🆕 **New Requirement**: `cloudtasks.googleapis.com`

#### IAM Permissions (New)
- **EventArc Service Agent** → `roles/cloudtasks.enqueuer` (enqueue tasks)
- **Cloud Run Service Account** → `roles/cloudtasks.taskRunner` (process tasks)
- **Cloud Tasks Service Agent** → `roles/run.invoker` (invoke Cloud Run for tasks)

#### Infrastructure Components
- 🆕 **Main Queue**: `{service-name}-processing-queue`
- 🆕 **Dead Letter Queue**: `{service-name}-processing-queue-dlq`
- 🔄 **EventArc Trigger**: Change destination from HTTP to Cloud Tasks
- 🔄 **Cloud Run Service**: Change from HTTP server to task processor

### Application Architecture Changes

#### Remove (HTTP-based)
```python
# ❌ Remove all HTTP server code
from fastapi import FastAPI, Request
app = FastAPI()

@app.post("/")
async def process_eventarc_notification(request: Request):
    # Direct HTTP processing
```

#### Replace With (Task-based)
```python
# ✅ Add Cloud Tasks processor
from google.cloud import tasks_v2
from google.cloud.tasks_v2 import CloudTasksAsyncClient

class CloudTasksProcessor:
    async def start_processing(self) -> None:
        # Poll tasks from queue and process
```

---

## 6. Implementation Plan

### Phase 1: Infrastructure Setup (gcp_setup_core.py)

#### 1.1 Enable Cloud Tasks API
**File:** `scripts/gcp_setup_core.py`
**Function:** `enable_apis()`

```python
# In enable_apis_only() function in gcp_utils.py
# Add to REQUIRED_APIS list:
"cloudtasks.googleapis.com",  # Cloud Tasks for queue-based processing
```

#### 1.2 Create Cloud Tasks Infrastructure
**File:** `scripts/gcp_setup_core.py`
**New Function:** Add after `create_storage_bucket()`

```python
def setup_cloud_tasks_infrastructure(config: dict[str, Any]) -> None:
    """Setup Cloud Tasks queues and permissions for file processing"""
    env_config = config["env_config"]
    project_id = config["project_id"]
    region = config["region"]
    service_name = env_config["service_name"]
    
    log_step("Cloud Tasks", f"Setting up task queues for {env_config['environment']}...")
    
    # Define queue names
    main_queue = f"{service-name}-processing-queue"
    dlq_queue = f"{service-name}-processing-queue-dlq"
    
    # 1. Create main processing queue
    try:
        log(f"Creating main processing queue: {main_queue}")
        run_command(f"""
gcloud tasks queues create {main_queue} 
    --location={region} 
    --max-concurrent-dispatches=10
    --max-dispatches-per-second=5
    --max-attempts=3
    --max-retry-duration=3600s
    --project={project_id}
""")
        log_success(f"Main queue created: {main_queue}")
    except Exception as e:
        if "already exists" in str(e).lower():
            log_warning(f"Queue {main_queue} already exists - will reuse")
        else:
            raise e
    
    # 2. Create dead letter queue  
    try:
        log(f"Creating dead letter queue: {dlq_queue}")
        run_command(f"""
gcloud tasks queues create {dlq_queue}
    --location={region}
    --max-concurrent-dispatches=1
    --max-dispatches-per-second=1
    --project={project_id}
""")
        log_success(f"Dead letter queue created: {dlq_queue}")
    except Exception as e:
        if "already exists" in str(e).lower():
            log_warning(f"Dead letter queue {dlq_queue} already exists - will reuse")
        else:
            raise e
    
    # 3. Setup IAM permissions for Cloud Tasks workflow
    setup_cloud_tasks_iam_permissions(config, main_queue, dlq_queue)
    
    # Store queue names in config for deployment
    config["main_queue_name"] = main_queue
    config["dlq_queue_name"] = dlq_queue
    
    log_success("Cloud Tasks infrastructure setup completed")
```

#### 1.3 Setup Cloud Tasks IAM Permissions
**File:** `scripts/gcp_setup_core.py`
**New Function:** Add after `setup_cloud_tasks_infrastructure()`

```python
def setup_cloud_tasks_iam_permissions(config: dict[str, Any], main_queue: str, dlq_queue: str) -> None:
    """Configure IAM permissions for Cloud Tasks workflow"""
    project_id = config["project_id"]
    service_account_email = config["service_account_email"]
    
    log("Setting up Cloud Tasks IAM permissions...")
    
    try:
        # Get project number for service agents
        project_number = run_command(
            f"gcloud projects describe {project_id} --format='value(projectNumber)'"
        ).strip()
        
        # Define service agents
        eventarc_agent = f"service-{project_number}@gcp-sa-eventarc.iam.gserviceaccount.com"
        cloudtasks_agent = f"service-{project_number}@gcp-sa-cloudtasks.iam.gserviceaccount.com"
        
        # IAM permissions to grant
        permissions = [
            # EventArc service agent can enqueue tasks
            (eventarc_agent, "roles/cloudtasks.enqueuer", "EventArc → enqueue tasks"),
            
            # Cloud Run service account can process tasks
            (service_account_email, "roles/cloudtasks.taskRunner", "Cloud Run → process tasks"),
            
            # Cloud Tasks service agent can invoke Cloud Run
            (cloudtasks_agent, "roles/run.invoker", "Cloud Tasks → invoke Cloud Run"),
        ]
        
        # Grant permissions with retry logic
        success_count = 0
        for member, role, description in permissions:
            try:
                run_command(f"""
gcloud projects add-iam-policy-binding {project_id}
    --member=serviceAccount:{member}
    --role={role}
    --quiet
""")
                log(f"  ✓ {description}")
                success_count += 1
            except Exception as e:
                log_warning(f"Could not grant {role} to {member}: {e}")
        
        if success_count == len(permissions):
            log_success("All Cloud Tasks IAM permissions configured")
        else:
            log_success(f"Cloud Tasks IAM setup completed ({success_count}/{len(permissions)} successful)")
            
    except Exception as e:
        log_warning(f"Could not setup all Cloud Tasks IAM permissions: {e}")
        log("You may need to configure some permissions manually")
```

#### 1.4 Integrate into Main Setup Flow
**File:** `scripts/gcp_setup_core.py`
**Function:** `setup_gcp_environment()`

```python
# In Phase 4: Infrastructure Setup, add after create_storage_bucket():
setup_cloud_tasks_infrastructure(config)
```

### Phase 2: Deployment Configuration (deploy_core.py)

#### 2.1 Replace EventArc HTTP Trigger
**File:** `scripts/deploy_core.py`
**Function:** Replace `setup_enhanced_eventarc()` entirely

```python
def setup_cloud_tasks_eventarc(config: DeploymentConfig) -> None:
    """Setup EventArc to enqueue Cloud Tasks instead of direct HTTP calls"""
    project_id = config["project_id"]
    region = config["region"]
    service_name = config["service_name"] 
    bucket_name = config.get("bucket_name")
    rag_service_account = config["rag_service_account"]
    
    # Derive queue name from service name
    queue_name = f"{service_name}-processing-queue"
    trigger_name = f"{service_name}-trigger"
    
    if not bucket_name:
        log("⚠️  GOOGLE_CLOUD_STORAGE_BUCKET not configured - EventArc trigger cannot be created")
        return
        
    log("🔄 Setting up EventArc → Cloud Tasks trigger...")
    log(f"   GCS Bucket: {bucket_name}")
    log(f"   Target Queue: {queue_name}")
    log(f"   Trigger Name: {trigger_name}")
    log(f"   Service Account: {rag_service_account}")
    
    def create_cloud_tasks_eventarc_trigger() -> bool:
        """Create EventArc trigger targeting Cloud Tasks queue"""
        try:
            # Check if trigger exists first
            describe_result = subprocess.run([
                "gcloud", "eventarc", "triggers", "describe", trigger_name,
                f"--location={region}", "--quiet"
            ], capture_output=True, text=True)
            
            if describe_result.returncode == 0:
                # Trigger exists - update it to target Cloud Tasks
                log(f"📝 Updating existing trigger to target Cloud Tasks: {trigger_name}")
                subprocess.run([
                    "gcloud", "eventarc", "triggers", "update", trigger_name,
                    f"--location={region}",
                    f"--destination-cloud-tasks-queue={queue_name}",
                    f"--destination-cloud-tasks-location={region}",
                    "--event-filters=type=google.cloud.storage.object.v1.finalized",
                    f"--event-filters=bucket={bucket_name}",
                    f"--service-account={rag_service_account}",
                    "--quiet"
                ], check=True, text=True, capture_output=True)
                log(f"✅ Updated EventArc trigger to target Cloud Tasks: {trigger_name}")
                return True
            else:
                # Trigger doesn't exist - create new one targeting Cloud Tasks
                log(f"🔄 Creating new EventArc trigger targeting Cloud Tasks: {trigger_name}")
                subprocess.run([
                    "gcloud", "eventarc", "triggers", "create", trigger_name,
                    f"--destination-cloud-tasks-queue={queue_name}",
                    f"--destination-cloud-tasks-location={region}",
                    "--event-filters=type=google.cloud.storage.object.v1.finalized", 
                    f"--event-filters=bucket={bucket_name}",
                    f"--location={region}",
                    f"--service-account={rag_service_account}",
                    "--quiet"
                ], check=True, text=True, capture_output=True)
                log(f"✅ Created EventArc trigger targeting Cloud Tasks: {trigger_name}")
                return True
                
        except subprocess.CalledProcessError as e:
            log_warning(f"EventArc trigger setup failed: {e.stderr if e.stderr else str(e)}")
            return False
    
    # Create the trigger
    trigger_success = create_cloud_tasks_eventarc_trigger()
    
    if trigger_success:
        log("✅ EventArc → Cloud Tasks trigger setup completed successfully")
        log(f"   File uploads to gs://{bucket_name}/ will now enqueue tasks in {queue_name}")
        log("   Tasks will be processed by Cloud Run instances as capacity allows")
    else:
        log_warning("EventArc → Cloud Tasks trigger setup failed")
        log("💡 You may need to configure the trigger manually:")
        log(f"   • Trigger name: {trigger_name}")
        log("   • Event type: google.cloud.storage.object.v1.finalized")
        log(f"   • Destination: Cloud Tasks queue {queue_name}")
        log(f"   • Bucket: {bucket_name}")
```

#### 2.2 Update Cloud Run Deployment
**File:** `scripts/deploy_core.py`
**Function:** `deploy_to_cloud_run()`

```python
# In deploy_to_cloud_run(), modify environment variables:
cloud_run_env = [
    f"GOOGLE_CLOUD_PROJECT_ID={project_id}",
    f"GOOGLE_CLOUD_REGION={region}", 
    f"GOOGLE_CLOUD_STORAGE_BUCKET={env_vars.get('GOOGLE_CLOUD_STORAGE_BUCKET', '')}",
    "ENVIRONMENT=production",
    f"LOG_LEVEL={env_vars.get('LOG_LEVEL', 'INFO')}",
    
    # NEW: Cloud Tasks configuration
    "PROCESSING_MODE=cloud_tasks",
    f"QUEUE_NAME={service_name}-processing-queue",
    f"DLQ_NAME={service_name}-processing-queue-dlq",
]

# Update deployment args - remove HTTP-specific configurations:
deploy_args = [
    "gcloud", "run", "deploy", str(service_name),
    f"--image={str(image_name)}",
    "--platform=managed",
    f"--region={str(region)}",
    
    # Keep authentication for security (task processing still needs it)
    "--no-allow-unauthenticated",
    
    f"--set-env-vars={env_vars_str}",
    f"--set-secrets=DATABASE_URL={config_obj.database_secret_name}:latest,GEMINI_API_KEY={config_obj.gemini_api_key_secret_name}:latest",
    f"--cpu={config_obj.cpu}",
    f"--memory={config_obj.memory}",
    "--execution-environment=gen2",
    f"--max-instances={config_obj.max_instances}",
    f"--min-instances={config_obj.min_instances}",
    f"--concurrency={config_obj.concurrency}",
    
    # Still need port for health checks
    f"--port=8080",
    f"--service-account={str(rag_service_account)}",
    
    # Task processing optimizations
    "--timeout=3600",  # Longer timeout for task processing
    "--cpu-boost",
    "--no-cpu-throttling",
    
    # Simple health check for monitoring
    "--startup-probe=httpGet.path=/health,httpGet.port=8080,initialDelaySeconds=60,failureThreshold=3,periodSeconds=120,timeoutSeconds=60",
]
```

#### 2.3 Update Main Deployment Function
**File:** `scripts/deploy_core.py`
**Function:** `deploy_gcp_environment()`

```python
# Replace the EventArc setup call:
# OLD: setup_enhanced_eventarc(config)
# NEW:
setup_cloud_tasks_eventarc(config)
```

### Phase 3: Application Code Changes (main.py)

#### 3.1 Remove HTTP Server Components
**File:** `rag_processor/main.py`
**Remove all HTTP-related code:**

```python
# ❌ REMOVE ALL OF THIS:
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="RAG Processor", version="1.0.0")

@app.post("/")
async def process_eventarc_notification(request: Request):
    # Remove entire HTTP handler

@app.get("/health")
async def health_check():
    # Keep this but simplify

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

#### 3.2 Implement Cloud Tasks Processor
**File:** `rag_processor/main.py`
**Replace with pure task processing:**

```python
import asyncio
import json
import os
import signal
import sys
from datetime import datetime, timezone
from typing import Any

import structlog
from google.cloud import tasks_v2
from google.cloud.tasks_v2 import CloudTasksAsyncClient

# Import existing processing logic
from rag_processor.services.processing_service import ProcessingService
from rag_processor.utils.error_handling import NonRetryableError

logger = structlog.get_logger()

class CloudTasksProcessor:
    """Cloud Tasks-based file processor for RAG pipeline"""
    
    def __init__(self):
        self.client = CloudTasksAsyncClient()
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
        self.location = os.getenv("GOOGLE_CLOUD_REGION", "us-central1") 
        self.queue_name = os.getenv("QUEUE_NAME", "rag-processor-dev-processing-queue")
        self.dlq_name = os.getenv("DLQ_NAME", "rag-processor-dev-processing-queue-dlq")
        
        # Build queue paths
        self.queue_path = self.client.queue_path(self.project_id, self.location, self.queue_name)
        self.dlq_path = self.client.queue_path(self.project_id, self.location, self.dlq_name)
        
        # Initialize processing service
        self.processing_service = ProcessingService()
        
        # Graceful shutdown handling
        self.shutdown_requested = False
        signal.signal(signal.SIGTERM, self._handle_shutdown)
        signal.signal(signal.SIGINT, self._handle_shutdown)
        
    def _handle_shutdown(self, signum, frame):
        """Handle graceful shutdown"""
        logger.info("Shutdown signal received", signal=signum)
        self.shutdown_requested = True
        
    async def start_processing(self) -> None:
        """Start the main task processing loop"""
        logger.info("Starting Cloud Tasks processor", 
                   queue=self.queue_name, 
                   project=self.project_id,
                   location=self.location)
        
        while not self.shutdown_requested:
            try:
                # Pull tasks from queue (long polling)
                tasks = await self.pull_tasks(max_messages=1, ack_deadline=600)
                
                if not tasks:
                    # No tasks available, short sleep to avoid busy waiting
                    await asyncio.sleep(1)
                    continue
                    
                # Process each task
                for task in tasks:
                    if self.shutdown_requested:
                        break
                    await self.process_task(task)
                    
            except Exception as e:
                logger.error("Error in processing loop", error=str(e))
                # Brief pause before retrying to avoid rapid error loops
                await asyncio.sleep(5)
                
        logger.info("Cloud Tasks processor shutting down gracefully")
        
    async def pull_tasks(self, max_messages: int = 1, ack_deadline: int = 600):
        """Pull tasks from Cloud Tasks queue"""
        try:
            request = tasks_v2.PullRequest(
                name=self.queue_path,
                max_messages=max_messages,
                ack_deadline_seconds=ack_deadline
            )
            
            response = await self.client.pull(request=request)
            return response.messages
            
        except Exception as e:
            logger.error("Failed to pull tasks from queue", error=str(e))
            return []
            
    async def process_task(self, task) -> None:
        """Process a single file processing task"""
        task_id = task.message.message_id
        
        try:
            # Decode task payload (EventArc GCS notification)
            payload_data = task.message.data.decode('utf-8')
            payload = json.loads(payload_data)
            
            logger.info("Processing file task", 
                       task_id=task_id,
                       bucket=payload.get('bucket'),
                       file_name=payload.get('name'))
            
            # Extract file information from EventArc payload
            bucket_name = payload.get('bucket')
            file_path = payload.get('name') 
            event_type = payload.get('eventType', 'unknown')
            
            # Validate payload
            if not bucket_name or not file_path:
                logger.warning("Invalid task payload - missing bucket or file path", 
                             payload=payload, task_id=task_id)
                await self.ack_task(task)  # Ack to prevent retry of invalid payload
                return
                
            # Process the file using existing processing service
            await self.processing_service.process_file_from_gcs(
                bucket_name=bucket_name,
                file_path=file_path
            )
            
            # Acknowledge successful processing
            await self.ack_task(task)
            logger.info("Task completed successfully", 
                       task_id=task_id,
                       file_path=file_path)
            
        except NonRetryableError as e:
            # Non-retryable errors should be acked to prevent infinite retries
            logger.error("Task failed with non-retryable error", 
                        task_id=task_id, 
                        error=str(e))
            await self.ack_task(task)
            
        except Exception as e:
            # Retryable errors - don't ack, let Cloud Tasks retry
            logger.error("Task processing failed - will retry", 
                        task_id=task_id, 
                        error=str(e))
            # Don't ack - Cloud Tasks will retry based on queue configuration
            
    async def ack_task(self, task) -> None:
        """Acknowledge task completion"""
        try:
            ack_request = tasks_v2.AcknowledgeRequest(
                name=task.message.name,
                ack_id=task.message.ack_id
            )
            await self.client.acknowledge(request=ack_request)
        except Exception as e:
            logger.error("Failed to acknowledge task", error=str(e))

# Simple HTTP server for health checks (required for Cloud Run)
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="RAG Processor - Cloud Tasks Mode", version="2.0.0")

@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run monitoring"""
    return JSONResponse({
        "status": "healthy",
        "processing_mode": "cloud_tasks",
        "queue_name": os.getenv("QUEUE_NAME"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.get("/")
async def root():
    """Root endpoint - redirects to health check"""
    return await health_check()

# Main entry point
async def main():
    """Main application entry point"""
    processing_mode = os.getenv("PROCESSING_MODE", "cloud_tasks")
    
    if processing_mode != "cloud_tasks":
        logger.error("Invalid processing mode - only 'cloud_tasks' is supported", 
                    mode=processing_mode)
        sys.exit(1)
        
    logger.info("Starting RAG Processor in Cloud Tasks mode")
    
    # Start task processor
    processor = CloudTasksProcessor()
    await processor.start_processing()

if __name__ == "__main__":
    # Run health check server in background for Cloud Run
    import threading
    
    def run_health_server():
        uvicorn.run(app, host="0.0.0.0", port=8080, log_level="warning")
    
    # Start health server in background thread
    health_thread = threading.Thread(target=run_health_server, daemon=True)
    health_thread.start()
    
    # Run main task processor
    asyncio.run(main())
```

### Phase 4: Configuration Updates

#### 4.1 Add Queue Configuration
**File:** `scripts/deployment_config.py`
**Add to EnvironmentConfig dataclass:**

```python
@dataclass
class EnvironmentConfig:
    # ... existing fields ...
    
    # Cloud Tasks Queue Configuration
    queue_name: str = ""
    dlq_name: str = ""
    max_concurrent_dispatches: int = 10
    max_dispatches_per_second: int = 5
    task_max_attempts: int = 3
    task_max_retry_duration: int = 3600  # 1 hour
    
    def __post_init__(self) -> None:
        # Set default queue names if not provided
        if not self.queue_name:
            self.queue_name = f"{self.service_name}-processing-queue"
        if not self.dlq_name:
            self.dlq_name = f"{self.service_name}-processing-queue-dlq"
            
        # Existing validation...
        self._validate_configuration()
```

#### 4.2 Update Dependencies
**File:** `pyproject.toml`
**Add Cloud Tasks dependency:**

```toml
[project.dependencies]
# ... existing dependencies ...
"google-cloud-tasks>=2.10.0"  # Cloud Tasks client library
```

### Phase 5: Dead Letter Queue Handling

#### 5.1 Add Dead Letter Processor
**File:** `rag_processor/services/dead_letter_service.py`
**New file:**

```python
"""Dead Letter Queue processor for permanently failed tasks"""

import json
from datetime import datetime, timezone
from typing import Any

import structlog
from google.cloud import tasks_v2
from google.cloud.tasks_v2 import CloudTasksAsyncClient

logger = structlog.get_logger()

class DeadLetterProcessor:
    """Handle tasks that failed all retry attempts"""
    
    def __init__(self, project_id: str, location: str, dlq_name: str):
        self.client = CloudTasksAsyncClient()
        self.project_id = project_id
        self.location = location
        self.dlq_name = dlq_name
        self.dlq_path = self.client.queue_path(project_id, location, dlq_name)
        
    async def process_dead_letters(self) -> None:
        """Process failed tasks for investigation and logging"""
        logger.info("Checking for dead letter tasks", dlq=self.dlq_name)
        
        try:
            # Pull dead letter tasks
            tasks = await self.pull_dead_letter_tasks()
            
            for task in tasks:
                await self.handle_dead_letter_task(task)
                
        except Exception as e:
            logger.error("Error processing dead letter queue", error=str(e))
            
    async def pull_dead_letter_tasks(self, max_messages: int = 10):
        """Pull tasks from dead letter queue"""
        try:
            request = tasks_v2.PullRequest(
                name=self.dlq_path,
                max_messages=max_messages,
                ack_deadline_seconds=300  # 5 minutes to process
            )
            
            response = await self.client.pull(request=request)
            return response.messages
            
        except Exception as e:
            logger.error("Failed to pull from dead letter queue", error=str(e))
            return []
            
    async def handle_dead_letter_task(self, task) -> None:
        """Handle a single dead letter task"""
        task_id = task.message.message_id
        
        try:
            # Decode the failed task payload
            payload_data = task.message.data.decode('utf-8')
            payload = json.loads(payload_data)
            
            # Log critical failure for investigation
            logger.critical("DEAD LETTER TASK - Permanent failure detected",
                           task_id=task_id,
                           bucket=payload.get('bucket'),
                           file_path=payload.get('name'),
                           event_type=payload.get('eventType'),
                           failure_reason="Max retries exceeded",
                           timestamp=datetime.now(timezone.utc).isoformat())
            
            # TODO: BRANDON - Add failure logging here
            # This should:
            # 1. Store failed task details in database
            # 2. Send alert to monitoring system  
            # 3. Create incident ticket for investigation
            # 4. Optionally notify operations team
            
            # Acknowledge the dead letter task to remove it from queue
            await self.ack_dead_letter_task(task)
            
        except Exception as e:
            logger.error("Failed to process dead letter task", 
                        task_id=task_id, 
                        error=str(e))
            
    async def ack_dead_letter_task(self, task) -> None:
        """Acknowledge dead letter task processing"""
        try:
            ack_request = tasks_v2.AcknowledgeRequest(
                name=task.message.name,
                ack_id=task.message.ack_id
            )
            await self.client.acknowledge(request=ack_request)
            logger.info("Dead letter task acknowledged and removed from queue")
        except Exception as e:
            logger.error("Failed to acknowledge dead letter task", error=str(e))
```

---

## 8. Testing Strategy

### Development Testing

#### Phase 1: Infrastructure Validation
```bash
# 1. Verify Cloud Tasks queues exist
gcloud tasks queues list --location=us-central1

# 2. Check IAM permissions
gcloud projects get-iam-policy PROJECT_ID | grep cloudtasks

# 3. Verify EventArc trigger targets queue
gcloud eventarc triggers describe rag-processor-dev-trigger --location=us-central1
```

#### Phase 2: Application Testing
```bash
# 1. Deploy updated application
uv run python -m scripts.deploy_dev

# 2. Upload test file
gcloud storage cp test-document.pdf gs://BUCKET_NAME/uploads/test-user/test-document.pdf

# 3. Monitor queue activity
gcloud tasks queues describe rag-processor-dev-processing-queue --location=us-central1

# 4. Check Cloud Run logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=rag-processor-dev" --limit=20
```

#### Phase 3: Stress Testing
```bash
# Upload multiple files simultaneously
for i in {1..10}; do
  gcloud storage cp test-doc-$i.pdf gs://BUCKET_NAME/uploads/test-user/test-doc-$i.pdf &
done

# Monitor queue depth and processing
watch -n 2 'gcloud tasks queues describe rag-processor-dev-processing-queue --location=us-central1 --format="value(stats.tasksCount)"'
```

### Production Testing

#### Gradual Rollout Strategy
1. **Development Environment**: Full migration and testing
2. **Staging Environment**: Production-like testing with real workloads  
3. **Production Deployment**: Single coordinated deployment
4. **Monitoring Phase**: 24-hour monitoring of queue metrics

---

## 10. Monitoring & Alerting

### Queue Health Monitoring

#### Key Metrics to Monitor
- **Queue Depth**: `cloudtasks.googleapis.com/api/queue_depth`
- **Task Dispatch Rate**: `cloudtasks.googleapis.com/api/task_dispatch_count`
- **Task Success Rate**: `cloudtasks.googleapis.com/api/task_success_count`
- **Dead Letter Queue Depth**: Monitor DLQ for permanent failures

#### Recommended Alerts

```yaml
# Cloud Monitoring Alert Policies
alerts:
  - name: "Cloud Tasks Queue Backup"
    condition: "queue_depth > 50 for 5 minutes"  
    notification: "Queue backing up - may need more instances"
    
  - name: "High Task Failure Rate"
    condition: "task_failure_rate > 10% for 10 minutes"
    notification: "High task failure rate - investigate processing issues"
    
  - name: "Dead Letter Queue Activity"
    condition: "dlq_depth > 0"
    notification: "Tasks failing permanently - immediate investigation required"
    
  - name: "Queue Processing Stalled"
    condition: "queue_depth > 0 AND task_dispatch_count == 0 for 15 minutes"
    notification: "Queue not processing - check Cloud Run service health"
```

### Application Monitoring

#### Health Check Improvements
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "processing_mode": "cloud_tasks",
        "queue_name": os.getenv("QUEUE_NAME"),
        "dlq_name": os.getenv("DLQ_NAME"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime_seconds": time.time() - start_time
    }
```

---

## 11. Migration Execution Plan

### Pre-Migration Checklist
- [ ] **Code Review**: Complete review of all infrastructure and application changes
- [ ] **Development Testing**: Full end-to-end testing in development environment
- [ ] **Dependency Updates**: Ensure `google-cloud-tasks` is added to requirements
- [ ] **Monitoring Setup**: Configure queue monitoring and alerts
- [ ] **Rollback Plan**: Document emergency rollback procedures

### Migration Day Execution

#### Step 1: Infrastructure Setup (Setup Scripts)
```bash
# Development Environment
cd templates/rag-saas/apps/rag-processor
uv run python -m scripts.setup_gcp_dev

# Production Environment  
uv run python -m scripts.setup_gcp_prod
```

#### Step 2: Application Deployment (Deploy Scripts)
```bash
# Development Deployment
uv run python -m scripts.deploy_dev

# Production Deployment
uv run python -m scripts.deploy_prod
```

#### Step 3: Validation Testing
```bash
# Upload test files to verify end-to-end functionality
gcloud storage cp test-files/* gs://BUCKET_NAME/uploads/test-user/

# Monitor processing
gcloud tasks queues describe QUEUE_NAME --location=us-central1

# Check for any errors
gcloud logs read "resource.type=cloud_run_revision" --limit=50
```

### Post-Migration Monitoring

#### 24-Hour Monitoring Phase
- [ ] **Queue Metrics**: Monitor queue depth and processing rate
- [ ] **Error Rates**: Watch for increases in processing failures  
- [ ] **Performance**: Verify processing times are comparable
- [ ] **Cost Impact**: Monitor Cloud Tasks usage costs
- [ ] **Dead Letters**: Check for any tasks in dead letter queue

#### Success Criteria
- ✅ **Zero 429 Errors**: No "no available instance" errors
- ✅ **All Files Processed**: 100% of uploaded files successfully processed
- ✅ **Queue Management**: Queue depth stays reasonable under load
- ✅ **Error Handling**: Failed tasks properly retry or move to dead letter queue
- ✅ **Performance**: Processing times remain consistent

---

## 17. Implementation Notes

### Key Architecture Benefits
1. **Eliminates 429 Errors**: Queue acts as infinite buffer for file processing requests
2. **Graceful Scaling**: System processes files at available capacity, never drops requests
3. **Automatic Retries**: Failed processing attempts retry automatically with exponential backoff
4. **Dead Letter Handling**: Permanently failed tasks captured for investigation
5. **Perfect Backpressure**: System degrades gracefully under load instead of failing

### Migration Risks & Mitigation
- **Risk**: Complete architecture change with no easy rollback
- **Mitigation**: Thorough testing in development environment first
- **Risk**: EventArc → Cloud Tasks configuration complexity  
- **Mitigation**: Detailed IAM permission setup and validation
- **Risk**: Application code completely rewritten
- **Mitigation**: Preserve existing processing logic, only change task handling

### Post-Migration Improvements
1. **Enhanced Monitoring**: Rich queue metrics and alerting
2. **Better Error Handling**: Structured retry policies and dead letter processing
3. **Improved Scalability**: Handle 100+ simultaneous uploads gracefully
4. **Cost Optimization**: Only pay for actual task processing, not idle HTTP servers

### TODO Items for Follow-up
- [ ] **TODO: BRANDON** - Add comprehensive failure logging in `dead_letter_service.py`
- [ ] **TODO: BRANDON** - Set up Cloud Monitoring dashboards for queue metrics  
- [ ] **TODO: BRANDON** - Configure alert notification channels (email, Slack, etc.)
- [ ] **TODO: BRANDON** - Implement queue depth-based auto-scaling triggers
- [ ] **TODO: BRANDON** - Add queue management utilities (purge, retry, etc.)

### Expected Outcomes
After this migration:
- ✅ **429 errors completely eliminated** - queuing handles any volume of uploads
- ✅ **Improved reliability** - automatic retries and dead letter queue handling
- ✅ **Better monitoring** - rich queue metrics and processing visibility  
- ✅ **Enhanced scalability** - graceful handling of traffic spikes
- ✅ **Simplified operations** - no more manual instance limit adjustments

This represents a fundamental improvement to the RAG processor architecture, moving from a fragile HTTP-based system to a robust, queue-based processing pipeline that can handle production workloads gracefully. 
