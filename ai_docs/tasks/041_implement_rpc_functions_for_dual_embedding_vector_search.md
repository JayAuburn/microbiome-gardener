# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement PostgreSQL RPC Functions for Dual Embedding Vector Search

### Goal Statement
**Goal:** Create optimized PostgreSQL RPC functions to perform vector similarity search for both text and multimodal embeddings with user-level filtering. This will replace the current Drizzle-based vector search with database-optimized functions for better performance and cleaner code architecture.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (PostgreSQL) via Drizzle ORM with vector extensions
- **Vector Search:** PostgreSQL with pgvector extension, HNSW indexes
- **Embedding Models:** text-embedding-004 (768 dim) + multimodal-embedding-001 (1408 dim)
- **Key Architectural Patterns:** Dual embedding strategy, user-scoped data access
- **Relevant Existing Components:** 
  - `lib/search/text-search.ts` - Current text vector search
  - `lib/search/multimodal-search.ts` - Current multimodal vector search
  - `lib/drizzle/schema/document_chunks.ts` - Database schema with dual embeddings

### Current State
The system currently uses Drizzle ORM with raw SQL queries for vector similarity search. While functional, this approach has limitations:
- **Performance:** More data transfer between database and application
- **Complexity:** Vector search logic scattered across multiple TypeScript files
- **Optimization:** Database cannot fully optimize query execution plans
- **Maintenance:** Complex SQL embedded in TypeScript code

Current implementation performs dual searches in parallel but could benefit from database-level optimization.

## 3. Context & Problem Definition

### Problem Statement
The current vector search implementation uses Drizzle ORM with raw SQL queries, which results in:
1. **Suboptimal Performance:** Query execution and data transfer overhead
2. **Code Complexity:** Vector search logic spread across multiple files
3. **Maintenance Challenges:** Complex SQL embedded in TypeScript code
4. **Limited Optimization:** Database cannot fully optimize execution plans

By implementing PostgreSQL RPC functions, we can:
- Move computation to the database for better performance
- Encapsulate complex vector search logic in reusable functions
- Simplify the TypeScript codebase
- Enable database-level query optimization

### Success Criteria
- [ ] Two PostgreSQL RPC functions created: `match_text_chunks` and `match_multimodal_chunks`
- [ ] Functions perform user-scoped vector similarity search with configurable thresholds
- [ ] TypeScript services updated to use RPC functions instead of raw SQL
- [ ] Performance improvement in vector search operations
- [ ] Simplified and more maintainable codebase
- [ ] Template created for future RPC function implementations

---

## 4. Technical Requirements

### Functional Requirements
- **RPC Function 1:** `match_text_chunks` - Search text embeddings (768 dimensions)
- **RPC Function 2:** `match_multimodal_chunks` - Search multimodal embeddings (1408 dimensions)
- **User Filtering:** All searches must be scoped to the requesting user's documents
- **Similarity Thresholds:** Configurable similarity threshold to filter results
- **Result Limits:** Configurable maximum number of results returned
- **Content Type Filtering:** Optional filtering by content type (video, audio, image, document)
- **Metadata Inclusion:** Return chunk metadata along with similarity scores

### Non-Functional Requirements
- **Performance:** Faster than current Drizzle-based implementation
- **Security:** Functions must enforce user-level data access controls
- **Usability:** Simple, consistent API for both embedding types
- **Compatibility:** Work with existing HNSW indexes and vector operations
- **Error Handling:** Graceful handling of invalid inputs and edge cases

### Technical Constraints
- **Database:** Must work with PostgreSQL + pgvector extension
- **Existing Schema:** Cannot modify existing `document_chunks` table structure
- **User Scoping:** All operations must be filtered by `user_id`
- **Embedding Dimensions:** Fixed at 768 for text, 1408 for multimodal
- **Migration:** Use custom Drizzle migration for RPC function creation

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- RPC Function 1: Text Embedding Search (768 dimensions)
CREATE OR REPLACE FUNCTION match_text_chunks (
    query_embedding vector(768),
    p_user_id uuid,
    p_match_threshold float DEFAULT 0.7,
    p_match_count int DEFAULT 10,
    p_content_types text[] DEFAULT NULL
)
RETURNS TABLE (
    chunk_id uuid,
    document_id uuid,
    content text,
    similarity float,
    metadata jsonb,
    document_filename text,
    embedding_type text,
    created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id as chunk_id,
        dc.document_id,
        dc.content,
        (1 - (dc.text_embedding <=> query_embedding)) as similarity,
        dc.metadata,
        d.original_filename as document_filename,
        dc.embedding_type,
        dc.created_at
    FROM 
        document_chunks dc
    INNER JOIN 
        documents d ON dc.document_id = d.id
    WHERE 
        dc.user_id = p_user_id
        AND d.status = 'completed'
        AND dc.text_embedding IS NOT NULL
        AND (1 - (dc.text_embedding <=> query_embedding)) > p_match_threshold
        AND (p_content_types IS NULL OR dc.metadata->>'content_type' = ANY(p_content_types))
    ORDER BY 
        similarity DESC
    LIMIT p_match_count;
END;
$$;

-- RPC Function 2: Multimodal Embedding Search (1408 dimensions)
CREATE OR REPLACE FUNCTION match_multimodal_chunks (
    query_embedding vector(1408),
    p_user_id uuid,
    p_match_threshold float DEFAULT 0.7,
    p_match_count int DEFAULT 10,
    p_content_types text[] DEFAULT NULL
)
RETURNS TABLE (
    chunk_id uuid,
    document_id uuid,
    content text,
    similarity float,
    metadata jsonb,
    document_filename text,
    embedding_type text,
    created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id as chunk_id,
        dc.document_id,
        dc.content,
        (1 - (dc.multimodal_embedding <=> query_embedding)) as similarity,
        dc.metadata,
        d.original_filename as document_filename,
        dc.embedding_type,
        dc.created_at
    FROM 
        document_chunks dc
    INNER JOIN 
        documents d ON dc.document_id = d.id
    WHERE 
        dc.user_id = p_user_id
        AND d.status = 'completed'
        AND dc.multimodal_embedding IS NOT NULL
        AND (1 - (dc.multimodal_embedding <=> query_embedding)) > p_match_threshold
        AND (p_content_types IS NULL OR dc.metadata->>'content_type' = ANY(p_content_types))
    ORDER BY 
        similarity DESC
    LIMIT p_match_count;
END;
$$;
```

### Data Model Updates
```typescript
// New RPC result types
export interface RpcSearchResult {
  chunk_id: string;
  document_id: string;
  content: string;
  similarity: number;
  metadata: ChunkMetadata;
  document_filename: string;
  embedding_type: EmbeddingType;
  created_at: string;
}

// RPC function options
export interface RpcSearchOptions {
  user_id: string;
  match_threshold?: number;
  match_count?: number;
  content_types?: ContentType[];
}
```

### Data Migration Plan
- [ ] Create custom migration using `npm run db:generate:custom`
- [ ] Add RPC function definitions to migration file
- [ ] Test migration on development database
- [ ] Verify functions work correctly with existing data
- [ ] Plan rollback strategy if needed

---

## 6. API & Backend Changes

### Database Queries
- [ ] **RPC Functions in Database** - Complex vector search logic (user-scoped, similarity-based)
  - `match_text_chunks()` - Search text embeddings with user filtering
  - `match_multimodal_chunks()` - Search multimodal embeddings with user filtering

### Updated Search Services
- [ ] **lib/search/text-search.ts** - Update to use `match_text_chunks` RPC
- [ ] **lib/search/multimodal-search.ts** - Update to use `match_multimodal_chunks` RPC
- [ ] **lib/search/types.ts** - Add RPC result types and options

### External Integrations
- **Supabase Database:** Direct RPC function calls via Supabase client
- **pgvector Extension:** Leverages existing HNSW indexes for optimized vector search

---

## 7. Frontend Changes

### Updated Components
- [ ] **No direct UI changes required** - This is a backend optimization
- [ ] **Performance improvements** - Faster search results in chat interface
- [ ] **Error handling** - Better error messages from simplified search logic

### State Management
- No changes to existing state management - RPC functions are drop-in replacements

---

## 8. Implementation Plan

### Phase 1: Create RPC Functions
**Goal:** Implement PostgreSQL RPC functions for dual embedding search

- [ ] **Task 1.1:** Create custom migration for RPC functions
  - Files: `drizzle/migrations/XXXX_create_vector_search_rpc_functions.sql`
  - Details: Use `npm run db:generate:custom` to create migration
- [ ] **Task 1.2:** Define RPC function SQL
  - Files: Migration SQL file
  - Details: Create `match_text_chunks` and `match_multimodal_chunks` functions
- [ ] **Task 1.3:** Run migration and test functions
  - Files: Database schema
  - Details: Apply migration and verify functions work correctly

### Phase 2: Update TypeScript Services
**Goal:** Replace Drizzle queries with RPC function calls

- [ ] **Task 2.1:** Update text search service
  - Files: `lib/search/text-search.ts`
  - Details: Replace Drizzle query with Supabase RPC call
- [ ] **Task 2.2:** Update multimodal search service
  - Files: `lib/search/multimodal-search.ts`
  - Details: Replace Drizzle query with Supabase RPC call
- [ ] **Task 2.3:** Update search types
  - Files: `lib/search/types.ts`
  - Details: Add RPC result types and options

### Phase 3: Testing and Template Creation
**Goal:** Verify functionality and create reusable template

- [ ] **Task 3.1:** Test RPC functions with existing data
  - Files: Test various search scenarios
  - Details: Verify results match previous implementation
- [ ] **Task 3.2:** Performance testing
  - Files: Compare performance metrics
  - Details: Measure improvement over Drizzle implementation
- [ ] **Task 3.3:** Create RPC template for future use
  - Files: `apps/ai_docs/templates/rpc_function_template.md`
  - Details: Template for creating similar RPC functions

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── drizzle/migrations/
│   └── XXXX_create_vector_search_rpc_functions.sql    # Custom migration with RPC functions
├── apps/ai_docs/templates/
│   └── rpc_function_template.md                       # Reusable template for RPC functions
└── lib/search/
    ├── rpc-types.ts                                   # RPC-specific types (if needed)
    └── rpc-utils.ts                                   # RPC utility functions (if needed)
```

### Files to Modify
- [ ] **`lib/search/text-search.ts`** - Replace Drizzle query with RPC call
- [ ] **`lib/search/multimodal-search.ts`** - Replace Drizzle query with RPC call
- [ ] **`lib/search/types.ts`** - Add RPC result types and options
- [ ] **`lib/supabase/client.ts`** - Ensure RPC function support (if needed)

### Dependencies to Add
```json
{
  "dependencies": {
    // No new dependencies required - using existing Supabase client
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Invalid Embedding Dimensions:** RPC functions validate vector dimensions
  - **Handling:** Return descriptive error message, fallback to empty results
- [ ] **User Access Violation:** Ensure user can only access their own documents
  - **Handling:** Built-in user_id filtering prevents access violations
- [ ] **Database Connection Issues:** Handle Supabase RPC call failures
  - **Handling:** Graceful fallback, error logging, user notification

### Edge Cases
- [ ] **Empty Result Sets:** When no documents match the search criteria
  - **Solution:** Return empty array, log search parameters for debugging
- [ ] **Null Embeddings:** Handle cases where embedding is NULL
  - **Solution:** RPC functions filter out NULL embeddings automatically
- [ ] **Invalid Content Types:** When content_types filter contains invalid values
  - **Solution:** RPC functions ignore invalid content types, continue search

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **User Scoping:** All RPC functions require user_id parameter
- [ ] **Data Isolation:** Users can only search their own documents
- [ ] **Function Security:** RPC functions validate user access at database level

### Input Validation
- [ ] **Vector Validation:** Ensure embedding vectors have correct dimensions
- [ ] **Parameter Validation:** Validate threshold values and count limits
- [ ] **Content Type Validation:** Ensure valid content type filters

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# No new environment variables required
# Uses existing Supabase connection
```

### Migration Commands
```bash
# Generate custom migration
npm run db:generate:custom

# Apply migration
npm run db:migrate

# Check migration status
npm run db:status
```

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:** Task document created and awaiting approval for implementation.

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (✅ COMPLETED)**
   - [x] **Created task document** `041_implement_rpc_functions_for_dual_embedding_vector_search.md`
   - [x] **Filled out all sections** with specific RPC function requirements
   - [x] **Found latest task number** (040) and used next increment (041)
   - [x] **Presented summary** awaiting user approval

2. **GET APPROVAL SECOND (⏳ PENDING)**
   - [ ] **Wait for explicit user approval** before writing any code
   - [ ] **Incorporate user feedback** if requested
   - [ ] **Update task document** based on feedback

3. **IMPLEMENT THIRD (⏭️ NEXT)**
   - [ ] Create custom migration with RPC functions
   - [ ] Update TypeScript search services
   - [ ] Test and validate functionality
   - [ ] Create reusable RPC template

### Code Quality Standards
- [ ] Follow PostgreSQL best practices for RPC functions
- [ ] Ensure proper error handling and input validation
- [ ] Add comprehensive comments to SQL functions
- [ ] Test with various input scenarios
- [ ] Maintain consistency with existing codebase patterns

### Architecture Compliance
- [ ] **✅ VERIFIED: Using correct data access pattern**
  - [x] Database Functions → RPC for complex vector operations
  - [x] User Scoping → Built into RPC function parameters
  - [x] Type Safety → TypeScript interfaces for RPC results
- [ ] **✅ VERIFIED: No unnecessary API routes created**
- [ ] **✅ VERIFIED: Proper separation of concerns**

---

## 14. Notes & Additional Context

### Performance Expectations
- **Faster Query Execution:** Database-level optimization
- **Reduced Network Overhead:** Less data transfer
- **Better Resource Utilization:** Leverage database indices effectively

### Future Enhancements
- **Cross-Modal Search:** Potential for text queries against multimodal content
- **Advanced Filtering:** Additional metadata-based filtering options
- **Batch Operations:** Support for multiple query embeddings

### Reference Implementation
Based on the provided RPC function example but adapted for:
- Dual embedding architecture (text + multimodal)
- User-scoped data access
- Content type filtering
- Enhanced metadata support

---

*Template Version: 1.0*  
*Last Updated: December 2024*  
*Created By: AI Assistant* 
