# PostgreSQL RPC Function Template

> **Purpose:** This template provides a standardized approach for implementing PostgreSQL RPC functions in the RAG-SaaS application. Use this template when you need to move complex database operations from TypeScript to PostgreSQL for performance optimization.

---

## When to Use RPC Functions

### ✅ **Good Candidates for RPC Functions:**
- Complex queries with multiple JOINs and WHERE conditions
- Vector similarity search operations
- Aggregate calculations that benefit from database optimization
- Operations that process large amounts of data
- User-scoped queries that need consistent access control
- **Multimodal RAG operations** that need both content and context for comprehensive search

### ❌ **Not Suitable for RPC Functions:**
- Simple single-table queries
- Operations that primarily transform data in TypeScript
- Functions that need complex business logic better handled in code
- Operations that require external API calls

### 🎯 **Multimodal RAG Capabilities**
The current RPC functions support **comprehensive video RAG** by returning both:
- **`content`**: Transcribed audio content (what was said)
- **`context`**: Visual descriptions and contextual information (what was shown)

This enables queries like:
- *"What error appeared on screen?"* → Matches visual context
- *"What were the sales numbers shown in the chart?"* → Matches visual data
- *"Show me discussions about database errors"* → Matches audio + visual content

**Key Benefits:**
- **Disconnected Streams**: Handles scenarios where audio and visual content are completely different
- **Visual-Only Queries**: Enables searches for content that was only shown, not spoken
- **Enhanced Search Accuracy**: Combines both modalities for more comprehensive results

---

## Implementation Steps

### Step 1: Create Custom Migration

```bash
# Generate custom migration
npm run db:generate:custom
```

### Step 2: Define RPC Function in Migration

**Template Structure:**
```sql
-- Custom SQL migration file, put your code below! --

-- RPC Function: [Function Name]
-- Description: [What this function does and why it's needed]
CREATE OR REPLACE FUNCTION [function_name] (
    -- Parameters with appropriate types
    [param1_name] [param1_type],
    [param2_name] [param2_type] DEFAULT [default_value],
    -- Always include user_id for access control
    p_user_id uuid,
    -- Optional parameters for filtering/limits
    p_limit int DEFAULT 10,
    p_threshold float DEFAULT 0.7
)
RETURNS TABLE (
    -- Return columns matching your needs
    [column1_name] [column1_type],
    [column2_name] [column2_type],
    -- Always include metadata for debugging
    created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Your SELECT columns
        [table_alias].[column1] as [column1_name],
        [table_alias].[column2] as [column2_name],
        [table_alias].created_at
    FROM 
        [main_table] [table_alias]
    INNER JOIN 
        [related_table] [related_alias] ON [join_condition]
    WHERE 
        -- ALWAYS include user scoping first
        [table_alias].user_id = p_user_id
        -- Add other conditions
        AND [other_conditions]
        -- Add parameter-based filtering
        AND ([param_conditions])
    ORDER BY 
        [sort_column] [sort_direction]
    LIMIT p_limit;
END;
$$;
```

### Step 3: Apply Migration

```bash
# Apply migration
npm run db:migrate

# Verify migration status
npm run db:status
```

### Step 4: Create TypeScript Types

**Add to `lib/search/types.ts` (or appropriate types file):**
```typescript
// RPC-specific result type
export interface [FunctionName]RpcResult {
  [column1_name]: string;
  [column2_name]: number;
  context?: string;
  created_at: string;
}

// RPC function options
export interface [FunctionName]RpcOptions {
  user_id: string;
  [param1_name]?: [param1_type];
  [param2_name]?: [param2_type];
  limit?: number;
  threshold?: number;
}
```

### Step 5: Create Service Function

**Create or update service file:**
```typescript
import { createClient } from "../supabase/server";
import { [FunctionName]RpcResult, [FunctionName]RpcOptions } from "./types";

export async function [serviceFunctionName](
  [primaryParam]: [primaryParamType],
  options: [FunctionName]RpcOptions
): Promise<[ReturnType][]> {
  const {
    user_id,
    [param1_name] = [default_value],
    [param2_name] = [default_value],
    limit = 10,
    threshold = 0.7,
  } = options;

  console.log("[Service function name] via RPC:", {
    [primaryParam]: [primaryParam],
    user_id,
    limit,
    threshold,
  });

  try {
    // Create Supabase client
    const supabase = await createClient();

    // Call RPC function
    const { data: results, error } = await supabase.rpc("[rpc_function_name]", {
      [param1_name]: [param1_name],
      [param2_name]: [param2_name],
      p_user_id: user_id,
      p_limit: limit,
      p_threshold: threshold,
    });

    if (error) {
      console.error("RPC [function name] error:", error);
      throw new Error(`RPC [function name] failed: ${error.message}`);
    }

    if (!results) {
      console.log("No results from RPC [function name]");
      return [];
    }

    // Format results if needed
    const formattedResults: [ReturnType][] = results.map((result: [FunctionName]RpcResult) => ({
      // Transform RPC result to expected format
      [field1]: result.[column1_name],
      [field2]: result.[column2_name],
      // ... other transformations
    }));

    console.log("[Service function name] completed via RPC:", {
      resultCount: formattedResults.length,
    });

    return formattedResults;
  } catch (error) {
    console.error("[Service function name] failed:", error);
    throw new Error(`[Service function name] failed: ${error}`);
  }
}
```

---

## Best Practices

### Security
- **Always include user_id filtering** in WHERE clause as the first condition
- **Validate parameters** at the database level when possible
- **Use prepared statements** (handled automatically by Supabase RPC)
- **Prefix parameters** with `p_` to avoid naming conflicts

### Performance
- **Order by indexed columns** when possible
- **Use appropriate LIMIT clauses** to prevent large result sets
- **Consider database indexes** for frequently queried columns
- **Use column filters over JSON metadata filters** when possible (e.g., `embedding_type` column vs `metadata->>'content_type'`)
- **Leverage existing IS NOT NULL checks** instead of redundant filtering

### Error Handling
- **Check for RPC errors** before processing results
- **Provide meaningful error messages** for debugging
- **Handle null/empty results** gracefully
- **Test edge cases** like empty arrays or null parameters

### Maintainability
- **Document function purpose** in migration comments
- **Use descriptive parameter names** with `p_` prefix
- **Include created_at** or timestamp fields for debugging
- **Keep functions focused** on single responsibilities
- **Create down migrations** for all RPC function changes
- **Prefer direct column filtering** over JSON metadata queries for better performance

### Parameter Design
- **Use arrays for multiple values**: For filtering by multiple criteria
- **Default to NULL for optional filtering**: Allows "no filter" behavior
- **Consider performance implications**: Column filters (fast) vs JSON metadata filters (slower)
- **Use embedding column existence**: `text_embedding IS NOT NULL` instead of separate type columns

---

## Example: Dual Embedding Vector Search RPC Functions

### Migration SQL
```sql
-- RPC Function 1: Vector Search for Text Embeddings (768 dimensions)
-- Performs vector similarity search with user-level access control
-- Uses embedding column existence for natural filtering
-- Returns both content (transcription) and context (visual descriptions) for multimodal RAG
CREATE OR REPLACE FUNCTION match_text_chunks (
    query_embedding vector(768),
    p_user_id uuid,
    p_match_threshold float DEFAULT 0.7,
    p_match_count int DEFAULT 10
)
RETURNS TABLE (
    chunk_id uuid,
    document_id uuid,
    content text,
    context text,
    similarity float,
    metadata jsonb,
    document_filename text,
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
        dc.context,
        (1 - (dc.text_embedding <=> query_embedding)) as similarity,
        dc.metadata,
        d.original_filename as document_filename,
        dc.created_at
    FROM 
        document_chunks dc
    INNER JOIN 
        documents d ON dc.document_id = d.id
    WHERE 
        -- CRITICAL: User scoping first
        dc.user_id = p_user_id
        AND d.status = 'completed'
        -- Text embedding existence check (natural filtering)
        AND dc.text_embedding IS NOT NULL
        -- Similarity threshold
        AND (1 - (dc.text_embedding <=> query_embedding)) > p_match_threshold
    ORDER BY 
        similarity DESC
    LIMIT p_match_count;
END;
$$;

-- RPC Function 2: Vector Search for Multimodal Embeddings (1408 dimensions)
-- Performs vector similarity search for combined visual + text content
-- Uses embedding column existence for natural filtering
-- Returns both content (transcription) and context (visual descriptions) for multimodal RAG
CREATE OR REPLACE FUNCTION match_multimodal_chunks (
    query_embedding vector(1408),
    p_user_id uuid,
    p_match_threshold float DEFAULT 0.7,
    p_match_count int DEFAULT 10
)
RETURNS TABLE (
    chunk_id uuid,
    document_id uuid,
    content text,
    context text,
    similarity float,
    metadata jsonb,
    document_filename text,
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
        dc.context,
        (1 - (dc.multimodal_embedding <=> query_embedding)) as similarity,
        dc.metadata,
        d.original_filename as document_filename,
        dc.created_at
    FROM 
        document_chunks dc
    INNER JOIN 
        documents d ON dc.document_id = d.id
    WHERE 
        -- CRITICAL: User scoping first
        dc.user_id = p_user_id
        AND d.status = 'completed'
        -- Multimodal embedding existence check (natural filtering)
        AND dc.multimodal_embedding IS NOT NULL
        -- Similarity threshold
        AND (1 - (dc.multimodal_embedding <=> query_embedding)) > p_match_threshold
    ORDER BY 
        similarity DESC
    LIMIT p_match_count;
END;
$$;
```

### Key Design Decisions
1. **Dual Function Approach**: Separate functions for text (768 dim) and multimodal (1408 dim) embeddings
2. **Natural Filtering**: Use embedding column existence (`text_embedding IS NOT NULL`, `multimodal_embedding IS NOT NULL`) instead of separate type columns
3. **Simplified Parameters**: Removed redundant embedding type filtering
4. **Clear Comments**: Explain the purpose of each WHERE condition  
5. **Performance**: Embedding column existence check is fastest possible filter
6. **Consistent Interface**: Both functions return the same table structure for easy interchangeability

### TypeScript Services
```typescript
import { createClient } from "../supabase/server";
import { SearchOptions, SearchResult, RpcSearchResult } from "./types";

// Text Embedding Search Service (768 dimensions)
export async function searchTextChunks(
  queryEmbedding: number[],
  options: SearchOptions
): Promise<SearchResult[]> {
  const { limit = 10, similarity_threshold = 0.7, user_id } = options;

  console.log("Searching text chunks via RPC:", {
    embeddingDimensions: queryEmbedding.length,
    limit,
    similarity_threshold,
    user_id,
  });

  try {
    // Convert embedding to PostgreSQL vector format
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    // Create Supabase client
    const supabase = await createClient();

    // Call RPC function (naturally filters to text embeddings)
    const { data: searchResults, error } = await supabase.rpc("match_text_chunks", {
      query_embedding: embeddingString,
      p_user_id: user_id,
      p_match_threshold: similarity_threshold,
      p_match_count: limit,
    });

    if (error) {
      console.error("RPC text search error:", error);
      throw new Error(`RPC text search failed: ${error.message}`);
    }

    if (!searchResults) {
      console.log("No results from RPC text search");
      return [];
    }

    // Format results to match SearchResult interface
    const formattedResults: SearchResult[] = searchResults.map(
      (result: RpcSearchResult) => ({
        chunk_id: result.chunk_id,
        content: result.content,
        context: result.context, // Include context for multimodal RAG
        similarity: result.similarity,
        metadata: result.metadata,
        document_filename: result.document_filename,
        document_id: result.document_id,
      })
    );

    console.log("Text search completed via RPC:", {
      resultCount: formattedResults.length,
    });

    return formattedResults;
  } catch (error) {
    console.error("Text search failed:", error);
    throw new Error(`Text search failed: ${error}`);
  }
}

// Multimodal Embedding Search Service (1408 dimensions)
export async function searchMultimodalChunks(
  queryEmbedding: number[],
  options: SearchOptions
): Promise<SearchResult[]> {
  const { limit = 10, similarity_threshold = 0.7, user_id } = options;

  console.log("Searching multimodal chunks via RPC:", {
    embeddingDimensions: queryEmbedding.length,
    limit,
    similarity_threshold,
    user_id,
  });

  try {
    // Convert embedding to PostgreSQL vector format
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    // Create Supabase client
    const supabase = await createClient();

    // Call RPC function (naturally filters to multimodal embeddings)
    const { data: searchResults, error } = await supabase.rpc("match_multimodal_chunks", {
      query_embedding: embeddingString,
      p_user_id: user_id,
      p_match_threshold: similarity_threshold,
      p_match_count: limit,
    });

    if (error) {
      console.error("RPC multimodal search error:", error);
      throw new Error(`RPC multimodal search failed: ${error.message}`);
    }

    if (!searchResults) {
      console.log("No results from RPC multimodal search");
      return [];
    }

    // Format results to match SearchResult interface
    const formattedResults: SearchResult[] = searchResults.map(
      (result: RpcSearchResult) => ({
        chunk_id: result.chunk_id,
        content: result.content,
        context: result.context, // Include context for multimodal RAG
        similarity: result.similarity,
        metadata: result.metadata,
        document_filename: result.document_filename,
        document_id: result.document_id,
      })
    );

    console.log("Multimodal search completed via RPC:", {
      resultCount: formattedResults.length,
    });

    return formattedResults;
  } catch (error) {
    console.error("Multimodal search failed:", error);
    throw new Error(`Multimodal search failed: ${error}`);
  }
}
```

### Key TypeScript Patterns
1. **Dual Service Functions**: Separate services for text and multimodal search with consistent interfaces
2. **Simplified imports**: Remove unnecessary constants when using natural filtering
3. **Comprehensive logging**: Include relevant debugging information and embedding dimensions
4. **Error handling**: Distinguish RPC errors from other failures with descriptive messages
5. **Type safety**: Explicit type casting and proper interfaces
6. **Result formatting**: Map RPC results to standard interface for both search types
7. **Embedding Format**: Convert number arrays to PostgreSQL vector string format

---

## Testing Checklist

- [ ] Migration applies successfully
- [ ] RPC function can be called from database console
- [ ] TypeScript service compiles without errors
- [ ] Function handles user scoping correctly
- [ ] Function handles edge cases (null inputs, empty results)
- [ ] Performance is improved over previous implementation
- [ ] Error handling works as expected

---

## Migration Considerations

### When to Modify RPC Functions
- **Parameter changes**: Adding, removing, or renaming parameters
- **Performance optimization**: Switching from JSON metadata to column filtering
- **Logic changes**: Updating WHERE conditions or calculations
- **Return type changes**: Adding or removing returned columns

### Migration Strategy
1. **Function replacement**: Use `CREATE OR REPLACE FUNCTION` for changes
2. **Backward compatibility**: Consider if calling code needs updates
3. **Performance testing**: Verify function performance before deploying
4. **Rollback preparation**: Always create down migration

### Parameter Design Patterns
```sql
-- Pattern 1: JSON metadata filtering (flexible but slower)
p_content_types text[] -- Filters by metadata->>'content_type'

-- Pattern 2: Natural filtering (fastest and simplest)
-- No parameter needed, function inherently filters by embedding column existence
-- WHERE text_embedding IS NOT NULL (for text search)
-- WHERE multimodal_embedding IS NOT NULL (for multimodal search)
```

## Rollback Strategy

If the RPC function needs to be removed or modified:

1. **Create down migration** following `drizzle_down_migration.md` template
2. **Update TypeScript code** to match modified function signature
3. **Keep previous TypeScript implementation** as backup
4. **Test rollback** in development environment first
5. **Document the reason** for changes in down migration comments

---

*Template Version: 1.0*  
*Last Updated: December 2024*  
*Created for RAG-SaaS Project* 
