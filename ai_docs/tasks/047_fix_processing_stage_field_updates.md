# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix processing_stage Field Not Being Updated in RAG Processor

### Goal Statement
**Goal:** Fix the bug where the `processing_stage` field in the `document_processing_jobs` table remains stuck at "pending" even after successful processing completion. The field should accurately reflect the current processing state throughout the job lifecycle, allowing the web application to display meaningful progress information to users.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with comprehensive type hints
- **Primary Framework:** FastAPI with async/await patterns for high-performance processing
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with raw SQL queries using psycopg2 and pgvector extension
- **API Patterns:** RESTful APIs with Pydantic models for validation and EventArc integration
- **Testing Framework:** pytest with async support and coverage reporting
- **Code Quality Tools:** ruff for linting and import sorting, black for formatting, mypy for type checking
- **Containerization:** Docker with multi-stage builds for Google Cloud Run deployment
- **Key Architectural Patterns:** Service-oriented architecture with dependency injection, async processing pipelines
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for embeddings and multimodal processing, Google Gen AI for text generation
- **🔑 AUTHENTICATION PATTERNS:** Google Cloud service account authentication with Secret Manager integration
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0 for multimodal embeddings, google-cloud-secretmanager for credentials
- **Relevant Existing Modules:** 
  - `rag_processor/services/processing_service.py` - Main processing orchestration
  - `rag_processor/services/database_service.py` - Database operations
  - `rag_processor/models/metadata_models.py` - Data models and enums

### Current State
The RAG processor successfully processes documents, audio, and video files, but has a critical bug where the `processing_stage` field in the `document_processing_jobs` table is not being updated during the processing lifecycle. 

**Current Behavior:**
- `processing_stage` gets set to "pending" during job creation
- Field remains "pending" even after successful processing completion
- `status` field correctly updates: "pending" → "processing" → "processed"
- Web application shows incorrect processing stage information to users

**Root Cause Analysis:**
1. **Job Creation:** `_store_processing_job()` sets `processing_stage = job.processing_pipeline` (which is "pending")
2. **Job Updates:** `_update_processing_job()` completely ignores the `processing_stage` field in UPDATE queries
3. **No Stage Progression:** No code exists to advance the processing stage through meaningful states

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing SDK Analysis:** Project uses Vertex AI SDK and Google Cloud services - no new SDKs needed
- [x] **Authentication Method:** Uses Google Cloud service account authentication via Secret Manager - maintain consistency
- [x] **Dependency Consistency:** Fix uses existing database patterns with psycopg2 - no new dependencies required
- [x] **Architecture Alignment:** Bug fix aligns with existing service-oriented architecture and async patterns
- [x] **Performance Impact:** Minimal impact - just adding field updates to existing database operations

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing database service patterns** - maintain consistency with current psycopg2 usage
- [x] **Follow existing async patterns** - all database operations are already async
- [x] **Match existing error handling** - use existing retry mechanisms and logging
- [x] **Maintain current job lifecycle** - don't change overall processing flow, just add stage updates
- [x] **No new dependencies required** - pure bug fix using existing infrastructure

## 3. Context & Problem Definition

### Problem Statement
The `processing_stage` field in the `document_processing_jobs` table provides crucial information about the current processing step for documents, audio, and video files. However, this field is currently not being updated during the processing lifecycle, causing:

1. **User Experience Issues:** Web application shows misleading "pending" status even for completed jobs
2. **Debugging Difficulties:** Unable to track where processing might be stuck or failing
3. **Monitoring Gaps:** No visibility into processing pipeline progress for operations teams
4. **Data Integrity:** Database contains incorrect processing state information

The issue was discovered when processing a PowerPoint file that showed:
- `status: "processed"` (correct)
- `processing_stage: "pending"` (incorrect - should be "completed" or similar)

### Success Criteria
- [x] `processing_stage` field accurately reflects current processing state throughout job lifecycle
- [x] Field updates correctly for all content types (document, audio, video, image)
- [x] No performance regression in processing pipeline
- [x] Backward compatibility maintained for existing jobs
- [x] All existing processing functionality continues to work unchanged

---

## 4. Technical Requirements

### Functional Requirements
- **Requirement 1:** `processing_stage` field must be updated at each major processing step
- **Requirement 2:** Processing stages should be meaningful and consistent across content types
- **Requirement 3:** Failed jobs should have appropriate error stage information
- **Requirement 4:** Historical jobs should not break due to schema changes

### Non-Functional Requirements
- **Performance:** No measurable impact on processing speed or database performance
- **Security:** Maintain existing authentication and authorization patterns
- **Scalability:** Changes must work with concurrent processing jobs
- **Reliability:** Robust error handling for database update failures
- **Observability:** Enhanced structured logging for processing stage transitions

### Technical Constraints
- **Constraint 1:** Must not modify existing database schema or add new columns
- **Constraint 2:** Cannot change existing API contracts or EventArc integration
- **Constraint 3:** Must maintain backward compatibility with existing job records
- **Constraint 4:** No changes to job retry logic or error handling patterns

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- No schema changes required - using existing processing_stage column
-- Current column: processing_stage VARCHAR
-- Will populate with meaningful stage values instead of leaving as "pending"
```

### Data Model Updates
```python
# No Pydantic model changes required - existing ProcessingJob model sufficient
# Will enhance stage transition logic in processing service

# Proposed processing stages for consistency:
PROCESSING_STAGES = {
    "pending": "Job created, awaiting processing",
    "downloading": "Downloading file from GCS",
    "processing": "Processing file content",
    "embedding": "Generating embeddings",
    "storing": "Storing processed chunks",
    "completed": "Processing completed successfully",
    "failed": "Processing failed with error"
}
```

### Data Migration Plan
- [x] **No migration required:** Existing jobs with "pending" stage remain valid
- [x] **Graceful handling:** Code will work with both old and new stage values
- [x] **No data loss:** Historical job records remain unchanged and functional

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MANDATORY: Follow these Python patterns strictly:**

**API ROUTES** → `main.py` or `routers/[feature].py`
- [x] **No API changes required** - This is an internal processing bug fix
- [x] **Existing EventArc integration remains unchanged**

**BUSINESS LOGIC** → `services/processing_service.py`
- [x] **ProcessingService class** - Add stage update logic to existing methods
- [x] **Keep processing flow intact** - Only add stage updates, don't change core logic

**DATABASE ACCESS** → `services/processing_service.py` (existing pattern)
- [x] **Follow existing database patterns** - Use existing psycopg2 connection and cursor patterns
- [x] **Maintain async operations** - All database operations remain async with proper error handling

**CONFIGURATION** → No configuration changes required
- [x] **No new environment variables** - Uses existing database and service configuration

### API Endpoints
- **No new endpoints required** - This is an internal processing bug fix
- **Existing EventArc webhook remains unchanged** - Processing service internal implementation only

### Database Operations
- [x] **Enhanced UPDATE queries** - Add processing_stage field to existing job update operations
- [x] **Maintain existing patterns** - Use current connection pooling and transaction handling
- [x] **Preserve retry logic** - Work within existing retry_database_operation framework

### External Integrations
- **No changes to external integrations** - GCS, Vertex AI, and Secret Manager usage unchanged
- **EventArc integration preserved** - No changes to event handling or authentication

---

## 7. Python Module & Code Organization

### New Modules/Files
- **No new modules required** - This is a bug fix in existing `processing_service.py`

### Files to Modify
- [x] **`rag_processor/services/processing_service.py`** - Add processing stage update logic
  - **Methods to modify:**
    - `_update_processing_job()` - Add processing_stage field to UPDATE query
    - `_route_to_pipeline()` - Add stage updates during processing steps
    - `_process_video()`, `_process_audio()`, `_process_image()`, `_process_document()` - Add stage transitions
  - **New helper methods:**
    - `_update_processing_stage()` - Helper method for consistent stage updates
    - `_get_processing_stage_for_status()` - Map job status to appropriate stage

### Module Organization Pattern
- **Maintain existing service architecture** - No structural changes to module organization
- **Follow existing patterns** - Use same async/await patterns, logging, and error handling
- **Preserve existing interfaces** - No changes to public method signatures

### Code Quality Requirements
- **Type Hints:** All new methods will have complete type annotations
- **Documentation:** Docstrings for new helper methods following existing patterns
- **Error Handling:** Proper exception handling consistent with existing retry patterns
- **Async/Await:** Maintain existing async patterns for database operations

### Dependency Management
**🔧 NO NEW DEPENDENCIES REQUIRED:**
- [x] **Use existing psycopg2 patterns** - No new database libraries needed
- [x] **Use existing structlog logging** - No new logging dependencies
- [x] **Use existing retry utilities** - No new retry mechanism dependencies

---

## 8. Implementation Plan

### Phase 1: Fix Core Processing Stage Updates
**Goal:** Fix the immediate bug where processing_stage field is not being updated

- [x] **Task 1.1:** Add processing_stage field to UPDATE query in `_update_processing_job()`
  - Files: `rag_processor/services/processing_service.py`
  - Details: Modify the UPDATE SQL query to include processing_stage field alongside status updates
  
- [x] **Task 1.2:** Create helper method for consistent stage updates
  - Files: `rag_processor/services/processing_service.py`
  - Details: Add `_update_processing_stage()` method to encapsulate stage update logic with proper error handling

### Phase 2: Add Stage Transitions Throughout Processing Pipeline
**Goal:** Add meaningful stage transitions during processing lifecycle

- [x] **Task 2.1:** Add stage updates to main processing pipeline
  - Files: `rag_processor/services/processing_service.py`
  - Details: Add stage transitions in `_route_to_pipeline()` method for different processing steps

- [x] **Task 2.2:** Add stage updates to content-specific processing methods
  - Files: `rag_processor/services/processing_service.py`
  - Details: Add stage transitions in `_process_video()`, `_process_audio()`, `_process_image()`, `_process_document()` methods

### Phase 3: Testing and Validation
**Goal:** Ensure all processing scenarios correctly update stages

- [x] **Task 3.1:** Test stage updates for all content types
  - Files: Test processing with document, audio, video, and image files
  - Details: Verify stage progression and database updates work correctly

- [x] **Task 3.2:** Validate error handling and failed job stages
  - Files: Test error scenarios and verify stage updates work during failures
  - Details: Ensure failed jobs get appropriate error stages

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

## 9. File Structure & Organization

### New Files to Create
**No new files required** - This is a bug fix in existing service

### Files to Modify
- [x] **`rag_processor/services/processing_service.py`** - Add processing stage update logic
  - **Specific changes:**
    - Add processing_stage field to UPDATE query in `_update_processing_job()`
    - Add stage transition logic in processing pipeline methods
    - Add helper methods for consistent stage management
    - Enhance error handling to include stage updates

### Dependencies to Add to pyproject.toml
**⚠️ NO NEW DEPENDENCIES REQUIRED**
- This is a pure bug fix using existing infrastructure
- All required dependencies (psycopg2, structlog, etc.) already exist

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [x] **Error 1:** Database connection failures during stage updates
  - **Handling:** Use existing retry_database_operation framework, log stage update failures
- [x] **Error 2:** Stage update failure during processing
  - **Handling:** Continue processing but log warning, don't fail entire job for stage update issues
- [x] **Error 3:** Invalid stage transitions
  - **Handling:** Validate stage values and fall back to status-based stage mapping

### Edge Cases
- [x] **Edge Case 1:** Existing jobs with "pending" stage
  - **Solution:** Code handles both old and new stage values gracefully
- [x] **Edge Case 2:** Concurrent job processing
  - **Solution:** Use existing database transaction patterns to prevent race conditions
- [x] **Edge Case 3:** Processing interruption/restart
  - **Solution:** Stage updates are idempotent and can be safely retried

### Custom Exception Handling
```python
# Use existing ProcessingServiceError patterns
# No new exception types required
# Enhanced logging for stage transition failures
```

---

## 11. Security Considerations

### Authentication & Authorization
- [x] **No changes required** - Using existing Google Cloud service account authentication
- [x] **Maintain existing security patterns** - No new authentication or authorization logic

### Input Validation
- [x] **Stage value validation** - Ensure only valid stage values are written to database
- [x] **Maintain existing input validation** - No changes to existing Pydantic model validation

### Data Protection
- [x] **No new data exposure** - Stage information is internal processing metadata
- [x] **Maintain existing data protection** - No changes to existing encryption or security patterns

---

## 12. Testing Strategy

### Test Structure
```python
# Use existing test patterns - no new test infrastructure required
# Test stage updates within existing processing tests
```

### Test Categories
- [x] **Unit Tests** - Test stage update helper methods
- [x] **Integration Tests** - Test stage updates during actual processing
- [x] **Regression Tests** - Ensure existing functionality remains unchanged
- [x] **Error Handling Tests** - Test stage updates during various failure scenarios

### Testing Commands
**🧪 ALWAYS use uv for running tests to ensure correct dependencies:**

```bash
# First sync test dependencies
uv sync --group test

# Run all tests
uv run --group test pytest

# Run specific processing service tests
uv run --group test pytest tests/test_processing_service.py -v
```

---

## 13. Deployment & Configuration

### Environment Variables
**No new environment variables required** - Using existing database and service configuration

### Docker Configuration
**No Docker changes required** - This is a code-only bug fix

### Health Checks
**No health check changes required** - Existing health checks remain functional

---

## 14. AI Agent Instructions

### Communication Preferences
- [x] Ask for clarification if stage naming conventions need adjustment
- [x] Provide clear before/after examples of stage transitions
- [x] Flag any potential performance implications immediately
- [x] Suggest testing approach for validation

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **TASK DOCUMENT CREATED** ✓
   - [x] Task document created with specific details for processing_stage bug fix
   - [x] Technical approach confirmed - using existing patterns and infrastructure
   - [x] No new dependencies or architectural changes required

2. **CONFIRM TECHNICAL APPROACH** ✓
   - [x] **SDK choices verified** - No new SDKs required, using existing database patterns
   - [x] **Authentication confirmed** - Using existing Google Cloud service account patterns
   - [x] **Architecture alignment confirmed** - Bug fix fits existing service architecture
   - [x] **Performance impact minimal** - Only adding field updates to existing operations

3. **AWAITING USER APPROVAL** 🔄
   - [ ] **Wait for explicit user approval** of both task document and technical approach
   - [ ] **Incorporate any requested changes** to the task document
   - [ ] **Confirm implementation plan** before writing code

4. **IMPLEMENTATION** (After approval)
   - [ ] Fix `_update_processing_job()` to include processing_stage field
   - [ ] Add stage transitions throughout processing pipeline
   - [ ] Add helper methods for consistent stage management
   - [ ] Test with all content types and error scenarios
   - [ ] Run code quality checks and validation

### 🚨 CRITICAL: Technical Approach Validation
**CONFIRMED APPROACH:**
- [x] **Database Pattern:** Continue using existing psycopg2 with async patterns
- [x] **Error Handling:** Use existing retry_database_operation framework
- [x] **Logging:** Use existing structlog patterns for stage transition logging
- [x] **Architecture:** Maintain existing service-oriented architecture
- [x] **Performance:** Minimal impact - just adding field updates to existing queries

---

## 15. Notes & Additional Context

### Research Links
- Existing processing_service.py implementation patterns
- Current database schema for document_processing_jobs table
- ProcessingJob model definition in metadata_models.py
- Existing retry and error handling patterns

### Performance Considerations
- **Database Operations:** Adding one field to existing UPDATE queries - negligible performance impact
- **Processing Pipeline:** Stage updates are lightweight operations that won't affect processing speed
- **Memory Usage:** No additional memory requirements for stage tracking
- **Connection Pooling:** Using existing database connection patterns

### Current Processing Stage Values Found
```python
# From the user's example output:
# "processing_stage": "pending"  # This is the bug - should be "completed"
# "status": "processed"          # This is correct

# Proposed stage progression:
# "pending" → "downloading" → "processing" → "embedding" → "storing" → "completed"
# Or for failures: "pending" → "processing" → "failed"
```

---

*Template Version: 1.0*  
*Last Updated: January 7, 2025*  
*Created By: AI Assistant*  
*Task Type: Bug Fix - Processing Stage Field Updates* 
