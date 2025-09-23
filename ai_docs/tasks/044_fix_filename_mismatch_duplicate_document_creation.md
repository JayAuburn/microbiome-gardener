# Fix Filename Mismatch Causing Duplicate Document Creation

## 1. Task Overview

### Task Title
**Title:** Fix filename transformation mismatch between web app database storage and GCS uploads causing duplicate document creation

### Goal Statement
**Goal:** Eliminate duplicate document creation by ensuring consistent filename handling between the web app's database records and the actual GCS file paths that trigger EventArc processing, so the rag-processor can correctly identify and update existing documents instead of creating new ones.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with type hints
- **Primary Framework:** FastAPI 0.104+ with async/await patterns for rag-processor; Next.js for web app
- **Dependency Management:** uv for Python dependencies in rag-processor
- **Database & ORM:** PostgreSQL with raw SQL queries and psycopg2
- **API Patterns:** RESTful APIs with Pydantic models for validation
- **Testing Framework:** pytest with async support
- **Code Quality Tools:** ruff for linting, black for formatting, mypy for type checking
- **Containerization:** Docker with Cloud Run deployment
- **Key Architectural Patterns:** EventArc triggers from GCS uploads to rag-processor
- **🔑 EXISTING AI/ML INTEGRATIONS:** Vertex AI for embeddings (text-embedding-004, multimodalembedding@001)
- **🔑 AUTHENTICATION PATTERNS:** Vertex AI with gcloud auth, service accounts for Cloud Run
- **🔑 EXISTING SDK USAGE:** vertexai>=1.38.0, google-cloud-storage>=2.10.0, pgvector>=0.2.4
- **Relevant Existing Modules:** 
  - **rag-processor**: `main.py`, `services/processing_service.py`, `utils/event_handling.py`
  - **web app**: File upload handling, GCS client integration

### Current State
**PROBLEM IDENTIFIED:** The web app and rag-processor have a filename mismatch issue:

1. **User uploads**: `Week 6 Tools and Tutorials (2).pptx`
2. **Web app stores in database**: `Week 6 Tools and Tutorials (2).pptx` 
3. **Web app uploads to GCS**: `Week_6_Tools_and_Tutorials__2_-1751899794720.pptx` (filename gets transformed)
4. **EventArc triggers rag-processor**: For the transformed filename
5. **Rag-processor looks for existing document**: Using transformed GCS path but can't find the database record
6. **Result**: Rag-processor creates a NEW document instead of updating the existing one

**Evidence from logs:**
- Original upload: `Week 6 Tools and Tutorials (2).pptx` shows "Processing" status
- Duplicate created: `Week_6_Tools_and_Tutorials__2_-1751899794720.pptx` shows "Completed" status
- Rag-processor logs show: `Found existing document - updating instead of creating duplicate` but for the WRONG document (the already-transformed one, not the original)

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing SDK Analysis:** Rag-processor uses Vertex AI, google-cloud-storage, pgvector
- [x] **Authentication Method:** gcloud auth with service accounts
- [x] **Dependency Consistency:** Will use existing tools and patterns
- [x] **Architecture Alignment:** Must maintain EventArc -> rag-processor flow
- [x] **Performance Impact:** Fix should not affect processing pipeline performance

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing Vertex AI setup** - no changes needed
- [x] **Use existing authentication patterns** - no changes needed  
- [x] **Fix filename handling logic** - primary focus area
- [x] **Maintain backward compatibility** - existing processed documents should not be affected

## 3. Context & Problem Definition

### Problem Statement
The RAG SaaS application creates duplicate documents instead of processing uploaded files because there's a mismatch between:

1. **Database Storage**: Web app stores original filenames (e.g., `Week 6 Tools and Tutorials (2).pptx`)
2. **GCS Upload**: Web app uploads files with transformed filenames (e.g., `Week_6_Tools_and_Tutorials__2_-1751899794720.pptx`)
3. **EventArc Processing**: Rag-processor receives events for transformed filenames
4. **Document Lookup**: Rag-processor can't find existing documents because GCS paths don't match

This results in:
- **User confusion**: Original documents show "Processing" forever
- **Duplicate content**: New documents get created and processed instead
- **Storage waste**: Multiple database entries and vector embeddings for the same content
- **Poor UX**: Users see multiple versions of the same file

### Success Criteria
- [x] **No Duplicate Documents**: Uploaded files should update existing database records, not create new ones
- [x] **Consistent Status Updates**: Original uploaded documents should show proper processing status progression
- [x] **Backward Compatibility**: Existing processed documents should continue to work
- [x] **Clear Logging**: Easy to trace filename transformations and document lookups in logs

---

## 4. Technical Requirements

### Functional Requirements
- **Web App**: Database records must store the same filename/path that gets uploaded to GCS
- **Rag-Processor**: Must be able to find existing documents using GCS paths from EventArc events
- **File Processing**: Should update existing documents instead of creating duplicates
- **Status Updates**: Processing status should update the original document record

### Non-Functional Requirements
- **Performance:** No impact on upload or processing performance
- **Security:** Maintain existing authentication and authorization patterns
- **Scalability:** Solution must work with concurrent uploads
- **Reliability:** Robust error handling for edge cases
- **Observability:** Clear logging for debugging filename mismatches

### Technical Constraints
- **Cannot modify EventArc events**: Must work with existing GCS event structure
- **Must maintain existing API contracts**: Web app and rag-processor interfaces
- **Backward compatibility**: Existing documents must continue to work
- **No breaking changes**: Users should not experience service interruption

---

## 5. Data & Database Changes

### Database Schema Changes
**No schema changes required** - the issue is in application logic, not database structure.

### Data Model Updates
**Potential updates to ensure consistency:**

```python
# In document creation/update logic
class DocumentRecord:
    """Ensure GCS path matches what actually gets uploaded"""
    id: str
    filename: str  # Should match the transformed filename
    original_filename: str  # Store user's original filename separately
    gcs_path: str  # Should match actual GCS upload path
    gcs_bucket: str
    # ... other fields
```

### Data Migration Plan
**Investigation needed:**
- [x] **Analyze existing documents**: Check how many have filename mismatches
- [x] **Data cleanup strategy**: Determine if existing duplicates need to be merged
- [x] **Rollback plan**: Ability to revert changes if issues arise

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**API ROUTES** → `main.py` or `routers/[feature].py`
- [x] **FastAPI Routes** - rag-processor CloudEvent endpoint (existing)
- [x] **Web app upload endpoints** - needs investigation for filename handling

**BUSINESS LOGIC** → `services/[feature].py` or dedicated modules  
- [x] **rag-processor**: `services/processing_service.py` document lookup logic
- [x] **web app**: File upload and GCS path generation logic

**DATABASE ACCESS** → `repositories/[feature].py` or direct SQL
- [x] **Document lookup**: Currently searches by `gcs_path` and `user_id`
- [x] **Document creation**: Must ensure consistent path storage

### Root Cause Analysis Areas

**1. Web App File Upload Process**
- **Investigation needed**: How does web app transform filenames before GCS upload?
- **Key files**: Upload handlers, GCS client code
- **Transformation logic**: Special character replacement, timestamp addition

**2. Rag-Processor Document Lookup**
- **Current logic**: Searches for documents by exact `gcs_path` match
- **Issue**: GCS path from EventArc doesn't match database record
- **Location**: `services/processing_service.py` in `_store_processing_job()`

**3. Filename Transformation Rules**
Need to understand:
- What characters get replaced? (spaces → underscores, parentheses → underscores?)
- When does timestamp get added? (`-1751899794720`)
- Is transformation consistent and reversible?

### External Integrations
- **Google Cloud Storage**: Existing integration works correctly
- **EventArc**: Existing integration works correctly
- **Vertex AI**: No changes needed

---

## 7. Python Module & Code Organization

### Files to Investigate
- [x] **Web App Upload Logic** - Find filename transformation code
- [x] **rag-processor/services/processing_service.py** - Document lookup logic
- [x] **rag-processor/utils/event_handling.py** - GCS event parsing
- [x] **Web app GCS integration** - File upload and path generation

### Files to Potentially Modify
- [x] **rag-processor/services/processing_service.py** - Improve document lookup logic
- [x] **Web app upload handlers** - Fix filename consistency
- [x] **Database insertion logic** - Ensure correct path storage

### Dependency Management
**No new dependencies needed** - issue is in existing application logic.

---

## 8. Implementation Plan

### Phase 1: Root Cause Analysis & Investigation
**Goal:** Understand exactly how filename transformation works in both systems

- [x] **Task 1.1:** Analyze web app file upload flow
  - Files: Web app upload handlers, GCS client code
  - Details: Trace filename from user upload → database storage → GCS upload
- [x] **Task 1.2:** Map filename transformation rules
  - Files: Upload processing logic
  - Details: Document exact transformation algorithm (spaces, special chars, timestamps)
- [x] **Task 1.3:** Analyze rag-processor document lookup
  - Files: `services/processing_service.py`
  - Details: Review current database query logic in `_store_processing_job()`
- [x] **Task 1.4:** Test filename transformation scenarios
  - Files: Create test cases
  - Details: Test various filename patterns to understand transformation rules

### Phase 2: Solution Design & Implementation
**Goal:** Implement fix to ensure filename consistency

**Option A: Fix Web App (Preferred)**
- [x] **Task 2.1:** Store transformed filename in database
  - Files: Web app upload handlers, database insertion logic
  - Details: Ensure database `gcs_path` matches actual GCS upload path

**Option B: Fix Rag-Processor**  
- [x] **Task 2.2:** Add filename transformation logic to rag-processor
  - Files: `services/processing_service.py`
  - Details: Reverse-engineer filename transformation to find original database records

**Option C: Hybrid Approach**
- [x] **Task 2.3:** Store both original and transformed filenames
  - Files: Database schema, both web app and rag-processor
  - Details: Add fields for both filenames, search using both patterns

### Phase 3: Testing & Validation
**Goal:** Ensure fix works and no regressions

- [x] **Task 3.1:** End-to-end testing
  - Files: Test various filename patterns
  - Details: Upload files → verify single document created → verify processing works
- [x] **Task 3.2:** Backward compatibility testing
  - Files: Existing document processing
  - Details: Ensure existing documents continue to work properly
- [x] **Task 3.3:** Performance validation
  - Files: Upload and processing performance
  - Details: Verify no performance degradation in upload or processing

### Code Quality Checks
**🔍 MANDATORY: Run these checks after each phase:**

```bash
# Python (rag-processor)
uv sync --group lint
uv run --group lint ruff check --fix rag_processor/
uv run --group lint mypy rag_processor/
uv run --group lint black --check rag_processor/

# Web app (if TypeScript changes)
npm run lint
npm run type-check
```

---

## 9. File Structure & Organization

### Investigation Target Files
```
rag-saas/
├── apps/
│   ├── rag-processor/
│   │   ├── rag_processor/
│   │   │   ├── services/processing_service.py     # Document lookup logic
│   │   │   ├── utils/event_handling.py            # GCS event parsing
│   │   │   └── main.py                            # CloudEvent endpoint
│   │   └── tests/
│   │       └── test_filename_handling.py          # New test file
│   └── web/
│       ├── app/
│       │   ├── api/                               # Upload API endpoints
│       │   ├── components/                        # Upload UI components
│       │   └── lib/                               # GCS client integration
│       └── tests/
│           └── filename-transformation.test.ts    # New test file
```

### New Files to Create
```
rag-processor/
├── tests/
│   ├── test_filename_transformation.py            # Test filename handling logic
│   └── test_document_lookup.py                    # Test document lookup scenarios
└── utils/
    └── filename_utils.py                          # Filename transformation utilities (if needed)

web/
├── tests/
│   └── filename-handling.test.ts                 # Test upload filename logic
└── lib/
    └── filename-utils.ts                          # Shared filename utilities (if needed)
```

### Files to Modify
- [x] **rag-processor/services/processing_service.py** - Document lookup logic
- [x] **Web app upload handlers** - Filename storage consistency
- [x] **Database insertion logic** - Ensure correct GCS path storage

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [x] **Error 1:** Multiple documents with similar filenames
  - **Handling:** Robust lookup logic with fuzzy matching if needed
- [x] **Error 2:** Filename transformation edge cases
  - **Handling:** Comprehensive transformation rules and fallback logic
- [x] **Error 3:** Existing duplicate documents
  - **Handling:** Data cleanup strategy to merge or deduplicate

### Edge Cases
- [x] **Edge Case 1:** Very long filenames
  - **Solution:** Filename truncation and collision handling
- [x] **Edge Case 2:** Special Unicode characters
  - **Solution:** Proper character encoding and transformation
- [x] **Edge Case 3:** Identical filenames from different users
  - **Solution:** User-scoped document lookup

### Custom Exception Handling
```python
# rag_processor/utils/exceptions.py
class FilenameTransformationError(Exception):
    """Error in filename transformation logic"""
    pass

class DocumentLookupError(Exception):  
    """Error finding existing document record"""
    pass

# Enhanced error logging for debugging
@app.exception_handler(DocumentLookupError)
async def document_lookup_handler(request: Request, exc: DocumentLookupError):
    logger.error("Document lookup failed", 
                 gcs_path=getattr(exc, 'gcs_path', None),
                 user_id=getattr(exc, 'user_id', None))
    # Handle gracefully without failing entire processing
```

---

## 11. Security Considerations

### Authentication & Authorization
- [x] **No changes needed**: Existing auth patterns work correctly
- [x] **Document access control**: Maintain user-scoped document access

### Input Validation
- [x] **Filename validation**: Ensure malicious filenames can't break transformation logic
- [x] **GCS path validation**: Validate EventArc event data integrity
- [x] **User ID validation**: Prevent cross-user document access

### Data Protection
- [x] **No security impact**: Filename changes don't affect data encryption or access control
- [x] **Audit logging**: Log filename transformations for debugging

---

## 12. Testing Strategy

### Test Structure
```python
# tests/test_filename_handling.py
import pytest
from rag_processor.services.processing_service import ProcessingService

class TestFilenameHandling:
    """Test filename transformation and document lookup logic"""
    
    @pytest.mark.parametrize("original,expected_transformed", [
        ("Week 6 Tools and Tutorials (2).pptx", "Week_6_Tools_and_Tutorials__2_-{timestamp}.pptx"),
        ("My Document (1).pdf", "My_Document__1_-{timestamp}.pdf"),
        ("Special_Chars@#$.docx", "Special_Chars____-{timestamp}.docx"),
    ])
    async def test_filename_transformation(self, original, expected_transformed):
        # Test filename transformation logic
        pass
    
    async def test_document_lookup_by_gcs_path(self):
        # Test document lookup using actual GCS paths
        pass
        
    async def test_no_duplicate_creation(self):
        # Test that duplicate documents are not created
        pass
```

### Test Categories
- [x] **Unit Tests** - Filename transformation logic
- [x] **Integration Tests** - Database lookup with various filename patterns
- [x] **End-to-End Tests** - Full upload → processing → status update flow
- [x] **Regression Tests** - Ensure existing documents continue working

### Testing Commands
```bash
# Test rag-processor
uv sync --group test
uv run --group test pytest tests/test_filename_handling.py -v

# Test web app  
npm run test:filename-handling
```

---

## 13. Deployment & Configuration

### Environment Variables
**No new environment variables needed** - using existing configuration.

### Deployment Strategy
1. **Phase 1**: Deploy rag-processor fixes first (backward compatible)
2. **Phase 2**: Deploy web app fixes (if needed)
3. **Phase 3**: Monitor for any remaining issues

### Health Checks
```python
@app.get("/health")
async def health_check():
    # Include filename handling in health check if needed
    return {"status": "healthy", "filename_handling": "operational"}
```

---

## 14. AI Agent Instructions

### Communication Preferences
- [x] **Root cause first**: Investigate web app filename transformation before implementing fixes
- [x] **Evidence-based**: Use logs and actual data to understand the exact transformation rules
- [x] **Minimal changes**: Prefer fixing the root cause over complex workarounds
- [x] **Backward compatibility**: Ensure existing documents continue working

### Implementation Approach - CRITICAL WORKFLOW

1. **INVESTIGATE WEB APP FIRST (Required)**
   - [x] Find web app file upload handlers
   - [x] Analyze filename transformation logic  
   - [x] Document exact transformation rules
   - [x] Test transformation with various filename patterns

2. **ANALYZE RAG-PROCESSOR SECOND (Required)**
   - [x] Review current document lookup logic in `_store_processing_job()`
   - [x] Test lookup with transformed filenames
   - [x] Identify where lookup fails

3. **DESIGN SOLUTION THIRD (Required)**
   - [x] Choose between fixing web app vs rag-processor vs hybrid approach
   - [x] **Prefer web app fix**: Store transformed filename in database to match GCS
   - [x] **Fallback**: Add transformation logic to rag-processor if web app can't be changed

4. **IMPLEMENT & TEST FOURTH (Only after analysis)**
   - [x] Implement chosen solution
   - [x] Test with original problematic files
   - [x] Verify no new duplicates are created
   - [x] Ensure existing documents still work

### 🚨 CRITICAL: Investigation Focus Areas
**MUST investigate these specific areas:**
- [x] **Web app filename transformation**: How does `Week 6 Tools and Tutorials (2).pptx` become `Week_6_Tools_and_Tutorials__2_-1751899794720.pptx`?
- [x] **Database vs GCS consistency**: What gets stored in database vs what gets uploaded to GCS?
- [x] **Timestamp generation**: When and how is the timestamp (`-1751899794720`) added?
- [x] **Character replacement rules**: How are spaces, parentheses, and other special characters handled?

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start implementation):**
- "Proceed with investigation"
- "Start the root cause analysis"
- "Go ahead and fix this"
- "Approved"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific approach
- Requests for more details
- "What about..." or "How will you handle..."

---

## 15. Notes & Additional Context

### Research Links
- [GCS CloudEvent documentation](https://cloud.google.com/eventarc/docs/cloudevents)
- [FastAPI EventArc integration patterns](https://cloud.google.com/run/docs/tutorials/eventarc)
- [Filename sanitization best practices](https://stackoverflow.com/questions/7406102/create-sane-safe-filename-from-any-unsafe-string)

### Performance Considerations
- **Database queries**: Current lookup by `gcs_path` and `user_id` should remain efficient
- **Filename transformation**: Should be lightweight operation
- **Memory usage**: No significant impact expected
- **Upload performance**: Should not affect file upload speed

### Key Questions to Answer
1. **Web app transformation**: What exact algorithm transforms filenames?
2. **Timestamp source**: Where does the timestamp come from? (current time, upload time, etc.)
3. **Reversibility**: Can we reverse the transformation to find original records?
4. **Consistency**: Are transformations deterministic and consistent?
5. **Edge cases**: How are collisions and special characters handled?

---

*Template Version: 1.0*  
*Last Updated: July 7, 2025*  
*Created By: AI Agent*  
*Priority: HIGH - Affects core document processing functionality* 
