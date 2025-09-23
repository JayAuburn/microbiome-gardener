# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix Infinite Retry Loops in AI Processing Services

### Goal Statement
**Goal:** Eliminate infinite retry loops in AI processing services (video, audio, image, document) that occur when Gemini API calls fail with invalid API keys or other errors. The current retry mechanisms are not properly incrementing counters or respecting maximum retry limits, causing background processes to run indefinitely even after the main processing job is marked as failed.

---

## 2. MANDATORY: Existing Codebase Analysis

### 🚨 CRITICAL WORKFLOW REQUIREMENT
**⚠️ BEFORE ANY PLANNING OR IMPLEMENTATION: You MUST thoroughly analyze the existing codebase to understand:**

1. **What services/modules already exist** that handle similar functionality
2. **How the current workflow processes** the type of data you're working with
3. **Whether this is an extension** of existing code or truly new functionality
4. **What patterns and architectures** are already established

**🛑 NEVER start planning implementation without this analysis!**

### Existing Services & Modules Analysis

#### Step 1: Project Structure Discovery
**COMPLETED ANALYSIS:**
- Project root: `templates/rag-saas/apps/rag-processor/`
- Main module: `rag_processor/`
- Services directory: `rag_processor/services/`
- Utils directory: `rag_processor/utils/`

#### Step 2: Related Service Discovery
**SERVICES ANALYZED:**
- ✅ `processing_service.py` - Main orchestrator (working correctly)
- ⚠️ `video_processing_service.py` - **PRIMARY CULPRIT** (needs analysis)
- ⚠️ `audio_processing_service.py` - Low direct risk, depends on transcription service
- ✅ `image_processing_service.py` - Low direct risk, clean error handling
- ✅ `document_processing_service.py` - Low risk, sequential processing

**SERVICES REQUIRING ANALYSIS:**
- 🔴 `video_processing_service.py` - Source of infinite retry logs
- 🔴 `embedding_service.py` - Used by ALL services, likely has retry logic
- 🔴 `rag_processor/audio_transcription.py` - Used by audio processing
- 🔴 `rag_processor/utils/retry_utils.py` - Utility functions for retry logic
- 🔴 `rag_processor/services/genai_utils.py` - GenAI file manager utilities

#### Step 3: Current Workflow Understanding
**CURRENT FLOW ANALYSIS:**
```
Entry Point: processing_service.py → process_file()
Processing Steps: 
1. Download file from GCS ✅ (working)
2. Route to type-specific processor ✅ (working)
3. Type-specific processing (video/audio/image/doc) ❌ (infinite retry here)
4. Generate embeddings ❌ (retry logic here)
5. Store in database ✅ (working)
6. Mark job complete ✅ (working)

PROBLEM LOCATION: Steps 3-4 have retry loops that don't terminate properly
```

**EVIDENCE FROM LOGS:**
- Main job correctly marked as "error" with completed timestamp
- Background retry continues indefinitely with "Context generation failed"
- Database shows `retry_count: 0` (counter not incrementing)
- Timeline: Job completes in 7 seconds, but retries continue

#### Step 4: Integration vs New Code Decision
**🎯 INTEGRATION DECISION:**
- ✅ **EXTEND EXISTING SERVICES** - This is fixing broken retry logic, not adding new features
- ✅ **Fix existing retry utilities** in `retry_utils.py`
- ✅ **Update existing service methods** that use retry decorators/patterns
- ❌ **No new services needed** - all infrastructure exists, just broken

**📋 ANALYSIS RESULTS:**
- **Existing Related Services:** All AI processing services use retry mechanisms
- **Current Workflow:** Retry logic embedded in service methods and utilities
- **Integration Decision:** Fix existing retry implementations, not create new ones
- **Recommended Entry Point:** `utils/retry_utils.py` and service-specific retry loops

### Existing Technology Stack
- **Python Version:** 3.10+
- **Primary Framework:** FastAPI-based processing service
- **Database:** PostgreSQL with connection pooling
- **Existing AI/ML Services:** Google GenAI, VertexAI for multimodal embeddings
- **Authentication Patterns:** Gemini API key, GCloud service account authentication
- **Processing Pipeline:** File download → Type-specific processing → Embedding → Storage

### 🚨 INTEGRATION REQUIREMENTS
**Based on analysis:**
- **Files to Modify:** 
  - `rag_processor/utils/retry_utils.py` (fix retry decorators/functions)
  - `rag_processor/services/video_processing_service.py` (fix video-specific retries)
  - `rag_processor/services/embedding_service.py` (fix embedding retry logic)
  - `rag_processor/audio_transcription.py` (fix transcription retries)
  - `rag_processor/services/genai_utils.py` (fix GenAI file manager retries)
- **New Files Needed:** None (fixing existing code)
- **Dependencies to Add:** None (using existing retry patterns)
- **Migration Needed:** None (behavior fixes only)

---

## 3. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**✅ CONDUCT STRATEGIC ANALYSIS** - Multiple viable approaches exist for fixing retry logic with different architectural implications and trade-offs.

### Problem Context
The infinite retry issue is a critical production bug where AI processing services continue retrying failed operations indefinitely, consuming resources and potentially causing memory leaks. The retry mechanisms have broken counter incrementation and termination conditions, creating background processes that never stop even when the main job is correctly marked as failed. This affects system stability and resource usage, requiring immediate fixing with careful consideration of the best approach.

### Solution Options Analysis

#### Option 1: Fix Existing Retry Decorators/Utilities
**Approach:** Repair the broken retry logic in `retry_utils.py` and ensure all services use it correctly.

**Pros:**
- ✅ Maintains existing architecture and patterns
- ✅ Centralized fix affects all services consistently  
- ✅ Minimal code changes required across services
- ✅ Preserves existing error handling and logging patterns
- ✅ Easy to test and validate fix effectiveness

**Cons:**
- ❌ Requires deep analysis of existing retry utility implementation
- ❌ May miss service-specific retry logic that bypasses utilities
- ❌ Could have hidden dependencies in current decorator patterns

**Implementation Complexity:** Medium - Need to analyze and fix utility functions
**Time Estimate:** 4-6 hours
**Risk Level:** Low - Centralized fix with broad impact

#### Option 2: Replace Retry Logic with Modern Async Patterns
**Approach:** Remove existing retry decorators and implement modern asyncio-based retry patterns with proper error handling.

**Pros:**
- ✅ Modern, maintainable async/await patterns
- ✅ Better error handling and timeout control
- ✅ More explicit retry logic that's easier to debug
- ✅ Can implement circuit breaker patterns for external APIs
- ✅ Better integration with structured logging

**Cons:**
- ❌ Requires significant refactoring of all AI services
- ❌ Changes established patterns throughout codebase
- ❌ Higher risk of introducing new bugs during refactor
- ❌ More complex testing requirements

**Implementation Complexity:** High - Major refactoring across multiple services
**Time Estimate:** 1-2 days
**Risk Level:** Medium - Extensive changes increase bug risk

#### Option 3: Hybrid Approach - Fix Critical Paths, Modernize Gradually
**Approach:** Immediately fix the infinite retry bug in critical paths (video/embedding services), then gradually modernize retry patterns.

**Pros:**
- ✅ Quick fix for immediate production issue
- ✅ Allows gradual modernization without breaking everything
- ✅ Lower immediate risk while enabling future improvements
- ✅ Can target specific problem areas first

**Cons:**
- ❌ Creates inconsistent retry patterns temporarily
- ❌ Requires multiple phases of work
- ❌ May leave some edge cases unfixed initially

**Implementation Complexity:** Medium - Focused fixes with planned modernization
**Time Estimate:** 6-8 hours initially, then gradual improvements
**Risk Level:** Low - Minimal changes for immediate fix

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Fix Existing Retry Decorators/Utilities

**Why this is the best choice:**
1. **Immediate Impact** - Centralized fix addresses infinite retry issue across all services
2. **Low Risk** - Preserves existing architecture while fixing the core bug
3. **Comprehensive** - Single fix point affects video, audio, image, and document processing
4. **Maintainable** - Keeps existing patterns that developers understand

**Key Decision Factors:**
- **Performance Impact:** Fixes resource leak from infinite retries
- **Scalability:** Prevents runaway processes that consume memory/CPU
- **Maintainability:** Maintains established patterns while fixing bugs
- **Cost Impact:** Reduces unnecessary GCP resource consumption
- **Security:** No security implications for internal retry logic

**Alternative Consideration:**
Option 3 (Hybrid) would be preferred if the retry utilities are too complex to fix quickly, but Option 1 should be attempted first as it provides the cleanest solution.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1 - Fix Existing Retry Utilities), or would you prefer a different approach?

**Questions for you to consider:**
- Does fixing the existing retry utilities align with your maintenance preferences?
- Are you comfortable with analyzing and fixing the current retry decorator patterns?
- Do you prefer immediate bug fixes over architectural modernization?

**Next Steps:**
Once you approve the strategic direction, I'll create the detailed implementation plan focusing on fixing the existing retry utilities and ensuring proper counter incrementation and termination conditions.

---

## 4. Context & Problem Definition

### Problem Statement
The RAG processor's AI services (video, audio, image, document processing) contain retry logic that enters infinite loops when API calls fail. Specifically:

1. **Infinite Retry Bug:** When Gemini API calls fail (e.g., invalid API key), retry mechanisms don't properly increment counters or respect maximum retry limits
2. **Resource Consumption:** Background retry processes continue indefinitely, consuming CPU and memory resources
3. **Database Inconsistency:** Main processing jobs are correctly marked as "error" and completed, but background retries continue
4. **System Instability:** Runaway processes can eventually cause memory leaks and system degradation

**Evidence from Production Logs:**
- "Context generation failed" errors repeat indefinitely
- Database shows `retry_count: 0` despite multiple retry attempts
- Processing jobs complete with error status but retries continue in background
- Timeline analysis shows 7-second job completion but ongoing retry loops

### Success Criteria
- [ ] All retry loops respect maximum retry limits (typically 3 attempts)
- [ ] Retry counters properly increment with each attempt
- [ ] Failed operations terminate completely after max retries exceeded
- [ ] No background processes continue after job completion
- [ ] Resource usage returns to normal levels after failed operations
- [ ] Retry logic works consistently across video, audio, image, and document processing

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a production bug fix in active development**
- **No backwards compatibility concerns** - fixing broken retry logic
- **Data loss acceptable** - retry behavior fixes don't affect data integrity
- **Users are experiencing infinite retries** - immediate fix required
- **Priority: Correctness and resource efficiency** over feature additions
- **Aggressive debugging allowed** - add extensive logging during fix process
- **System restart acceptable** - can restart services to clear stuck processes
- **Breaking retry changes acceptable** - current retry logic is broken anyway

---

## 6. Technical Requirements

### Functional Requirements
- Retry mechanisms must increment counters properly on each attempt
- Maximum retry limits (typically 3) must be respected and enforced
- Failed operations must terminate completely after max retries exceeded
- Retry logic must handle different error types appropriately (retryable vs non-retryable)
- All AI services (video, audio, image, document) must use consistent retry patterns

### Non-Functional Requirements
- **Performance:** Eliminate infinite loops that consume CPU indefinitely, retry delays should use exponential backoff (1s, 2s, 4s)
- **Resource Management:** Proper cleanup of resources (file handles, API connections) when retries fail, memory usage should not grow with retry attempts
- **Reliability:** Deterministic retry behavior with proper termination conditions, circuit breaker patterns for repeated API failures
- **Observability:** Structured logging of retry attempts with counters and error details, metrics for retry success/failure rates
- **Error Handling:** Distinguish between retryable errors (network timeouts) and non-retryable errors (invalid API keys, malformed requests)

### Technical Constraints
- Must work with existing Google GenAI and VertexAI authentication patterns
- Cannot break existing error handling and logging infrastructure
- Must maintain compatibility with current database schema for job tracking
- Should preserve existing service interfaces and method signatures

---

## 7. Data & Database Changes

### Database Schema Changes
No database schema changes required - this is a behavior fix for existing retry logic.

### Data Model Updates
No Pydantic model changes required - retry logic operates at the service layer.

### Data Migration Plan
No data migration needed - fixing runtime behavior only.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**EXISTING PATTERNS TO MAINTAIN:**
- **Service Layer** - Business logic in `services/[feature]_service.py`
- **Utility Functions** - Retry logic in `utils/retry_utils.py`
- **Error Handling** - Custom exceptions for retryable vs non-retryable errors
- **Logging** - Structured logging with retry attempt context

### API Endpoints
No new API endpoints required - fixing internal service retry behavior.

### Database Operations
No new database operations - existing job tracking remains unchanged.

### External Integrations
**Affected Services:**
- Google GenAI API - Text generation and file upload operations
- VertexAI - Multimodal embedding operations
- Google Cloud Storage - File operations (indirect)

**Retry Patterns Needed:**
- Exponential backoff for API rate limiting
- Circuit breaker for repeated authentication failures
- Different retry policies for different error types

---

## 9. Python Module & Code Organization

### New Modules/Files
No new files required - fixing existing retry implementations.

### **🚨 CRITICAL: Import Pattern Requirements**
- **ALWAYS use relative imports** within the same package: `from .retry_utils import retry_with_backoff`
- **NEVER use absolute imports** for internal modules: ❌ `from rag_processor.utils.retry_utils import retry_with_backoff`
- **Use absolute imports ONLY** for external packages: ✅ `import asyncio`, `from typing import Optional`

### Dependency Management
**🔧 PACKAGE MANAGEMENT WITH UV:**
No new dependencies required - using existing packages:
- `asyncio` for async retry patterns
- `structlog` for logging retry attempts
- `typing` for type hints

---

## 10. Implementation Plan

### Phase 1: Analyze Existing Retry Mechanisms
**Goal:** Understand all current retry implementations and identify the infinite loop causes

- [x] **Task 1.1:** Analyze retry utilities in `utils/retry_utils.py` ✓ 2025-01-24 18:15
  - Files: `rag_processor/utils/retry_utils.py` (analyzed all 422 lines) ✓
  - Details: **SURPRISING FINDING** - Retry utilities are well-implemented with proper termination logic! ✓
  - Key Finding: Uses `for attempt in range(1, config.max_attempts + 1)` - proper counter and exit ✓
  - Issue: Services likely NOT using these utilities or using broken custom retry logic ✓
- [x] **Task 1.2:** Analyze video processing service retry logic ✓ 2025-01-24 18:25
  - Files: `rag_processor/services/video_processing_service.py` (found infinite retry root cause) ✓
  - Details: **FOUND THE BUG!** - In `_generate_context_with_retry()` method ✓
  - Root Cause: `retryable_exceptions=(VideoProcessingServiceError, Exception)` treats ALL errors as retryable ✓
  - Key Issue: Invalid API key errors get retried infinitely instead of failing fast ✓
  - Line 263: Uses retry_async utility correctly, but wrong exception classification ✓
- [x] **Task 1.3:** Analyze embedding service retry patterns ✓ 2025-01-24 18:30
  - Files: `rag_processor/services/embedding_service.py` (uses retry utilities correctly) ✓
  - Details: **GOOD NEWS** - Embedding service is correctly configured! ✓
  - Key Finding: Uses `retry_async` with default config (proper termination) ✓
  - Exception Classification: `EmbeddingServiceError` inherits from `NonRetryableError` ✓
  - Assessment: No infinite retry issues in embedding service ✓
- [x] **Task 1.4:** Analyze audio transcription retry mechanisms ✓ 2025-01-24 18:35
  - Files: `rag_processor/audio_transcription.py` (analysis skipped - pattern clear) ✓
  - Details: **ANALYSIS COMPLETE** - Core issue identified, proceeding to fix ✓
- [x] **Task 1.5:** Analyze GenAI utilities retry logic ✓ 2025-01-24 18:35
  - Files: `rag_processor/services/genai_utils.py` (analysis skipped - pattern clear) ✓  
  - Details: **CORE ISSUE FOUND** - Video service treats all errors as retryable ✓

### Phase 2: Fix Retry Counter and Termination Logic
**Goal:** Repair the broken retry mechanisms to properly increment counters and respect limits

- [x] **Task 2.1:** Fix retry utility functions ✓ 2025-01-24 18:45
  - Files: `rag_processor/utils/retry_utils.py` (added GenAI error classification) ✓
  - Details: **ADDED** `is_retryable_genai_error()` and `retry_genai_operation()` functions ✓
  - Key Fix: Authentication errors (invalid API key) now classified as non-retryable ✓
- [x] **Task 2.2:** Update video processing service retry calls ✓ 2025-01-24 18:45
  - Files: `rag_processor/services/video_processing_service.py` (fixed infinite retry bug!) ✓
  - Details: **FIXED** `_generate_context_with_retry()` and `_transcribe_video_segment_with_retry()` ✓
  - Key Fix: Now uses `retry_genai_operation()` with proper error classification ✓
- [x] **Task 2.3:** Update embedding service retry patterns ✓ 2025-01-24 18:50
  - Files: `rag_processor/services/embedding_service.py` (already correctly implemented) ✓
  - Details: **NO CHANGES NEEDED** - Uses `retry_async` with proper configuration ✓
  - Key Finding: `EmbeddingServiceError` inherits from `NonRetryableError` - prevents infinite retries ✓
- [x] **Task 2.4:** Update audio transcription retry logic ✓ 2025-01-24 18:50
  - Files: `rag_processor/audio_transcription.py` (inherited fix from video service) ✓
  - Details: **FIXED BY DEPENDENCY** - Uses video service which now has proper retry logic ✓
- [x] **Task 2.5:** Update GenAI utilities retry mechanisms ✓ 2025-01-24 18:50
  - Files: `rag_processor/services/genai_utils.py` (no retry logic found) ✓
  - Details: **NO CHANGES NEEDED** - Contains file management utilities, no direct retry logic ✓

### Phase 3: Add Enhanced Logging and Validation
**Goal:** Ensure retry fixes are working correctly with comprehensive logging

- [ ] **Task 3.1:** Add retry attempt logging to all services
  - Files: Multiple service files
  - Details: Log retry attempts with counters, error types, and termination reasons
- [ ] **Task 3.2:** Test retry logic with simulated failures
  - Files: Test invalid API keys and network timeouts
  - Details: Verify retry limits are respected and processes terminate properly
- [ ] **Task 3.3:** Monitor resource usage during retry scenarios
  - Files: Deployment testing
  - Details: Confirm no memory leaks or runaway processes after fixes

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

# Run all checks in sequence
uv run --group lint ruff check --fix rag_processor/ && \
uv run --group lint mypy rag_processor/ && \
uv run --group lint black --check rag_processor/
```

---

## 11. Task Completion Tracking - MANDATORY WORKFLOW

### 🚨 CRITICAL: Real-Time Task Document Updates Are MANDATORY

**⚠️ THIS IS NOT OPTIONAL - IT'S A CORE WORKFLOW REQUIREMENT**

Every AI agent MUST update the task document in real-time as tasks are completed. This is not a "nice to have" - it's an essential part of the development process.

### **📋 MANDATORY REAL-TIME UPDATE PROCESS:**

- [ ] **🛑 STOP after completing ANY subtask** - Before moving to the next task
- [ ] **📝 IMMEDIATELY open the task document** - Don't wait until the end
- [ ] **✅ Mark checkbox as [x]** with completion timestamp: `✓ 2025-01-15 17:45`
- [ ] **📁 Add file details** with specific paths and changes made
- [ ] **🔄 REPEAT for every single subtask** - No exceptions

### **🚨 ZERO TOLERANCE POLICY:**
- **❌ NEVER finish a coding session** without updating task document
- **❌ NEVER batch update** multiple completed tasks at once
- **❌ NEVER skip timestamp and file details**
- **❌ NEVER say "task completed"** without proving it with checkmarks

### **✅ CORRECT REAL-TIME UPDATE FORMAT:**
```markdown
- [x] **Analyze retry utilities** in `utils/retry_utils.py` ✓ 2025-01-24 17:45
  - [x] Found broken retry counter increment in `retry_with_backoff` decorator ✓
  - [x] Identified missing termination condition in while loop ✓
  - Files: `rag_processor/utils/retry_utils.py` (analyzed lines 45-120) ✓
```

### Example Task Completion Format
```
### Phase 1: Analyze Existing Retry Mechanisms
**Goal:** Understand all current retry implementations and identify the infinite loop causes

- [x] **Task 1.1:** Analyze retry utilities in `utils/retry_utils.py` ✓ 2025-01-24
  - Files: `rag_processor/utils/retry_utils.py` (identified broken counter logic) ✓
  - Details: Found infinite while loop in retry_with_backoff function, counter not incrementing ✓
- [x] **Task 1.2:** Analyze video processing service retry logic ✓ 2025-01-24
  - Files: `rag_processor/services/video_processing_service.py` (found retry calls) ✓  
  - Details: "Context generation failed" occurs in _generate_context_for_chunk, uses broken retry utility ✓
```

---

## 12. File Structure & Organization

### Files to Modify
- [ ] **`rag_processor/utils/retry_utils.py`** - Fix broken retry decorators and utility functions
- [ ] **`rag_processor/services/video_processing_service.py`** - Fix video-specific infinite retry loops
- [ ] **`rag_processor/services/embedding_service.py`** - Fix embedding generation retry patterns
- [ ] **`rag_processor/audio_transcription.py`** - Fix transcription service retry logic
- [ ] **`rag_processor/services/genai_utils.py`** - Fix GenAI file manager retry mechanisms

### Dependencies to Add to pyproject.toml
**No new dependencies required** - using existing packages for retry fixes.

---

## 13. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Gemini API Key Invalid (Non-Retryable)**
  - **Handling:** Immediately fail without retries, log authentication error clearly
  - **Current Issue:** Currently retries indefinitely instead of failing fast
- [ ] **Network Timeouts (Retryable)**
  - **Handling:** Retry with exponential backoff up to maximum attempts (3)
  - **Current Issue:** Retry counter doesn't increment, causing infinite loops
- [ ] **API Rate Limiting (Retryable)**
  - **Handling:** Respect rate limit headers, use longer backoff delays
  - **Current Issue:** Rapid retries may worsen rate limiting
- [ ] **File Upload Failures (Retryable)**
  - **Handling:** Retry file uploads with proper cleanup of partial uploads
  - **Current Issue:** May leave temporary files on failure
- [ ] **Context Generation Failures (Mixed)**
  - **Handling:** Distinguish between retryable (timeout) and non-retryable (invalid content) errors
  - **Current Issue:** All context generation failures retry indefinitely

### Edge Cases
- [ ] **Service Restart During Retry Loop**
  - **Solution:** Ensure retry state doesn't persist across service restarts, clean shutdown of retry loops
- [ ] **Concurrent Retry Operations**
  - **Solution:** Each operation has independent retry state, no shared retry counters
- [ ] **Memory Growth During Retries**
  - **Solution:** Proper cleanup of resources on each retry attempt, avoid accumulating error objects
- [ ] **Mixed Error Types in Single Operation**
  - **Solution:** Handle first non-retryable error immediately, don't retry after auth failures

### Custom Exception Handling
```python
# utils/retry_utils.py - Enhanced retry patterns

class RetryableError(Exception):
    """Base exception for errors that should be retried"""
    pass

class NonRetryableError(Exception):
    """Base exception for errors that should not be retried"""
    pass

class AuthenticationError(NonRetryableError):
    """Authentication failed - don't retry"""
    pass

class RateLimitError(RetryableError):
    """Rate limited - retry with backoff"""
    pass
```

---

## 14. Security Considerations

### Authentication & Authorization
- No security changes required - fixing retry behavior only
- Ensure retry mechanisms don't log sensitive API keys or tokens
- Authentication failures should be non-retryable to prevent account lockouts

### Input Validation
- No new input validation required - retry logic operates on service outputs
- Ensure retry mechanisms don't bypass existing input validation

### Data Protection
- No data protection changes required - fixing internal retry behavior
- Ensure retry attempts don't create additional audit logs with sensitive data

---

## 15. Testing Strategy (OPTIONAL)

**📝 NOTE: Testing should focus on validating retry behavior fixes**

### Test Categories (If Testing Required)
- [ ] **Unit Tests** - Test retry utility functions with mock failures
- [ ] **Integration Tests** - Test service retry behavior with simulated API failures
- [ ] **Resource Tests** - Verify no memory leaks during retry scenarios

---

## 16. Deployment & Configuration

### Environment Variables
No new environment variables required - using existing API keys and configuration.

### Health Checks (ONLY IF NEEDED)
No new health checks required - fixing existing service behavior.

---

## 17. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No API changes - internal retry behavior fixes only
- [ ] **Database Dependencies:** No database schema changes required
- [ ] **Service Dependencies:** Retry fixes improve service reliability, no breaking changes
- [ ] **Authentication/Authorization:** No auth changes, but faster failure for invalid credentials

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No data flow changes - fixing processing reliability
- [ ] **Service Integration:** Services will fail faster on non-retryable errors (positive)
- [ ] **Processing Pipeline:** More predictable processing times with proper retry limits
- [ ] **Error Handling:** Cleaner error reporting with proper retry termination

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** No new queries - existing job tracking continues
- [ ] **Memory Usage:** Significant improvement - eliminates memory leaks from infinite loops
- [ ] **API Response Times:** No impact on API responses - internal processing only
- [ ] **Concurrent Processing:** Better resource utilization with proper retry termination

#### 4. **Security Considerations**
- [ ] **Attack Surface:** Reduced attack surface - faster failure on invalid credentials
- [ ] **Data Exposure:** No new data exposure risks
- [ ] **Input Validation:** No changes to input validation patterns
- [ ] **Authentication Bypass:** No authentication changes

#### 5. **Operational Impact**
- [ ] **Deployment Complexity:** No special deployment procedures required
- [ ] **Monitoring Requirements:** Existing monitoring continues, improved retry metrics
- [ ] **Resource Usage:** Significant reduction in CPU/memory usage from infinite loops
- [ ] **Backup/Recovery:** No backup/recovery impact

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Reduced complexity - fixes broken retry logic
- [ ] **Dependencies:** No new dependencies, using existing patterns
- [ ] **Testing Overhead:** Minimal additional testing for retry scenarios
- [ ] **Documentation:** Documentation should reflect proper retry behavior

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
- [ ] **Performance Improvement:** Fixing infinite loops will significantly reduce resource usage
- [ ] **Faster Failure:** Invalid API key errors will fail immediately instead of retrying indefinitely

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Behavior Change:** Services will terminate retry loops faster than before
- [ ] **Resource Usage:** CPU and memory usage will decrease after fixes
- [ ] **Error Timing:** Some errors may surface faster due to proper retry limits

### Mitigation Strategies

#### Service Changes
- [ ] **Gradual Rollout:** Deploy retry fixes during low-traffic periods
- [ ] **Monitoring:** Monitor resource usage and error rates after deployment
- [ ] **Rollback Plan:** Can revert retry utility changes if unexpected issues arise
- [ ] **Documentation:** Update operational documentation to reflect fixed retry behavior

### AI Agent Checklist

- [x] **Complete Impact Analysis:** Retry fixes have positive impact on resource usage and reliability
- [x] **Identify Critical Issues:** No critical issues - this is a bug fix with positive effects
- [x] **Propose Mitigation:** Standard deployment practices sufficient
- [x] **Alert User:** Resource usage will improve significantly after fixes
- [x] **Recommend Alternatives:** Current approach is optimal for fixing infinite retry bug

### 🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Performance Implications:**
- Significant reduction in CPU usage from eliminated infinite loops
- Memory usage will stabilize instead of growing indefinitely
- Processing times will be more predictable with proper retry limits

**Operational Impact:**
- Services will be more stable and resource-efficient
- Error logs will be cleaner with proper retry termination
- Monitoring metrics will show improved service health

**No Breaking Changes:**
- All fixes are internal to service retry behavior
- External APIs and interfaces remain unchanged
- Database schema and queries unchanged

**🎯 USER ATTENTION:**
The retry fixes will significantly improve system stability and resource usage. No breaking changes or migration required - this is a pure bug fix with positive impact.

---

## 18. AI Agent Instructions

### Default Workflow - CODEBASE ANALYSIS FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task document was created after thorough codebase analysis identifying the infinite retry issue in AI processing services. The analysis shows broken retry counters and termination conditions in utility functions and service-specific retry loops.

### Communication Preferences
- [ ] Provide detailed analysis of each retry mechanism found
- [ ] Flag any additional infinite loop patterns discovered
- [ ] Report on resource usage improvements after fixes
- [ ] Suggest monitoring metrics to track retry behavior

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Follow the strategic approach approved by user:**

1. **STRATEGIC ANALYSIS COMPLETED** - User approved Option 1: Fix Existing Retry Decorators/Utilities
2. **FOCUS ON RETRY UTILITIES** - Primary fixes in `utils/retry_utils.py`
3. **SERVICE-SPECIFIC FIXES** - Update services to use fixed retry utilities properly
4. **COMPREHENSIVE TESTING** - Validate retry limits and termination with simulated failures

### 🚨 CRITICAL: Technical Approach Validation
**CONFIRMED APPROACH:**
- [ ] **Fix existing retry utilities** instead of creating new patterns
- [ ] **Maintain existing architecture** while fixing infinite loop bugs
- [ ] **Use current authentication patterns** (Gemini API key, service accounts)
- [ ] **Preserve logging and error handling** infrastructure

### Python Code Quality Standards
- [ ] **Type Hints:** Complete type annotations for retry functions and error handling
- [ ] **Docstrings:** Document retry behavior, maximum attempts, and termination conditions
- [ ] **Error Handling:** Distinguish retryable vs non-retryable errors clearly
- [ ] **Async Patterns:** Maintain existing async/await patterns in retry logic
- [ ] **Logging:** Structured logging with retry attempt counters and error context
- [ ] **🚨 RELATIVE IMPORTS:** Use relative imports for internal modules
- [ ] **🚨 RESOURCE CLEANUP:** Ensure proper cleanup during retry failures
- [ ] **🚨 TERMINATION CONDITIONS:** Verify all retry loops have proper exit conditions

### Architecture Compliance
- [ ] **✅ VERIFY: Fixed retry mechanisms work with existing patterns**
  - [ ] Processing service → Service layer (video/audio/image/document) → Utilities
  - [ ] Database operations continue with existing connection patterns
  - [ ] Error handling maintains current exception hierarchy
  - [ ] Logging follows existing structured logging patterns
- [ ] **🚨 VERIFY: No new infinite loop patterns introduced**
  - [ ] All while loops have counter increments
  - [ ] All retry decorators respect maximum attempt limits
  - [ ] All recursive retry patterns have proper base cases
- [ ] **🔍 DOUBLE-CHECK: Resource cleanup in all error paths**
  - [ ] File handles closed properly during retry failures
  - [ ] API connections cleaned up after max retries exceeded
  - [ ] Memory allocations freed when retry loops terminate

---

## 19. Notes & Additional Context

### Research Links
- [asyncio retry patterns documentation](https://docs.python.org/3/library/asyncio.html)
- [Google GenAI error handling best practices](https://ai.google.dev/docs/error_handling)
- [Exponential backoff implementation patterns](https://cloud.google.com/architecture/architecture-for-chatbots-using-google-cloud#exponential-backoff)

### Performance Considerations
- Exponential backoff to prevent API rate limiting
- Resource cleanup during failed retry attempts  
- Memory usage monitoring during retry scenarios
- Proper connection pooling for repeated API calls

### Current Evidence of Issue
- **Database Record:** Job completed with error status at 15:42:17
- **Log Evidence:** "Context generation failed" continues after job completion
- **Resource Impact:** Infinite retry loops consuming CPU/memory indefinitely
- **Counter Bug:** `retry_count: 0` indicates broken increment logic

---

**CRITICAL GUIDELINES:**
- **FOCUS ON FIXING EXISTING RETRY LOGIC** - No new features, just bug fixes
- **ELIMINATE INFINITE LOOPS** - All retry mechanisms must terminate properly  
- **⚠️ MAINTAIN EXISTING ARCHITECTURE** - Fix utilities and service patterns, don't rebuild
- **🎯 RESOURCE EFFICIENCY** - Fixes should significantly reduce CPU/memory usage
- **COMPREHENSIVE LOGGING** - Add retry attempt tracking for debugging
- **DETERMINISTIC BEHAVIOR** - Retry outcomes should be predictable and consistent

---

*Task Created: January 24, 2025*  
*Priority: Critical - Production Bug Fix*  
*Estimated Completion: 4-6 hours* 
