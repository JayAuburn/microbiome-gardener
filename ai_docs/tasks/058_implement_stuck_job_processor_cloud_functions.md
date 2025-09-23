# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement Stuck Job Processor with Cloud Scheduler + Cloud Functions

### Goal Statement
**Goal:** Create a serverless background job processor that automatically detects and retries document processing jobs that have become stuck in "pending" status due to circuit breaker activation, processing failures, or other system issues. This ensures no user uploads are permanently lost and provides automatic recovery without manual intervention.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The RAG processor currently has a critical gap: when the circuit breaker activates and returns 200 to EventArc to prevent retry loops, document processing jobs remain in "pending" status indefinitely. There's no mechanism to retry these stuck jobs, leading to permanently lost user uploads and degraded user experience.

### Solution Options Analysis

#### Option 1: Cloud Scheduler + Cloud Functions ✅ APPROVED
**Approach:** Create a lightweight Cloud Function triggered by Cloud Scheduler every 5 minutes to detect and retry stuck jobs.

**Pros:**
- ✅ **Serverless and cost-effective** - Only pay for execution time, no idle resources
- ✅ **Simple deployment** - Single function, minimal infrastructure 
- ✅ **Auto-scaling** - Handles job volume automatically without configuration
- ✅ **Low maintenance** - No persistent services to monitor or update
- ✅ **Fast startup** - Cloud Functions start quickly for periodic tasks
- ✅ **Easy monitoring** - Cloud Functions have built-in logging and metrics

**Cons:**
- ❌ **Cold start latency** - Minor delay on first execution (not critical for background jobs)
- ❌ **15-minute timeout** - Limits batch size (mitigated by processing in chunks)
- ❌ **No persistent state** - Must query database each time (acceptable for this use case)

**Implementation Complexity:** Low - Single function with database queries
**Time Estimate:** 2-3 hours for complete implementation
**Risk Level:** Low - Simple, well-established pattern

#### Option 2: Separate Cloud Run Service
**Approach:** Deploy a dedicated Cloud Run service with cron endpoint for job processing.

**Pros:**
- ✅ **Shared codebase** - Can reuse existing database connections and models
- ✅ **No timeout limits** - Can process large batches without interruption
- ✅ **Familiar deployment** - Uses existing deploy-dev.py patterns

**Cons:**
- ❌ **Higher cost** - Always-running instance even when idle
- ❌ **More complexity** - Additional service to deploy and monitor
- ❌ **Resource overhead** - Minimum CPU/memory allocation required
- ❌ **Deployment coupling** - Changes require redeploying entire service

**Implementation Complexity:** Medium - New service with deployment scripts
**Time Estimate:** 4-6 hours including deployment setup
**Risk Level:** Medium - Additional infrastructure to maintain

#### Option 3: Add Endpoint to Existing RAG Processor
**Approach:** Add `/process-stuck-jobs` endpoint to existing rag-processor service.

**Pros:**
- ✅ **Code reuse** - Direct access to existing database models and services
- ✅ **Simple deployment** - No new services required
- ✅ **Shared monitoring** - Uses existing logging and error handling

**Cons:**
- ❌ **Service coupling** - Background jobs tied to main processing service
- ❌ **Resource contention** - Background processing may impact main service performance
- ❌ **Deployment risk** - Changes to job processor require deploying main service
- ❌ **Scaling conflicts** - Main service scaling optimized for request processing, not batch jobs

**Implementation Complexity:** Medium - Integration with existing service patterns
**Time Estimate:** 3-4 hours including testing
**Risk Level:** Medium - Potential impact on main service

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Cloud Scheduler + Cloud Functions

**Why this is the best choice:**
1. **Cost optimization** - Perfect serverless pattern for periodic batch processing that runs for seconds every 5 minutes
2. **Operational simplicity** - Single function with minimal infrastructure, easy to understand and debug
3. **Decoupled architecture** - Independent of main RAG processor, failures don't cascade between systems
4. **Proven pattern** - Cloud Scheduler + Functions is Google's recommended approach for cron-like jobs

**Key Decision Factors:**
- **Performance Impact:** None on main service - completely isolated execution
- **Scalability:** Auto-scales to handle any reasonable number of stuck jobs
- **Maintainability:** Simple single-purpose function, easy to modify and test
- **Cost Impact:** Minimal - only pays for ~30 seconds execution every 5 minutes
- **Security:** Uses same service account and database credentials as main service

**Alternative Consideration:**
Option 3 (existing service endpoint) would be simpler to implement but creates unnecessary coupling and potential performance impact. The small additional complexity of Cloud Functions is worth the architectural benefits.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1 - Cloud Functions), or would you prefer a different approach? 

**Questions for you to consider:**
- Does the serverless approach align with your infrastructure preferences?
- Are you comfortable with the Google Cloud Functions deployment process?
- Do you have any concerns about the 15-minute timeout for batch processing?

**Next Steps:**
Once you approve the strategic direction, I'll create the detailed implementation plan for the Cloud Function with proper database integration and error handling.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with modern type hints and async patterns
- **Primary Framework:** FastAPI 0.104+ for main RAG processor with async request handling
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with raw SQL/asyncpg for high-performance database operations
- **Cloud Platform:** Google Cloud Platform with Cloud Run, Cloud Functions, and Cloud Scheduler
- **Code Quality Tools:** ruff for linting, black for formatting, mypy for type checking
- **Containerization:** Docker with multi-stage builds for Cloud Run deployment
- **Key Architectural Patterns:** Service layer separation, async database operations, structured logging
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for multimodal embeddings, Google Gen AI for text processing
- **🔑 AUTHENTICATION PATTERNS:** Google Cloud service accounts with Workload Identity for Cloud Run
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0 for embeddings, google-genai>=1.24.0 for text generation
- **Relevant Existing Modules:** `rag_processor/database/` for DB operations, `rag_processor/models/` for Pydantic schemas

### Current State
The RAG processor successfully handles document uploads via EventArc triggers from Google Cloud Storage. When files are uploaded, they're processed through a pipeline that extracts content, generates embeddings, and stores chunks in the database. However, there's a critical gap in error recovery:

**Current Processing Flow:**
1. File uploaded to GCS → EventArc trigger → Cloud Run rag-processor
2. Job created with status "pending" in `document_processing_jobs` table
3. Processing starts, status changes to "processing"
4. On success: status → "completed", on failure: status → "failed"

**The Problem:**
- Circuit breaker activates after 5 failures per hour per file
- Returns 200 to EventArc to prevent infinite retry loops
- Job remains stuck in "pending" status forever
- No recovery mechanism exists to retry these stuck jobs

**Database Schema (Existing):**
```sql
-- From document_processing_jobs.ts
CREATE TABLE document_processing_jobs (
  id SERIAL PRIMARY KEY,
  file_path VARCHAR NOT NULL,
  user_id UUID NOT NULL,
  organization_id UUID,
  status VARCHAR NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB
);
```

### 🚨 CRITICAL: Technical Approach Confirmation

**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing SDK Analysis:** Project uses Vertex AI and Google Gen AI - Cloud Function will only need database access, no AI SDK requirements
- [x] **Authentication Method:** Google Cloud service accounts with environment-based credentials - Cloud Function will use same pattern
- [x] **Dependency Consistency:** Cloud Function will use existing database libraries (asyncpg) and Pydantic models
- [x] **Architecture Alignment:** Serverless Cloud Function aligns with existing Cloud Run serverless approach
- [x] **Performance Impact:** Completely isolated from main processing pipeline - no performance impact

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing database setup** - Same PostgreSQL instance and connection patterns
- [x] **Reuse Pydantic models** - Import existing document_processing_jobs models
- [x] **Match authentication patterns** - Use Google Cloud service account in Cloud Function
- [x] **🚨 GOOGLE AI PACKAGES COMPLIANCE** - No AI packages needed for this function
- [x] **Confirm approach with user** - Serverless Cloud Function for periodic job processing

---

## 4. Context & Problem Definition

### Problem Statement
Document processing jobs in the RAG processor can become permanently stuck in "pending" status when the circuit breaker activates to prevent EventArc retry loops. This happens when:

1. **EventArc delivers file processing event** to Cloud Run rag-processor
2. **Job is created** with status "pending" in the database
3. **Circuit breaker activates** due to repeated failures (5 failures/hour threshold)
4. **Service returns 200** to EventArc to prevent infinite retries
5. **Job remains pending forever** - no mechanism to retry

This results in lost user uploads, degraded user experience, and no automatic recovery mechanism. Users may believe their files were processed when they're actually stuck indefinitely.

### Success Criteria
- [x] **Stuck jobs detected within 5 minutes** - Jobs pending for >5 minutes are identified as stuck
- [x] **Automatic retry mechanism** - Stuck jobs are retried by triggering the original processing endpoint
- [x] **Failure limit enforcement** - Jobs with excessive retry attempts are marked as permanently failed
- [x] **Comprehensive logging** - All retry attempts, successes, and failures are logged for monitoring
- [x] **Cost-effective operation** - Minimal resource usage for background processing
- [x] **Zero impact on main service** - Background processing doesn't affect main RAG processor performance

---

## 5. Technical Requirements

### Functional Requirements
- **Stuck job detection:** Query database every 5 minutes for jobs in "pending" status with `updated_at` >5 minutes ago
- **Retry logic:** Trigger original processing by making authenticated HTTP request to rag-processor
- **Failure tracking:** Increment retry_count and mark jobs as "failed" after maximum retry attempts (3 retries)
- **Error handling:** Handle database connection failures, HTTP request timeouts, and authentication errors
- **Batch processing:** Process multiple stuck jobs efficiently within Cloud Function timeout limits

### Non-Functional Requirements
- **Performance:** Complete processing of typical batch (5-20 stuck jobs) within 2 minutes
- **Security:** Use service account authentication for database and HTTP requests
- **Scalability:** Handle up to 100 stuck jobs per execution without timeout
- **Reliability:** Graceful error handling with detailed logging for debugging
- **Observability:** Structured logging with job IDs, retry counts, and execution metrics

### Technical Constraints
- **Cloud Function timeout:** 15-minute maximum execution time
- **Memory limit:** 512MB allocated for database connections and HTTP requests
- **Database access:** Must use existing PostgreSQL instance and connection patterns
- **Authentication:** Must use Google Cloud service account for all external requests
- **Idempotency:** Safe to run multiple times without duplicating retry attempts

---

## 6. Data & Database Changes

### Database Schema Changes
**No schema changes required** - Using existing `document_processing_jobs` table structure:

```sql
-- Existing table structure (no changes needed)
-- Key fields for stuck job processing:
-- - status: 'pending' jobs are candidates for retry
-- - updated_at: Determine how long job has been stuck
-- - retry_count: Track retry attempts to prevent infinite loops
-- - file_path: Required for triggering retry processing
-- - user_id, organization_id: Required for processing context
```

### Data Model Updates
**Reuse existing Pydantic models** from rag-processor:

```python
# Existing model in rag_processor/models/jobs.py (no changes needed)
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DocumentProcessingJob(BaseModel):
    id: int
    file_path: str
    user_id: str
    organization_id: Optional[str] = None
    status: str  # 'pending', 'processing', 'completed', 'failed'
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    retry_count: int = 0
    metadata: Optional[dict] = None
```

### Data Migration Plan
**No migration required** - Function operates on existing data structure:
- [x] **Read operations only initially** - Function identifies stuck jobs without modifying them
- [x] **Update retry_count and status** - Increment retry attempts and update status on failure
- [x] **No breaking changes** - All operations maintain existing data integrity

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**CLOUD FUNCTION STRUCTURE** → Single-purpose serverless function
- [x] **Main handler function** - Entry point for Cloud Scheduler HTTP trigger
- [x] **Database service layer** - Connection management and query operations  
- [x] **HTTP client service** - Authenticated requests to rag-processor
- [x] **Configuration management** - Environment variables and secrets

**DATABASE ACCESS** → Direct async database operations
- [x] **Connection pooling** - Efficient database connections for batch operations
- [x] **Query optimization** - Efficient queries to find stuck jobs with proper indexing
- [x] **Transaction safety** - Atomic updates to prevent race conditions

**ERROR HANDLING** → Comprehensive failure recovery
- [x] **Database failures** - Connection retry logic with exponential backoff
- [x] **HTTP failures** - Request timeout and retry for rag-processor communication  
- [x] **Partial failures** - Continue processing remaining jobs if some fail

### API Endpoints
**Cloud Function HTTP Trigger:**
- [x] **`POST /`** - Main entry point triggered by Cloud Scheduler
  - **Input:** Empty POST request from Cloud Scheduler
  - **Output:** JSON response with processing summary and metrics
  - **Authentication:** Service account authentication from Cloud Scheduler

**External API Calls:**
- [x] **`POST https://rag-processor-url/process-file`** - Trigger retry processing
  - **Input:** File path, user ID, and organization ID for stuck job
  - **Authentication:** Service account bearer token
  - **Error handling:** Timeout, retry logic, and failure tracking

### Database Operations
**Read Operations:**
- [x] **Find stuck jobs:** Query for status='pending' AND updated_at < (now - 5 minutes)
- [x] **Batch retrieval:** Limit query results to prevent timeout (e.g., 50 jobs per execution)
- [x] **Index optimization:** Ensure proper indexes on status and updated_at columns

**Update Operations:**
- [x] **Increment retry count:** Atomic update of retry_count field
- [x] **Update status:** Change status from 'pending' to 'failed' after max retries
- [x] **Update timestamp:** Touch updated_at field to prevent immediate re-processing

### External Integrations
**Google Cloud Services:**
- [x] **Cloud Scheduler:** HTTP trigger every 5 minutes for function execution
- [x] **Secret Manager:** Database credentials and service account keys
- [x] **Cloud Logging:** Structured logging for monitoring and debugging

**RAG Processor Integration:**
- [x] **HTTP API calls:** Authenticated requests to trigger job reprocessing
- [x] **Service discovery:** Use environment variables for rag-processor URL
- [x] **Authentication:** Service account bearer tokens for API access

---

## 8. Python Module & Code Organization

### New Modules/Files
**Cloud Function Structure:**
- [x] **`main.py`** - Cloud Function entry point and HTTP handler
- [x] **`services/job_processor.py`** - Core business logic for stuck job processing
- [x] **`services/database.py`** - Database connection and query operations
- [x] **`services/http_client.py`** - HTTP client for rag-processor communication
- [x] **`models/job.py`** - Pydantic models for job data (imported from rag-processor)
- [x] **`config.py`** - Configuration management and environment variables
- [x] **`requirements.txt`** - Dependencies for Cloud Function deployment

**Module Organization Pattern:**
```
stuck-job-processor/
├── main.py                    # Cloud Function entry point
├── services/
│   ├── __init__.py
│   ├── job_processor.py       # Main business logic
│   ├── database.py            # Database operations
│   └── http_client.py         # HTTP client for API calls
├── models/
│   ├── __init__.py
│   └── job.py                 # Pydantic models
├── config.py                  # Configuration management
├── requirements.txt           # Dependencies
└── deployment/
    ├── deploy-function.py     # Deployment script
    └── function-config.yaml   # Cloud Function configuration
```

**Code Quality Requirements:**
- **Type Hints:** Complete type annotations for all functions and variables
- **Documentation:** Comprehensive docstrings for all public functions
- **Error Handling:** Robust exception handling with detailed logging
- **Async/Await:** Async patterns for database and HTTP operations

### Dependency Management
**🔧 PACKAGE MANAGEMENT WITH UV:**
- [x] **Create separate pyproject.toml** - Dedicated Cloud Function project with minimal dependencies
- [x] **Use uv for dependency management** - Consistent with existing project patterns
- [x] **No AI/ML packages required** - Function only handles database and HTTP operations
- [x] **Deploy with uv** - Use `uv export` to generate requirements.txt for Cloud Function deployment

**Cloud Function pyproject.toml:**
```toml
[project]
name = "stuck-job-processor"
version = "0.1.0"
description = "Background processor for stuck document processing jobs"
requires-python = ">=3.10"
dependencies = [
    # Database
    "asyncpg>=0.29.0",
    
    # HTTP client
    "httpx>=0.25.0",
    
    # Data validation
    "pydantic>=2.5.0",
    
    # Google Cloud integration
    "google-auth>=2.24.0",
    "google-cloud-secret-manager>=2.18.1",
    
    # Cloud Function framework
    "functions-framework>=3.5.0",
    
    # Utilities
    "structlog>=23.2.0",
    "python-dotenv>=1.0.0",
]

[dependency-groups]
lint = [
    "ruff>=0.12.0",
    "black>=25.1.0", 
    "mypy>=1.16.0",
]
```

**Installation and deployment approach:**
```bash
# Development setup
uv sync

# Generate requirements.txt for Cloud Function deployment
uv export --format requirements-txt --output-file requirements.txt

# Deploy Cloud Function (uses generated requirements.txt)
gcloud functions deploy stuck-job-processor --requirements-file requirements.txt
```

---

## 9. Implementation Plan

### Phase 1: Core Infrastructure Setup
**Goal:** Create basic Cloud Function with database connectivity and configuration

- [x] **Task 1.1:** Create Cloud Function project structure
  - Files: `main.py`, `services/`, `models/`, `config.py`
  - Details: Basic project layout with proper module organization
- [x] **Task 1.2:** Implement configuration management
  - Files: `config.py`
  - Details: Environment variables for database URL, rag-processor URL, timeouts
- [x] **Task 1.3:** Create database service layer
  - Files: `services/database.py`
  - Details: Async PostgreSQL connection, connection pooling, query operations
- [x] **Task 1.4:** Implement basic logging and error handling
  - Files: `services/job_processor.py`
  - Details: Structured logging with job context, exception handling patterns

### Phase 2: Job Processing Logic
**Goal:** Implement core stuck job detection and retry logic

- [x] **Task 2.1:** Create stuck job detection
  - Files: `services/job_processor.py`
  - Details: Database query for pending jobs older than 5 minutes
- [x] **Task 2.2:** Implement HTTP client for rag-processor communication
  - Files: `services/http_client.py`
  - Details: Authenticated HTTP requests with retry logic and timeout handling
- [x] **Task 2.3:** Add retry logic and failure tracking
  - Files: `services/job_processor.py`
  - Details: Increment retry count, mark jobs failed after max attempts
- [x] **Task 2.4:** Create batch processing with timeout management
  - Files: `services/job_processor.py`
  - Details: Process jobs in batches to stay within Cloud Function time limits

### Phase 3: Deployment and Monitoring
**Goal:** Deploy Cloud Function with Cloud Scheduler and implement monitoring

- [x] **Task 3.1:** Create deployment script
  - Files: `deployment/deploy-function.py`
  - Details: Automated deployment similar to existing deploy-dev.py patterns
- [x] **Task 3.2:** Configure Cloud Scheduler trigger
  - Files: `deployment/deploy-function.py`
  - Details: HTTP trigger every 5 minutes with proper authentication
- [x] **Task 3.3:** Implement comprehensive monitoring and alerting
  - Files: `main.py`, `services/job_processor.py`
  - Details: Metrics export, error tracking, execution time monitoring
- [x] **Task 3.4:** Create manual validation procedures
  - Files: deployment scripts, documentation
  - Details: Manual testing procedures and validation steps

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# Use uv to run linting tools
uv sync --group lint

# Run linting
uv run --group lint ruff check stuck-job-processor/

# Auto-fix common issues  
uv run --group lint ruff check --fix stuck-job-processor/

# Run type checking
uv run --group lint mypy stuck-job-processor/

# Format code
uv run --group lint black stuck-job-processor/
```

---

## 10. File Structure & Organization

### New Files to Create
```
stuck-job-processor/
├── main.py                           # Cloud Function entry point
├── services/
│   ├── __init__.py                   # Package initialization
│   ├── job_processor.py              # Main business logic
│   ├── database.py                   # Database operations
│   └── http_client.py                # HTTP client for API calls
├── models/
│   ├── __init__.py                   # Package initialization
│   └── job.py                        # Job data models
├── config.py                         # Configuration management
├── pyproject.toml                    # UV dependency management
├── deployment/
│   ├── deploy-function.py            # Deployment automation
│   └── function-config.yaml          # Cloud Function configuration
└── requirements.txt                  # Generated for Cloud Function deployment
```

### Files to Modify in Main Project
- [x] **`rag_processor/main.py`** - Ensure proper authentication for function HTTP calls
- [x] **`deploy-dev.py`** - Add Cloud Function deployment as optional step
- [x] **Documentation** - Update README with stuck job processor information

### Cloud Function Dependencies (pyproject.toml)
```toml
[project]
name = "stuck-job-processor"
version = "0.1.0"
description = "Background processor for stuck document processing jobs"
requires-python = ">=3.10"
dependencies = [
    "asyncpg>=0.29.0",
    "httpx>=0.25.0",
    "pydantic>=2.5.0",
    "google-auth>=2.24.0",
    "google-cloud-secret-manager>=2.18.1",
    "functions-framework>=3.5.0",
    "structlog>=23.2.0",
    "python-dotenv>=1.0.0",
]

[dependency-groups]
lint = [
    "ruff>=0.12.0",
    "black>=25.1.0", 
    "mypy>=1.16.0",
]
```

**Deployment configuration:**
```yaml
# deployment/function-config.yaml
name: stuck-job-processor
runtime: python310
entry_point: main
timeout: 540s  # 9 minutes
memory: 512MB
environment_variables:
  DATABASE_URL: "projects/{PROJECT}/secrets/database-url/versions/latest"
  RAG_PROCESSOR_URL: "https://rag-processor-url"
  MAX_RETRY_ATTEMPTS: "3"
  STUCK_JOB_THRESHOLD_MINUTES: "5"
  BATCH_SIZE: "50"
```

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [x] **Error 1:** Database connection failures during job query
  - **Handling:** Connection retry with exponential backoff, log failure and exit gracefully
- [x] **Error 2:** RAG processor HTTP endpoint unavailable or timing out
  - **Handling:** HTTP timeout configuration, retry logic, mark job for later retry
- [x] **Error 3:** Partial batch failures (some jobs succeed, others fail)
  - **Handling:** Continue processing remaining jobs, log individual failures separately
- [x] **Error 4:** Cloud Function timeout approaching
  - **Handling:** Monitor execution time, stop processing new jobs with time buffer

### Edge Cases
- [x] **Edge Case 1:** Large number of stuck jobs (>100) exceeding function timeout
  - **Solution:** Process in configurable batches (default 50), multiple function executions
- [x] **Edge Case 2:** Job status changes during processing (race condition)
  - **Solution:** Use database row locking or optimistic locking with retry
- [x] **Edge Case 3:** Rapid repeated failures causing retry loop
  - **Solution:** Implement exponential backoff between retry attempts
- [x] **Edge Case 4:** Function execution overlap due to long processing times
  - **Solution:** Function timeout buffer, idempotency checks, execution time monitoring

### Custom Exception Handling
```python
# services/exceptions.py
class StuckJobProcessorError(Exception):
    """Base exception for stuck job processor"""
    pass

class DatabaseConnectionError(StuckJobProcessorError):
    """Database connection or query failure"""
    pass

class RagProcessorUnavailableError(StuckJobProcessorError):
    """RAG processor API unavailable or timing out"""
    pass

class BatchProcessingTimeoutError(StuckJobProcessorError):
    """Function approaching timeout limit"""
    pass

# Error handling in main function
@app.exception_handler(DatabaseConnectionError)
async def database_error_handler(request, exc):
    logger.error("Database connection failed", error=str(exc))
    return {"status": "error", "message": "Database unavailable"}
```

---

## 12. Security Considerations

### Authentication & Authorization
- [x] **Service account authentication:** Cloud Function uses dedicated service account with minimal permissions
- [x] **Database access:** Service account has only SELECT and UPDATE permissions on document_processing_jobs table
- [x] **RAG processor API access:** Authenticated HTTP requests using service account bearer tokens
- [x] **Secret management:** Database credentials stored in Google Secret Manager

### Input Validation
- [x] **Database query validation:** Parameterized queries to prevent SQL injection
- [x] **Job data validation:** Pydantic model validation for all job data
- [x] **HTTP request validation:** Validate and sanitize all data sent to RAG processor
- [x] **Batch size limits:** Prevent resource exhaustion with configurable batch processing

### Data Protection
- [x] **Minimal data access:** Function only reads necessary job fields, doesn't access document content
- [x] **Audit logging:** All job retry attempts logged for security and debugging
- [x] **Network security:** Function communicates only with authorized services (database, RAG processor)
- [x] **Error message sanitization:** No sensitive data exposed in error messages or logs

---

---

## 13. Deployment & Configuration

### Environment Variables
```bash
# Cloud Function environment variables
DATABASE_URL=postgresql://user:pass@host:port/dbname
RAG_PROCESSOR_URL=https://rag-processor-xxx-uc.a.run.app
MAX_RETRY_ATTEMPTS=3
STUCK_JOB_THRESHOLD_MINUTES=5
BATCH_SIZE=50
LOG_LEVEL=INFO
FUNCTION_TIMEOUT_BUFFER_SECONDS=30
```

### Cloud Function Configuration
```python
# deployment/deploy-function.py
import subprocess
import os

def deploy_stuck_job_processor():
    """Deploy Cloud Function with proper configuration"""
    project_id = os.environ["GOOGLE_CLOUD_PROJECT_ID"]
    region = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    
    # Deploy function
    deploy_cmd = f"""
    gcloud functions deploy stuck-job-processor \
        --runtime python310 \
        --trigger-http \
        --entry-point main \
        --memory 512MB \
        --timeout 540s \
        --region {region} \
        --set-env-vars DATABASE_URL=projects/{project_id}/secrets/database-url/versions/latest,RAG_PROCESSOR_URL=https://rag-processor-url \
        --service-account rag-service@{project_id}.iam.gserviceaccount.com \
        --no-allow-unauthenticated
    """
    
    subprocess.run(deploy_cmd, shell=True, check=True)
    
    # Create Cloud Scheduler job
    scheduler_cmd = f"""
    gcloud scheduler jobs create http stuck-job-processor-trigger \
        --location {region} \
        --schedule "*/5 * * * *" \
        --uri https://{region}-{project_id}.cloudfunctions.net/stuck-job-processor \
        --http-method POST \
        --oidc-service-account-email rag-service@{project_id}.iam.gserviceaccount.com
    """
    
    subprocess.run(scheduler_cmd, shell=True, check=True)
```

### Health Checks
```python
# main.py
@functions_framework.http
def main(request):
    """Cloud Function entry point"""
    if request.method == "GET" and request.path == "/health":
        return {"status": "healthy", "function": "stuck-job-processor"}
    
    # Main processing logic
    return process_stuck_jobs_handler(request)
```

---

## 14. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: Analyze potential second-order consequences before implementation**

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [x] **No breaking changes** - Function operates independently of existing systems
- [x] **Database schema unchanged** - Only reads and updates existing job records
- [x] **API contracts maintained** - Uses existing RAG processor endpoints
- [x] **Authentication preserved** - Uses same service account patterns

#### 2. **Ripple Effects Assessment**  
- [x] **Improved user experience** - Stuck jobs automatically recover instead of permanent failure
- [x] **Reduced support burden** - Fewer user complaints about lost uploads
- [x] **Database load increase** - Periodic queries every 5 minutes (minimal impact)
- [x] **RAG processor retry traffic** - Additional HTTP requests for stuck job retries

#### 3. **Performance Implications**
- [x] **Database impact:** Additional read queries every 5 minutes with optimized indexes
- [x] **RAG processor impact:** Retry requests will trigger normal processing pipeline
- [x] **Network traffic:** Minimal increase from HTTP requests to RAG processor
- [x] **Function execution:** 30-60 seconds every 5 minutes, negligible cost impact

#### 4. **Security Considerations**
- [x] **Attack surface:** New HTTP endpoint, but authenticated and minimal functionality
- [x] **Data exposure:** Function only accesses job metadata, not document content
- [x] **Authentication security:** Uses same service account as main RAG processor
- [x] **Audit trail:** All retry attempts logged for security monitoring

#### 5. **Operational Impact**
- [x] **Deployment simplicity:** Single Cloud Function, minimal infrastructure changes
- [x] **Monitoring requirements:** Standard Cloud Function monitoring, logs integration
- [x] **Cost impact:** ~$0.50/month for function execution (negligible)
- [x] **Maintenance:** Simple single-purpose function, low maintenance overhead

#### 6. **Maintenance Burden**
- [x] **Code complexity:** Simple, single-purpose function with clear responsibilities
- [x] **Dependencies:** Minimal external dependencies, mostly Google Cloud libraries
- [x] **Testing overhead:** Straightforward unit and integration tests
- [x] **Documentation:** Self-contained function with clear purpose and operation

### Critical Issues Identification

#### ✅ **GREEN FLAGS - Positive Impacts**
- [x] **Improved reliability** - Automatic recovery from stuck jobs
- [x] **Better user experience** - No permanently lost uploads
- [x] **Reduced operational burden** - Automatic problem resolution
- [x] **Simple architecture** - Minimal infrastructure, easy to understand and maintain

#### ⚠️ **YELLOW FLAGS - Monitor These Areas**
- [x] **Database query frequency** - Monitor index performance with additional queries
- [x] **RAG processor retry load** - Ensure retry traffic doesn't overwhelm main service
- [x] **Function execution costs** - Monitor Cloud Function billing for cost optimization
- [x] **Error accumulation** - Watch for patterns in stuck job causes

#### 🚨 **NO RED FLAGS IDENTIFIED**
No critical risks or blocking issues identified for this implementation.

### Mitigation Strategies

#### Database Performance
- [x] **Optimize indexes:** Ensure compound index on (status, updated_at) for efficient queries
- [x] **Query limits:** Batch processing to prevent large result sets
- [x] **Connection pooling:** Efficient database connections to minimize overhead

#### System Integration
- [x] **Graceful degradation:** Function failures don't impact main RAG processor
- [x] **Rate limiting:** Built-in via Cloud Scheduler frequency (every 5 minutes)
- [x] **Error isolation:** Function errors logged separately, don't cascade to main system

#### Monitoring and Alerting
- [x] **Function monitoring:** Cloud Function built-in metrics and logging
- [x] **Database monitoring:** Watch for query performance impact
- [x] **Success rate tracking:** Monitor retry success rates and failure patterns

### Positive Second-Order Effects

#### User Experience Improvements
- [x] **Automatic recovery** - Users no longer experience permanently lost uploads
- [x] **Improved confidence** - More reliable document processing system
- [x] **Reduced confusion** - Fewer cases of uploads appearing to hang indefinitely

#### Operational Benefits
- [x] **Proactive problem resolution** - Issues resolved before users notice
- [x] **Better system observability** - Retry patterns reveal underlying issues
- [x] **Reduced support tickets** - Fewer user complaints about lost uploads

#### Technical Advantages
- [x] **Circuit breaker effectiveness** - Can now use circuit breaker without losing jobs
- [x] **System resilience** - Graceful recovery from transient failures
- [x] **Clean architecture** - Separation of concerns between processing and recovery

---

## 15. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS COMPLETED ✅
🎯 **STRATEGIC ANALYSIS COMPLETED:**
This task document was created after conducting strategic analysis and receiving user approval for Option 1 (Cloud Scheduler + Cloud Functions). The strategic analysis is complete and documented in Section 2.

**CURRENT STATUS:** Ready for implementation upon user approval of this task document.

### Communication Preferences
- [x] Provide regular progress updates during implementation phases
- [x] Flag any technical challenges or deviations from the plan immediately
- [x] Ask for clarification if Cloud Function deployment specifics are unclear
- [x] Suggest optimizations or improvements based on implementation experience

### Implementation Approach - READY FOR IMPLEMENTATION
🚨 **IMPLEMENTATION SEQUENCE:**

1. **✅ STRATEGIC ANALYSIS COMPLETE** - Option 1 approved by user
2. **✅ TASK DOCUMENT CREATED** - This comprehensive document covers all aspects
3. **⏳ AWAITING USER APPROVAL** - Waiting for user to approve this task document
4. **📋 READY FOR IMPLEMENTATION** - All phases planned and ready to execute

**TECHNICAL APPROACH CONFIRMED:**
- [x] **Cloud Function with HTTP trigger** - Serverless approach for cost optimization
- [x] **Cloud Scheduler integration** - Every 5 minutes execution frequency
- [x] **Existing database integration** - Reuse PostgreSQL instance and patterns
- [x] **Service account authentication** - Consistent with existing architecture
- [x] **Minimal dependencies** - Only database and HTTP client libraries required

### Implementation Standards
- [x] **Follow Python best practices:** Type hints, docstrings, async patterns
- [x] **Use minimal dependencies:** Only essential packages for Cloud Function
- [x] **Implement comprehensive error handling:** Database failures, HTTP timeouts, batch processing
- [x] **Create thorough tests:** Unit tests, integration tests, error scenarios
- [x] **Ensure proper logging:** Structured logging for monitoring and debugging
- [x] **Optimize for Cloud Function:** Fast startup, minimal memory usage, timeout management

### Deployment Requirements
- [x] **Create deployment automation** - Similar to existing deploy-dev.py patterns
- [x] **Configure Cloud Scheduler** - HTTP trigger with proper authentication
- [x] **Set up monitoring** - Cloud Function logs and metrics integration
- [x] **Test end-to-end** - Verify complete stuck job recovery workflow

### What Constitutes "Explicit User Approval"

**✅ APPROVAL RESPONSES (Start implementation immediately):**
- "Proceed with implementation"
- "Go ahead and build this"
- "Approved"
- "Start coding"
- "This looks good, begin implementation"
- "Execute the plan"
- "Begin Phase 1"

**❓ CLARIFICATION NEEDED (Do NOT start implementation):**
- Questions about specific technical details
- Requests for changes to the approach
- "What about..." or "How will you handle..."
- "I'd like to modify..."
- "Wait, let me think about..."
- No response

🛑 **NEVER start implementation without explicit user approval of this task document!**

---

## 16. Notes & Additional Context

### Research Links
- [Google Cloud Functions Python Runtime](https://cloud.google.com/functions/docs/runtime-support#python)
- [Cloud Scheduler HTTP targets](https://cloud.google.com/scheduler/docs/http-targets)
- [Cloud Functions service account authentication](https://cloud.google.com/functions/docs/securing/authenticating)
- [AsyncPG connection pooling](https://magicstack.github.io/asyncpg/current/usage.html#connection-pools)

### Performance Considerations
- **Function cold start:** ~1-2 seconds for Python runtime initialization
- **Database connections:** Connection pooling to minimize overhead for batch operations
- **Memory optimization:** 512MB allocation sufficient for typical batch sizes (50 jobs)
- **Execution time:** Target 2-3 minutes average execution time for typical workloads

### Cost Analysis
- **Cloud Function execution:** ~$0.40/month for 8,640 executions (every 5 minutes)
- **Database queries:** Negligible cost increase for periodic SELECT/UPDATE operations
- **Cloud Scheduler:** $0.10/month for job scheduling
- **Total estimated cost:** ~$0.50/month additional infrastructure cost

### Future Enhancements
- **Adaptive scheduling:** Adjust frequency based on stuck job volume
- **Priority processing:** Process high-priority users' stuck jobs first
- **Advanced retry strategies:** Exponential backoff, circuit breaker integration
- **Metrics dashboard:** Visualize stuck job patterns and recovery success rates

---

**CRITICAL GUIDELINES:**
- **SERVERLESS FIRST** - Cloud Function approach optimizes for cost and simplicity
- **MINIMAL DEPENDENCIES** - Keep function lightweight for fast startup and low cost
- **COMPREHENSIVE ERROR HANDLING** - Robust failure recovery for production reliability
- **THOROUGH TESTING** - Unit tests, integration tests, and end-to-end validation
- **PROPER MONITORING** - Structured logging and metrics for operational visibility

---

*Template Version: 1.2*  
*Last Updated: 1/8/2025*  
*Created By: AI Assistant*  
*Task: Implement Stuck Job Processor with Cloud Functions* 
