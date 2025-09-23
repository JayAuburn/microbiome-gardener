# Python AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Secure Cloud Run Authentication by Removing Public Access and Implementing Service-to-Service Authentication

### Goal Statement
**Goal:** Fix the critical security vulnerability where the `rag-processor` Cloud Run service is publicly accessible (`--allow-unauthenticated`) by implementing proper authentication, ensuring only authorized services (the web application) can access the expensive GPU-enabled document processing service while maintaining existing functionality.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with type hints
- **Primary Framework:** FastAPI 0.104+ with async/await patterns
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with asyncpg for raw SQL operations
- **API Patterns:** RESTful APIs with Pydantic models for validation
- **Testing Framework:** pytest with async support and coverage
- **Code Quality Tools:** ruff for linting and import sorting, black for formatting, mypy for type checking
- **Containerization:** Docker with multi-stage builds for production
- **Key Architectural Patterns:** Dependency injection, async request handlers, structured logging
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for embeddings, Google Gen AI for text processing, Docling for document processing
- **🔑 AUTHENTICATION PATTERNS:** Application-level API key auth via middleware, Google Cloud service account for GCP resources
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0, google-genai>=1.24.0, google-cloud-secret-manager>=2.18.1
- **Relevant Existing Modules:** `main.py` for FastAPI app, `middleware/auth.py` for API key validation, `config.py` for settings

### Current State
The RAG Processor Cloud Run service is deployed with a **critical security vulnerability**:

**❌ CURRENT UNSAFE CONFIGURATION:**
- **`--allow-unauthenticated`** flag in deployment makes the service **publicly accessible**
- Anyone on the internet can access the service without authentication
- Service processes sensitive documents and uses expensive GPU resources (NVIDIA L4, ~$0.90/hour)
- **Potential for abuse**: Unauthorized users could consume expensive resources
- **Data exposure risk**: Sensitive document processing endpoints are public

**✅ EXISTING SECURITY LAYERS (Application Level):**
- API key authentication implemented via `middleware/auth.py`
- `verify_api_key()` dependency protects `/process` endpoint
- Service account `rag-service@{PROJECT_ID}.iam.gserviceaccount.com` with proper IAM permissions
- Secrets stored in Google Secret Manager with proper access controls

**🔄 SERVICE INTEGRATION PATTERNS:**
- Web app calls RAG processor via HTTP API (`/process` endpoint)
- EventArc triggers for GCS file uploads (authenticated via service account)
- Health checks via `/health` endpoint

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing SDK Analysis:** Service uses Google Cloud IAM and service accounts for GCP resource access
- [x] **Authentication Method:** Currently uses application-level API keys + GCP service account authentication
- [x] **Dependency Consistency:** Will enhance existing IAM patterns, no new SDKs required
- [x] **Architecture Alignment:** Fits existing service account and IAM security model
- [x] **Performance Impact:** No impact on processing - only changes service access control

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing service account setup** (`rag-service` account already configured)
- [x] **Leverage Google Cloud IAM** for service-to-service authentication
- [x] **Maintain existing API key auth** as secondary layer for request validation
- [x] **No new dependencies required** - uses existing Google Cloud IAM libraries
- [x] **Approach confirmed** - Remove public access, implement IAM-based service auth

## 3. Context & Problem Definition

### Problem Statement
The RAG Processor Cloud Run service is currently deployed with `--allow-unauthenticated`, creating a **critical security vulnerability**:

1. **Public Exposure**: Anyone with the service URL can access document processing endpoints
2. **Resource Abuse**: Unauthorized users can consume expensive GPU resources (~$0.90/hour per instance)
3. **Data Security Risk**: Sensitive document processing capabilities are publicly accessible
4. **Cost Impact**: Potential for unexpected charges from unauthorized usage
5. **Compliance Risk**: Publicly accessible service processing potentially sensitive documents

**User Impact:**
- Security teams would flag this as a critical vulnerability
- Potential for service abuse and unexpected costs
- Risk of sensitive document exposure if API keys are compromised
- Non-compliance with security best practices

### Success Criteria
- [x] Cloud Run service requires authentication (`--no-allow-unauthenticated`)
- [x] Web application can successfully authenticate to rag-processor service
- [x] EventArc triggers continue to work with proper service account authentication
- [x] All existing functionality preserved (health checks, document processing)
- [x] No public internet access to service endpoints
- [x] Service-to-service authentication properly implemented
- [x] Documentation updated with new authentication requirements

---

## 4. Technical Requirements

### Functional Requirements
- Cloud Run service must require authentication for all requests
- Web application must authenticate when calling rag-processor endpoints
- EventArc CloudEvents must continue to work with service account authentication
- Health check endpoint should be accessible for monitoring (with authentication)
- API key authentication should remain as an additional security layer
- Service should return 401 Unauthorized for unauthenticated requests

### Non-Functional Requirements
- **Performance:** No degradation in request processing times
- **Security:** Implement principle of least privilege for service access
- **Scalability:** Authentication should not impact auto-scaling behavior
- **Reliability:** Robust error handling for authentication failures
- **Observability:** Clear logging for authentication success/failure events

### Technical Constraints
- Must preserve existing rag-service service account and its permissions
- Cannot modify the existing API key authentication system (additive changes only)
- Must maintain backward compatibility with EventArc CloudEvent processing
- Service must continue to work with existing GPU resource configuration

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required for this security enhancement.

### Data Model Updates
No Pydantic model changes required - authentication happens at the transport layer.

### Data Migration Plan
No data migration required.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MANDATORY: Follow these Python patterns strictly:**

**API ROUTES** → `main.py` - FastAPI endpoints remain unchanged
- [x] **Existing Routes Preserved** - `/health`, `/process`, `/`, and CloudEvent handler
- [x] **Authentication Middleware** - Existing `verify_api_key` dependency continues to work
- [x] **Error Responses** - Add proper 401 responses for authentication failures

**AUTHENTICATION LAYER** → Cloud Run IAM + Application API Keys
- [x] **Cloud Run IAM** - Service-level authentication via Google Cloud IAM
- [x] **API Key Validation** - Application-level authentication continues as secondary layer
- [x] **Service Account Auth** - EventArc and service-to-service calls use IAM

**CONFIGURATION** → Update deployment configuration and client authentication
- [x] **Deploy Script Changes** - Remove `--allow-unauthenticated` flag
- [x] **Client Authentication** - Web app must obtain and use identity tokens
- [x] **Environment Variables** - No changes to existing environment configuration

### API Endpoints
All existing endpoints remain unchanged:
- [x] **`GET /health`** - Health check (now requires authentication)
- [x] **`POST /process`** - Document processing (authentication required)
- [x] **`GET /`** - Root endpoint (authentication required)
- [x] **`POST /`** - CloudEvent handler (service account authentication)

### Database Operations
No changes to database operations - this is purely an authentication layer enhancement.

### External Integrations
**Updated Authentication Requirements:**
- **Web App → RAG Processor**: Must use Google Cloud Identity tokens
- **EventArc → RAG Processor**: Uses existing service account authentication (no changes)
- **Monitoring Systems**: Must authenticate for health checks

---

## 7. Python Module & Code Organization

### New Modules/Files
No new Python modules required - changes are in deployment configuration and client authentication.

### Files to Modify
- [x] **`deploy.sh`** - Remove `--allow-unauthenticated` flag from Cloud Run deployment
- [x] **Web application HTTP client** - Add authentication headers when calling rag-processor

### Dependency Management
**🔧 No new dependencies required:**
- Existing Google Cloud libraries support IAM authentication
- Web application may need identity token generation utilities

---

## 8. Implementation Plan

### Phase 1: Update Cloud Run Deployment Configuration
**Goal:** Secure the Cloud Run service by requiring authentication

- [x] **Task 1.1:** Modify deployment script
  - Files: `deploy.sh`
  - Details: Remove `--allow-unauthenticated` flag, add proper IAM policies
- [x] **Task 1.2:** Test authentication requirement
  - Files: Deployment verification
  - Details: Confirm service returns 401 for unauthenticated requests

### Phase 2: Implement Service-to-Service Authentication
**Goal:** Enable web application to authenticate to rag-processor

- [x] **Task 2.1:** Update web application HTTP client
  - Files: Web app service calling rag-processor
  - Details: Add identity token generation and authorization headers
- [x] **Task 2.2:** Verify EventArc authentication
  - Files: CloudEvent processing verification
  - Details: Ensure service account auth continues to work

### Phase 3: Testing and Validation
**Goal:** Comprehensive testing of new authentication flow

- [x] **Task 3.1:** End-to-end authentication testing
- [x] **Task 3.2:** Monitor authentication logs and error handling

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# No code quality changes required for deployment configuration
# Web app changes should follow existing linting standards

# Verify deployment configuration syntax
bash -n deploy.sh

# Test deployment in development environment
./deploy.sh  # Should now require authentication
```

---

## 9. File Structure & Organization

### New Files to Create
No new files required.

### Files to Modify
- [x] **`deploy.sh`** - Update Cloud Run deployment configuration
- [x] **Web application service files** - Add authentication for rag-processor calls

### Dependencies to Add to pyproject.toml
**⚠️ No new dependencies required** - using existing Google Cloud authentication libraries.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [x] **Error 1:** Web app authentication token expired/invalid
  - **Handling:** Token refresh logic, proper error propagation to user
- [x] **Error 2:** Service account permissions insufficient
  - **Handling:** Clear error messages, IAM permission validation
- [x] **Error 3:** EventArc authentication failure
  - **Handling:** Service account validation, CloudEvent authentication verification

### Edge Cases
- [x] **Edge Case 1:** Health check monitoring systems
  - **Solution:** Document authentication requirements for monitoring tools
- [x] **Edge Case 2:** Development/testing access
  - **Solution:** Provide development authentication setup instructions

### Custom Exception Handling
```python
# Enhanced authentication error handling in existing middleware
from fastapi import HTTPException

async def handle_authentication_errors(request: Request, call_next):
    """Enhanced error handling for Cloud Run authentication failures."""
    try:
        response = await call_next(request)
        return response
    except AuthenticationError as e:
        logger.error("Cloud Run authentication failed", error=str(e))
        raise HTTPException(status_code=401, detail="Authentication required")
```

---

## 11. Security Considerations

### Authentication & Authorization
- [x] **Cloud Run IAM Authentication**: Service-level access control via Google Cloud IAM
- [x] **Service Account Permissions**: Principle of least privilege for accessing services
- [x] **API Key Validation**: Maintained as secondary authentication layer
- [x] **Identity Token Validation**: Proper token verification and refresh logic

### Input Validation
- [x] **Existing Validation Preserved**: Pydantic models continue to validate all inputs
- [x] **Authentication Headers**: Proper validation of authorization headers
- [x] **Token Expiration**: Handle expired tokens gracefully

### Data Protection
- [x] **Transport Security**: HTTPS enforced by Cloud Run
- [x] **Token Security**: Identity tokens transmitted securely
- [x] **Service Isolation**: Service only accessible to authorized callers

---

## 12. Testing Strategy

### Test Structure
```python
# Authentication testing approach
async def test_unauthenticated_request():
    """Test that unauthenticated requests are rejected."""
    async with AsyncClient(app=app) as client:
        response = await client.get("/health")
        assert response.status_code == 401

async def test_authenticated_request():
    """Test that properly authenticated requests succeed."""
    token = await get_identity_token()
    headers = {"Authorization": f"Bearer {token}"}
    async with AsyncClient(app=app) as client:
        response = await client.get("/health", headers=headers)
        assert response.status_code == 200
```

### Test Categories
- [x] **Authentication Tests**: Verify auth requirements work correctly
- [x] **Integration Tests**: End-to-end service-to-service authentication
- [x] **Security Tests**: Confirm unauthorized access is blocked
- [x] **Regression Tests**: Ensure existing functionality preserved

### Testing Commands
```bash
# Test deployment configuration
gcloud run services describe rag-processor --region=us-central1

# Test authentication requirement
curl -X GET "https://rag-processor-url/health"  # Should return 401

# Test authenticated access
TOKEN=$(gcloud auth print-identity-token)
curl -H "Authorization: Bearer $TOKEN" "https://rag-processor-url/health"
```

---

## 13. Deployment & Configuration

### Environment Variables
```bash
# No new environment variables required
# Existing configuration preserved
GOOGLE_CLOUD_PROJECT_ID=your-project-id
RAG_PROCESSOR_API_KEY=your-api-key
```

### Cloud Run Configuration Changes
```bash
# BEFORE (INSECURE):
gcloud run deploy rag-processor \
    --allow-unauthenticated \
    # ... other flags

# AFTER (SECURE):
gcloud run deploy rag-processor \
    --no-allow-unauthenticated \
    # ... other flags remain the same
```

### IAM Configuration
```bash
# Ensure web app service account has Cloud Run Invoker role
gcloud run services add-iam-policy-binding rag-processor \
    --member="serviceAccount:web-app-service-account@project.iam.gserviceaccount.com" \
    --role="roles/run.invoker" \
    --region=us-central1
```

### Health Checks
Health check endpoints now require authentication:
```python
# Health checks must include authentication
headers = {"Authorization": f"Bearer {identity_token}"}
response = requests.get("https://service-url/health", headers=headers)
```

---

## 14. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task document has been created following the standard template. Implementation should proceed with:

1. **✅ TASK DOCUMENT CREATED** - This comprehensive task document
2. **⏳ AWAITING USER APPROVAL** - Wait for explicit approval before implementation
3. **🚀 IMPLEMENTATION READY** - Proceed only after user confirms approach

### Communication Preferences
- [x] Ask for clarification if deployment environment details are unclear
- [x] Provide regular progress updates during implementation
- [x] Flag any authentication issues immediately
- [x] Suggest testing approaches for verification

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **✅ TASK DOCUMENT COMPLETED** - This document provides complete specification
2. **⚠️ SECURITY CRITICAL** - This task addresses a critical security vulnerability
3. **🔄 COORDINATION REQUIRED** - Changes affect both deployment and web application
4. **⏳ AWAITING APPROVAL** - User must approve before implementing security changes

### 🚨 CRITICAL: Security Implementation Validation
**BEFORE implementing, CONFIRM:**
- [x] **Deployment Impact**: "This will make the service require authentication - web app integration needed"
- [x] **Service Access**: "Web application will need identity tokens to call rag-processor"
- [x] **EventArc Compatibility**: "Existing CloudEvent processing should continue to work"
- [x] **Testing Strategy**: "We'll need to test both authentication success and failure cases"

**SECURITY PRIORITY: This task addresses a critical vulnerability and should be prioritized!**

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start implementation immediately):**
- "Proceed with security fix"
- "Go ahead and secure the service"
- "Approved - implement authentication"
- "Start the security implementation"
- "Fix the vulnerability"
- "Begin securing Cloud Run"

**❓ CLARIFICATION NEEDED (Do NOT start implementing):**
- Questions about specific deployment environments
- Requests for changes to authentication approach
- "What about..." or "How will this affect..."
- "I'd like to change..."
- "Wait, let me check..."

🛑 **NEVER start implementing security changes without user approval first!**

### Security Implementation Standards
- [x] **Principle of Least Privilege**: Only grant necessary permissions
- [x] **Defense in Depth**: Maintain API key auth + IAM authentication
- [x] **Clear Error Messages**: Proper 401 responses for authentication failures
- [x] **Comprehensive Testing**: Test both authenticated and unauthenticated scenarios
- [x] **Documentation Updates**: Update deployment and integration documentation
- [x] **Monitoring**: Ensure authentication events are properly logged

---

## 15. Notes & Additional Context

### Security Vulnerability Details
**Current Risk Level: CRITICAL**
- Service processes sensitive documents
- Expensive GPU resources (~$0.90/hour) publicly accessible
- No authentication required for document processing endpoints
- Potential for service abuse and unexpected costs

### Authentication Flow Changes
**BEFORE:**
```
Internet → Cloud Run (public) → API Key Check → Process Document
```

**AFTER:**
```
Web App → Identity Token → Cloud Run (authenticated) → API Key Check → Process Document
```

### Performance Considerations
- Identity token generation adds minimal latency (~10-50ms)
- Authentication check is handled by Cloud Run infrastructure
- No impact on document processing performance
- Token caching can minimize authentication overhead

### Monitoring and Alerting
- Monitor 401 authentication failures
- Alert on unexpected authentication patterns
- Track successful service-to-service authentication
- Monitor for any service disruption during transition

---

*Template Version: 1.0*  
*Last Updated: 2024-12-31*  
*Created By: AI Assistant*  
*Task Priority: CRITICAL SECURITY FIX* 
