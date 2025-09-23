# Python Variable Scoping in Error Context Blocks - Fix Unbound Variable Errors

## Problem
Python type checker (mypy) reports "possibly unbound" and "incompatible type" errors when variables are assigned inside exception handling blocks (`with ErrorContext`, `try/except`) but used outside those blocks.

**Specific Errors:**
- `Argument of type "dict[str, Any] | None" cannot be assigned to parameter "config" of type "dict[str, Any]"`
- `"project_id" is possibly unbound`

## Root Cause Analysis

### Current Problematic Pattern
```python
# 1. Variable initialized as nullable
dev_config: dict[str, Any] | None = None

# 2. Assignment inside exception block
with ErrorContext("Configuration loading"):
    dev_config = get_config_dict("development")  # Assignment here
    project_id = select_project_interactive()     # Assignment here
    dev_config["project_id"] = project_id

# 3. Usage outside exception block - TYPE CHECKER CAN'T GUARANTEE SUCCESS
enable_development_apis(dev_config)  # ERROR: could still be None
create_cloud_tasks_queue(project_id) # ERROR: possibly unbound
```

### Why Type Checker Complains
1. **Exception blocks can fail** - If `ErrorContext` raises an exception before assignments, variables stay unbound/None
2. **Type checker sees possibility** - Variables could be None/unbound when used outside the block
3. **Function signatures expect guaranteed types** - `enable_development_apis(config: dict[str, Any])` can't accept None

## Solution Options Analysis

### Option 1: Early Declaration with None Check Pattern
**Approach:** Keep nullable initialization but add explicit None checks before usage

**Pros:**
- ✅ Minimal code changes required
- ✅ Preserves existing error handling structure
- ✅ Clear about when variables might be None

**Cons:**
- ❌ More verbose with None checks everywhere
- ❌ Still allows possibility of None values
- ❌ Doesn't prevent the underlying issue

**Implementation Complexity:** Low
**Risk Level:** Low

### Option 2: Move Variable Usage Inside Success Block
**Approach:** Restructure code so variable usage only happens after successful assignment

**Pros:**
- ✅ Eliminates type checker warnings completely
- ✅ Variables guaranteed to be assigned before use
- ✅ Cleaner error handling flow

**Cons:**
- ❌ Requires restructuring control flow
- ❌ May need nested exception handling
- ❌ Could make code more complex

**Implementation Complexity:** Medium
**Risk Level:** Low

### Option 3: Separate Assignment and Usage Phases
**Approach:** Split configuration loading from infrastructure setup with explicit validation between phases

**Pros:**
- ✅ Clear separation of concerns
- ✅ Variables guaranteed to exist before usage
- ✅ Better error handling for each phase
- ✅ Easier to debug configuration vs infrastructure issues

**Cons:**
- ❌ More code restructuring required
- ❌ Changes existing function signatures
- ❌ May require updating multiple files

**Implementation Complexity:** Medium-High
**Risk Level:** Low

## Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 3 - Separate Assignment and Usage Phases

**Why this is the best choice:**
1. **Type Safety** - Eliminates all "possibly unbound" errors completely
2. **Better Architecture** - Clear separation between config loading and infrastructure setup
3. **Maintainability** - Easier to debug and modify each phase independently
4. **Future-Proof** - Prevents similar issues in new code

## Implementation Plan

### Phase 1: Restructure Configuration Loading
**Goal:** Separate configuration loading from infrastructure setup

- [ ] **Task 1.1:** Create configuration validation function
  - Files: `scripts/setup_gcp_dev.py`
  - Details: Extract configuration loading into separate function that returns validated config
- [ ] **Task 1.2:** Update main() function structure
  - Files: `scripts/setup_gcp_dev.py`
  - Details: Call configuration function first, then use results in infrastructure setup

### Phase 2: Fix Variable Scoping
**Goal:** Ensure all variables are properly scoped and typed

- [ ] **Task 2.1:** Remove nullable type annotations
  - Files: `scripts/setup_gcp_dev.py`
  - Details: Change `dict[str, Any] | None` to `dict[str, Any]` after proper validation
- [ ] **Task 2.2:** Move variable usage into success blocks
  - Files: `scripts/setup_gcp_dev.py`
  - Details: Ensure project_id and dev_config are only used after successful assignment

### Phase 3: Apply Same Fix to Production Setup
**Goal:** Consistent pattern across all setup scripts

- [ ] **Task 3.1:** Apply same pattern to setup_gcp_prod.py
  - Files: `scripts/setup_gcp_prod.py`
  - Details: Fix the same variable scoping issues in production setup

## Files to Modify

### Primary Changes
- `scripts/setup_gcp_dev.py` - Fix dev_config and project_id scoping
- `scripts/setup_gcp_prod.py` - Apply same fixes to production version

### Proposed Code Structure Fix

#### Current Problematic Structure
```python
def main() -> None:
    dev_config: dict[str, Any] | None = None  # ❌ Nullable init
    
    try:
        with ErrorContext("Configuration loading"):
            dev_config = get_config_dict("development")  # Assignment inside block
            project_id = select_project_interactive()     # Assignment inside block
            dev_config["project_id"] = project_id
        
        # Usage outside block - variables could be None/unbound
        enable_development_apis(dev_config)  # ❌ Type error
        create_cloud_tasks_queue(project_id) # ❌ Possibly unbound
```

#### Proposed Fixed Structure
```python
def load_and_validate_config() -> tuple[dict[str, Any], str]:
    """Load configuration and return validated config and project_id."""
    with ErrorContext("Configuration loading"):
        dev_config = get_config_dict("development")
        if dev_config is None:
            raise ConfigurationError("Failed to load development configuration")
        
        project_id = select_project_interactive()
        dev_config["project_id"] = project_id
        validate_development_config(dev_config)
        
        return dev_config, project_id

def main() -> None:
    try:
        # Phase 1: Get validated configuration (guaranteed success or exception)
        dev_config, project_id = load_and_validate_config()  # ✅ Proper types
        
        # Phase 2: Use validated configuration (variables guaranteed to exist)
        enable_development_apis(dev_config)     # ✅ Type-safe
        create_cloud_tasks_queue(project_id)    # ✅ Guaranteed to exist
```

## Technical Benefits of This Fix

### Type Safety Improvements
- **Eliminates nullable types** - Variables are guaranteed to have proper values
- **Clear function contracts** - Functions receive the types they expect
- **Better IDE support** - Autocompletion works correctly

### Error Handling Improvements  
- **Clearer error boundaries** - Configuration errors vs infrastructure errors are separate
- **Better error messages** - More specific about what phase failed
- **Easier debugging** - Clear separation of concerns

### Code Maintainability
- **Single responsibility** - Each function has one clear purpose
- **Easier testing** - Configuration loading can be tested independently
- **Better readability** - Control flow is more obvious

## Validation Commands
```bash
# Type checking to verify fix
uv run --group lint mypy scripts/setup_gcp_dev.py

# Ensure no regressions
uv run --group lint ruff check scripts/setup_gcp_dev.py

# Test imports still work
python -c "from scripts.setup_gcp_dev import main; print('✅ Imports work')"
```

**Time Estimate:** 2-3 hours for complete fix across both setup scripts

---

## Current Usage Analysis Results

### Problem Files Identified
1. **`scripts/setup_gcp_dev.py`** - Lines 206, 239, 245, 251, 268, 284
2. **`scripts/setup_gcp_prod.py`** - Similar pattern (lines 487-495 have same issue)

### Variable Scoping Pattern Issues

#### dev_config Variable Flow
```python
# Line 206: Nullable initialization
dev_config: dict[str, Any] | None = None  

# Lines 238-248: Assignment inside ErrorContext
with ErrorContext("Configuration loading"):
    dev_config = get_config_dict("development")      # Could fail here
    project_id = select_project_interactive()        # Could fail here  
    dev_config["project_id"] = project_id            # Could fail here

# Line 251: Usage outside ErrorContext - PROBLEM!
enable_development_apis(dev_config)  # Type: dict[str, Any] | None
#                      ^^^^^^^^^^^ Function expects: dict[str, Any]
```

#### project_id Variable Flow
```python
# Lines 245: Assignment inside ErrorContext
with ErrorContext("Configuration loading"):
    project_id = select_project_interactive()  # Could fail, variable never assigned

# Lines 268, 284: Usage outside ErrorContext - PROBLEM!
create_cloud_tasks_queue(
    project_id,  # ERROR: "project_id" is possibly unbound
    dev_config.get("region", "us-central1"),
    queue_name="rag-processor-processing-queue",
)
```

### Function Signature Requirements
```python
# What functions expect:
def enable_development_apis(config: dict[str, Any]) -> None:  # NOT nullable

def create_cloud_tasks_queue(
    project_id: str,                    # NOT optional  
    region: str,
    queue_name: str
) -> None:
```

### Type Checker Logic
1. **ErrorContext can raise exceptions** → assignments might never happen
2. **Variables start as None/unbound** → could stay that way if assignment fails
3. **Functions expect guaranteed types** → None/unbound is incompatible
4. **Type checker correctly identifies risk** → reports "possibly unbound" errors

---

*Created: January 25, 2025*  
*Priority: High - Blocks development environment setup*  
*Complexity: 🟡 STANDARD - Multi-file changes with type system implications*
