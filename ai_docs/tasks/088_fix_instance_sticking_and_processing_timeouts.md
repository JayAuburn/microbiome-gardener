# Fix Instance Sticking and Processing Timeouts in RAG Processor

> **Task Complexity:** 🟡 STANDARD TASK
> **Sections Used:** 1,3,4,6,8,10,11,17 (~400 lines)

---

## 1. Task Overview

### Task Title
**Title:** Fix Cloud Run Instance Sticking and Processing Timeout Issues

### Goal Statement
**Goal:** Resolve the critical issue where Cloud Run instances get stuck processing files and trap all incoming traffic, causing the entire service to become unresponsive. This happens when files are deleted during processing or when processing operations hang indefinitely, creating a traffic bottleneck due to single-concurrency configuration.

---

## 3. Strategic Analysis & Solution Options

### Problem Context
Investigation revealed that Cloud Run instances can get "stuck" processing files, which prevents new files from being processed because:
1. **Traffic Trapping**: `concurrency=1` means if one request hangs, the entire instance becomes unusable
2. **Long Timeouts**: 15-minute timeout + single concurrency = up to 15 minutes of blocked traffic
3. **File-Level Circuit Breaker**: Circuit breaker prevents same file retry but doesn't prevent new files from routing to stuck instances
4. **Multiple Hanging Points**: Several operations lack proper timeouts and can hang indefinitely

### Solution Options Analysis

#### Option 1: Quick Configuration Fix
**Approach:** Increase concurrency and reduce key timeouts without major code changes

**Pros:**
- ✅ Minimal code changes required - mostly configuration updates
- ✅ Addresses root cause of traffic trapping (single concurrency)
- ✅ Fast implementation - can be deployed immediately
- ✅ Low risk - no complex logic changes

**Cons:**
- ❌ Doesn't address all potential hanging points in processing pipeline
- ❌ May need further refinement based on real-world testing
- ❌ Doesn't add comprehensive instance-level health monitoring

**Implementation Complexity:** Low - Configuration changes and simple timeout additions
**Risk Level:** Low - Mostly configuration changes with well-understood impacts

#### Option 2: Comprehensive Timeout and Health Monitoring
**Approach:** Add timeouts everywhere, health checks, and instance-level monitoring

**Pros:**
- ✅ Addresses all identified hanging points systematically
- ✅ Provides better observability into instance health
- ✅ More robust long-term solution

**Cons:**
- ❌ Much more complex implementation across multiple services
- ❌ Health checks may not actually solve traffic routing issues in Cloud Run
- ❌ Longer development and testing time
- ❌ Risk of introducing new bugs with extensive changes

**Implementation Complexity:** High - Changes needed across multiple services and deployment
**Risk Level:** Medium - Complex changes with potential for unintended side effects

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Quick Configuration Fix

**Why this is the best choice:**
1. **Immediate Impact** - Solves the primary traffic trapping issue by allowing multiple concurrent requests per instance
2. **Proven Solution** - Increasing concurrency is a standard approach for preventing single-request bottlenecks
3. **Low Risk** - Configuration changes are easily reversible and well-understood
4. **Fast Deployment** - Can be implemented and deployed quickly to resolve the immediate production issue

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1), or would you prefer the more comprehensive approach (Option 2)?

---

## 4. Context & Problem Definition

### Problem Statement
The RAG processor experiences critical service outages when Cloud Run instances get "stuck" processing files. This creates a cascade failure where:

1. **Instance Gets Stuck**: One file processing operation hangs (deleted file, GenAI timeout, video chunk processing, etc.)
2. **Traffic Trapping**: With `concurrency=1`, the stuck instance can't process new requests but appears "busy" not "failed"
3. **No Auto-Scaling**: Cloud Run doesn't scale new instances because existing instance isn't returning errors
4. **Service Outage**: All subsequent file uploads queue behind the stuck instance, causing complete service unavailability

This was observed when a file was deleted during processing, but investigation revealed multiple potential hanging points in the processing pipeline.

### Success Criteria
- [ ] Cloud Run instances can handle multiple concurrent requests without traffic trapping
- [ ] File processing operations timeout appropriately rather than hanging indefinitely
- [ ] Service remains responsive even when individual file processing operations fail or hang
- [ ] New instances scale up when existing instances are busy or unresponsive
- [ ] Processing timeouts are reasonable for the operations being performed

---

## 6. Technical Requirements

### Functional Requirements
- **Concurrent Processing**: Instance must handle 3 concurrent file processing requests
- **Timeout Protection**: All potentially long-running operations must have reasonable timeouts
- **Graceful Degradation**: Individual file processing failures should not impact service availability
- **Auto-Recovery**: Service should automatically scale and recover from stuck instances

### Non-Functional Requirements
- **Performance**: Concurrency increase should not significantly impact processing quality or resource usage per file
- **Reliability**: Changes should improve overall service reliability without introducing new failure modes
- **Scalability**: Auto-scaling should work properly with new concurrency settings
- **Observability**: Timeout events should be properly logged for monitoring and debugging

### Technical Constraints
- **Memory Limits**: Increased concurrency must fit within existing Cloud Run memory allocation (12Gi)
- **Processing Isolation**: Multiple concurrent video/audio processing operations must not interfere with each other
- **Database Connections**: Connection pooling must handle increased concurrent database operations
- **Backward Compatibility**: Changes should not break existing processing workflows

---

## 8. API & Backend Changes

### Configuration Changes

#### Deployment Configuration Updates
**File**: `scripts/deployment_config.py`
- **Change**: Update `concurrency` from 1 to 3 for both development and production environments
- **Rationale**: Allow 3 concurrent requests per instance to prevent single-request traffic trapping

#### Cloud Run Deployment Updates
**File**: `scripts/deploy_core.py`
- **Change**: Update concurrency deployment argument to use new configuration
- **Rationale**: Apply the concurrency change to actual Cloud Run deployments

### Service Layer Timeout Improvements

#### GCS Operations Timeout
**File**: `rag_processor/utils/gcs_utils.py`
- **Change**: Reduce file size check timeout from 30 seconds to 5 seconds
- **Rationale**: GCS metadata operations should complete in < 1 second; 30 seconds is excessive

#### GenAI File Processing Timeout
**File**: `rag_processor/services/genai_utils.py`
- **Change**: Reduce file active wait timeout from 300 seconds (5 minutes) to 60 seconds (1 minute)
- **Rationale**: If Google's file processing takes more than 1 minute, it's likely stuck

#### Video Chunk Processing Timeout
**File**: `rag_processor/services/video_processing_service.py`
- **Change**: Add per-chunk timeout of 120 seconds with fail-fast logic
- **Rationale**: Prevent individual video chunks from hanging indefinitely and blocking entire video processing

---

## 10. Implementation Plan

### Phase 1: Configuration Updates ✓ July 29, 2025 17:30 (REVERTED)
**Goal:** ~~Update deployment configuration to prevent traffic trapping~~ **REVERTED per user preference**

- [x] **Task 1.1:** ~~Update concurrency in deployment configuration~~ **REVERTED** ✓ July 29, 2025 17:55
  - Files: `scripts/deployment_config.py` (reverted back to `concurrency: int = 1`)  
  - Details: User prefers `concurrency=1` for resource isolation - each instance handles 1 request
- [x] **Task 1.2:** Update deployment script description ✓ July 29, 2025 17:55
  - Files: `scripts/deploy_core.py` (updated description to reflect single request per container)
  - Details: Description now correctly states "single request per container for resource isolation"

### Phase 2: GCS Timeout Improvements ✓ July 29, 2025 17:35
**Goal:** Prevent GCS operations from hanging indefinitely

- [x] **Task 2.1:** Reduce file size check timeout ✓ July 29, 2025 17:35
  - Files: `rag_processor/utils/gcs_utils.py` (added asyncio import and timeout wrapper)
  - Details: Added `asyncio.wait_for()` wrapper around `get_file_metadata()` with 5-second timeout
- [x] **Task 2.2:** Update error handling for timeout scenarios ✓ July 29, 2025 17:35
  - Files: `rag_processor/utils/gcs_utils.py` (added timeout error handling)
  - Details: Timeout errors are properly classified as `GCSFileNotFoundError` (non-retryable)

### Phase 3: GenAI Processing Timeout ✓ July 29, 2025 17:38
**Goal:** Prevent GenAI file processing from hanging

- [x] **Task 3.1:** Reduce GenAI file active wait timeout ✓ July 29, 2025 17:38
  - Files: `rag_processor/services/genai_utils.py` (reduced timeout from 300s to 60s)
  - Details: Changed `max_wait_time: int = 300` to `max_wait_time: int = 60` in `wait_for_file_active()`

### Phase 4: Video Processing Timeout ✓ July 29, 2025 17:42
**Goal:** Prevent video chunk processing from hanging indefinitely

- [x] **Task 4.1:** Add per-chunk timeout wrapper ✓ July 29, 2025 17:42  
  - Files: `rag_processor/services/video_processing_service.py` (added asyncio.wait_for with 120s timeout)
  - Details: Wrapped chunk processing in `asyncio.wait_for()` with 120-second timeout
- [x] **Task 4.2:** Implement fail-fast logic for multiple chunk failures ✓ July 29, 2025 17:42
  - Files: `rag_processor/services/video_processing_service.py` (added fail-fast logic for >50% failures)
  - Details: Fail entire video if >50% of chunks fail to prevent partial hanging

### 🚨 MANDATORY: Code Quality Validation (After Each File Change)

**Run these 4 simple checks after modifying any Python file:**

```bash
# 1. Basic compilation check
python -m py_compile [modified_file].py && echo "✅ Syntax valid"

# 2. Import validation  
python -c "from rag_processor import *; print('✅ Imports work')" 

# 3. Quick linting with auto-fix
uv run --group lint ruff check rag_processor/ --fix

# 4. Type checking
uv run --group lint mypy rag_processor/
```

**🛑 If ANY check fails, stop coding and fix it immediately!**

### 🚫 **Forbidden Patterns Checklist**

**Before marking any task complete, verify NONE of these exist:**

```bash
# Check for forbidden patterns (run once at end)
grep -r "Any" rag_processor/ && echo "❌ Found Any - use specific types"
grep -r "from rag_processor\." rag_processor/ && echo "❌ Found absolute imports - use relative"
grep -r "google-cloud-aiplatform" pyproject.toml && echo "❌ Found deprecated package"
```

---

## 11. Task Completion Tracking - MANDATORY WORKFLOW

### 🚨 CRITICAL: Real-Time Task Document Updates Are MANDATORY

**⚠️ THIS IS NOT OPTIONAL - IT'S A CORE WORKFLOW REQUIREMENT**

Every AI agent MUST update the task document in real-time as tasks are completed.

### **📋 MANDATORY REAL-TIME UPDATE PROCESS:**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date (fallback to web search if time tool unavailable)
- [ ] **🛑 STOP after completing ANY subtask** - Before moving to the next task
- [ ] **📝 IMMEDIATELY open the task document** - Don't wait until the end
- [ ] **✅ Mark checkbox as [x]** with completion timestamp using ACTUAL current date: `✓ 2025-01-28 17:45`
- [ ] **📁 Add file details** with specific paths and changes made
- [ ] **🔄 REPEAT for every single subtask** - No exceptions

### **✅ CORRECT REAL-TIME UPDATE FORMAT:**
```markdown
- [x] **Update concurrency in deployment configuration** ✓ 2025-01-28 17:45
  - [x] Changed `concurrency: int = 1` to `concurrency: int = 3` in EnvironmentConfig ✓
  - Files: `scripts/deployment_config.py` (updated concurrency setting) ✓
```

---

## 17. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** ✅ No API contract changes - all changes are internal configuration and timeout handling
- [ ] **Database Dependencies:** ✅ No database schema changes required
- [ ] **Service Dependencies:** ⚠️ **MODERATE IMPACT** - Increased concurrency may affect database connection pooling

#### 2. **Performance Implications**
- [ ] **Database Query Impact:** ⚠️ **MONITOR REQUIRED** - 3x concurrent requests may strain database connection pool (currently 2-3 connections)
- [ ] **Memory Usage:** ⚠️ **MODERATE INCREASE** - 3 concurrent file processing operations will use more memory simultaneously
- [ ] **API Response Times:** ✅ Should improve overall response times by preventing traffic queuing

#### 3. **Security Considerations**
- [ ] **Attack Surface:** ✅ No new security vulnerabilities introduced
- [ ] **Data Exposure:** ✅ No changes to data handling or exposure patterns

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
- [ ] **Database Connection Pool**: Current pool size (2-3 connections) may be insufficient for 3 concurrent operations per instance
- [ ] **Memory Usage**: 3 concurrent video processing operations may approach 12Gi memory limit
- [ ] **File System**: Concurrent processing may create temporary file conflicts if not properly isolated

#### ⚠️ **YELLOW FLAGS - Monitor After Deployment**
- [ ] **Processing Quality**: Ensure concurrent processing doesn't degrade individual file processing quality
- [ ] **Resource Contention**: Monitor for CPU/memory contention between concurrent operations
- [ ] **Database Performance**: Watch for connection pool exhaustion or query performance degradation

#### ✅ **GREEN FLAGS - Expected Improvements**
- [ ] **Service Availability**: Should eliminate service outages from stuck instances
- [ ] **Throughput**: Should improve overall file processing throughput
- [ ] **Auto-Scaling**: Should enable proper Cloud Run auto-scaling behavior

### Mitigation Strategies
1. **Database Monitoring**: Monitor connection pool usage and consider increasing pool size if needed
2. **Memory Monitoring**: Watch for memory usage approaching limits and consider memory optimization
3. **Gradual Rollout**: Consider testing with concurrency=2 first, then scaling to 3
4. **Rollback Plan**: Keep previous configuration ready for quick rollback if issues arise

---

**Time Estimate:** 2-3 hours
**Priority:** High (Production Issue)
**Risk Level:** Low-Medium (Configuration changes with monitoring requirements) 
