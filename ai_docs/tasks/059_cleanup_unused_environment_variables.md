# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Clean Up Unused Environment Variables from Deployment Scripts and Configuration

### Goal Statement
**Goal:** Remove unused environment variables (`MAX_FILE_SIZE_MB`, `CHUNK_SIZE`, `CHUNK_OVERLAP`) from deployment scripts and update the code to use consistent hardcoded defaults instead of environment variable references. This simplifies deployment configuration and removes unnecessary environment variables that are not actually needed for the application's functionality.

---

## 2. Strategic Analysis & Solution Options

**Strategic Analysis: SKIPPED** - This is a straightforward cleanup task with only one obvious approach: remove the unused environment variables and update code to use hardcoded defaults. No multiple viable approaches exist.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with type hints and modern syntax
- **Primary Framework:** FastAPI 0.104+ with async/await patterns for web API endpoints
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **API Patterns:** RESTful APIs with Pydantic models for validation
- **Code Quality Tools:** ruff for linting and import sorting, black for formatting, mypy for type checking
- **Containerization:** Docker with multi-stage builds for Google Cloud Run deployment
- **Key Architectural Patterns:** Configuration management via config.py, service layer pattern
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for embeddings, Google Gen AI for text processing
- **🔑 AUTHENTICATION PATTERNS:** Vertex AI with gcloud auth and service accounts
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0 for multimodal, google-genai>=1.24.0 for text
- **Relevant Existing Modules:** `config.py` for centralized configuration, various processing services

### Current State
Based on analysis of the codebase:

1. **Environment Variables in Deployment Scripts:**
   - `deploy-dev.py` sets: `MAX_FILE_SIZE_MB=100`, `CHUNK_SIZE=1000`, `CHUNK_OVERLAP=100`
   - `deploy-prod.py` sets: `MAX_FILE_SIZE_MB=500`, `CHUNK_SIZE=1000`, `CHUNK_OVERLAP=200`
   - `setup-gcp.py` also references these variables

2. **Actual Usage in Code:**
   - `MAX_FILE_SIZE_MB`: **NOT USED** in application code - only appears in deployment scripts
   - `CHUNK_SIZE`: Used in `config.py` with default 1000, referenced in `document_processing_service.py`
   - `CHUNK_OVERLAP`: Used in `config.py` with default 200, referenced in `document_processing_service.py`

3. **Service Layer Defaults:**
   - `document_processing_service.py`: Uses config values but has its own defaults (chunk_size=1000, chunk_overlap=100)
   - `video_processing_service.py`: Uses hardcoded 30-second chunks (different concept)
   - `audio_processing_service.py`: Uses hardcoded 60-second chunks (different concept)

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing Configuration Analysis:** Environment variables are set in deployment but some are unused
- [x] **Code Usage Pattern:** Only document processing actually uses CHUNK_SIZE/CHUNK_OVERLAP from config
- [x] **Service Dependencies:** Each service has appropriate defaults for its use case
- [x] **Architecture Alignment:** Removing unused env vars simplifies deployment and config management
- [x] **Performance Impact:** No performance impact - just cleanup

---

## 4. Context & Problem Definition

### Problem Statement
The deployment scripts are setting environment variables (`MAX_FILE_SIZE_MB`, `CHUNK_SIZE`, `CHUNK_OVERLAP`) that either:
1. Are not used at all in the application code (`MAX_FILE_SIZE_MB`)
2. Are used but the services already have appropriate hardcoded defaults (`CHUNK_SIZE`, `CHUNK_OVERLAP`)

This creates unnecessary complexity in deployment configuration and can be confusing for developers who might think these environment variables are required or actively used when they're not.

### Success Criteria
- [ ] `MAX_FILE_SIZE_MB`, `CHUNK_SIZE`, and `CHUNK_OVERLAP` environment variables removed from deployment scripts
- [ ] Application code no longer references these environment variables
- [ ] Services use consistent, appropriate hardcoded defaults
- [ ] Deployment scripts are simplified and cleaner
- [ ] All existing functionality remains unchanged

---

## 5. Technical Requirements

### Functional Requirements
- Remove environment variable lines from deployment scripts without affecting other functionality
- Update config.py to use hardcoded defaults instead of environment variable lookups
- Ensure document processing service uses appropriate defaults
- Maintain all existing processing behavior and performance

### Non-Functional Requirements
- **Simplicity:** Reduced deployment configuration complexity
- **Maintainability:** Fewer environment variables to manage
- **Consistency:** Standardized defaults across environments
- **Backward Compatibility:** No breaking changes to existing functionality

### Technical Constraints
- Must not affect existing document processing behavior
- Must not require changes to database or storage systems
- Must maintain compatibility with existing Cloud Run deployments

---

## 6. Data & Database Changes

### Database Schema Changes
**None required** - This is purely a configuration cleanup task.

### Data Model Updates
**None required** - No changes to Pydantic models or data structures.

### Data Migration Plan
**None required** - No data migration needed.

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES
This task follows existing patterns - no new patterns needed.

### API Endpoints
**No changes to API endpoints** - This is purely a configuration cleanup task.

### Database Operations
**No changes to database operations** - This is purely a configuration cleanup task.

### External Integrations
**No changes to external integrations** - This is purely a configuration cleanup task.

---

## 8. Python Module & Code Organization

### New Modules/Files
**None** - This is a cleanup task that only modifies existing files.

### Files to Modify
- [ ] **`deploy-dev.py`** - Remove environment variable lines for MAX_FILE_SIZE_MB, CHUNK_SIZE, CHUNK_OVERLAP
- [ ] **`deploy-prod.py`** - Remove environment variable lines for MAX_FILE_SIZE_MB, CHUNK_SIZE, CHUNK_OVERLAP
- [ ] **`config.py`** - Remove environment variable lookups and use hardcoded defaults
- [ ] **`setup-gcp.py`** - Remove environment variable references (optional cleanup)

### Dependency Management
**No new dependencies required** - This is purely a cleanup task.

---

## 9. Implementation Plan

### Phase 1: Remove Environment Variables from Deployment Scripts
**Goal:** Clean up deployment scripts by removing unused environment variable assignments

- [ ] **Task 1.1:** Update `deploy-dev.py`
  - Files: `deploy-dev.py`
  - Details: Remove lines 415-417 that set MAX_FILE_SIZE_MB, CHUNK_SIZE, CHUNK_OVERLAP
- [ ] **Task 1.2:** Update `deploy-prod.py`
  - Files: `deploy-prod.py` 
  - Details: Remove lines 268-270 that set MAX_FILE_SIZE_MB, CHUNK_SIZE, CHUNK_OVERLAP
- [ ] **Task 1.3:** Update `setup-gcp.py` (optional)
  - Files: `scripts/setup-gcp.py`
  - Details: Remove environment variable references on lines 419-421 and 546-548

### Phase 2: Update Configuration to Use Hardcoded Defaults
**Goal:** Simplify configuration by removing environment variable dependencies

- [ ] **Task 2.1:** Update `config.py`
  - Files: `rag_processor/config.py`
  - Details: 
    - Change `CHUNK_SIZE` from `int(os.getenv("CHUNK_SIZE", "1000"))` to `1000`
    - Change `CHUNK_OVERLAP` from `int(os.getenv("CHUNK_OVERLAP", "200"))` to `200`
    - Keep validation logic for these values

### Phase 3: Verification and Testing
**Goal:** Ensure all changes work correctly and deployment still functions

- [ ] **Task 3.1:** Verify deployment scripts
  - Test that both dev and prod deployment scripts work without the removed environment variables
- [ ] **Task 3.2:** Verify application behavior
  - Ensure document processing still works with the hardcoded defaults
  - Check that config validation still works properly

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# Sync lint dependencies
uv sync --group lint

# Run Ruff linting (fast, comprehensive)
uv run --group lint ruff check rag_processor/

# Auto-fix common issues
uv run --group lint ruff check --fix rag_processor/

# Run type checking
uv run --group lint mypy rag_processor/

# Run formatting check
uv run --group lint black --check rag_processor/

# Format code (if not using ruff format)
uv run --group lint black rag_processor/
```

---

## 10. File Structure & Organization

### Files to Modify
```
project-root/
├── deploy-dev.py                     # Remove env var lines 415-417
├── deploy-prod.py                    # Remove env var lines 268-270  
├── scripts/setup-gcp.py              # Remove env var references (optional)
└── rag_processor/
    └── config.py                     # Update CHUNK_SIZE and CHUNK_OVERLAP to hardcoded values
```

### Files to Analyze (No Changes Needed)
```
rag_processor/
├── services/
│   ├── document_processing_service.py    # Uses config values, will automatically use new defaults
│   ├── video_processing_service.py       # Uses own hardcoded 30-second chunks
│   └── audio_processing_service.py       # Uses own hardcoded 60-second chunks
```

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Deployment script syntax errors after removal
  - **Handling:** Carefully remove only the specific lines, maintain proper comma separation
- [ ] **Error 2:** Config validation fails with hardcoded values  
  - **Handling:** Use appropriate defaults that pass existing validation (1000 and 200)
- [ ] **Error 3:** Document processing behavior changes
  - **Handling:** Use same default values currently used (1000 for chunk size, 200 for overlap)

### Edge Cases
- [ ] **Edge Case 1:** Services expecting different defaults
  - **Solution:** Document processing service already has its own defaults that match what we're setting
- [ ] **Edge Case 2:** Future environment variable needs
  - **Solution:** If needed later, environment variables can be re-added, but currently they're unused

---

## 12. Security Considerations

### Configuration Security
- [ ] Removing unused environment variables improves security by reducing attack surface
- [ ] No sensitive data is involved in this cleanup
- [ ] Configuration becomes more predictable and easier to audit

### No New Security Risks
This is purely a cleanup task that removes unused configuration - no new security considerations.

---

## 13. Testing Strategy (OPTIONAL)

**📝 NOTE: Testing not required for this simple cleanup task.**

---

## 14. Deployment & Configuration

### Environment Variables After Cleanup
The following environment variables will no longer be set by deployment scripts:
- `MAX_FILE_SIZE_MB` (was unused anyway)
- `CHUNK_SIZE` (will use hardcoded 1000)
- `CHUNK_OVERLAP` (will use hardcoded 200)

### Deployment Impact
- Deployment scripts become simpler and cleaner
- No functional changes to the deployed application
- Same behavior with fewer configuration dependencies

---

## 15. Second-Order Consequences & Impact Analysis

### Breaking Changes Analysis
- [ ] **No Breaking Changes:** Application behavior remains identical
- [ ] **Environment Variable Dependencies:** Removes dependency on unused/unnecessary env vars
- [ ] **Service Defaults:** All services already have appropriate defaults

### Performance Implications  
- [ ] **No Performance Impact:** Same processing behavior with hardcoded vs environment variable defaults
- [ ] **Slightly Faster Startup:** Marginal improvement from not reading env vars, but negligible

### Security Considerations
- [ ] **Improved Security:** Fewer environment variables to manage and secure
- [ ] **Reduced Attack Surface:** Less configuration complexity

### Operational Impact
- [ ] **Simplified Deployment:** Fewer environment variables to set and maintain
- [ ] **Easier Configuration Management:** Less complexity in deployment scripts
- [ ] **Better Maintainability:** Clearer what configuration is actually used

### Critical Issues Identification
#### ✅ **NO RED FLAGS** - This is a low-risk cleanup task
#### ✅ **NO YELLOW FLAGS** - Simplification with no downside

---

## 16. AI Agent Instructions

### Communication Preferences
- [ ] This is a straightforward cleanup task - proceed with implementation after approval
- [ ] Flag any unexpected dependencies on the environment variables during implementation
- [ ] Provide clear before/after comparisons for the changed files

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **EVALUATE STRATEGIC NEED FIRST (Required)** - ✅ COMPLETED: This is straightforward cleanup
2. **STRATEGIC ANALYSIS SECOND (If needed)** - ✅ SKIPPED: Only one obvious approach
3. **CREATE TASK DOCUMENT THIRD (Required)** - ✅ COMPLETED: This document
4. **CONFIRM TECHNICAL APPROACH (Required)** - No technical ambiguity, proceed after approval
5. **GET APPROVAL FIFTH (Required)** - Wait for user approval
6. **IMPLEMENT SIXTH (Only after approval)** - Follow the phases in implementation plan

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start implementation immediately):**
- "Proceed"
- "Go ahead"
- "Approved" 
- "Start implementation"
- "Looks good"
- "Begin"
- "Execute the plan"
- "That works"
- "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start implementation):**
- Questions about specific implementation details
- Requests for changes or modifications
- No response or silence

### Python Code Quality Standards
- [ ] **Type Hints:** Maintain existing type annotations 
- [ ] **Code Formatting:** Use existing ruff/black configuration
- [ ] **Clean Removal:** Remove lines cleanly without affecting surrounding code
- [ ] **Validation:** Ensure removed env vars don't break anything

---

## 17. Notes & Additional Context

### Research Links
- Deploy scripts analysis completed - environment variables identified
- Config.py analysis completed - usage patterns identified  
- Service layer analysis completed - defaults already exist appropriately

### Performance Considerations
- No performance impact - purely configuration cleanup
- Marginal startup improvement from fewer environment variable lookups
- Document processing behavior remains identical

### Current Default Values to Use
- `CHUNK_SIZE`: 1000 characters (matches current default)
- `CHUNK_OVERLAP`: 200 characters (matches current production default)
- `MAX_FILE_SIZE_MB`: Remove entirely (not used in application code)

### Verification Steps
1. Confirm deployment scripts run without errors
2. Verify document processing still works correctly
3. Check that services use appropriate chunk sizes for their contexts

---

**CRITICAL GUIDELINES:**
- **FOCUS ON CLEAN REMOVAL** of unused configuration
- **MAINTAIN EXISTING BEHAVIOR** with hardcoded defaults
- **SIMPLIFY DEPLOYMENT** by removing unnecessary environment variables
- **FOLLOW EXISTING CODE PATTERNS** and maintain code quality

---

*Template Version: 1.2*  
*Last Updated: 7/7/2025*  
*Created By: Brandon Hancock*  
*Adapted from: Python Task Template* 
