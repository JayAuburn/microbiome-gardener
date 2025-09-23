# Implement Dual Embedding Search API

> **Instructions:** This task implements comprehensive search functionality that uses both text and multimodal embeddings to search across all document types with proper dimensional consistency.

---

## 1. Task Overview

### Task Title
**Title:** Implement Dual Embedding Search API with Text and Multimodal Support

### Goal Statement
**Goal:** Build a robust search API that generates both text (768d) and multimodal (1408d) query embeddings, performs separate vector searches against each embedding type, and combines results for comprehensive document search across text, images, audio, and video content.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM with pgvector
- **Vector Storage:** Separate text_embedding (768d) and multimodal_embedding (1408d) columns
- **AI Models:** text-embedding-004 (text) and multimodalembedding@001 (multimodal)
- **Authentication:** Google Cloud Service Account for Vertex AI access
- **Relevant Existing Components:** 
  - `app/api/search/route.ts` - Current incomplete search implementation
  - `lib/drizzle/schema/document_chunks.ts` - Dual embedding schema

### Current State
The current search API has TypeScript errors due to missing embedding fields and incomplete Google Cloud authentication. It attempts to use a single embedding approach but the database schema supports dual embeddings (text + multimodal) with different dimensions. The search needs to generate two query embeddings and run two separate vector searches for comprehensive results.

## 3. Context & Problem Definition

### Problem Statement
Users need to search across all document types (text, images, audio, video) but the current search API only supports single embedding queries. The database schema supports dual embeddings with different dimensions (768d text, 1408d multimodal), but the search logic doesn't leverage this capability. Additionally, dimension mismatches occur when trying to compare embeddings of different sizes.

### Success Criteria
- [ ] Search API generates both text and multimodal query embeddings
- [ ] Separate vector searches performed against appropriate embedding columns
- [ ] Results combined and ranked by similarity scores
- [ ] Proper Google Cloud authentication for embedding generation
- [ ] Type-safe implementation with no TypeScript errors
- [ ] Comprehensive search across all content types

---

## 4. Technical Requirements

### Functional Requirements
- Generate text embedding (768d) using text-embedding-004 model
- Generate multimodal embedding (1408d) using multimodalembedding@001 model
- Search text chunks using text_embedding column with text query embedding
- Search multimodal chunks using multimodal_embedding column with multimodal query embedding
- Combine and rank results from both searches by similarity score
- Return unified search results with proper metadata

### Non-Functional Requirements
- **Performance:** Search responses within 3 seconds
- **Accuracy:** Proper dimensional consistency (768d <=> 768d, 1408d <=> 1408d)
- **Security:** Secure Google Cloud authentication
- **Scalability:** Support for large document collections
- **Responsive Design:** N/A (API only)
- **Theme Support:** N/A (API only)
- **Compatibility:** Works with existing document processing pipeline

### Technical Constraints
- Must use existing Google Cloud Service Account authentication
- Must maintain compatibility with existing document_chunks schema
- Must use pgvector for similarity calculations
- Cannot modify embedding dimensions (768d and 1408d are fixed)

---

## 5. Data & Database Changes

### Database Schema Changes
No database changes required - the dual embedding schema already exists in `document_chunks`:

```sql
-- Existing schema already supports dual embeddings
text_embedding vector(768)
multimodal_embedding vector(1408) 
embedding_type varchar(20)
```

### Data Model Updates
```typescript
// Search request interface
interface SearchRequest {
  query: string;
  limit?: number;
  similarity_threshold?: number;
  content_types?: ContentType[]; // Filter by content type
}

// Combined search results
interface SearchResult {
  chunk_id: string;
  content: string;
  similarity: number;
  embedding_type: 'text' | 'multimodal';
  metadata: ChunkMetadata;
  document_filename: string;
  document_id: string;
}

// Search response
interface SearchResponse {
  results: SearchResult[];
  query: string;
  total_results: number;
  text_results_count: number;
  multimodal_results_count: number;
}
```

---

## 6. API & Backend Changes

### API Route Updates
- [ ] **`app/api/search/route.ts`** - Complete rewrite with dual embedding support

### Google Cloud Integration
- [ ] **Text Embedding Generation** - Call text-embedding-004 via Vertex AI
- [ ] **Multimodal Embedding Generation** - Call multimodalembedding@001 via Vertex AI
- [ ] **Authentication** - Use GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY for API calls

### Search Algorithm
```typescript
async function performDualEmbeddingSearch(query: string, options: SearchOptions) {
  // 1. Generate both query embeddings in parallel
  const [textEmbedding, multimodalEmbedding] = await Promise.all([
    generateTextEmbedding(query),     // 768d
    generateMultimodalEmbedding(query) // 1408d
  ]);
  
  // 2. Run parallel vector searches
  const [textResults, multimodalResults] = await Promise.all([
    searchTextChunks(textEmbedding, options),
    searchMultimodalChunks(multimodalEmbedding, options)
  ]);
  
  // 3. Combine and rank results
  return combineAndRankResults(textResults, multimodalResults);
}
```

---

## 7. Frontend Changes

### No Frontend Changes Required
This is a backend API implementation only. The existing chat interface and search components will consume the improved API without changes.

---

## 8. Implementation Plan

### Phase 1: Google Cloud Authentication Setup
**Goal:** Establish proper authentication for Vertex AI embedding services

- [ ] **Task 1.1:** Add Google Cloud authentication helper
  - Files: `lib/google-cloud-auth.ts`
  - Details: Service account authentication for Vertex AI API calls
- [ ] **Task 1.2:** Test authentication with simple API call
  - Files: Test script or API route
  - Details: Verify service account can access Vertex AI

### Phase 2: Embedding Generation Functions
**Goal:** Create separate functions for text and multimodal embedding generation

- [ ] **Task 2.1:** Implement text embedding generation
  - Files: `lib/embeddings/text-embeddings.ts`
  - Details: Call text-embedding-004 model, return 768d vector
- [ ] **Task 2.2:** Implement multimodal embedding generation  
  - Files: `lib/embeddings/multimodal-embeddings.ts`
  - Details: Call multimodalembedding@001 model, return 1408d vector
- [ ] **Task 2.3:** Add error handling and retries
  - Files: Both embedding files
  - Details: Robust error handling, rate limiting, fallbacks

### Phase 3: Dual Search Implementation
**Goal:** Build the core search logic with dual embedding support

- [ ] **Task 3.1:** Implement text chunk search
  - Files: `lib/search/text-search.ts`
  - Details: Vector search against text_embedding column
- [ ] **Task 3.2:** Implement multimodal chunk search
  - Files: `lib/search/multimodal-search.ts` 
  - Details: Vector search against multimodal_embedding column
- [ ] **Task 3.3:** Build result combination logic
  - Files: `lib/search/search-combiner.ts`
  - Details: Merge, rank, and deduplicate results

### Phase 4: API Route Implementation
**Goal:** Complete the search API route with all functionality

- [ ] **Task 4.1:** Rewrite search API route
  - Files: `app/api/search/route.ts`
  - Details: Integrate all search components, proper error handling
- [ ] **Task 4.2:** Add comprehensive input validation
  - Files: `app/api/search/route.ts`
  - Details: Zod schemas, parameter validation, security checks
- [ ] **Task 4.3:** Implement response formatting
  - Files: `app/api/search/route.ts`
  - Details: Consistent response structure, proper metadata

### Phase 5: Testing and Optimization
**Goal:** Ensure reliable performance and accuracy

- [ ] **Task 5.1:** Add comprehensive error handling
- [ ] **Task 5.2:** Test with various content types
- [ ] **Task 5.3:** Performance optimization and caching
- [ ] **Task 5.4:** Add request rate limiting

---

## 9. File Structure & Organization

### New Files to Create
```
apps/web/
├── lib/
│   ├── google-cloud-auth.ts           # Google Cloud authentication
│   ├── embeddings/
│   │   ├── text-embeddings.ts         # Text embedding generation
│   │   ├── multimodal-embeddings.ts   # Multimodal embedding generation
│   │   └── types.ts                   # Shared embedding types
│   └── search/
│       ├── text-search.ts             # Text vector search
│       ├── multimodal-search.ts       # Multimodal vector search
│       ├── search-combiner.ts         # Result combination
│       └── types.ts                   # Search types
└── app/api/search/
    └── route.ts                       # Complete API implementation
```

### Files to Modify
- [ ] **`app/api/search/route.ts`** - Complete rewrite with dual embedding support
- [ ] **`lib/env.ts`** - Add any missing environment variables for Google Cloud

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Google Cloud API authentication fails
  - **Handling:** Retry with exponential backoff, fallback to cached embeddings
- [ ] **Error 2:** Embedding generation rate limits hit
  - **Handling:** Queue requests, implement request batching
- [ ] **Error 3:** Vector search returns no results
  - **Handling:** Return empty results with helpful message
- [ ] **Error 4:** Dimension mismatch in vector operations
  - **Handling:** Validate embedding dimensions before search

### Edge Cases
- [ ] **Edge Case 1:** Query text is empty or too short
  - **Solution:** Return validation error with minimum length requirement
- [ ] **Edge Case 2:** No documents exist for user
  - **Solution:** Return empty results gracefully
- [ ] **Edge Case 3:** Database connection fails during search
  - **Solution:** Return service unavailable with retry suggestion

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] User can only search their own documents (user_id filtering)
- [ ] Google Cloud API credentials securely managed
- [ ] No sensitive document content exposed in logs

### Input Validation
- [ ] Query text sanitized and length-limited
- [ ] Search parameters validated (limit, threshold ranges)
- [ ] SQL injection prevention through parameterized queries

---

## 12. Environment Variables

### Required Environment Variables
```bash
# Already exist in .env.local
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY=base64_encoded_key_json
```

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
Task document created for future implementation.

### Implementation Approach - CRITICAL WORKFLOW
🚨 **NOT FOR IMMEDIATE IMPLEMENTATION:**
- [ ] **Task document created** - For future sprint
- [ ] **Current focus** - Continue with usage tracking error fixes
- [ ] **Implementation phases defined** - Ready for future development

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add comprehensive error handling and logging
- [ ] Include proper input validation and sanitization
- [ ] Use proper async/await patterns for API calls
- [ ] Implement retry logic for external API calls
- [ ] Add comprehensive unit tests for all functions

---

## 14. Notes & Additional Context

### Key Technical Details
1. **Dimensional Consistency**: 
   - Text queries → text embeddings (768d <=> 768d)
   - Multimodal queries → multimodal embeddings (1408d <=> 1408d)

2. **Search Strategy**:
   - Generate both embedding types from same query text
   - Run parallel searches against appropriate columns
   - Combine results with unified ranking

3. **Google Cloud Models**:
   - text-embedding-004: For text content, 768 dimensions
   - multimodalembedding@001: For images/video/audio, 1408 dimensions

### Performance Considerations
- Parallel embedding generation and searches for speed
- Consider caching frequent query embeddings
- Implement connection pooling for database queries
- Add request rate limiting to prevent abuse

### Future Enhancements
- Semantic search across document relationships
- Advanced filtering by content type, date, file size
- Search result highlighting and snippets
- Search analytics and query optimization

---

*Template Version: 1.0*  
*Last Updated: 6/23/2025*  
*Created By: AI Assistant* 
