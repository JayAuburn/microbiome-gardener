# Clean Up Redundant Environment Loading in deploy_rag_processor.py

## Problem

The `deploy_rag_processor.py` file has **redundant and conflicting environment loading code** that violates our agreed-upon patterns:

1. **Two different env loading approaches**:
   - `load_dotenv` from `python-dotenv` package (with try/catch fallback)
   - `_load_env_file` from our custom `utils.env_loader`

2. **Try/catch fallback behavior** around `load_dotenv` import (lines 54-59) contradicts our agreement to not do fallback behavior

3. **Double environment loading**:
   - `load_env_files()` uses `load_dotenv` (line 111)
   - `check_prerequisites()` → `load_env_file()` uses `_load_env_file` (line 622 → 82)

4. **Unnecessary dependency**: We have a custom env parser that works perfectly, making `python-dotenv` redundant

## Solution  

Remove the redundant `load_dotenv` usage and use only our custom `utils.env_loader` consistently throughout the file.

## Implementation

- [ ] **Task 1:** Remove load_dotenv import and fallback
  - Files: `scripts/deploy_rag_processor.py`
  - Details: Remove lines 54-59 (try/catch import of load_dotenv)

- [ ] **Task 2:** Update load_env_files() function to use custom env loader
  - Files: `scripts/deploy_rag_processor.py`
  - Details: Replace `load_dotenv()` call with `_load_env_file()` in load_env_files function

- [ ] **Task 3:** Clean up any remaining references
  - Files: `scripts/deploy_rag_processor.py`
  - Details: Ensure no other load_dotenv usage remains

## Files to Modify

- `scripts/deploy_rag_processor.py` - Remove load_dotenv, use custom env loader consistently

**Time Estimate:** 10 minutes
