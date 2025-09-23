# Python AI Task: Enhance RAG Processor with Audio Support and Production-Ready Pipeline

> **Task 030:** Enhance RAG processor background worker with audio support, retry logic, and production-ready processing pipeline.

---

## 1. Task Overview

### Task Title
**Title:** Enhance RAG Processor with Audio Support, Retry Logic, and Production-Ready Processing Pipeline

### Goal Statement
**Goal:** Enhance the rag-processor background worker with comprehensive multimodal content processing, robust error handling, retry logic, and production-ready GCS integration. This includes complete processing pipelines for video, audio, image, and document files with optimized transcript storage and type-safe metadata structures that align with the frontend TypeScript interfaces.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.10+ with complete type hints and async/await patterns
- **Primary Framework:** FastAPI 0.104+ with async request handlers and Pydantic models
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with raw SQL using psycopg2 and pgvector extension for vector operations
- **API Patterns:** RESTful APIs with Pydantic models for validation, structured logging with structlog
- **Testing Framework:** pytest with async support, pytest-cov for coverage analysis
- **Code Quality Tools:** black, isort, flake8, mypy for formatting and linting
- **Containerization:** Docker with multi-stage builds, Cloud Run deployment
- **Key Architectural Patterns:** Event-driven processing, async request handlers, dependency injection via FastAPI
- **🔑 EXISTING AI/ML INTEGRATIONS:** Hybrid SDK approach - Google Gen AI (google-genai>=1.24.0) for text embeddings, Vertex AI (vertexai>=1.38.0) for multimodal embeddings
- **🔑 AUTHENTICATION PATTERNS:** Vertex AI with gcloud auth, Google Cloud Secret Manager for database credentials
- **🔑 EXISTING SDK USAGE:** google-genai for text-embedding-004 (768d), vertexai for multimodalembedding@001 (1408d)
- **Relevant Existing Modules:** `main.py` for FastAPI app and processing pipeline, `config.py` for settings, `audio_transcription.py` for video transcription

### Current State
The rag-processor currently operates as a document processing service that:
- Handles Google Cloud Storage events for document uploads
- Processes videos with transcript generation and multimodal embeddings (1408d)
- Processes documents with text embeddings (768d) 
- Stores optimized content in document_chunks table with transcript text in content field
- Has minimal FastAPI app with only health check endpoint
- **MISSING: Comprehensive audio file processing pipeline**
- **MISSING: Enhanced retry logic and error handling for production reliability**
- **MISSING: Robust GCS integration with proper error recovery**
- **MISSING: Query/search API endpoints for frontend consumption**
- **RECENT OPTIMIZATION: Transcript text moved from metadata to content field for better searchability**

### 🚨 CRITICAL: Technical Approach Confirmation
**BEFORE ANY IMPLEMENTATION:**
- [x] **Existing SDK Analysis:** Uses Google Gen AI for text embeddings + Vertex AI for multimodal (hybrid approach)
- [x] **Authentication Method:** gcloud auth with Vertex AI, Secret Manager for database connections
- [x] **Dependency Consistency:** Will extend existing FastAPI app rather than new services
- [x] **Architecture Alignment:** REST API endpoints will follow existing async patterns
- [x] **Performance Impact:** Leverages existing pgvector indexes for fast similarity search

**📋 TECHNICAL DECISION CHECKLIST:**
- [x] **Use existing Vertex AI setup** for query embeddings (maintaining consistency)
- [x] **Use existing Google Gen AI setup** for text query embeddings
- [x] **Extend existing FastAPI app** rather than creating separate service
- [x] **Match existing authentication patterns** (gcloud auth + Secret Manager)
- [x] **Leverage optimized content field** with transcript text for enhanced search

---

## 3. Context & Problem Definition

### Problem Statement
The current rag-processor has several critical gaps that prevent production-ready operation:

**Processing Pipeline Gaps:**
1. **Incomplete audio file support** - Only handles audio within videos, needs standalone audio processing
2. **Limited error handling** - Lacks comprehensive retry logic and error recovery mechanisms
3. **Basic GCS integration** - No retry policies or robust error handling for storage operations
4. **Missing file type detection** - Limited content type routing and validation

**Background Processing Gaps:**
1. **No standalone audio processing** - Only handles audio within videos, needs dedicated audio file processing
2. **Limited content type routing** - Insufficient file type detection and processing pipeline routing
3. **Missing metadata optimization** - Not fully utilizing the optimized content field structure
4. **No processing analytics** - No insights into processing success rates, performance metrics

**Production Readiness Gaps:**
1. **Error resilience** - No circuit breakers or graceful degradation
2. **Monitoring** - Limited observability and health checks
3. **Performance** - No caching or optimization for high-throughput scenarios

Without these enhancements, the system cannot reliably process diverse content types or serve frontend applications effectively.

### Success Criteria
- [ ] **Audio File Processing** - Complete pipeline for standalone audio files with transcription
- [ ] **Enhanced Video Processing** - Improved video handling with better error recovery
- [ ] **Robust GCS Integration** - Retry logic and comprehensive error handling for file operations
- [ ] **Content Type Detection** - Smart file type routing and validation
- [ ] **Type-Safe Metadata** - Pydantic models matching frontend TypeScript interfaces
- [ ] **Performance Optimization** - Efficient processing with proper resource management
- [ ] **Error Resilience** - Comprehensive error handling with retry mechanisms
- [ ] **Production Monitoring** - Enhanced logging and health check capabilities

---

## 4. Technical Requirements

### Functional Requirements
- **Audio File Processing** - Complete pipeline for MP3, WAV, FLAC, M4A files with transcription
- **Enhanced Video Processing** - Improved video handling with better chunking and error recovery
- **Robust File Download** - GCS integration with retry logic and proper error handling
- **Content Type Detection** - Smart file type identification and processing pipeline routing
- **Metadata Optimization** - Type-safe metadata storage matching frontend TypeScript interfaces
- **Error Recovery** - Comprehensive error handling with graceful degradation
- **Performance Monitoring** - Processing metrics, success rates, and health monitoring

### Non-Functional Requirements
- **Performance:** <2 minutes for video processing, <30 seconds for audio processing
- **Security:** Secure GCS access, input validation, sanitization of file paths
- **Scalability:** Efficient memory management, concurrent processing, resource cleanup
- **Reliability:** Retry mechanisms, graceful error recovery, structured logging
- **Observability:** Processing metrics, error tracking, performance monitoring

### Technical Constraints
- **Must maintain compatibility** with existing document_chunks table schema
- **Must support both embedding types** (768d text, 1408d multimodal) in unified search
- **Must preserve existing processing pipeline** and only add query capabilities
- **Cannot modify core embedding generation** logic or storage patterns

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- No schema changes required - leveraging existing optimized structure
-- Existing table: document_chunks
-- - content: TEXT (now contains transcript text for videos)
-- - metadata: JSONB (structured per content type)
-- - embedding_type: VARCHAR (text|multimodal)
-- - text_embedding: vector(768)
-- - multimodal_embedding: vector(1408)

-- Potential index optimizations for search performance
CREATE INDEX IF NOT EXISTS idx_document_chunks_content_gin ON document_chunks USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_document_chunks_metadata_content_type ON document_chunks ((metadata->>'content_type'));
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_embedding_type ON document_chunks (user_id, embedding_type);
```

### Data Model Updates
```python
# Pydantic models for API requests/responses matching TypeScript interfaces

from typing import Literal, Union, Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

# Content type constants (matching TypeScript)
ContentType = Literal["video", "audio", "image", "document"]
EmbeddingType = Literal["text", "multimodal"]

# Base metadata models
class TranscriptMetadata(BaseModel):
    language: str
    confidence: float
    model: str
    transcript_timestamp: str
    has_audio: bool
    error: Optional[str] = None

class BaseChunkMetadata(BaseModel):
    media_path: Optional[str] = None
    contextual_text: Optional[str] = None
    embedding_type: EmbeddingType

# Content-specific metadata (discriminated union)
class VideoChunkMetadata(BaseChunkMetadata):
    content_type: Literal["video"]
    segment_index: int
    start_offset_sec: float
    end_offset_sec: float
    duration_sec: float
    total_segments: int
    transcript: TranscriptMetadata

class AudioChunkMetadata(BaseChunkMetadata):
    content_type: Literal["audio"]
    segment_index: int
    start_offset_sec: float
    end_offset_sec: float
    duration_sec: float
    total_segments: int
    transcript: TranscriptMetadata
    audio_info: Optional[dict] = None

class ImageChunkMetadata(BaseChunkMetadata):
    content_type: Literal["image"]
    filename: str
    dimensions: Optional[dict] = None
    file_size: Optional[int] = None
    exif_data: Optional[dict] = None
    ocr_text: Optional[str] = None

class DocumentChunkMetadata(BaseChunkMetadata):
    content_type: Literal["document"]
    page_number: Optional[int] = None
    section: Optional[str] = None
    chunk_index: int
    doc_type: str
    structure_info: Optional[dict] = None

# Union type for all metadata
ChunkMetadata = Union[VideoChunkMetadata, AudioChunkMetadata, ImageChunkMetadata, DocumentChunkMetadata]

# API request/response models
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    content_types: Optional[List[ContentType]] = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
    min_similarity: float = Field(default=0.5, ge=0.0, le=1.0)

class DocumentChunkResponse(BaseModel):
    id: str
    user_id: str
    document_id: Optional[str]
    content: str
    chunk_index: int
    metadata: ChunkMetadata
    embedding_type: EmbeddingType
    similarity_score: Optional[float] = None
    created_at: datetime

class SearchResponse(BaseModel):
    results: List[DocumentChunkResponse]
    total_count: int
    query: str
    execution_time_ms: int
    
class ContentStatsResponse(BaseModel):
    total_chunks: int
    by_content_type: dict[ContentType, int]
    by_embedding_type: dict[EmbeddingType, int]
    storage_size_mb: float
    last_updated: datetime
```

### Data Migration Plan
- [ ] **No migration required** - existing data structure is optimized
- [ ] **Validate existing data** to ensure metadata conforms to new type schema
- [ ] **Add database indexes** for improved search performance
- [ ] **Test query performance** with representative data volumes

---

## 6. Backend Processing Architecture

### Processing Architecture - CRITICAL DESIGN RULES

**PROCESSING PIPELINE** → `rag_processor/processors/`
- [ ] **Content Type Detection** - Smart file type identification and routing
- [ ] **Audio Processing** - Standalone audio file handling with transcription
- [ ] **Video Processing** - Enhanced video chunking and error recovery
- [ ] **Document Processing** - Robust document parsing and text extraction

**BUSINESS LOGIC** → `rag_processor/services/`
- [ ] **Service Layer** - Core processing logic separated from event handlers
- [ ] **Audio Service** - Audio file processing and transcription
- [ ] **Video Service** - Video processing with chunking and optimization
- [ ] **Storage Service** - Database operations with type-safe metadata

**ERROR HANDLING** → `rag_processor/utils/`
- [ ] **Retry Logic** - Configurable retry mechanisms for all operations
- [ ] **Error Recovery** - Graceful degradation and fallback strategies
- [ ] **Monitoring** - Comprehensive logging and metrics collection

### Core Processing Operations
- [ ] **GCS File Download** - Robust file retrieval with retry logic and error handling
- [ ] **Content Type Routing** - Smart file type detection and processing pipeline selection
- [ ] **Multimodal Embedding** - Enhanced embedding generation with error recovery
- [ ] **Database Storage** - Type-safe metadata storage with optimized content fields
- [ ] **Resource Management** - Proper cleanup of temporary files and connections

---

## 7. Python Module & Code Organization

### New Modules/Files
- [ ] **`rag_processor/models/metadata_models.py`** - Content-specific metadata models matching TypeScript interfaces
- [ ] **`rag_processor/services/audio_service.py`** - Audio file processing and transcription
- [ ] **`rag_processor/services/video_service.py`** - Enhanced video processing with error recovery
- [ ] **`rag_processor/services/storage_service.py`** - Database operations with type-safe metadata
- [ ] **`rag_processor/processors/content_router.py`** - Content type detection and routing
- [ ] **`rag_processor/processors/audio_processor.py`** - Audio file processing pipeline
- [ ] **`rag_processor/processors/video_processor.py`** - Video processing with chunking
- [ ] **`rag_processor/utils/retry_utils.py`** - Retry logic and error recovery utilities
- [ ] **`rag_processor/utils/gcs_utils.py`** - Enhanced GCS integration with error handling

### Dependencies to Add to pyproject.toml
```toml
[project.dependencies]
# Extend existing dependencies
"tenacity>=8.2.0"         # Retry logic and error handling
"prometheus-client>=0.17.0" # Metrics collection

[dependency-groups.dev]
# Development dependencies
"faker>=19.0.0"           # Test data generation

[dependency-groups.test]
# Test dependencies
"pytest-mock>=3.11.0"     # Mocking framework
"pytest-benchmark>=4.0.0" # Performance testing
```

---

## 8. Implementation Plan

### Phase 1: Core Processing Infrastructure
**Goal:** Establish robust background processing with error handling and retry logic

- [ ] **Task 1.1:** Create metadata models and content type system
  - Files: `models/metadata_models.py`
  - Details: Pydantic models matching TypeScript interfaces, discriminated unions
- [ ] **Task 1.2:** Implement retry utilities and error handling
  - Files: `utils/retry_utils.py`, `utils/gcs_utils.py`
  - Details: Configurable retry logic, GCS integration with error recovery
- [ ] **Task 1.3:** Create content type detection and routing
  - Files: `processors/content_router.py`
  - Details: Smart file type identification and processing pipeline selection

### Phase 2: Enhanced Processing Services
**Goal:** Implement comprehensive audio processing and improve video processing

- [ ] **Task 2.1:** Build audio processing service
  - Files: `services/audio_service.py`, `processors/audio_processor.py`
  - Details: Standalone audio file processing with transcription and embeddings
- [ ] **Task 2.2:** Enhance video processing service
  - Files: `services/video_service.py`, `processors/video_processor.py`
  - Details: Improved video processing with better error recovery and chunking
- [ ] **Task 2.3:** Implement storage service with type-safe metadata
  - Files: `services/storage_service.py`
  - Details: Database operations with optimized content storage and metadata

### Phase 3: Integration and Production Readiness
**Goal:** Complete testing, monitoring, and deployment preparation

- [ ] **Task 3.1:** Performance optimization and resource management
  - Details: Memory management, concurrent processing, resource cleanup
- [ ] **Task 3.2:** Comprehensive testing suite
  - Files: `tests/test_audio_processing.py`, `tests/test_video_processing.py`
  - Details: Unit tests, integration tests, performance benchmarks
- [ ] **Task 3.3:** Monitoring and observability
  - Details: Metrics collection, error tracking, performance monitoring

---

## 9. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Database connection failures** - Connection retry logic, circuit breaker pattern
- [ ] **Embedding generation timeouts** - Timeout configuration, fallback mechanisms
- [ ] **Invalid query parameters** - Pydantic validation with detailed error messages
- [ ] **Vector similarity calculation errors** - Input validation, numerical stability

### Custom Exception Handling
```python
# exceptions.py
class SearchServiceError(Exception):
    """Base exception for search service errors"""
    pass

class EmbeddingGenerationError(SearchServiceError):
    """Embedding generation failed"""
    pass

class ChunkNotFoundError(SearchServiceError):
    """Requested chunk does not exist"""
    pass
```

---

## 10. Testing Strategy

### Test Categories
- [ ] **Unit Tests** - Service methods, processor functions, utility helpers
- [ ] **Integration Tests** - GCS file processing with database operations
- [ ] **Performance Tests** - Processing times, memory usage, resource cleanup
- [ ] **End-to-End Tests** - Complete file processing workflows with real content

### Testing Commands
```bash
# Sync test dependencies
uv sync --group test

# Run all tests
uv run --group test pytest

# Run with coverage
uv run --group test pytest --cov=rag_processor

# Run performance benchmarks
uv run --group test pytest tests/test_performance.py --benchmark-only
```

---

## 11. AI Agent Instructions

### Implementation Approach
🚨 **MANDATORY: Follow this exact sequence:**

1. **IMPLEMENT PHASE 1 FIRST** - Complete all Phase 1 tasks before Phase 2
2. **IMPLEMENT PHASE 2 SECOND** - Build on Phase 1 foundation
3. **IMPLEMENT PHASE 3 THIRD** - Complete optimization and testing

### Python Code Quality Standards
- [ ] **Type Hints:** Complete type annotations using discriminated unions for metadata
- [ ] **Docstrings:** Google-style docstrings with examples for all public APIs
- [ ] **Error Handling:** Custom exception hierarchy with proper HTTP status mapping
- [ ] **Async Patterns:** Consistent async/await usage for all I/O operations
- [ ] **Input Validation:** Comprehensive Pydantic models with proper constraints
- [ ] **Performance:** Efficient database queries with proper indexing
- [ ] **Testing:** >90% code coverage with unit, integration, and performance tests
- [ ] **Security:** User-scoped queries, input sanitization, rate limiting

---

## 12. Notes & Additional Context

### Performance Considerations
- **Vector Search Optimization** - Use appropriate pgvector indexes (HNSW vs IVFFlat)
- **Connection Pooling** - Efficient database connection management for high concurrency
- **Query Optimization** - Combine vector similarity with traditional PostgreSQL optimizations

### Integration Points
- **Frontend TypeScript** - API responses must match the TypeScript metadata interfaces
- **Existing Processing Pipeline** - New APIs must work with current embedding storage patterns
- **Authentication Flow** - Maintain consistency with existing user authentication

---

*Task Number: 030*  
*Created: January 2024*  
*Status: Ready for Implementation*
