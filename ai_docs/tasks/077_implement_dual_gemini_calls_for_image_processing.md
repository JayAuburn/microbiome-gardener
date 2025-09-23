# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement Dual Gemini API Calls for Enhanced Image Processing with Context Field

### Goal Statement
**Goal:** Enhance the image processing service to make two separate Gemini API calls for each image: one comprehensive analysis for the `content` field (existing functionality) and a second concise, key-concept focused analysis for the `context` field. The context field will be used to improve multimodal embedding quality by providing focused conceptual information when generating embeddings.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
Currently, the image processing service makes one Gemini API call that generates comprehensive analysis stored in the `content` field. However, for optimal multimodal embedding generation, we need more focused, concise conceptual information that highlights what makes each image distinctive. This requires a second API call optimized for embedding purposes while maintaining the existing detailed analysis capability.

### Solution Options Analysis

#### Option 1: Sequential Dual API Calls (Recommended)
**Approach:** Make two separate Gemini API calls in sequence using the same uploaded image file

**Pros:**
- ✅ Clean separation of concerns - each call optimized for its purpose
- ✅ Reuses the same uploaded file, minimizing GenAI file operations
- ✅ Maintains existing comprehensive analysis functionality unchanged
- ✅ Easy to implement and test each call independently
- ✅ Clear error handling - can handle failures independently

**Cons:**
- ❌ Higher API costs - two calls per image instead of one
- ❌ Slightly longer processing time (though still sub-30 seconds)
- ❌ More complex error handling for dual calls

**Implementation Complexity:** Medium - Need to refactor service method and update database storage
**Time Estimate:** 2-3 hours
**Risk Level:** Low - Building on existing proven patterns

#### Option 2: Single Call with Multi-Part Prompt
**Approach:** Create one complex prompt asking for both detailed and concise outputs in structured format

**Pros:**
- ✅ Single API call reduces costs
- ✅ Faster processing time
- ✅ Simpler file management

**Cons:**
- ❌ Complex prompt engineering to get consistent dual outputs
- ❌ Less control over each output format and length
- ❌ Harder to optimize each output for its specific purpose
- ❌ More prone to format inconsistencies
- ❌ Difficult to debug when one part fails but not the other

**Implementation Complexity:** High - Complex prompt engineering and response parsing
**Time Estimate:** 4-5 hours including prompt optimization
**Risk Level:** Medium - Response format consistency issues

#### Option 3: Post-Processing Summarization
**Approach:** Keep existing comprehensive call, then use local AI or rules to generate concise version

**Pros:**
- ✅ No additional GenAI API costs
- ✅ Maintains existing functionality completely unchanged

**Cons:**
- ❌ Quality loss through summarization vs. purpose-built analysis
- ❌ Additional complexity in local AI integration
- ❌ Less optimal for embedding generation (generic summarization vs. concept-focused analysis)
- ❌ Requires additional dependencies or services

**Implementation Complexity:** High - Need local AI or complex rule-based summarization
**Time Estimate:** 5-6 hours
**Risk Level:** Medium - Quality concerns and dependency complexity

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Sequential Dual API Calls

**Why this is the best choice:**
1. **Quality Optimization** - Each API call can be precisely tuned for its purpose (comprehensive vs. concept-focused)
2. **Maintainability** - Clean separation allows independent optimization and debugging
3. **Reliability** - Proven pattern building on existing successful implementation
4. **Cost vs. Quality Trade-off** - Double API cost is justified by significantly better embedding quality

**Key Decision Factors:**
- **Performance Impact:** Minimal - still under 30-second processing target
- **User Experience:** Transparent - users get better search results from improved embeddings
- **Maintainability:** High - clear separation of concerns and purposes
- **Scalability:** Good - pattern scales well for future enhancements
- **Security:** Maintains existing security patterns

**Alternative Consideration:**
Option 2 could be viable if API costs become a significant concern, but the complexity and quality trade-offs make it less desirable for the initial implementation.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Sequential Dual API Calls), or would you prefer a different approach? 

**Questions for you to consider:**
- Are the doubled API costs acceptable for improved embedding quality?
- Do you have any concerns about processing time increasing slightly?
- Are there any specific requirements for the concise analysis format?

**Next Steps:**
Once you approve the strategic direction, I'll create the detailed implementation plan in the sections below.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Python-based RAG processor service with Google GenAI integration
- **Language:** Python with modern type annotations and Pydantic models
- **AI Integration:** Google GenAI package for Gemini 2.5 Flash model
- **Database & ORM:** PostgreSQL with direct psycopg2 connections and vector support
- **Embedding Service:** VertexAI multimodal embeddings (1408 dimensions)
- **Key Architectural Patterns:** Service-oriented architecture with dependency injection
- **Relevant Existing Components:** 
  - `ImageProcessingService` in `image_processing_service.py`
  - `DatabaseService` for chunk storage with dual embedding support
  - `ChunkData` model with text, metadata, context, and embedding fields

### Current State
The image processing service currently:
- Makes one comprehensive Gemini API call for detailed image analysis
- Stores result in the `content` field (max 1023 chars, truncated)
- Sets `context` field to `None` in ChunkData creation
- Generates multimodal embeddings using only the image file and content text
- The database schema already supports the `context` field but it's unused for images

---

## 4. Context & Problem Definition

### Problem Statement
The current image processing generates high-quality comprehensive analysis but lacks focused conceptual information needed for optimal multimodal embedding generation. The `context` field exists in the database but is unused for images, representing a missed opportunity to improve search quality by providing distilled, concept-focused content that better represents what makes each image distinctive and searchable.

### Success Criteria
- [ ] Two distinct Gemini API calls made for each image processing request
- [ ] `content` field continues to receive comprehensive analysis (existing functionality preserved)
- [ ] `context` field receives concise, concept-focused analysis (max 1023 chars, truncated)
- [ ] Multimodal embedding generation incorporates both image and context text
- [ ] Processing time remains under 30 seconds per image
- [ ] Error handling gracefully manages partial failures
- [ ] All existing tests continue to pass
- [ ] New context-generation functionality is thoroughly tested

---

## 5. Technical Requirements

### Functional Requirements
- ImageProcessingService makes two sequential Gemini API calls per image
- First call generates comprehensive analysis for `content` field (unchanged behavior)
- Second call generates concise concept-focused analysis for `context` field
- Both outputs are limited to 1023 UTF-8 characters (truncated if exceeded)
- Context field content is passed to embedding generation service
- Database storage populates both `content` and `context` fields
- File cleanup occurs after both API calls complete

### Non-Functional Requirements
- **Performance:** Total processing time under 30 seconds per image
- **Security:** Maintains existing GenAI authentication and file management patterns
- **Error Handling:** Graceful degradation if one API call fails
- **Logging:** Comprehensive logging for both API calls and truncation events
- **Resource Management:** Proper cleanup of uploaded GenAI files
- **Backward Compatibility:** Existing `content` field functionality unchanged

### Technical Constraints
- Must use existing Google GenAI client and authentication
- Must maintain existing error handling and retry patterns
- Must work within existing service architecture and dependency injection
- Cannot modify database schema (context field already exists)
- Must truncate outputs to 1023 characters for embedding compatibility

---

## 6. Data & Database Changes

### Database Schema Changes
No database schema changes required - the `context` field already exists in `document_chunks` table and is currently unused for images.

### Data Model Updates
**ChunkData Model Update:**
```python
# In processing_service.py _process_image method
chunk_data = ChunkData(
    text=content,                    # Comprehensive analysis
    metadata=metadata,
    context=context_content,         # NEW: Concise concept-focused analysis  
    text_embedding=text_embedding,   # Still None for images
    multimodal_embedding=multimodal_embedding,  # Now uses context in generation
)
```

**Embedding Service Integration:**
```python
# Multimodal embedding generation will now use context
embedding = await embedding_service.generate_multimodal_embedding(
    media_file_path=file_path,
    contextual_text=context_content,  # Changed from content to context
)
```

### Data Migration Plan
No migration required - existing images will continue to work with `context = NULL`, and new images will populate both fields.

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [ ] No new mutations required - existing document processing flow handles this

#### **QUERIES (Data Fetching)** → No changes required
- [ ] Existing query patterns remain unchanged

#### **API Routes** → No changes required  
- [ ] Existing processing endpoint continues to work

### Server Actions
No new server actions required - this is an internal service enhancement.

### Database Queries
**Updated Storage Logic:**
```python
# In DatabaseService.store_chunks method - already handles context field
cursor.executemany(
    """
    INSERT INTO document_chunks (
        id, content, chunk_index, text_embedding, multimodal_embedding, user_id, metadata,
        document_id, created_at, context
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """,
    chunk_records,  # context will now be populated instead of None
)
```

### External Integrations
- **Google GenAI:** Enhanced usage with dual API calls per image
- **VertexAI Multimodal Embeddings:** Updated to use context field for embedding generation

---

## 8. Frontend Changes

### New Components
No frontend changes required - this is a backend service enhancement that will improve search quality transparently.

### Page Updates
No page updates required.

### State Management
No frontend state changes required.

---

## 9. Implementation Plan

### Phase 1: Enhance Image Processing Service
**Goal:** Add second API call capability to ImageProcessingService

- [ ] **Task 1.1:** Create new method for concept-focused analysis
  - Files: `apps/rag-processor/rag_processor/services/image_processing_service.py`
  - Details: Add `_analyze_image_for_context()` method with concept-focused prompt
- [ ] **Task 1.2:** Create concept-focused prompt template
  - Files: `apps/rag-processor/rag_processor/services/image_processing_service.py`
  - Details: Add `_create_concept_focused_prompt()` method
- [ ] **Task 1.3:** Modify main analyze_image method to make dual calls
  - Files: `apps/rag-processor/rag_processor/services/image_processing_service.py`
  - Details: Update `analyze_image()` to return tuple of (content, context)

### Phase 2: Update Processing Service Integration
**Goal:** Modify processing service to handle dual outputs and update embedding generation

- [ ] **Task 2.1:** Update _process_image method in ProcessingService
  - Files: `apps/rag-processor/rag_processor/services/processing_service.py`
  - Details: Handle dual return values from image analysis service
- [ ] **Task 2.2:** Update embedding generation to use context
  - Files: `apps/rag-processor/rag_processor/services/processing_service.py`
  - Details: Pass context instead of content to multimodal embedding generation
- [ ] **Task 2.3:** Update ChunkData creation with context
  - Files: `apps/rag-processor/rag_processor/services/processing_service.py`
  - Details: Populate context field in ChunkData construction

### Phase 3: Testing and Validation
**Goal:** Comprehensive testing of dual API call functionality

- [ ] **Task 3.1:** Add unit tests for new image processing methods
  - Files: Create test files for new functionality
  - Details: Test both API calls, error handling, and truncation logic
- [ ] **Task 3.2:** Integration testing with real images
  - Files: Test with various image types and sizes
  - Details: Verify both fields populated correctly and embeddings generated
- [ ] **Task 3.3:** Performance testing and monitoring
  - Files: Monitor processing times and API call costs
  - Details: Ensure performance targets met

---

## 10. File Structure & Organization

### New Files to Create
```
apps/rag-processor/
├── tests/
│   ├── test_image_processing_dual_calls.py    # Unit tests for new functionality
│   └── test_integration_image_context.py      # Integration tests
```

### Files to Modify
- [ ] **`apps/rag-processor/rag_processor/services/image_processing_service.py`** - Add dual API call capability
- [ ] **`apps/rag-processor/rag_processor/services/processing_service.py`** - Update to handle dual outputs and context

### Dependencies to Add
No new dependencies required - using existing Google GenAI and VertexAI packages.

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **First API call succeeds, second fails** 
  - **Handling:** Store comprehensive analysis in content, set context to None, log warning
- [ ] **First API call fails, second succeeds**
  - **Handling:** Fail entire operation (content is required), cleanup uploaded file
- [ ] **Both API calls fail**
  - **Handling:** Raise ImageAnalysisError, cleanup uploaded file
- [ ] **Context content exceeds 1023 characters**
  - **Handling:** Truncate and log warning with original/truncated lengths

### Edge Cases
- [ ] **Empty or minimal image content**
  - **Solution:** Both prompts handle minimal content gracefully
- [ ] **Very large context response from Gemini**
  - **Solution:** Implement robust truncation with proper UTF-8 character boundary handling
- [ ] **GenAI file upload/cleanup failures**
  - **Solution:** Ensure cleanup happens in finally block after both calls

---

## 12. Security Considerations

### Authentication & Authorization
- [ ] Uses existing GenAI API key authentication
- [ ] Maintains existing service-level access controls
- [ ] No new authentication requirements

### Input Validation
- [ ] Image path validation remains unchanged
- [ ] Output sanitization through existing truncation logic
- [ ] Proper UTF-8 encoding handling for character limits

---

## 13. Deployment & Configuration

### Environment Variables
No new environment variables required - uses existing:
```bash
GEMINI_API_KEY=existing_api_key
PROJECT_ID=existing_project_id
```

---

## 14. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **IMPLEMENT PHASE 1 FIRST (Required)**
   - [ ] Create the concept-focused analysis method
   - [ ] Create the optimized prompt for key concepts
   - [ ] Modify analyze_image to return tuple (content, context)
   - [ ] Test that both API calls work correctly

2. **IMPLEMENT PHASE 2 SECOND (Required)**
   - [ ] Update processing service to handle dual outputs
   - [ ] Modify embedding generation to use context field
   - [ ] Update ChunkData creation with context
   - [ ] Verify database storage works correctly

3. **IMPLEMENT PHASE 3 THIRD (Required)**
   - [ ] Add comprehensive tests
   - [ ] Perform integration testing
   - [ ] Validate performance and monitoring

### Code Quality Standards
- [ ] Follow existing Python service patterns and error handling
- [ ] Add comprehensive logging for both API calls
- [ ] Include proper type annotations for all new methods
- [ ] Follow existing retry and cleanup patterns
- [ ] Ensure proper UTF-8 character truncation
- [ ] Maintain existing code style and documentation patterns

### Architecture Compliance
- [ ] **✅ VERIFY: Maintains existing service architecture patterns**
- [ ] **✅ VERIFY: Uses existing Google GenAI client and authentication**
- [ ] **✅ VERIFY: Follows existing error handling and logging patterns**
- [ ] **❌ AVOID: Adding unnecessary complexity or dependencies**

---

## 15. Detailed Implementation Specifications

### Concept-Focused Prompt Design
The second API call should use a prompt optimized for:
- **Key visual concepts and objects**
- **Distinctive features that make the image unique**
- **Searchable keywords and categories** 
- **Essential context for embedding generation**
- **Concise format under 1023 characters**

### Expected Output Format for Context Field
```
Key Concepts: [Main visual elements, objects, people]
Distinctive Features: [What makes this image unique/searchable]
Categories: [Type classification - photo, diagram, screenshot, etc.]
Context: [Setting, purpose, notable details]
```

### API Call Sequence Logic
```python
async def analyze_image(self, image_path: str, contextual_text: str | None = None) -> tuple[str, str]:
    """
    Analyze image with dual API calls for comprehensive and concept-focused analysis.
    
    Returns:
        tuple[str, str]: (comprehensive_content, concept_context)
    """
    # Upload file once
    genai_file = await self.file_manager.upload_and_wait(image_path, mime_type)
    
    try:
        # First call: comprehensive analysis (existing logic)
        content = await self._analyze_comprehensive(genai_file, contextual_text)
        
        # Second call: concept-focused analysis (new logic)
        context = await self._analyze_for_context(genai_file, contextual_text)
        
        return content, context
    finally:
        # Cleanup after both calls
        await self.file_manager.cleanup_file(genai_file)
```

---

## 16. Notes & Additional Context

### Performance Considerations
- Two API calls will roughly double processing time but should still remain well under 30 seconds
- Consider implementing parallel calls in future optimization if sequential proves too slow
- Monitor API costs and usage patterns after implementation

### Future Enhancements
- Could implement caching if same image processed multiple times
- Could optimize prompts based on usage analytics
- Could implement parallel API calls for better performance

---

*Template Version: 1.2*  
*Last Updated: January 18, 2025*  
*Task Number: 077* 
