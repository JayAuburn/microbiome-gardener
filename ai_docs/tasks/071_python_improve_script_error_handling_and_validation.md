# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Improve Error Handling and Input Validation in RAG Processor Setup/Deploy Scripts

### Goal Statement
**Goal:** Enhance the robustness and reliability of the RAG processor setup and deployment scripts by implementing comprehensive error handling, input validation, and graceful failure recovery mechanisms. This will ensure that hundreds of developers can use these scripts without encountering confusing error messages or unexpected failures.

---

## 2. MANDATORY: Existing Codebase Analysis

### 🚨 CRITICAL WORKFLOW REQUIREMENT
**⚠️ ANALYSIS COMPLETE:** The existing codebase has been thoroughly analyzed and the following issues have been identified:

#### Step 1: Project Structure Discovery
**Current Structure:**
- `scripts/gcp_setup_core.py` - Core setup functionality
- `scripts/setup_gcp_dev.py` - Development environment setup
- `scripts/setup_gcp_prod.py` - Production environment setup  
- `scripts/deploy_dev.py` - Development deployment
- `scripts/deploy_prod.py` - Production deployment
- `scripts/deployment_config.py` - Configuration management

#### Step 2: Related Service Discovery
**Found services related to setup and deployment:**
- `gcp_setup_core.py` - Main setup logic with error handling
- `deployment_config.py` - Configuration validation
- Deploy scripts with command execution utilities

#### Step 3: Current Workflow Understanding
**Current Flow:**
```
Setup Flow: User runs setup script → Prerequisites check → Configuration collection → API enablement → Infrastructure creation → Environment file generation
Deploy Flow: User runs deploy script → Environment validation → Docker build → Cloud Run deployment → EventArc setup
```

**Error Handling Issues Identified:**
1. **Generic exception handling** - Catch-all except blocks without specific error types
2. **Missing input validation** - User inputs not properly validated for format/content
3. **Unclear error messages** - Technical errors exposed to users without context
4. **No graceful recovery** - Scripts exit immediately on first failure
5. **Missing prerequisite checks** - Some dependencies not verified before execution
6. **Hard-coded timeout values** - No configuration for different network conditions

#### Step 4: Integration vs New Code Decision
**✅ EXTEND EXISTING SERVICES:** The error handling improvements will extend existing functions in:
- `gcp_setup_core.py` - Add validation functions and improve error handling
- Deploy scripts - Enhance command execution error handling
- Configuration validation in `deployment_config.py`

**📋 ANALYSIS RESULTS:**
- **Existing Related Services:** Error handling scattered across multiple files
- **Current Workflow:** Setup and deploy scripts with basic error handling
- **Integration Decision:** Extend existing services with enhanced error handling patterns
- **Recommended Entry Point:** Add validation utilities to `gcp_setup_core.py` and enhance existing functions

### Existing Technology Stack
**Based on codebase analysis:**
- **Python Version:** 3.10+ (from pyproject.toml)
- **Primary Framework:** Command-line scripts with subprocess calls
- **Cloud Platform:** Google Cloud Platform (gcloud CLI)
- **Authentication:** Google Cloud SDK authentication
- **Configuration:** Environment variables and .env files
- **Error Handling:** Basic try/except blocks, needs enhancement

### 🚨 INTEGRATION REQUIREMENTS
**Based on analysis:**
- **Files to Modify:** `gcp_setup_core.py`, `setup_gcp_dev.py`, `setup_gcp_prod.py`, `deploy_dev.py`, `deploy_prod.py`
- **New Files Needed:** `scripts/validation_utils.py` (for centralized validation)
- **Dependencies to Add:** None (use standard library)
- **Migration Needed:** Enhance existing error handling patterns without breaking changes

---

## 3. Context & Problem Definition

### Problem Statement
The current RAG processor setup and deployment scripts have inconsistent error handling that can confuse developers. Issues include:

1. **Generic Error Messages:** Users see raw Python exceptions instead of helpful guidance
2. **No Input Validation:** User inputs (project IDs, URLs, API keys) aren't validated for format
3. **Abrupt Failures:** Scripts exit immediately on first error without cleanup or recovery suggestions
4. **Missing Prerequisites:** Some dependencies aren't checked before execution
5. **Unclear Error Context:** Technical errors without user-friendly explanations

These issues will cause problems when hundreds of developers use these scripts, leading to support overhead and poor user experience.

### Success Criteria
- [ ] All user inputs are validated with clear error messages
- [ ] Network and API failures have retry logic with exponential backoff
- [ ] Error messages include context and suggested solutions
- [ ] Scripts perform graceful cleanup on failure
- [ ] Prerequisites are thoroughly checked before execution
- [ ] Timeout handling is configurable and appropriate

---

## 4. Technical Requirements

### Functional Requirements
- **Input Validation:** All user inputs (project IDs, URLs, API keys) validated for format and accessibility
- **Error Recovery:** Network failures retry with exponential backoff (2s, 4s, 8s intervals)
- **Graceful Cleanup:** Failed operations clean up partially created resources
- **Clear Error Messages:** Technical errors translated to user-friendly messages with solutions
- **Prerequisites Check:** All dependencies verified before execution starts

### Non-Functional Requirements
- **Performance:** Error handling adds minimal overhead to successful operations
- **Security:** Error messages don't expose sensitive information (API keys, secrets)
- **Reliability:** Scripts handle common network and API failures gracefully
- **Observability:** Enhanced logging shows detailed error context for debugging

### Technical Constraints
- **Backward Compatibility:** Existing script interfaces must remain unchanged
- **Dependencies:** Use only Python standard library, no additional packages
- **Platform Support:** Error handling must work on Windows, macOS, and Linux

---

## 5. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**VALIDATION UTILITIES** → `scripts/validation_utils.py`
- [ ] **Input Validation Functions** - Project ID format, URL accessibility, API key format
- [ ] **Network Validation** - Check connectivity, API endpoint availability
- [ ] **Resource Validation** - Verify GCP resource existence and permissions

**ERROR HANDLING ENHANCEMENT** → Existing scripts
- [ ] **Specific Exception Types** - Replace generic except blocks with specific error handling
- [ ] **Retry Logic** - Implement exponential backoff for network operations
- [ ] **Cleanup Functions** - Ensure partial resources are cleaned up on failure

**LOGGING IMPROVEMENT** → `scripts/gcp_setup_core.py`
- [ ] **Structured Error Logging** - Consistent error message format
- [ ] **Debug Information** - Detailed context for troubleshooting
- [ ] **User-Friendly Messages** - Clear guidance for common issues

### New Functions to Add
- [ ] **`validate_project_id(project_id: str) -> bool`** - Validate GCP project ID format and access
- [ ] **`validate_database_url(url: str) -> bool`** - Validate database URL format and connectivity
- [ ] **`validate_api_key(key: str, service: str) -> bool`** - Validate API key format and access
- [ ] **`retry_with_backoff(func, max_retries=3) -> Any`** - Retry function with exponential backoff
- [ ] **`cleanup_on_failure(resources: list) -> None`** - Clean up partially created resources

### Enhanced Error Handling
- [ ] **Network Errors** - Retry with backoff, suggest network troubleshooting
- [ ] **Authentication Errors** - Clear guidance on authentication setup
- [ ] **Permission Errors** - Specific suggestions for missing permissions
- [ ] **Resource Conflicts** - Handle existing resources gracefully
- [ ] **Configuration Errors** - Validate configuration before execution

---

## 6. Python Module & Code Organization

### New Modules/Files
- [ ] **`scripts/validation_utils.py`** - Centralized validation functions
- [ ] **`scripts/error_handling.py`** - Error handling utilities and custom exceptions
- [ ] **`scripts/retry_utils.py`** - Retry logic and backoff implementations

### Files to Modify
- [ ] **`scripts/gcp_setup_core.py`** - Enhanced error handling in all functions
- [ ] **`scripts/setup_gcp_dev.py`** - Add input validation and error handling
- [ ] **`scripts/setup_gcp_prod.py`** - Add input validation and error handling
- [ ] **`scripts/deploy_dev.py`** - Enhanced command execution error handling
- [ ] **`scripts/deploy_prod.py`** - Enhanced command execution error handling

### Dependency Management
**No new dependencies required** - using Python standard library only:
- `typing` - Type annotations
- `subprocess` - Command execution (already used)
- `pathlib` - Path handling (already used)
- `time` - Sleep for retry backoff
- `re` - Regular expressions for validation
- `urllib.parse` - URL parsing and validation

---

## 7. Implementation Plan

### Phase 1: Core Validation and Error Handling Infrastructure
**Goal:** Create centralized validation and error handling utilities

- [ ] **Task 1.1:** Create `scripts/validation_utils.py` with input validation functions
  - Files: `scripts/validation_utils.py`
  - Details: Project ID validation, URL validation, API key format validation
- [ ] **Task 1.2:** Create `scripts/error_handling.py` with custom exception classes
  - Files: `scripts/error_handling.py`
  - Details: Custom exception types, error message formatting, user-friendly error display
- [ ] **Task 1.3:** Create `scripts/retry_utils.py` with retry logic
  - Files: `scripts/retry_utils.py`
  - Details: Exponential backoff, configurable retry policies, network error handling

### Phase 2: Enhance Setup Scripts
**Goal:** Improve error handling in setup scripts

- [ ] **Task 2.1:** Enhance `gcp_setup_core.py` with validation and error handling
  - Files: `scripts/gcp_setup_core.py`
  - Details: Add input validation to all user prompts, improve error messages
- [ ] **Task 2.2:** Update setup scripts with enhanced error handling
  - Files: `scripts/setup_gcp_dev.py`, `scripts/setup_gcp_prod.py`
  - Details: Add prerequisite checks, input validation, graceful error handling

### Phase 3: Enhance Deploy Scripts
**Goal:** Improve error handling in deployment scripts

- [ ] **Task 3.1:** Enhance deploy scripts with retry logic and error handling
  - Files: `scripts/deploy_dev.py`, `scripts/deploy_prod.py`
  - Details: Add retry logic for Docker builds, improve Cloud Run deployment error handling
- [ ] **Task 3.2:** Add comprehensive error recovery and cleanup
  - Files: All deploy scripts
  - Details: Clean up partial deployments, provide recovery suggestions

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# Sync lint dependencies
uv sync --group lint

# Run Ruff linting (fast, comprehensive)
uv run --group lint ruff check scripts/

# Auto-fix common issues
uv run --group lint ruff check --fix scripts/

# Run type checking
uv run --group lint mypy scripts/

# Run formatting check
uv run --group lint black --check scripts/

# Test error handling improvements
uv run python -c "
from scripts.validation_utils import validate_project_id
print('✅ Validation utilities working')
"
```

---

## 8. File Structure & Organization

### New Files to Create
```
scripts/
├── validation_utils.py          # Input validation functions
├── error_handling.py           # Custom exceptions and error formatting
├── retry_utils.py              # Retry logic and backoff
└── __init__.py                 # Package initialization
```

### Files to Modify
- [ ] **`scripts/gcp_setup_core.py`** - Add validation calls and enhanced error handling
- [ ] **`scripts/setup_gcp_dev.py`** - Add input validation and error handling
- [ ] **`scripts/setup_gcp_prod.py`** - Add input validation and error handling
- [ ] **`scripts/deploy_dev.py`** - Enhanced command execution error handling
- [ ] **`scripts/deploy_prod.py`** - Enhanced command execution error handling

### Dependencies to Add to pyproject.toml
**No new dependencies required** - using Python standard library only

---

## 9. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Invalid project ID format
  - **Handling:** Validate format with regex, check project existence with gcloud
- [ ] **Error 2:** Network connectivity issues
  - **Handling:** Retry with exponential backoff, suggest network troubleshooting
- [ ] **Error 3:** Authentication failures
  - **Handling:** Clear guidance on gcloud auth setup, check current auth status
- [ ] **Error 4:** Permission denied errors
  - **Handling:** Specific suggestions for missing IAM permissions
- [ ] **Error 5:** Resource already exists
  - **Handling:** Skip creation, update existing resources if needed

### Edge Cases
- [ ] **Edge Case 1:** Partial resource creation failure
  - **Solution:** Cleanup partially created resources, provide recovery steps
- [ ] **Edge Case 2:** Network timeout during deployment
  - **Solution:** Configurable timeouts, retry with longer timeouts
- [ ] **Edge Case 3:** Invalid configuration values
  - **Solution:** Validate all configuration before execution begins

### Custom Exception Handling
```python
# scripts/error_handling.py
class RAGProcessorError(Exception):
    """Base exception for RAG processor operations"""
    pass

class ValidationError(RAGProcessorError):
    """Input validation failed"""
    pass

class NetworkError(RAGProcessorError):
    """Network operation failed"""
    pass

class AuthenticationError(RAGProcessorError):
    """Authentication failed"""
    pass
```

---

## 10. Security Considerations

### Input Validation
- [ ] **Project ID validation** - Ensure proper format and prevent injection
- [ ] **URL validation** - Validate database URLs without exposing credentials
- [ ] **API key validation** - Check format without logging sensitive values

### Error Message Security
- [ ] **Sensitive data protection** - Never log API keys or database credentials
- [ ] **Error message sanitization** - Remove sensitive information from error messages
- [ ] **Debug information control** - Detailed info only in debug mode

### Authentication Security
- [ ] **gcloud auth verification** - Ensure proper authentication before operations
- [ ] **Service account security** - Validate service account permissions
- [ ] **Secret management** - Proper handling of secrets in error scenarios

---

## 11. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing Script Interfaces:** No changes to command-line interfaces or main function signatures
- [ ] **Error Exit Codes:** Maintain existing exit codes for backward compatibility
- [ ] **Output Format:** Enhanced error messages maintain script output compatibility
- [ ] **Environment Variables:** No changes to expected environment variables

#### 2. **Ripple Effects Assessment**
- [ ] **Developer Experience:** Significantly improved error messages and validation
- [ ] **Support Overhead:** Reduced support requests due to clearer error guidance
- [ ] **Script Reliability:** Enhanced retry logic reduces intermittent failures
- [ ] **Debugging Capability:** Better error context improves troubleshooting

#### 3. **Performance Implications**
- [ ] **Validation Overhead:** Minimal performance impact from input validation
- [ ] **Retry Logic:** Slightly longer execution time for failed operations (acceptable tradeoff)
- [ ] **Error Handling:** Negligible overhead for successful operations
- [ ] **Logging Enhancement:** Minimal impact on execution speed

#### 4. **Operational Impact**
- [ ] **Script Deployment:** No changes to how scripts are deployed or executed
- [ ] **Resource Cleanup:** Improved cleanup reduces orphaned resources
- [ ] **Error Recovery:** Better recovery guidance reduces manual intervention
- [ ] **Documentation Needs:** Enhanced error messages reduce documentation burden

### Critical Issues Identification

#### 🚨 **RED FLAGS - None Identified**
No breaking changes or critical issues expected from this enhancement.

#### ⚠️ **YELLOW FLAGS - Minor Considerations**
- [ ] **Increased Code Complexity:** More comprehensive error handling adds code volume
- [ ] **Validation Time:** Input validation adds minor execution time overhead
- [ ] **New Dependencies:** Additional utility modules (acceptable for better maintainability)

### Mitigation Strategies

#### Error Handling Enhancement
- [ ] **Backward Compatibility:** Maintain existing script interfaces and exit codes
- [ ] **Performance Optimization:** Keep validation lightweight and efficient
- [ ] **Code Organization:** Centralize error handling to avoid duplication
- [ ] **Documentation:** Update error handling patterns for consistency

---

## 12. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Follow this exact sequence:**

1. **CREATE VALIDATION UTILITIES FIRST (Required)**
   - [ ] Create `scripts/validation_utils.py` with comprehensive input validation
   - [ ] Create `scripts/error_handling.py` with custom exception classes
   - [ ] Create `scripts/retry_utils.py` with retry logic and backoff

2. **ENHANCE SETUP SCRIPTS SECOND (Required)**
   - [ ] Add validation calls to `gcp_setup_core.py`
   - [ ] Improve error messages in setup scripts
   - [ ] Add prerequisite checks and input validation

3. **ENHANCE DEPLOY SCRIPTS THIRD (Required)**
   - [ ] Add retry logic to deploy scripts
   - [ ] Improve command execution error handling
   - [ ] Add cleanup and recovery mechanisms

4. **VALIDATE IMPROVEMENTS FOURTH (Required)**
   - [ ] Test error handling with invalid inputs
   - [ ] Verify retry logic with network simulation
   - [ ] Confirm backward compatibility

### Communication Preferences
- [ ] Provide clear progress updates for each phase
- [ ] Show before/after error message improvements
- [ ] Flag any issues that require user decisions
- [ ] Suggest additional improvements discovered during implementation

### Python Code Quality Standards
- [ ] **Type Hints:** Complete type annotations for all validation functions
- [ ] **Documentation:** Comprehensive docstrings for all error handling utilities
- [ ] **Error Handling:** Proper exception hierarchy and error context
- [ ] **Testing:** Validate error handling with various failure scenarios
- [ ] **Logging:** Structured logging for error context without exposing secrets

---

## 13. Notes & Additional Context

### Research Links
- [Google Cloud Error Handling Best Practices](https://cloud.google.com/apis/design/errors)
- [Python Exception Handling Best Practices](https://docs.python.org/3/tutorial/errors.html)
- [Subprocess Error Handling](https://docs.python.org/3/library/subprocess.html)

### Performance Considerations
- **Validation Performance:** Keep input validation lightweight and efficient
- **Retry Logic:** Use exponential backoff to avoid overwhelming services
- **Error Logging:** Structured logging without performance impact
- **Resource Management:** Proper cleanup without blocking operations

---

**CRITICAL GUIDELINES:**
- **FOCUS ON USER EXPERIENCE** - Error messages should guide users to solutions
- **MAINTAIN BACKWARD COMPATIBILITY** - Existing scripts must continue working
- **USE STANDARD LIBRARY ONLY** - No additional dependencies for error handling
- **IMPLEMENT COMPREHENSIVE VALIDATION** - All user inputs validated before execution
- **PROVIDE CLEAR GUIDANCE** - Every error message includes suggested solutions
- **ENSURE GRACEFUL FAILURE** - Scripts clean up and provide recovery steps

---

*Template Version: 1.2*  
*Last Updated: 1/7/2025*  
*Issue: Improve Error Handling and Input Validation*
*Priority: High - Critical for production readiness* 
