# AI Task Template

> **Instructions:** This template addresses token limit compliance for transcript text embeddings in video and audio processing services using the existing database schema.

---

## 1. Task Overview

### Task Title
**Title:** Implement Token-Aware Chunking for Transcript Text Embeddings

### Goal Statement
**Goal:** Add intelligent chunking to video and audio processing services to split long transcript text into multiple token-safe chunks for `text-embedding-004` embeddings. This prevents embedding API failures by creating multiple `document_chunks` rows per media segment when transcript text exceeds the 2048 token limit, using the existing database schema without any modifications.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current video and audio processing services generate single `document_chunks` rows from transcript text without checking token limits. The `text-embedding-004` model has a hard limit of 2048 tokens, and long transcripts can exceed this limit causing embedding generation to fail. We need to implement intelligent chunking that preserves all transcript content by creating multiple database rows per media segment when needed.

**Current Behavior:**
- Video: 30-second segment → 1 `document_chunks` row with potentially long transcript
- Audio: Entire audio → 1 `document_chunks` row with potentially long transcript  

**Desired Behavior:**
- Video: 30-second segment → Multiple `document_chunks` rows if transcript > 2048 tokens
- Audio: Entire audio → Multiple `document_chunks` rows if transcript > 2048 tokens

### Solution Options Analysis

#### Option 1: Smart Token-Aware Chunking (RECOMMENDED)
**Approach:** Use the existing `GoogleTokenizer` from document processing service to chunk transcript text into multiple `document_chunks` rows when it exceeds token limits

**Pros:**
- ✅ Uses existing proven tokenizer pattern from document service
- ✅ Preserves ALL transcript content for comprehensive search
- ✅ Works with existing database schema (no migrations needed)
- ✅ Creates proper token-safe embeddings for each chunk
- ✅ Maintains video/audio segment context in metadata
- ✅ Supports existing search and retrieval patterns

**Cons:**
- ❌ Multiple database rows per media segment (but this is acceptable)
- ❌ Slightly more complex processing logic

**Implementation Complexity:** Medium - Reuse existing GoogleTokenizer with chunking logic
**Time Estimate:** 2-3 hours
**Risk Level:** Low - Uses proven patterns from document service

**Database Pattern:**
```sql
-- Long video transcript gets multiple rows:
Row 1: segment_1, text_chunk_1, text_embedding_1, multimodal_embedding_1
Row 2: segment_1, text_chunk_2, text_embedding_2, multimodal_embedding_1 (same)  
Row 3: segment_1, text_chunk_3, text_embedding_3, multimodal_embedding_1 (same)
```

#### Option 2: Simple Token-Aware Truncation  
**Approach:** Truncate transcript text to fit within token limits, losing excess content

**Pros:**
- ✅ Simple implementation
- ✅ One row per media segment (simpler data model)
- ✅ Fast processing

**Cons:**
- ❌ Loses transcript content for long videos/audio
- ❌ Poor user experience for content with important information at the end
- ❌ Defeats the purpose of comprehensive search capabilities

**Implementation Complexity:** Low
**Time Estimate:** 1 hour  
**Risk Level:** Low but loses data

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Smart Token-Aware Chunking

**Why this is the best choice:**
1. **Data Preservation** - Keeps all transcript content for comprehensive search
2. **Existing Schema** - Works perfectly with current `document_chunks` structure
3. **Proven Pattern** - Reuses successful tokenizer approach from document service
4. **Search Quality** - Multiple embeddings provide better search coverage
5. **User Experience** - Users can find content regardless of transcript length

**Key Decision Factors:**
- **No Database Changes Required** - Uses existing schema perfectly
- **Content Completeness** - Preserves all transcript data for search
- **Performance** - Multiple smaller embeddings often perform better than truncated ones
- **Maintainability** - Consistent with document processing patterns

---

## 3. Technical Architecture

### Current Processing Flow
```
Video/Audio File → Transcript Generation → Single document_chunks Row → Single text_embedding
```

### New Processing Flow  
```
Video/Audio File → Transcript Generation → Token Counting → 
├─ If ≤ 2047 tokens: Single document_chunks Row
└─ If > 2047 tokens: Multiple document_chunks Rows (one per text chunk)
```

### Database Usage (No Schema Changes)
**Existing `document_chunks` table handles this perfectly:**

```typescript
// Multiple rows for same video segment:
{
  id: "uuid1",
  content: "First part of transcript...",  // Chunk 1
  chunk_index: 0,
  metadata: { segment_index: 0, start_offset_sec: 0, end_offset_sec: 30, ... },
  text_embedding: [embedding_for_chunk_1],
  multimodal_embedding: [same_for_all_chunks]
}
{
  id: "uuid2", 
  content: "Second part of transcript...", // Chunk 2
  chunk_index: 1,
  metadata: { segment_index: 0, start_offset_sec: 0, end_offset_sec: 30, ... },
  text_embedding: [embedding_for_chunk_2],
  multimodal_embedding: [same_for_all_chunks]
}
```

**Key Points:**
- ✅ Same `multimodal_embedding` for all chunks of the same video segment
- ✅ Different `text_embedding` for each transcript chunk
- ✅ Same media metadata (segment timing, etc.) for all chunks
- ✅ Sequential `chunk_index` for proper ordering

---

## 4. Implementation Details

### Token Chunking Strategy
**Reuse Document Service Pattern:**
1. Extract `GoogleTokenizer` to shared utility (`rag_processor/utils/token_utils.py`)
2. Implement `chunk_text_by_tokens(text: str, max_tokens: int = 2047) -> List[str]`
3. Apply to transcript text before embedding generation

### Video Processing Service Updates
**File:** `rag_processor/services/video_processing_service.py`

**Current Logic:**
```python
# One chunk per video segment
chunk = create_chunk(segment_text, segment_metadata)
text_embedding = generate_text_embedding(segment_text)
multimodal_embedding = generate_multimodal_embedding(video_segment, context)
```

**New Logic:**
```python  
# Multiple chunks per video segment if needed
text_chunks = chunk_text_by_tokens(segment_text, max_tokens=2047)
multimodal_embedding = generate_multimodal_embedding(video_segment, context)

for i, text_chunk in enumerate(text_chunks):
    text_embedding = generate_text_embedding(text_chunk)
    chunk = create_chunk(
        content=text_chunk,
        chunk_index=i,
        text_embedding=text_embedding,
        multimodal_embedding=multimodal_embedding,  # Same for all chunks
        metadata=segment_metadata  # Same segment metadata
    )
```

### Audio Processing Service Updates  
**File:** `rag_processor/services/audio_processing_service.py`

**Similar pattern but simpler (no multimodal embeddings):**
```python
text_chunks = chunk_text_by_tokens(transcript_text, max_tokens=2047)

for i, text_chunk in enumerate(text_chunks):
    text_embedding = generate_text_embedding(text_chunk)
    chunk = create_chunk(
        content=text_chunk,
        chunk_index=i,
        text_embedding=text_embedding,
        multimodal_embedding=None,  # Audio doesn't use multimodal
        metadata=audio_metadata
    )
```

---

## 5. Data & Database Changes

### Database Schema Changes
**No database schema changes required** - the existing `document_chunks` table already supports this pattern perfectly:

- ✅ `content` field stores individual text chunks
- ✅ `chunk_index` provides ordering for multiple chunks  
- ✅ `text_embedding` stores embedding for each text chunk
- ✅ `multimodal_embedding` can be same for video chunks from same segment
- ✅ `metadata` JSONB stores media segment information
- ✅ Existing indexes support the query patterns

### Data Model Updates
**No data model changes required** - existing types in `document_chunks.ts` already handle this:

```typescript
// Multiple chunks for same video segment work with existing types:
VideoChunkMetadata {
  content_type: "video",
  segment_index: 0,  // Same for all chunks from this segment
  start_offset_sec: 0,
  end_offset_sec: 30,
  // ... other metadata
}
```

---

## 6. Implementation Plan

### Phase 1: Extract and Enhance Shared Utilities
**Goal:** Create reusable token chunking utility from existing document service pattern

- [ ] **Task 1.1:** Extract GoogleTokenizer to Shared Utility
  - Files: `rag_processor/utils/token_utils.py`
  - Details: Move `GoogleTokenizer` class from document service to shared utility
- [ ] **Task 1.2:** Create Text Chunking Function
  - Files: `rag_processor/utils/token_utils.py`  
  - Details: Add `chunk_text_by_tokens()` function that splits text into safe chunks
- [ ] **Task 1.3:** Update Document Service to Use Shared Utility
  - Files: `rag_processor/services/document_processing_service.py`
  - Details: Import and use shared tokenizer utility

### Phase 2: Update Video Processing Service
**Goal:** Implement transcript text chunking for video segments

- [ ] **Task 2.1:** Add Token Chunking to Video Processing
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Import token utils and chunk transcript text before embedding
- [ ] **Task 2.2:** Modify Chunk Creation Logic
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Create multiple `document_chunks` rows when transcript exceeds token limit
- [ ] **Task 2.3:** Preserve Multimodal Embeddings Across Text Chunks
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Ensure same multimodal embedding is used for all text chunks from same video segment

### Phase 3: Update Audio Processing Service  
**Goal:** Implement transcript text chunking for audio files

- [ ] **Task 3.1:** Add Token Chunking to Audio Processing
  - Files: `rag_processor/services/audio_processing_service.py`
  - Details: Import token utils and chunk transcript text before embedding
- [ ] **Task 3.2:** Modify Chunk Creation Logic
  - Files: `rag_processor/services/audio_processing_service.py`
  - Details: Create multiple `document_chunks` rows when transcript exceeds token limit

### Phase 4: Testing and Validation
**Goal:** Ensure chunking works correctly and doesn't break existing functionality

- [ ] **Task 4.1:** Test Video Processing with Long Transcripts
  - Details: Process videos with > 2048 token transcripts, verify multiple chunks created
- [ ] **Task 4.2:** Test Audio Processing with Long Transcripts  
  - Details: Process audio with > 2048 token transcripts, verify multiple chunks created
- [ ] **Task 4.3:** Verify Search Functionality
  - Details: Ensure search works across multiple chunks for same media segment
- [ ] **Task 4.4:** Test Embedding API Compliance
  - Details: Verify no more token limit errors from embedding API

---

## 7. Task Completion Tracking - MANDATORY WORKFLOW

### Phase 1: Extract and Enhance Shared Utilities
**Goal:** Create reusable token chunking utility from existing document service pattern

- [ ] **Task 1.1:** Extract GoogleTokenizer to Shared Utility
  - Files: `rag_processor/utils/token_utils.py`
  - Details: Move `GoogleTokenizer` class from document service to shared utility
- [ ] **Task 1.2:** Create Text Chunking Function  
  - Files: `rag_processor/utils/token_utils.py`
  - Details: Add `chunk_text_by_tokens()` function that splits text into safe chunks
- [ ] **Task 1.3:** Update Document Service to Use Shared Utility
  - Files: `rag_processor/services/document_processing_service.py`
  - Details: Import and use shared tokenizer utility

### Phase 2: Update Video Processing Service
**Goal:** Implement transcript text chunking for video segments

- [ ] **Task 2.1:** Add Token Chunking to Video Processing
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Import token utils and chunk transcript text before embedding
- [ ] **Task 2.2:** Modify Chunk Creation Logic
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Create multiple `document_chunks` rows when transcript exceeds token limit
- [ ] **Task 2.3:** Preserve Multimodal Embeddings Across Text Chunks
  - Files: `rag_processor/services/video_processing_service.py`
  - Details: Ensure same multimodal embedding is used for all text chunks from same video segment

### Phase 3: Update Audio Processing Service
**Goal:** Implement transcript text chunking for audio files

- [ ] **Task 3.1:** Add Token Chunking to Audio Processing
  - Files: `rag_processor/services/audio_processing_service.py`
  - Details: Import token utils and chunk transcript text before embedding
- [ ] **Task 3.2:** Modify Chunk Creation Logic
  - Files: `rag_processor/services/audio_processing_service.py`
  - Details: Create multiple `document_chunks` rows when transcript exceeds token limit

### Phase 4: Testing and Validation
**Goal:** Ensure chunking works correctly and doesn't break existing functionality

- [ ] **Task 4.1:** Test Video Processing with Long Transcripts
  - Details: Process videos with > 2048 token transcripts, verify multiple chunks created
- [ ] **Task 4.2:** Test Audio Processing with Long Transcripts
  - Details: Process audio with > 2048 token transcripts, verify multiple chunks created
- [ ] **Task 4.3:** Verify Search Functionality  
  - Details: Ensure search works across multiple chunks for same media segment
- [ ] **Task 4.4:** Test Embedding API Compliance
  - Details: Verify no more token limit errors from embedding API

---

## 8. Expected Outcomes

### Success Criteria
1. **No Token Limit Errors** - Video and audio processing no longer fails due to embedding token limits
2. **Complete Content Preservation** - All transcript content is preserved and searchable
3. **Existing Functionality Maintained** - Current search and retrieval patterns continue to work
4. **Performance Maintained** - Processing speed is not significantly impacted

### Validation Tests
```python
# Test cases to validate implementation:

# 1. Short transcript (under 2047 tokens) - should create 1 chunk
short_video = process_video_with_short_transcript()
assert len(chunks) == 1

# 2. Long transcript (over 2047 tokens) - should create multiple chunks  
long_video = process_video_with_long_transcript()
assert len(chunks) > 1
assert all(count_tokens(chunk.content) <= 2047 for chunk in chunks)

# 3. All chunks from same segment share multimodal embedding
assert all(chunk.multimodal_embedding == chunks[0].multimodal_embedding for chunk in chunks)

# 4. Search works across all chunks
search_results = search_transcript_content("keyword from middle of long transcript")
assert len(search_results) > 0
```

### Performance Impact
- **Processing Time** - Minimal increase due to token counting and chunking
- **Storage** - Slight increase in database rows for long transcripts (acceptable)
- **Search Quality** - Improved due to better embedding coverage of long content
- **API Reliability** - Significantly improved due to elimination of token limit errors

---

## 9. Notes and Considerations

### Why This Approach Works Best
1. **No Database Migrations** - Uses existing schema that was designed for this flexibility
2. **Proven Pattern** - Document service already demonstrates this chunking approach works
3. **Search Compatibility** - Multiple chunks per media segment actually improves search coverage
4. **Gradual Implementation** - Can be implemented incrementally without breaking existing functionality

### Future Enhancements
- **Smart Chunking Boundaries** - Could enhance to split at sentence boundaries for better semantic coherence
- **Chunk Overlap** - Could add small overlaps between chunks to preserve context across boundaries
- **Dynamic Token Limits** - Could adjust limits based on embedding model capabilities

### Monitoring and Observability
- **Log chunking statistics** - Track how often chunking is needed and chunk counts
- **Monitor embedding API success rates** - Ensure token limit errors are eliminated
- **Track search performance** - Verify search quality across chunked content 
