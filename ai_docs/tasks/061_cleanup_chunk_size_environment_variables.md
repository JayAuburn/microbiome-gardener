# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Clean Up Chunk Size Environment Variables from Deployment Scripts

### Goal Statement
**Goal:** Remove `CHUNK_SIZE` and `CHUNK_OVERLAP` environment variables from deployment scripts since they are already hardcoded in config.py and don't need to be configurable. This simplifies deployment configuration and prevents accidental modification of text chunking parameters.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current system sets `CHUNK_SIZE` and `CHUNK_OVERLAP` as environment variables in deployment scripts, but config.py already uses hardcoded values (1000 and 200 respectively). This creates confusion and unnecessary environment variable management for values that should be consistent across environments.

### Solution Options Analysis

#### Option 1: Remove Environment Variables (RECOMMENDED)
**Approach:** Remove CHUNK_SIZE and CHUNK_OVERLAP from deployment scripts since config.py already uses hardcoded values

**Pros:**
- ✅ **Eliminates confusion** - Config already uses hardcoded values, so env vars are ignored
- ✅ **Simplifies deployment** - Fewer environment variables to manage
- ✅ **Consistent behavior** - Same chunk settings across all environments
- ✅ **Matches current implementation** - Config.py already hardcoded, just cleaning up scripts

**Cons:**
- ❌ **None significant** - Config already uses hardcoded values

**Implementation Complexity:** Very Low - Just remove unused environment variable settings
**Time Estimate:** 5-10 minutes
**Risk Level:** Very Low - No functional changes, just cleanup

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Remove Environment Variables

**Why this is the best choice:**
1. **Already implemented** - Config.py already uses hardcoded values
2. **Zero risk** - Just removing unused environment variable declarations
3. **Cleaner deployment** - Eliminates unnecessary configuration
4. **Consistency** - Aligns deployment scripts with actual implementation

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with type hints
- **Primary Framework:** FastAPI 0.104+ with async/await patterns
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Current Implementation:** Config.py already uses hardcoded CHUNK_SIZE=1000, CHUNK_OVERLAP=200

### Current State
- **✅ config.py**: Already uses hardcoded values (CHUNK_SIZE=1000, CHUNK_OVERLAP=200)
- **❌ setup-gcp.py**: Still sets unused environment variables
- **✅ document_processing_service.py**: Uses config values correctly
- **✅ No os.getenv() calls**: No environment variable lookups exist

### 🚨 CRITICAL: Technical Approach Confirmation
This is a simple cleanup of unused environment variable declarations. The application already works correctly with hardcoded values.

---

## 4. Context & Problem Definition

### Problem Statement
Deployment scripts set `CHUNK_SIZE=1000` and `CHUNK_OVERLAP=200` as environment variables, but these are ignored because config.py already uses hardcoded values. This creates unnecessary environment variable management and potential confusion.

### Success Criteria
- [ ] Environment variables removed from deployment scripts
- [ ] No functionality changes (chunk sizes remain the same)
- [ ] Deployment scripts work correctly without these variables

---

## 5. Technical Requirements

### Functional Requirements
- Remove unused `CHUNK_SIZE` and `CHUNK_OVERLAP` environment variable declarations
- Maintain existing chunk processing behavior (1000 character chunks with 200 character overlap)
- Keep all existing document processing functionality unchanged

### Non-Functional Requirements
- **Performance:** No performance impact - same chunk processing
- **Reliability:** No reliability changes - same processing logic
- **Maintainability:** Improved by removing unused configuration

---

## 6. Implementation Plan

### Phase 1: Remove Environment Variables from Setup Script
**Goal:** Clean up deployment script environment variable configuration

- [ ] **Task 1.1:** Update `setup-gcp.py`
  - Files: `scripts/setup-gcp.py`
  - Details: Remove CHUNK_SIZE=1000 and CHUNK_OVERLAP=200 from environment variable list

### Phase 2: Verification
**Goal:** Ensure cleanup is complete

- [ ] **Task 2.1:** Search for any remaining references
  - Details: Grep for any remaining CHUNK_SIZE or CHUNK_OVERLAP environment variable references
  
- [ ] **Task 2.2:** Verify functionality
  - Details: Confirm document processing still works with hardcoded config values

---

## 7. Files to Modify

### Files to Modify
- [ ] **`scripts/setup-gcp.py`** - Remove CHUNK_SIZE and CHUNK_OVERLAP environment variables

### Expected Changes
```bash
# Remove these lines from setup-gcp.py:
"CHUNK_SIZE=1000",
"CHUNK_OVERLAP=200",
```

---

## 8. Verification Steps

1. **Check config.py**: Confirm CHUNK_SIZE and CHUNK_OVERLAP are hardcoded (already done)
2. **Remove from setup-gcp.py**: Remove environment variable declarations
3. **Search for references**: Ensure no other environment variable references exist
4. **Test deployment script**: Verify setup-gcp.py still works correctly

---

**CRITICAL GUIDELINES:**
- **ZERO FUNCTIONAL CHANGES** - Only removing unused environment variable declarations
- **MAINTAIN HARDCODED VALUES** in config.py (already implemented)
- **SIMPLIFY DEPLOYMENT** by removing unnecessary environment variables

---

*Template Version: 1.2*  
*Task Number: 061*  
*Created: January 2025*  
*Purpose: Environment Variable Cleanup for Chunk Size Settings* 
