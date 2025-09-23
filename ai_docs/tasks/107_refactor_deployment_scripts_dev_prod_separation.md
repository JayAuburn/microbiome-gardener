# Refactor Deployment Scripts for Dev/Prod Environment Separation

## 1. Task Overview

### Task Title
**Title:** Refactor RAG processor and queue handler deployment scripts to support separate dev/prod environments with core/wrapper pattern

### Goal Statement
**Goal:** Create a clean separation between development and production deployments by refactoring the existing hardcoded deployment scripts into a core/wrapper pattern, similar to the setup scripts. This will enable environment-specific service names, Docker images, configurations, and resource allocation while maintaining code reusability and following established project patterns.

---

## 3. Strategic Analysis & Solution Options

### Problem Context
Currently, deployment scripts (`deploy_rag_processor.py` and `deploy_queue_handler.py`) hardcode service names and configurations, making it impossible to maintain separate development and production environments. The setup scripts already follow an excellent core/wrapper pattern with `gcp_setup_core.py`, but the deployment scripts haven't been updated to match this architecture.

The existing `deployment_config.py` contains comprehensive environment-specific configurations, but the deployment scripts don't leverage this system, instead using hardcoded values.

### Solution Options Analysis

#### Option 1: Extend Current Scripts with Environment Parameter
**Approach:** Add environment parameter to existing scripts and modify them to use `deployment_config.py`

**Pros:**
- ✅ Minimal file restructuring required
- ✅ Quick implementation with existing code base
- ✅ No breaking changes to existing npm scripts

**Cons:**
- ❌ Doesn't follow established setup script pattern
- ❌ Mixed environment logic in single files makes maintenance harder
- ❌ Doesn't provide clean separation of concerns
- ❌ Command line parameter pattern is inconsistent with setup scripts

**Implementation Complexity:** Low - Simple parameter addition and config integration
**Risk Level:** Medium - Easy to introduce environment mixing bugs

#### Option 2: Core/Wrapper Pattern (Recommended)
**Approach:** Create core modules containing shared logic and thin environment-specific wrapper scripts, matching the setup script architecture

**Pros:**
- ✅ Follows established project patterns (setup_gcp_dev/setup_gcp_prod → gcp_setup_core)
- ✅ Clean separation of environment-specific vs shared logic  
- ✅ Consistent npm script naming (`deploy:processor:dev` vs `deploy:processor:prod`)
- ✅ Easy to maintain and extend with new environments
- ✅ Leverages existing `deployment_config.py` infrastructure
- ✅ Environment-specific service names and Docker images

**Cons:**
- ❌ More files to create and maintain
- ❌ Requires updating npm scripts in package.json
- ❌ Need to migrate existing deployment logic

**Implementation Complexity:** Medium - Requires restructuring existing code and creating new modules
**Risk Level:** Low - Well-established pattern with clear separation

#### Option 3: Single Dynamic Script with Config Detection
**Approach:** Single script that automatically detects environment from config files or environment variables

**Pros:**
- ✅ Single script to maintain
- ✅ Automatic environment detection

**Cons:**
- ❌ Magic behavior that's harder to understand
- ❌ Doesn't match established setup script patterns
- ❌ Risk of deploying to wrong environment accidentally
- ❌ Less explicit about which environment is being targeted

**Implementation Complexity:** Medium - Complex detection logic required
**Risk Level:** High - Risk of environment confusion and accidental production deployments

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 2 - Core/Wrapper Pattern

**Why this is the best choice:**
1. **Consistency with established patterns** - Matches the successful setup_gcp_dev/setup_gcp_prod → gcp_setup_core architecture
2. **Leverages existing infrastructure** - Uses the comprehensive `deployment_config.py` system that's already built
3. **Clear environment separation** - Eliminates risk of accidentally deploying to wrong environment
4. **Maintainable and extensible** - Easy to add new environments (staging, testing, etc.) in the future

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 2 - Core/Wrapper Pattern), or would you prefer a different approach?

---

## 4. Context & Problem Definition

### Problem Statement
The current deployment scripts hardcode service names, configurations, and environment-specific settings, making it impossible to maintain clean development and production environments. Specifically:

- `deploy_rag_processor.py` hardcodes service name as "rag-processor-app" 
- `deploy_queue_handler.py` hardcodes function name as "rag-queue-handler"
- No environment-specific Docker image naming
- Single `.env.local` file used for both environments
- Resource configurations are hardcoded rather than using `deployment_config.py`
- Deployment scripts don't follow the established core/wrapper pattern used by setup scripts

This creates operational challenges and prevents proper environment isolation.

### Success Criteria
- [ ] Environment-specific service names (rag-processor-app-dev, rag-processor-app-prod)
- [ ] Environment-specific Docker image names and tags
- [ ] Environment-specific queue handler names and Cloud Tasks queues
- [ ] Dynamic loading of `.env.local` vs `.env.prod` files
- [ ] Integration with existing `deployment_config.py` system
- [ ] Core/wrapper script pattern matching setup scripts
- [ ] Updated npm scripts for dev/prod deployment
- [ ] No hardcoded environment-specific values in core logic

---

## 6. Technical Requirements

### Functional Requirements
- Core deployment modules containing shared logic for both environments
- Environment-specific wrapper scripts that call core functions with proper configuration
- Dynamic environment file loading (`.env.local` for dev, `.env.prod` for prod)
- Service naming follows `[service-name]-[environment]` pattern
- Docker images tagged with environment-specific names
- Cloud Tasks queues are environment-specific
- Resource allocation from `deployment_config.py` based on environment

### Non-Functional Requirements
- **Performance:** No impact on deployment speed - same underlying logic
- **Security:** Environment isolation prevents accidental cross-environment deployments
- **Scalability:** Pattern supports adding additional environments (staging, testing) easily
- **Reliability:** Clear error handling when environment files or configurations are missing

### Technical Constraints
- Must maintain compatibility with existing Cloud Build configurations
- Must not break existing deployment workflows during transition
- Must leverage existing `deployment_config.py` infrastructure
- Must follow established Python project patterns and import structure

---

## 8. API & Backend Changes

### Environment Configuration Integration
**Integration with deployment_config.py system:**

```python
from .deployment_config import get_config

def deploy_processor_service_core(environment: str) -> str:
    """Core deployment logic that works for any environment"""
    config = get_config(environment, service_type="processor")
    
    # Use environment-specific values from config
    service_name = config.service_name  # "rag-processor-app-dev" or "rag-processor-app-prod"
    image_name = f"{config.service_name}:latest"
    service_account = f"{config.service_account_name}@{project_id}.iam.gserviceaccount.com"
```

### Environment File Loading
**Dynamic environment file loading:**

```python
def load_environment_file(environment: str) -> dict[str, str]:
    """Load appropriate environment file based on environment"""
    if environment == "development":
        env_file = Path("apps/rag-processor/.env.local")
    elif environment == "production":
        env_file = Path("apps/rag-processor/.env.prod")
    else:
        raise ValueError(f"Unknown environment: {environment}")
        
    if not env_file.exists():
        raise FileNotFoundError(f"Environment file not found: {env_file}")
        
    return load_env_file(env_file)
```

### Service Naming Pattern
**Environment-specific service names:**
- **Development:** `rag-processor-app-dev`, `rag-queue-handler-dev`
- **Production:** `rag-processor-app-prod`, `rag-queue-handler-prod`
- **Docker Images:** `rag-processor-app-dev:latest`, `rag-processor-app-prod:latest`
- **Cloud Tasks:** `rag-processor-processing-queue-dev`, `rag-processor-processing-queue-prod`

---

## 10. Code Quality Standards & Best Practices

### Python Code Quality Requirements
- [ ] **🚨 FUNCTION INSPECTION:** Always inspect function definitions before calling - never guess parameter types
- [ ] **Type Hints:** Complete type annotations for all functions, classes, and variables
- [ ] **Async Patterns:** Use async/await for I/O operations (database, HTTP, file access)
- [ ] **🚨 RELATIVE IMPORTS:** Always use relative imports (`.`) for internal modules
- [ ] **🚨 USE UV:** Always use `uv` commands for dependency management, never `pip install`

### Python Code Style & Best Practices
- [ ] **🚨 MANDATORY: Write Professional Comments - Never Historical Comments**
  - [ ] **❌ NEVER write change history**: `# Fixed this bug`, `# Removed old function`, `# Updated to use new API`
  - [ ] **✅ ALWAYS explain business logic**: `# Load environment-specific configuration`, `# Deploy service with computed resource allocation`

- [ ] **🚨 MANDATORY: Use early returns to keep code clean and readable**
  - [ ] **Validate inputs early** and return immediately for invalid cases
  - [ ] **Handle error conditions first** before proceeding with main logic

- [ ] **🚨 MANDATORY: NO FALLBACK BEHAVIOR - Always raise exceptions instead**
  - [ ] **Never handle "legacy formats"** - expect the current format or fail fast
  - [ ] **No "try other common fields"** fallback logic - if expected field missing, raise exception

- [ ] **🚨 MANDATORY: Clean up removal artifacts**
  - [ ] **Remove unused imports** and dependencies after refactoring
  - [ ] **Delete empty functions/classes** completely rather than leaving commented stubs

### Validation Commands (Run After Each File Change)
```bash
# 1. Basic compilation check
python -m py_compile scripts/deploy_rag_processor_core.py && echo "✅ Syntax valid"

# 2. Import validation  
python -c "from scripts import deploy_rag_processor_core; print('✅ Imports work')" 

# 3. Quick linting with auto-fix
uv run --group lint ruff check scripts/ --fix

# 4. Type checking
uv run --group lint mypy scripts/
```

### Forbidden Patterns Checklist
**Before marking any task complete, verify NONE of these exist:**

```bash
# Check for forbidden patterns (run once at end)
grep -r "Any" scripts/ && echo "❌ Found Any - use specific types"
grep -r "from scripts\." scripts/ && echo "❌ Found absolute imports - use relative"
```

---

## 11. Implementation Plan

### Phase 1: Create Core Deployment Modules
**Goal:** Extract shared deployment logic into reusable core modules

- [ ] **Task 1.1:** Create `deploy_rag_processor_core.py` with shared logic
  - Files: `scripts/deploy_rag_processor_core.py` 
  - Details: Move all deployment logic from current script, parameterize environment-specific values
- [ ] **Task 1.2:** Create `deploy_queue_handler_core.py` with shared logic
  - Files: `scripts/deploy_queue_handler_core.py`
  - Details: Extract Cloud Function deployment logic, parameterize service names and queues
- [ ] **Task 1.3:** Update core modules to use `deployment_config.py`
  - Files: Both core modules
  - Details: Replace hardcoded configurations with `get_config(environment, service_type)`

### Phase 2: Create Environment-Specific Wrapper Scripts  
**Goal:** Create thin wrapper scripts for each environment following setup script pattern

- [ ] **Task 2.1:** Create development wrapper scripts
  - Files: `scripts/deploy_rag_processor_dev.py`, `scripts/deploy_queue_handler_dev.py`
  - Details: Simple imports and calls to core functions with "development" environment
- [ ] **Task 2.2:** Create production wrapper scripts
  - Files: `scripts/deploy_rag_processor_prod.py`, `scripts/deploy_queue_handler_prod.py`
  - Details: Simple imports and calls to core functions with "production" environment
- [ ] **Task 2.3:** Update npm scripts in package.json
  - Files: `package.json`
  - Details: Update script references to point to environment-specific wrappers

### Phase 3: Environment File Management
**Goal:** Implement dynamic environment file loading

- [ ] **Task 3.1:** Create environment file loading utility
  - Files: `scripts/deploy_rag_processor_core.py`, `scripts/deploy_queue_handler_core.py`
  - Details: Add logic to load `.env.local` for dev, `.env.prod` for production
- [ ] **Task 3.2:** Update service URL persistence logic  
  - Files: Core deployment modules
  - Details: Environment-aware service URL updates (PROCESSOR_SERVICE_URL_DEV vs PROCESSOR_SERVICE_URL_PROD or environment-specific file updates)

### Phase 4: Basic Code Validation (AI-Only)
**Goal:** Run basic automated checks - this is NOT the final code review

- [ ] **Task 4.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting, type checking, compilation checks
- [ ] **Task 4.2:** Import and Syntax Validation
  - Files: All Python modules
  - Details: Verify imports work and syntax is valid (NO live testing)

### Phase 5: Comprehensive Code Review (Mandatory)
**Goal:** Present "Implementation Complete!" and execute thorough code review

🚨 **CRITICAL WORKFLOW CHECKPOINT:**

- [ ] **Task 5.1:** Present Implementation Complete Message (MANDATORY)
  - **Action:** Present the exact "Implementation Complete!" message below
  - **Wait:** For user approval before proceeding with code review
  
  **📋 EXACT MESSAGE TO PRESENT:**
  ```
  🎉 **Implementation Complete!**
  
  All phases have been implemented successfully. I've made changes to 6+ files across 3 phases.
  
  **📋 I recommend doing a thorough code review of all changes to ensure:**
  - No mistakes were introduced
  - All goals were achieved  
  - Code follows Python project standards
  - Everything will work as expected
  
  **Would you like me to proceed with the comprehensive code review?**
  ```

- [ ] **Task 5.2:** Execute Comprehensive Code Review (If User Approves)
  - **Action:** Read all modified files and verify changes match task requirements exactly
  - **Validation:** Run complete Python validation on all modified files
  - **Integration:** Check for integration issues between modified components
  - **Requirements:** Verify all success criteria from task document are met
  - **Report:** Provide detailed review summary with confidence assessment

### Phase 6: User Testing Request
**Goal:** Request human testing for functionality requiring live system interaction

- [ ] **Task 6.1:** Present Testing Summary
  - **Action:** Provide summary of all changes and automated validation results
  - **Request:** Specific deployment testing steps for both dev and prod environments

### Task Completion Tracking - MANDATORY WORKFLOW

**🚨 CRITICAL: Real-Time Task Document Updates Are MANDATORY**

**📋 MANDATORY REAL-TIME UPDATE PROCESS:**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date
- [ ] **🛑 STOP after completing ANY subtask** - Before moving to the next task
- [ ] **📝 IMMEDIATELY open the task document** - Don't wait until the end
- [ ] **✅ Mark checkbox as [x]** with completion timestamp using ACTUAL current date: `✓ 2025-07-26 17:45`
- [ ] **📁 Add file details** with specific paths and changes made
- [ ] **🔄 REPEAT for every single subtask** - No exceptions

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Development environment (.env.local)
ENVIRONMENT=development
GOOGLE_CLOUD_PROJECT_ID=my-dev-project
GOOGLE_CLOUD_STORAGE_BUCKET=my-project-rag-documents-dev
PROCESSOR_SERVICE_URL=https://rag-processor-app-dev-xyz.run.app

# Production environment (.env.prod) 
ENVIRONMENT=production
GOOGLE_CLOUD_PROJECT_ID=my-prod-project
GOOGLE_CLOUD_STORAGE_BUCKET=my-project-rag-documents-prod
PROCESSOR_SERVICE_URL=https://rag-processor-app-prod-xyz.run.app
```

### Updated NPM Scripts
```json
{
  "scripts": {
    "setup:gcp:dev": "uv run python -m scripts.setup_gcp_dev",
    "setup:gcp:prod": "uv run python -m scripts.setup_gcp_prod",
    "deploy:processor:dev": "uv run python -m scripts.deploy_rag_processor_dev",
    "deploy:processor:prod": "uv run python -m scripts.deploy_rag_processor_prod", 
    "deploy:queue:dev": "uv run python -m scripts.deploy_queue_handler_dev",
    "deploy:queue:prod": "uv run python -m scripts.deploy_queue_handler_prod"
  }
}
```

### File Structure After Implementation
```
scripts/
├── __init__.py
├── deploy_rag_processor_core.py      # Shared deployment logic
├── deploy_rag_processor_dev.py       # Development wrapper
├── deploy_rag_processor_prod.py      # Production wrapper  
├── deploy_queue_handler_core.py      # Shared queue handler logic
├── deploy_queue_handler_dev.py       # Development wrapper
├── deploy_queue_handler_prod.py      # Production wrapper
├── deployment_config.py              # Existing config system (unchanged)
├── gcp_setup_core.py                 # Existing setup core (unchanged)
├── setup_gcp_dev.py                  # Existing dev setup (unchanged)
└── setup_gcp_prod.py                 # Existing prod setup (unchanged)
```

**Time Estimate:** 3-4 hours for complete implementation and validation
