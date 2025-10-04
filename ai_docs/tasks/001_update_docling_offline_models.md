# Update Docling Offline Models to 2.55+ Standard Approach

**Task Complexity:** 🟡 STANDARD TASK

---

## 1. Task Overview

### Task Title

**Update Docling Offline Model Handling to Use Official docling-tools CLI and Eliminate Manual Environment Variable Configuration**

### Goal Statement

**Goal:** Update the RAG processor deployment pipeline to use Docling 2.55+'s official `docling-tools` CLI for model downloads instead of the deprecated custom Python script approach. This fixes the "Missing safe tensors file" error by ensuring models are downloaded in the exact directory structure that Docling expects, while maintaining the Docker container approach for baked-in offline models.

---

## 2. Existing Codebase Analysis

### Current Implementation Analysis

**Files Analyzed:**

- `scripts/deploy_rag_processor_core.py` - Deployment script with custom model download logic
- `apps/rag-processor/rag_processor/services/document_processing_service.py` - Service using offline models
- `apps/rag-processor/pyproject.toml` - Dependencies (docling==2.55.1, docling-core==2.48.4)

### Current Workflow

**Model Download Flow (deploy_rag_processor_core.py lines 219-320):**

```
1. Create temporary directory
2. Run custom Python script that:
   - Imports docling.utils.model_downloader
   - Calls download_models()
   - Copies from ~/.cache/docling/models to temp directory
   - Manually organizes model files
3. Upload organized models to GCS
4. Bake models into Docker container at /app/models/docling
```

**Model Loading Flow (document_processing_service.py lines 115-199):**

```
1. Check for models at /app/models/docling or DOCLING_ARTIFACTS_PATH
2. Manually set os.environ["DOCLING_ARTIFACTS_PATH"] = str(artifacts_path)
3. Create PdfPipelineOptions with artifacts_path parameter
4. Initialize DocumentConverter with pipeline options
```

### Problem Identified

**Current Error:**

```
Missing safe tensors file: /app/models/docling/model.safetensors
```

**Root Cause:**

1. ❌ Custom Python script uses deprecated `docling.utils.model_downloader` API
2. ❌ Manual file copying doesn't preserve exact directory structure Docling 2.55+ expects
3. ❌ Model files are organized incorrectly, missing expected safetensors files
4. ❌ Manual environment variable setting in Python code creates configuration complexity

### Existing Technology Stack

- **Python Version:** 3.10+ (from pyproject.toml)
- **Docling Version:** 2.55.1
- **Docling Core Version:** 2.48.4
- **Deployment:** Google Cloud Run Jobs with Docker containers
- **Model Storage:** GCS bucket (gs://[bucket]/models/docling/)
- **Container Path:** /app/models/docling

---

## 3. Strategic Analysis & Solution Options

### Problem Context

The current implementation uses a deprecated approach for downloading Docling models that doesn't align with Docling 2.55+'s expected model directory structure. This causes runtime errors when the DocumentConverter tries to load models that aren't in the expected format/location.

### Solution Options Analysis

#### Option 1: Use Official docling-tools CLI (RECOMMENDED)

**Approach:** Replace custom Python download script with official `docling-tools models download` command and simplify configuration.

**Pros:**

- ✅ Official Docling 2.55+ approach - guaranteed compatibility
- ✅ Models downloaded in exact structure Docling expects
- ✅ Fixes "missing safetensors file" error immediately
- ✅ Simpler deployment script (fewer custom lines of code)
- ✅ Future-proof - will work with newer Docling versions
- ✅ Maintains Docker container approach (models baked in)
- ✅ Cleaner configuration - environment variable set once at container level

**Cons:**

- ❌ Requires docling-tools CLI to be available during deployment
- ❌ Minor change to deployment script structure

**Implementation Complexity:** Low - Replace ~40 lines of custom Python with single CLI command
**Risk Level:** Low - Official supported approach, well-documented

#### Option 2: Keep Custom Script but Fix Directory Structure

**Approach:** Keep custom Python script but manually create the exact directory structure Docling expects.

**Pros:**

- ✅ Minimal changes to existing deployment script structure
- ✅ Maintains Docker container approach

**Cons:**

- ❌ Requires reverse-engineering Docling's expected directory structure
- ❌ Fragile - may break with future Docling updates
- ❌ More complex code to maintain
- ❌ Still using deprecated download API
- ❌ Higher risk of missing files or incorrect structure

**Implementation Complexity:** Medium - Need to research and implement exact structure
**Risk Level:** High - Relies on undocumented directory structure that may change

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Use Official docling-tools CLI

**Why this is the best choice:**

1. **Guaranteed Compatibility** - Official Docling approach ensures models are downloaded in the exact structure expected by DocumentConverter
2. **Fixes Current Error** - The "missing safetensors file" error is directly caused by incorrect directory structure, which the official CLI handles correctly
3. **Future-Proof** - Using official APIs ensures compatibility with future Docling updates
4. **Simpler Codebase** - Reduces custom code from ~40 lines to a single CLI command
5. **Better Maintainability** - Documented official approach is easier for future developers to understand

---

## 4. Context & Problem Definition

### Problem Statement

The RAG processor deployment uses a custom Python script to download Docling models, which relies on deprecated APIs (`docling.utils.model_downloader`) and doesn't create the correct directory structure expected by Docling 2.55+. This causes runtime failures with "Missing safe tensors file: /app/models/docling/model.safetensors" errors when the DocumentConverter attempts to load models.

Additionally, the service manually sets `os.environ["DOCLING_ARTIFACTS_PATH"]` in Python code, creating configuration complexity when the environment variable should be set once at the container level.

### Success Criteria

- [ ] Deployment script uses official `docling-tools models download` command
- [ ] Models are downloaded in correct Docling 2.55+ directory structure
- [ ] DocumentConverter successfully loads models without "missing safetensors" errors
- [ ] Manual `os.environ["DOCLING_ARTIFACTS_PATH"]` setting removed from Python code
- [ ] Environment variable `DOCLING_ARTIFACTS_PATH` set at Cloud Run container level
- [ ] Deployment still bakes models into Docker container for offline operation
- [ ] Models successfully uploaded to GCS for Docker build access

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - can completely replace deployment approach
- **Data loss acceptable** - existing deployed containers can be replaced
- **Priority: Fixing production errors** over preserving old implementation
- **Aggressive refactoring allowed** - complete replacement of model download logic

### 🚨 CRITICAL: Fix Root Problems, Don't Work Around Them

- **Root problem**: Using deprecated model download API and incorrect directory structure
- **Solution**: Replace with official Docling approach, not patch existing code
- **No workarounds**: Complete replacement ensures future compatibility

---

## 6. Technical Requirements

### Functional Requirements

- Deployment script must download all standard Docling models (layout, tableformer, picture classifier, code formula, easyocr)
- Models must be stored in GCS bucket for Docker build access
- Models must be baked into Docker container at `/app/models/docling`
- DocumentConverter must successfully initialize with offline models
- No internet access required at runtime (models pre-downloaded)

### Non-Functional Requirements

- **Performance:** Model download should complete in reasonable time (< 5 minutes)
- **Security:** Use existing GCS authentication for model upload
- **Reliability:** Official Docling CLI ensures correct model structure
- **Maintainability:** Simpler code using official APIs

### Technical Constraints

- Must maintain Docker container approach (models baked in during build)
- Must use GCS for model storage (shared between deployment and Docker build)
- Must work in Cloud Run Jobs environment
- Must use Python 3.10+ and Docling 2.55+

---

## 7. Data & Database Changes

**No database changes required for this task.**

---

## 8. API & Backend Changes

### External Integrations

**Docling Tools CLI:**

- Command: `docling-tools models download`
- Purpose: Download standard Docling models to default cache location
- Output: Models stored in `~/.cache/docling/models` with correct structure

**GCS Storage:**

- Existing integration for model upload remains unchanged
- Command: `gcloud storage rsync -r [source] gs://[bucket]/models/docling/`

---

## 9. Code Organization & File Structure

### Files to Modify

- [ ] **`scripts/deploy_rag_processor_core.py`** - Replace custom model download with docling-tools CLI
- [ ] **`apps/rag-processor/rag_processor/services/document_processing_service.py`** - Remove manual environment variable setting
- [ ] **`apps/rag-processor/pyproject.toml`** - Verify docling and docling-core versions

### Dependencies to Verify

**Current dependencies in pyproject.toml:**

```toml
[project.dependencies]
"docling==2.55.1"
"docling-core==2.48.4"
```

**No additional dependencies needed** - docling-tools CLI is included with docling package.

---

## 10. Code Quality Standards & Best Practices

### Python Code Quality Requirements

- [ ] **Type Hints:** Complete type annotations for all functions
- [ ] **Async Patterns:** Use async/await for I/O operations
- [ ] **Relative Imports:** Always use relative imports (`.`) for internal modules
- [ ] **Modern Type Annotations:** Use `dict[str, str]` not `Dict[str, str]`
- [ ] **Exception Chaining:** Use `raise ... from e` for proper error context

### Python Code Style & Best Practices

- [ ] **Professional Comments:** Explain business logic, not change history
- [ ] **Early Returns:** Validate inputs early and return immediately for invalid cases
- [ ] **No Fallback Behavior:** Raise exceptions instead of trying alternate approaches
- [ ] **Clean Removal:** Delete unused code completely, don't leave commented artifacts

### Validation Commands (Run After Each File Change)

```bash
# 1. Basic compilation check
python -m py_compile scripts/deploy_rag_processor_core.py && echo "✅ Syntax valid"

# 2. Quick linting with auto-fix
uv run --group lint ruff check scripts/ --fix

# 3. Type checking
uv run --group lint mypy scripts/

# 4. Format code
uv run --group lint black scripts/
```

---

## 11. Implementation Plan

### Phase 1: Update Deployment Script Model Download

**Goal:** Replace custom Python download script with official docling-tools CLI command

- [ ] **Task 1.1:** Remove custom Python download script (lines 230-266)
  - Files: `scripts/deploy_rag_processor_core.py`
  - Details: Delete the `download_script` variable and Python execution logic
- [ ] **Task 1.2:** Add docling-tools CLI download command
  - Files: `scripts/deploy_rag_processor_core.py`
  - Details: Replace with direct subprocess call to `docling-tools models download`
- [ ] **Task 1.3:** Update model organization logic
  - Files: `scripts/deploy_rag_processor_core.py`
  - Details: Copy models from `~/.cache/docling/models` to temp directory without reorganizing

- [ ] **Task 1.4:** Verify GCS upload preserves model structure
  - Files: `scripts/deploy_rag_processor_core.py`
  - Details: Ensure rsync command maintains exact directory structure from cache

### Phase 2: Simplify Service Configuration

**Goal:** Remove manual environment variable setting from Python code

- [ ] **Task 2.1:** Remove manual os.environ setting
  - Files: `apps/rag-processor/rag_processor/services/document_processing_service.py`
  - Details: Delete line 154 `os.environ["DOCLING_ARTIFACTS_PATH"] = str(artifacts_path)`

- [ ] **Task 2.2:** Simplify configuration logic
  - Files: `apps/rag-processor/rag_processor/services/document_processing_service.py`
  - Details: Rely on environment variable set at container level, keep artifacts_path parameter as explicit fallback

- [ ] **Task 2.3:** Update documentation comments
  - Files: `apps/rag-processor/rag_processor/services/document_processing_service.py`
  - Details: Update docstrings to reflect new configuration approach

### Phase 3: Basic Code Validation (AI-Only)

**Goal:** Run basic automated checks - this is NOT the final code review

- [ ] **Task 3.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting, type checking, compilation checks
- [ ] **Task 3.2:** Import and Syntax Validation
  - Files: All Python modules
  - Details: Verify imports work and syntax is valid

### Phase 4: Comprehensive Code Review (Mandatory)

**Goal:** Present "Implementation Complete!" and execute thorough code review

🚨 **CRITICAL WORKFLOW CHECKPOINT:**

- [ ] **Task 4.1:** Present Implementation Complete Message (MANDATORY)
  - **Action:** Present the exact "Implementation Complete!" message
  - **Wait:** For user approval before proceeding with code review

- [ ] **Task 4.2:** Execute Comprehensive Code Review (If User Approves)
  - **Action:** Read all modified files and verify changes match task requirements
  - **Validation:** Run complete Python validation on all modified files
  - **Integration:** Check for integration issues between modified components
  - **Requirements:** Verify all success criteria are met

### Phase 5: User Testing Request

**Goal:** Request human testing for deployment and runtime functionality

- [ ] **Task 5.1:** Present Testing Summary
  - **Action:** Provide summary of changes and testing instructions
  - **Request:** User to run deployment and test document processing

---

## 12. Error Handling & Edge Cases

### Error Scenarios

- [ ] **docling-tools CLI Not Available**
  - **Handling:** Check for docling installation before running download command
  - **Response:** Clear error message with installation instructions

- [ ] **Model Download Failures**
  - **Handling:** Retry logic with exponential backoff
  - **Response:** Detailed error message about network/download issues

- [ ] **GCS Upload Failures**
  - **Handling:** Verify bucket permissions and existence
  - **Response:** Clear error with troubleshooting steps

- [ ] **Model Path Not Found at Runtime**
  - **Handling:** Check multiple paths (environment variable, default, explicit parameter)
  - **Response:** Descriptive error about missing models with expected path

### Edge Cases

- [ ] **Models Already Exist in GCS**
  - **Solution:** Check for existing models, skip download if present (idempotent)

- [ ] **Incomplete Model Download**
  - **Solution:** Validate model directory structure before upload

---

## 13. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. Breaking Changes Analysis

- [ ] **Deployment Script Changes:** Requires redeployment but doesn't break existing deployed containers
- [ ] **Model Structure Change:** New deployments will have correct structure, old containers continue working until redeployed
- [ ] **No API Changes:** Service interface remains the same

#### 2. Performance Implications

- [ ] **Deployment Time:** May be slightly faster using official CLI vs custom Python script
- [ ] **Runtime Performance:** No change - models still loaded from same container path
- [ ] **Docker Build Time:** No significant change

#### 3. Migration Path

- [ ] **Existing Deployments:** Continue working until redeployed with new approach
- [ ] **Testing:** Can test in development environment before production rollout
- [ ] **Rollback:** Can revert to old deployment script if issues arise

---

## 14. AI Agent Instructions

### Implementation Approach

**Standard Operating Procedure:**

1. **COMPLEXITY LEVEL:** 🟡 STANDARD TASK
2. **ANALYZE EXISTING CODE:** Review deployment script and service implementation
3. **IMPLEMENT CHANGES:** Replace custom download logic with official CLI
4. **VALIDATE:** Run Python validation checks
5. **CODE REVIEW:** Comprehensive review before user testing

### What Constitutes "Explicit User Approval"

**For Phase Continuation:**

- "proceed"
- "continue"
- "next phase"
- "go ahead"

**For Final Code Review:**

- "proceed"
- "yes, review the code"
- "go ahead with review"

---

## 15. Deployment & Configuration

### Environment Variables

**Cloud Run Job Configuration:**

```bash
# Already configured in deployment script (line 742)
DOCLING_ARTIFACTS_PATH=/app/models/docling
```

**No additional environment variables needed.**

### Deployment Steps

1. Run updated deployment script: `npm run deploy:rag-processor:dev`
2. Script downloads models using `docling-tools models download`
3. Models uploaded to GCS with correct structure
4. Docker build includes models at `/app/models/docling`
5. Cloud Run Job deployed with `DOCLING_ARTIFACTS_PATH` environment variable

---

## 16. Notes & Additional Context

### Research Links

- [Docling Official Documentation - Offline Models](https://docling-project.github.io/docling/usage/advanced_options/)
- [Docling FAQ - Offline Configuration](https://docling-project.github.io/docling/faq)
- [docling-tools CLI Documentation](https://docling-project.github.io/docling/usage/advanced_options/)

### Key Implementation Details

**Official Model Download Command:**

```bash
docling-tools models download
```

Downloads to: `$HOME/.cache/docling/models`

**Official Configuration Approach:**

```python
pipeline_options = PdfPipelineOptions(artifacts_path="/path/to/models")
converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)
```

**Environment Variable Alternative:**

```bash
export DOCLING_ARTIFACTS_PATH="/local/path/to/models"
```

---

**CRITICAL GUIDELINES:**

- **FOLLOW OFFICIAL DOCLING 2.55+ APPROACH** - Use docling-tools CLI, not custom scripts
- **MAINTAIN DOCKER CONTAINER APPROACH** - Keep models baked into container
- **SIMPLIFY CONFIGURATION** - Remove manual environment variable setting in Python
- **VALIDATE MODEL STRUCTURE** - Ensure exact directory structure from official CLI

---

_Template Version: 2.0 - Complexity-Aware_  
_Task Created: 2025-10-04_  
_Task Type: 🟡 STANDARD TASK_  
_Estimated Time: 2-3 hours_
