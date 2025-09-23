# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Clean Up Embedding Model Environment Variables from Deployment and Configuration

### Goal Statement
**Goal:** Remove embedding model environment variables (`TEXT_EMBEDDING_MODEL`, `TEXT_EMBEDDING_DIMENSIONS`, `MULTIMODAL_EMBEDDING_MODEL`, `MULTIMODAL_EMBEDDING_DIMENSIONS`) from deployment scripts, environment templates, and configuration files. Replace environment variable references with hardcoded defaults to prevent accidental misconfiguration of critical AI model settings.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current system uses environment variables for embedding model configuration, which creates risk of production issues if these critical settings are accidentally modified. Since these are stable configuration values that shouldn't change between environments, they should be hardcoded in the application rather than configurable via environment variables.

### Solution Options Analysis

#### Option 1: Complete Environment Variable Removal (RECOMMENDED)
**Approach:** Remove all environment variable references and hardcode embedding model settings in config.py

**Pros:**
- ✅ **Eliminates configuration risk** - No accidental model changes in production
- ✅ **Simplifies deployment** - Fewer environment variables to manage
- ✅ **Consistent behavior** - Same models used across all environments
- ✅ **Easier troubleshooting** - No environment-specific model differences

**Cons:**
- ❌ **Less flexibility** - Requires code changes to switch models (but this is actually desired)
- ❌ **Harder testing** - Can't easily test with different models (but current tests work fine)

**Implementation Complexity:** Low - Simple find/replace operations
**Time Estimate:** 30-45 minutes
**Risk Level:** Low - Only configuration changes with immediate validation

#### Option 2: Keep Environment Variables with Documentation
**Approach:** Keep the environment variables but document them as "internal only"

**Pros:**
- ✅ **Maintains flexibility** - Could still override if needed
- ✅ **Minimal code changes** - Just update documentation

**Cons:**
- ❌ **Still allows misconfiguration** - Primary problem remains unsolved
- ❌ **Confusing for users** - Mixed message about which vars are configurable
- ❌ **Maintenance overhead** - Need to maintain both paths

**Implementation Complexity:** Low
**Time Estimate:** 15 minutes
**Risk Level:** Medium - Doesn't solve the core problem

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Complete Environment Variable Removal

**Why this is the best choice:**
1. **Risk elimination** - Prevents production issues from model misconfiguration
2. **Simplified deployment** - Cleaner environment variable management
3. **Clear intent** - Makes it obvious these values shouldn't be changed
4. **Maintenance reduction** - Fewer configuration paths to maintain

**Key Decision Factors:**
- **Stability:** Embedding models are infrastructure-level decisions, not runtime configuration
- **Risk Management:** Production issues from wrong models are more costly than reduced flexibility
- **Deployment Simplicity:** Fewer environment variables mean simpler deployments
- **Developer Experience:** Clear hardcoded values are easier to understand than env vars

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with type hints
- **Primary Framework:** FastAPI 0.104+ with async/await patterns
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with asyncpg for database operations
- **API Patterns:** RESTful APIs with Pydantic models for validation
- **Testing Framework:** pytest with async support and coverage
- **Code Quality Tools:** ruff for linting and import sorting, mypy for type checking
- **Containerization:** Docker with multi-stage builds for production
- **Key Architectural Patterns:** Dependency injection, async request handlers, structured logging
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for embeddings with text-embedding-004 and multimodalembedding@001
- **🔑 AUTHENTICATION PATTERNS:** Vertex AI with gcloud auth and service account credentials
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0 for embeddings and multimodal processing
- **Relevant Existing Modules:** `config.py` for settings, `embedding_service.py` for AI operations

### Current State
The system currently uses environment variables for embedding model configuration across:
- **Deployment scripts** (deploy-dev.py, deploy-prod.py) - Set environment variables for Cloud Run
- **Setup scripts** (setup-gcp.py) - Configure environment variables in .env templates
- **Configuration** (config.py) - Read environment variables with defaults
- **Environment templates** (env.local.template, env.prod.template) - Provide default values
- **Service usage** (embedding_service.py) - Use config values for model initialization

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [ ] **Existing SDK Analysis:** ✅ Currently uses Vertex AI with vertexai package
- [ ] **Authentication Method:** ✅ Uses gcloud auth for development, service accounts for production
- [ ] **Dependency Consistency:** ✅ No new dependencies required, just configuration cleanup
- [ ] **Architecture Alignment:** ✅ Hardcoded config fits existing patterns
- [ ] **Performance Impact:** ✅ No performance impact, same models and operations

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing Vertex AI setup** - No changes to AI integration
- [x] **Use existing Google Gen AI setup** - N/A, not used for embeddings
- [x] **Add new SDK only if necessary** - No new SDKs needed
- [x] **Match existing authentication patterns** - No auth changes needed
- [x] **🚨 GOOGLE AI PACKAGES COMPLIANCE** - Already using modern vertexai package
- [x] **Confirm approach with user** - Approved by user request

---

## 4. Context & Problem Definition

### Problem Statement
The current system uses environment variables for critical embedding model configuration, creating risk of production issues if these settings are accidentally modified. The embedding models (`text-embedding-004` and `multimodalembedding@001`) are stable infrastructure decisions that shouldn't vary between environments, but the current environment variable approach makes them appear user-configurable.

### Success Criteria
- [ ] Environment variables removed from all deployment scripts
- [ ] Environment variables removed from environment templates
- [ ] Config.py updated to use hardcoded values
- [ ] All references to environment variables cleaned up
- [ ] Embedding service continues to work with same models
- [ ] Deployment and development workflows unchanged except for cleaner env files

---

## 5. Technical Requirements

### Functional Requirements
- Remove `TEXT_EMBEDDING_MODEL`, `TEXT_EMBEDDING_DIMENSIONS`, `MULTIMODAL_EMBEDDING_MODEL`, `MULTIMODAL_EMBEDDING_DIMENSIONS` from environment variable configuration
- Update config.py to use hardcoded values instead of environment variable lookups
- Maintain same embedding model functionality with text-embedding-004 and multimodalembedding@001
- Keep all existing API contracts and service behavior unchanged

### Non-Functional Requirements
- **Performance:** No performance impact - same models and operations
- **Security:** No security changes required - same authentication patterns
- **Scalability:** No scalability changes - same resource usage
- **Reliability:** Improved reliability by eliminating configuration drift risk
- **Observability:** Same logging and monitoring behavior

### Technical Constraints
- Must maintain compatibility with existing embedding data in database
- Cannot change actual embedding models being used
- Must not break existing deployment workflows
- Must preserve all existing service functionality

---

## 6. Data & Database Changes

### Database Schema Changes
No database changes required - all embedding operations use the same models and produce the same vector dimensions.

### Data Model Updates
No data model changes required - Pydantic models and database schemas remain unchanged.

### Data Migration Plan
No data migration required - existing embedded data remains valid.

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**API ROUTES** → No changes required
**BUSINESS LOGIC** → No changes to embedding service logic
**DATABASE ACCESS** → No changes to database operations
**CONFIGURATION** → Update config.py to remove environment variable dependencies

### API Endpoints
No API endpoint changes required - all embedding functionality remains the same.

### Database Operations
No database operation changes required - same vector operations and queries.

### External Integrations
No changes to Vertex AI integration - same models and authentication patterns.

---

## 8. Python Module & Code Organization

### New Modules/Files
No new modules required - only updating existing configuration.

### Files to Modify
- [ ] **`deploy-dev.py`** - Remove embedding model environment variables
- [ ] **`deploy-prod.py`** - Remove embedding model environment variables  
- [ ] **`setup-gcp.py`** - Remove embedding model environment variables
- [ ] **`config.py`** - Replace environment variable lookups with hardcoded values
- [ ] **`env.local.template`** - Remove embedding model variables
- [ ] **`env.prod.template`** - Remove embedding model variables

### Dependencies to Add to pyproject.toml
No new dependencies required.

---

## 9. Implementation Plan

### Phase 1: Remove Environment Variables from Deployment Scripts
**Goal:** Clean up deployment script environment variable configuration

- [ ] **Task 1.1:** Update `deploy-dev.py`
  - Files: `apps/rag-processor/deploy-dev.py`
  - Details: Remove TEXT_EMBEDDING_MODEL, TEXT_EMBEDDING_DIMENSIONS, MULTIMODAL_EMBEDDING_MODEL, MULTIMODAL_EMBEDDING_DIMENSIONS from environment variable list
  
- [ ] **Task 1.2:** Update `deploy-prod.py`
  - Files: `apps/rag-processor/deploy-prod.py`
  - Details: Remove same four environment variables from Cloud Run environment configuration
  
- [ ] **Task 1.3:** Update `setup-gcp.py`
  - Files: `scripts/setup-gcp.py`
  - Details: Remove embedding model variables from both environment list and .env template generation

### Phase 2: Update Configuration and Templates
**Goal:** Replace environment variable lookups with hardcoded values

- [ ] **Task 2.1:** Update config.py
  - Files: `apps/rag-processor/rag_processor/config.py`
  - Details: Replace os.getenv() calls with direct hardcoded values for embedding model settings
  
- [ ] **Task 2.2:** Update environment templates
  - Files: `apps/rag-processor/env.local.template`, `apps/rag-processor/env.prod.template`
  - Details: Remove embedding model environment variable definitions

### Phase 3: Verification and Testing
**Goal:** Ensure all changes work correctly and no references remain

- [ ] **Task 3.1:** Verify embedding service functionality
  - Details: Test that embedding operations still work with hardcoded config values
  
- [ ] **Task 3.2:** Search for remaining references
  - Details: Grep for any remaining references to the removed environment variables
  
- [ ] **Task 3.3:** Test deployment scripts
  - Details: Verify deployment scripts still work without the removed environment variables

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
```

---

## 10. File Structure & Organization

### Files to Modify
```
project-root/
├── apps/rag-processor/
│   ├── deploy-dev.py                 # Remove embedding env vars
│   ├── deploy-prod.py                # Remove embedding env vars
│   ├── env.local.template            # Remove embedding env vars
│   ├── env.prod.template             # Remove embedding env vars
│   └── rag_processor/
│       └── config.py                 # Hardcode embedding model config
└── scripts/
    └── setup-gcp.py                  # Remove embedding env vars from setup
```

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Config validation failure after hardcoding values
  - **Handling:** Verify hardcoded values match existing defaults exactly
- [ ] **Error 2:** Embedding service initialization failure
  - **Handling:** Test embedding service startup with new config values
- [ ] **Error 3:** Deployment script failures
  - **Handling:** Validate deployment scripts work without removed environment variables

### Edge Cases
- [ ] **Edge Case 1:** Existing environment variables override hardcoded values
  - **Solution:** Remove all os.getenv() calls to ensure hardcoded values are used
- [ ] **Edge Case 2:** Scripts that depend on these environment variables
  - **Solution:** Search for all references and update accordingly

---

## 12. Security Considerations

### Authentication & Authorization
No authentication changes required - same Vertex AI authentication patterns.

### Input Validation
No validation changes required - same embedding model inputs and outputs.

### Data Protection
No data protection changes required - same embedding operations and data handling.

---

## 13. Testing Strategy (OPTIONAL)

**📝 NOTE: This section can be skipped if testing is not required for the task.**

### Test Categories (If Testing Required)
- [ ] **Unit Tests** - Verify config.py returns correct hardcoded values
- [ ] **Integration Tests** - Test embedding service with new configuration
- [ ] **Deployment Tests** - Verify deployment scripts work without removed environment variables

---

## 14. Deployment & Configuration

### Environment Variables
After cleanup, these variables will be removed from all environment files:
- `TEXT_EMBEDDING_MODEL` (hardcoded to "text-embedding-004")
- `TEXT_EMBEDDING_DIMENSIONS` (hardcoded to 768)
- `MULTIMODAL_EMBEDDING_MODEL` (hardcoded to "multimodalembedding@001")  
- `MULTIMODAL_EMBEDDING_DIMENSIONS` (hardcoded to 1408)

### Health Checks
Existing health checks will continue to work as embedding service behavior remains unchanged.

---

## 15. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** ✅ No API changes - embedding endpoints remain the same
- [ ] **Database Dependencies:** ✅ No database changes - same vector dimensions and operations
- [ ] **Service Dependencies:** ✅ No service interface changes
- [ ] **Authentication/Authorization:** ✅ No auth changes required

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** ✅ No data flow changes - same embeddings generated
- [ ] **Service Integration:** ✅ No integration changes required
- [ ] **Processing Pipeline:** ✅ Same processing behavior with hardcoded models
- [ ] **Error Handling:** ✅ Same error scenarios and handling

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** ✅ No query changes - same vector operations
- [ ] **Memory Usage:** ✅ No memory impact - same models loaded
- [ ] **API Response Times:** ✅ No latency changes
- [ ] **Concurrent Processing:** ✅ Same concurrency behavior

#### 4. **Security Considerations**
- [ ] **Attack Surface:** ✅ Reduced attack surface by removing configuration vectors
- [ ] **Data Exposure:** ✅ No new data exposure risks
- [ ] **Input Validation:** ✅ Same validation patterns
- [ ] **Authentication Bypass:** ✅ No authentication changes

#### 5. **Operational Impact**
- [ ] **Deployment Complexity:** ✅ Reduced complexity with fewer environment variables
- [ ] **Monitoring Requirements:** ✅ No new monitoring needed
- [ ] **Resource Usage:** ✅ Same resource usage patterns
- [ ] **Backup/Recovery:** ✅ No backup/recovery changes

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** ✅ Reduced complexity with hardcoded values
- [ ] **Dependencies:** ✅ No dependency changes
- [ ] **Testing Overhead:** ✅ No additional testing required
- [ ] **Documentation:** ✅ Simpler environment documentation

### Critical Issues Identification

#### ✅ **GREEN FLAGS - Low Risk Changes**
- [ ] **Configuration Simplification:** Reduces environment variable management complexity
- [ ] **Risk Reduction:** Eliminates possibility of embedding model misconfiguration
- [ ] **Deployment Improvement:** Cleaner environment variable setup
- [ ] **Maintenance Improvement:** Fewer configuration paths to maintain

### Mitigation Strategies

#### Configuration Changes
- [ ] **Validation Strategy:** Test embedding service startup after config changes
- [ ] **Rollback Plan:** Keep copies of original files for easy rollback if needed
- [ ] **Verification Process:** Search for any remaining references to removed variables

---

## 16. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW

**🚨 MANDATORY: This is a straightforward cleanup task with clear requirements:**

1. **EVALUATE STRATEGIC NEED FIRST (Required)**
   - [x] **Assess complexity** - This is a straightforward configuration cleanup
   - [x] **Review the criteria** - Single obvious approach, user specified exact requirements
   - [x] **Decision point** - Skip strategic analysis, proceed directly to implementation

2. **CREATE TASK DOCUMENT** (Completed)
   - [x] **Document the cleanup approach** with specific files and changes
   - [x] **Include comprehensive analysis** of current state and requirements
   - [x] **Technical approach confirmed** - No new SDKs or architecture changes

3. **IMPLEMENTATION WORKFLOW**
   - [ ] Start with Phase 1: Remove environment variables from deployment scripts
   - [ ] Complete Phase 2: Update configuration files and templates
   - [ ] Execute Phase 3: Verification and testing
   - [ ] **Follow removal order:** deployment scripts → config.py → templates
   - [ ] **Use search/replace for precision** - ensure exact variable names are targeted
   - [ ] **Test after each phase** - verify no functionality breaks

### Python Code Quality Standards
- [ ] **Maintain type hints** in config.py modifications
- [ ] **Keep docstrings** for any modified configuration methods
- [ ] **Preserve existing patterns** in all modified files
- [ ] **Clean removal** - ensure no commented-out or unused code remains

### What Constitutes "Explicit User Approval"

**✅ APPROVAL RESPONSES (Start implementation immediately):**
- "Proceed"
- "Go ahead"  
- "Start implementing"
- "Begin"
- "Great! start implementing" (user's exact words)

**🎯 USER HAS ALREADY APPROVED** - The user said "Great! start implementing" for this type of cleanup task.

---

## 17. Notes & Additional Context

### Research Links
- Vertex AI embedding models documentation
- Current config.py implementation patterns
- Environment variable management best practices

### Performance Considerations
- No performance impact expected
- Same embedding models and operations
- Simplified configuration loading

---

**CRITICAL GUIDELINES:**
- **REMOVE CONFIGURATION VECTORS** that could cause production issues
- **MAINTAIN EXACT SAME FUNCTIONALITY** with hardcoded values
- **SIMPLIFY DEPLOYMENT** by reducing environment variable count
- **PRESERVE ALL EXISTING BEHAVIOR** while removing configuration flexibility
- **TEST INCREMENTALLY** after each phase to ensure no regressions

---

*Template Version: 1.2*  
*Task Number: 060*  
*Created: January 2025*  
*Purpose: Environment Variable Cleanup for Embedding Models* 
