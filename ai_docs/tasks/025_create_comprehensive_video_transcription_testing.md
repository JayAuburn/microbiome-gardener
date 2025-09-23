# Python AI Task Template - Comprehensive Video Transcription Testing

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Create Comprehensive Video Transcription Testing & Validation

### Goal Statement
**Goal:** Build comprehensive testing infrastructure to validate the complete video transcription pipeline and ensure similarity search rankings work correctly. This includes testing text embeddings, image embeddings, video embeddings with transcripts, and verifying that relevant content (e.g., "AI" queries) returns appropriate results while irrelevant content (e.g., "Trump" queries) returns nothing.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Python Version:** Python 3.13 with complete type hints
- **Primary Framework:** FastAPI with async/await patterns for Google Cloud Functions
- **Dependency Management:** uv for fast dependency resolution and virtual environments
- **Database & ORM:** PostgreSQL with raw SQL/asyncpg and pgvector for vector operations
- **API Patterns:** Google Cloud Storage event-driven processing with Drizzle schema compatibility
- **Testing Framework:** pytest with async support and fixtures
- **Code Quality Tools:** black, isort, flake8, mypy for formatting and linting
- **Containerization:** Docker with multi-stage builds for Google Cloud deployment
- **Key Architectural Patterns:** Hybrid SDK approach (new Google Gen AI + deprecated Vertex AI), async request handlers, structured logging
- **Relevant Existing Modules:** 
  - `main.py` - RAGProcessor class with hybrid embedding generation
  - `tests/fixtures/` - Contains `test_1min.mp4`, `test.mp4`, and `Thumbnail.jpg`
  - Existing database schema with separate text_embedding and multimodal_embedding columns

### Current State
After Task 1 (024_setup_video_transcript_capabilities), the system will have:
- ✅ Video transcription capabilities using Google Cloud Speech-to-Text
- ✅ Enhanced metadata storage with transcript information
- ✅ Audio extraction from video chunks
- ❌ **Missing:** Comprehensive end-to-end testing of the complete pipeline
- ❌ **Missing:** Validation of similarity search accuracy with transcribed content
- ❌ **Missing:** Performance benchmarking and edge case testing

## 3. Context & Problem Definition

### Problem Statement
The video transcription functionality needs rigorous testing to ensure it works correctly in production. We need to validate that:

1. **End-to-End Pipeline Works:** Videos → chunks → audio extraction → transcription → embeddings → database storage
2. **Similarity Search Accuracy:** Queries about AI topics return relevant video results, while unrelated queries (like "Trump") return nothing
3. **Multi-Modal Search Quality:** Text, image, and video embeddings all work together effectively
4. **Transcript Context:** Video results include meaningful transcript excerpts that help users understand content
5. **Performance & Reliability:** System handles various video formats, sizes, and edge cases gracefully

Without comprehensive testing, we risk deploying a system that fails in production or provides poor search results.

### Success Criteria
- [ ] Complete test suite covering text, image, and video embedding generation and storage
- [ ] End-to-end tests validating video → transcription → searchable results workflow
- [ ] Similarity search tests proving relevant queries return correct results and irrelevant queries return empty results
- [ ] Performance tests measuring transcription speed and accuracy with real video files
- [ ] Edge case tests for silent videos, corrupted files, and various formats
- [ ] Integration tests confirming database storage and retrieval of transcript metadata
- [ ] Test fixtures and mock data that can be reused for future development

---

## 4. Technical Requirements

### Functional Requirements
- Create end-to-end test pipeline using existing video fixtures (`test_1min.mp4`, `test.mp4`)
- Test text embedding generation and storage (768 dimensions)
- Test multimodal embedding generation and storage (1408 dimensions) 
- Validate video transcription accuracy and metadata structure
- Test similarity search with queries like "AI", "chat app", "tutorial" (should return results)
- Test similarity search with irrelevant queries like "Trump", "politics" (should return empty)
- Verify transcript excerpts are properly formatted and contextual
- Test database operations for storing and retrieving embeddings with transcript metadata
- Validate cross-modal search capabilities (text query finding video content)

### Non-Functional Requirements
- **Performance:** Tests should complete within reasonable time limits (< 5 minutes total)
- **Reliability:** Tests must be deterministic and not flaky due to API rate limits
- **Maintainability:** Test fixtures and mocks should be reusable and well-documented
- **Coverage:** Achieve >90% code coverage for transcription and embedding modules
- **Scalability:** Tests should work with varying video sizes and quantities

### Technical Constraints
- Use existing test video files in `tests/fixtures/` directory
- Work with existing database schema (document_chunks table)
- Tests must work in CI/CD environment with proper mocking of external APIs
- Cannot rely on actual Google Cloud Speech-to-Text API calls in unit tests (use mocks)
- Must validate both hybrid SDK approaches (Google Gen AI for text, Vertex AI for multimodal)

---

## 5. Data & Database Changes

### Database Schema Changes
No schema changes required - will test existing schema:

```sql
-- Testing will validate this existing structure works correctly
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    document_id UUID NOT NULL,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    metadata JSONB NOT NULL,
    embedding_type VARCHAR(20) NOT NULL DEFAULT 'text',
    text_embedding VECTOR(768),
    multimodal_embedding VECTOR(1408),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Test Data Model
```python
# Test fixtures will validate this metadata structure
test_video_metadata = {
    "source": "test_1min.mp4",
    "chunk_index": 0,
    "video_segment": {
        "start_time": 0.0,
        "end_time": 60.0,
        "duration": 60.0
    },
    "transcript": {
        "text": "This is a test video about AI and machine learning tutorials...",
        "confidence": 0.95,
        "language": "en-US",
        "transcript_timestamp": "2024-01-15T10:30:00Z",
        "words": [
            {
                "word": "AI",
                "start_time": 5.2,
                "end_time": 5.6,
                "confidence": 0.98
            }
        ]
    }
}
```

### Test Database Strategy
- [ ] Use pytest fixtures to create isolated test database
- [ ] Seed database with known test embeddings for similarity testing
- [ ] Clean up test data after each test to ensure isolation

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MANDATORY: Follow these Python patterns strictly:**

**TEST SERVICES** → `tests/services/` directory
- [ ] **Test Data Service** - Generate and manage test embeddings and transcripts
- [ ] **Similarity Search Service** - Test search functionality with known queries
- [ ] **Database Test Service** - Validate storage and retrieval operations

**TEST FIXTURES** → `tests/fixtures/` directory  
- [ ] **Video Fixtures** - Use existing `test_1min.mp4`, `test.mp4`, `Thumbnail.jpg`
- [ ] **Expected Results** - JSON files with expected transcripts and search results
- [ ] **Mock API Responses** - Simulated Speech-to-Text and embedding API responses

### API Endpoints
No new API endpoints - testing existing Google Cloud Storage event processing and embedding generation.

### Testing Operations
- [ ] **Embedding Generation Tests** - Validate text and multimodal embedding creation
- [ ] **Transcription Tests** - Test audio extraction and transcription pipeline
- [ ] **Similarity Search Tests** - Query embeddings and validate result relevance
- [ ] **Database Integration Tests** - Store and retrieve embeddings with metadata

### External Integrations Testing
- **Google Cloud Speech-to-Text API** - Mocked for unit tests, real for integration tests
- **Google Gen AI SDK** - Test text embedding generation with known inputs
- **Vertex AI SDK** - Test multimodal embedding generation with test media files
- **PostgreSQL + pgvector** - Test vector similarity search operations

---

## 7. Python Module & Code Organization

### New Modules/Files
- [ ] **`tests/test_end_to_end_pipeline.py`** - Complete pipeline testing from video to searchable results
- [ ] **`tests/test_similarity_search.py`** - Similarity search accuracy and relevance testing
- [ ] **`tests/test_multimodal_embeddings.py`** - Multi-modal embedding generation testing
- [ ] **`tests/test_transcription_accuracy.py`** - Video transcription quality and metadata testing
- [ ] **`tests/services/test_data_service.py`** - Test data generation and management
- [ ] **`tests/fixtures/expected_results.json`** - Expected transcripts and search results
- [ ] **`tests/fixtures/mock_responses.json`** - Mocked API responses for consistent testing

**Module Organization Pattern:**
```
rag-processor/
├── tests/
│   ├── test_end_to_end_pipeline.py           # Complete workflow testing
│   ├── test_similarity_search.py             # Search accuracy validation
│   ├── test_multimodal_embeddings.py         # Multi-modal embedding tests
│   ├── test_transcription_accuracy.py        # Transcription quality tests
│   ├── services/
│   │   ├── test_data_service.py              # Test data management
│   │   └── similarity_test_service.py        # Search testing utilities
│   ├── fixtures/
│   │   ├── test_1min.mp4                     # Existing 1-minute test video
│   │   ├── test.mp4                          # Existing longer test video
│   │   ├── Thumbnail.jpg                     # Existing test image
│   │   ├── expected_results.json             # Expected outputs
│   │   ├── mock_responses.json               # API response mocks
│   │   └── test_queries.json                 # Search queries and expected results
│   └── conftest.py                           # Pytest configuration and shared fixtures
```

**Code Quality Requirements:**
- **Type Hints:** All test functions with complete type annotations
- **Documentation:** Clear docstrings explaining what each test validates
- **Parameterized Tests:** Use pytest.mark.parametrize for multiple test scenarios
- **Async Testing:** All async functions properly tested with pytest-asyncio

### Dependency Management
```toml
[dependency-groups.test]
# Enhanced testing dependencies
"pytest>=8.0.0"
"pytest-asyncio>=0.23.0"
"pytest-mock>=3.12.0"              # For mocking external APIs
"pytest-cov>=4.0.0"                # For coverage reporting
"pytest-benchmark>=4.0.0"          # For performance testing
"factory-boy>=3.3.0"               # For test data generation
"freezegun>=1.4.0"                 # For time-based testing
```

---

## 8. Implementation Plan

### Phase 1: Test Infrastructure Setup
**Goal:** Create reliable test foundation with fixtures and utilities

- [ ] **Task 1.1:** Setup test database and fixtures
  - Files: `tests/conftest.py`, `tests/services/test_data_service.py`
  - Details: Database setup, test data generation, cleanup utilities
- [ ] **Task 1.2:** Create expected results and mock responses
  - Files: `tests/fixtures/expected_results.json`, `tests/fixtures/mock_responses.json`
  - Details: Expected transcripts for test videos, mocked API responses
- [ ] **Task 1.3:** Build similarity search test utilities
  - Files: `tests/services/similarity_test_service.py`
  - Details: Query testing framework, result validation utilities

### Phase 2: Core Functionality Testing
**Goal:** Validate each component of the transcription and embedding pipeline

- [ ] **Task 2.1:** Test video transcription accuracy
  - Files: `tests/test_transcription_accuracy.py`
  - Details: Validate transcription quality, metadata structure, timing accuracy
- [ ] **Task 2.2:** Test multimodal embedding generation
  - Files: `tests/test_multimodal_embeddings.py`
  - Details: Test text (768d) and multimodal (1408d) embedding generation and storage
- [ ] **Task 2.3:** Test similarity search accuracy
  - Files: `tests/test_similarity_search.py`
  - Details: Validate search results for relevant and irrelevant queries

### Phase 3: End-to-End Integration Testing
**Goal:** Validate complete pipeline from video upload to searchable results

- [ ] **Task 3.1:** Complete pipeline testing
  - Files: `tests/test_end_to_end_pipeline.py`
  - Details: Video → chunks → transcription → embeddings → database → search
- [ ] **Task 3.2:** Performance and edge case testing
  - Files: Enhanced test files with performance benchmarks
  - Details: Large videos, silent videos, corrupted files, concurrent processing
- [ ] **Task 3.3:** Integration test with real APIs (optional)
  - Files: `tests/test_integration_real_apis.py`
  - Details: End-to-end tests with actual Google APIs (for staging environment)

---

## 9. File Structure & Organization

### New Files to Create
```
rag-processor/
├── tests/
│   ├── test_end_to_end_pipeline.py           # Complete workflow validation
│   ├── test_similarity_search.py             # Search accuracy and relevance
│   ├── test_multimodal_embeddings.py         # Multi-modal embedding tests  
│   ├── test_transcription_accuracy.py        # Transcription quality validation
│   ├── services/
│   │   ├── __init__.py
│   │   ├── test_data_service.py              # Test data generation service
│   │   └── similarity_test_service.py        # Search testing utilities
│   ├── fixtures/
│   │   ├── expected_results.json             # Expected transcription outputs
│   │   ├── mock_responses.json               # Mocked API responses
│   │   ├── test_queries.json                 # Search queries and expected results
│   │   └── performance_benchmarks.json       # Performance testing thresholds
│   └── conftest.py                           # Enhanced pytest configuration
└── pyproject.toml                            # Updated test dependencies
```

**File Organization Rules:**
- **Test Categories**: Separate files for different testing concerns (transcription, search, embeddings)
- **Test Services**: Reusable utilities for test data generation and validation
- **Fixtures**: JSON files with expected results and test data
- **Configuration**: Centralized pytest setup with database and API mocking
- **Type Safety**: Complete type annotations for all test code

### Files to Modify
- [ ] **`tests/conftest.py`** - Add comprehensive test fixtures and database setup
- [ ] **`pyproject.toml`** - Add enhanced testing dependencies and configuration

### Dependencies to Add
```toml
[dependency-groups.test]
"pytest>=8.0.0"
"pytest-asyncio>=0.23.0"
"pytest-mock>=3.12.0"              # API mocking
"pytest-cov>=4.0.0"                # Coverage reporting
"pytest-benchmark>=4.0.0"          # Performance testing
"factory-boy>=3.3.0"               # Test data generation
"freezegun>=1.4.0"                 # Time mocking
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Video file corruption during processing
  - **Testing:** Simulate corrupted video files, verify graceful failure
- [ ] **Error 2:** Speech-to-Text API failures or rate limiting
  - **Testing:** Mock API failures, test retry logic and fallback behavior
- [ ] **Error 3:** Database connection failures during embedding storage
  - **Testing:** Simulate database errors, verify transaction rollback
- [ ] **Error 4:** Out-of-memory errors with large video files
  - **Testing:** Test memory usage patterns, verify cleanup of temporary files

### Edge Cases
- [ ] **Edge Case 1:** Silent videos (no audio track)
  - **Testing:** Process videos with no audio, verify empty transcript handling
- [ ] **Edge Case 2:** Very short video segments (< 5 seconds)
  - **Testing:** Validate transcription accuracy for brief audio segments
- [ ] **Edge Case 3:** Multi-language content in videos
  - **Testing:** Test language detection and transcription accuracy
- [ ] **Edge Case 4:** Extremely low or high quality audio
  - **Testing:** Validate transcription confidence thresholds

### Test-Specific Exception Scenarios
```python
# tests/test_transcription_accuracy.py
class TestTranscriptionErrorHandling:
    async def test_silent_video_handling(self):
        """Test that silent videos are handled gracefully"""
        pass
    
    async def test_api_rate_limit_retry(self):
        """Test retry logic when Speech-to-Text API is rate limited"""
        pass
    
    async def test_corrupted_audio_extraction(self):
        """Test behavior when audio extraction fails"""
        pass
```

---

## 11. Security Considerations

### Test Environment Security
- [ ] Use separate test database to avoid corrupting production data
- [ ] Mock all external API calls in unit tests to avoid credential exposure
- [ ] Ensure test fixtures don't contain sensitive or copyrighted content
- [ ] Use environment-specific configuration for test vs production

### Test Data Protection
- [ ] Generate synthetic test transcripts rather than using real sensitive content
- [ ] Ensure temporary test files are properly cleaned up
- [ ] Validate that test database connections use appropriate isolation

### API Testing Security
- [ ] Mock Speech-to-Text API calls to avoid unnecessary costs and quota usage
- [ ] Use test-specific API keys when running integration tests
- [ ] Ensure test failures don't leak sensitive configuration information

---

## 12. Testing Strategy

### Test Structure
```python
# tests/conftest.py
import pytest
import asyncio
from unittest.mock import AsyncMock
from rag_processor.main import RAGProcessor

@pytest.fixture
async def test_database():
    """Isolated test database with cleanup"""
    # Setup test database
    yield test_db
    # Cleanup after test

@pytest.fixture
def mock_speech_client():
    """Mocked Speech-to-Text client"""
    return AsyncMock()

@pytest.fixture
def test_video_files():
    """Test video file paths"""
    return {
        "short": "tests/fixtures/test_1min.mp4",
        "long": "tests/fixtures/test.mp4"
    }
```

### Test Categories
- [ ] **Unit Tests** - Individual functions (transcription, embedding generation)
- [ ] **Integration Tests** - Component interactions (database + embeddings)
- [ ] **End-to-End Tests** - Complete workflows (video → searchable results)
- [ ] **Performance Tests** - Speed and memory usage benchmarks
- [ ] **Edge Case Tests** - Error conditions and unusual inputs

### Testing Commands
```bash
# Run all tests with coverage
uv run --group test pytest --cov=rag_processor --cov-report=html

# Run specific test categories
uv run --group test pytest tests/test_similarity_search.py -v

# Run performance benchmarks
uv run --group test pytest --benchmark-only

# Run end-to-end tests (may require real API access)
uv run --group test pytest tests/test_end_to_end_pipeline.py -m integration
```

---

## 13. Deployment & Configuration

### Test Environment Configuration
```bash
# Test-specific environment variables
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/rag_test
ENABLE_API_MOCKING=true
TEST_FIXTURE_PATH=/tests/fixtures
SPEECH_TO_TEXT_MOCK_MODE=true
EMBEDDING_API_MOCK_MODE=true
```

### Performance Benchmarks
```json
// tests/fixtures/performance_benchmarks.json
{
  "transcription": {
    "max_processing_time_per_minute": 30,
    "min_confidence_threshold": 0.8,
    "max_memory_usage_mb": 512
  },
  "embedding_generation": {
    "text_embedding_max_time_ms": 1000,
    "multimodal_embedding_max_time_ms": 5000
  },
  "similarity_search": {
    "max_query_time_ms": 100,
    "min_relevant_results": 1,
    "max_irrelevant_results": 0
  }
}
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml (example)
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run comprehensive tests
      run: |
        uv run --group test pytest --cov=rag_processor
        uv run --group test pytest --benchmark-only
```

---

## 14. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **This task document has been created following the standard operating procedure**

### Implementation Approach - READY FOR APPROVAL
🚨 **AWAITING USER APPROVAL TO PROCEED:**

This comprehensive testing task document outlines validation of the complete video transcription and similarity search pipeline. The testing will:

1. **Validate End-to-End Pipeline** from video files to searchable transcribed content
2. **Test Similarity Search Accuracy** ensuring relevant queries return results and irrelevant ones don't
3. **Verify Multi-Modal Embeddings** work correctly for text (768d) and video/image (1408d)
4. **Performance Testing** to ensure transcription doesn't significantly impact processing speed
5. **Edge Case Handling** for silent videos, corrupted files, and API failures

### Key Testing Scenarios
- **Positive Tests**: Query "AI", "tutorial", "chat app" → should return video results with transcript context
- **Negative Tests**: Query "Trump", "politics" → should return empty results
- **Performance Tests**: Measure transcription speed and memory usage
- **Integration Tests**: Complete pipeline with real video fixtures

### Test Fixtures Available
- `test_1min.mp4` - Short test video for quick testing
- `test.mp4` - Longer test video for comprehensive testing  
- `Thumbnail.jpg` - Image for multi-modal testing

### Ready for Implementation
- [ ] **Phase 1**: Test infrastructure setup (3 tasks)
- [ ] **Phase 2**: Core functionality testing (3 tasks)
- [ ] **Phase 3**: End-to-end integration testing (3 tasks)

**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed", "Go ahead", "Approved", "Start implementation", "Looks good", "Begin", "Execute the plan", "That works", "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific implementation details, requests for changes or modifications

---

## 15. Notes & Additional Context

### Research Links
- [pytest Documentation](https://docs.pytest.org/en/stable/)
- [pytest-asyncio for Async Testing](https://pytest-asyncio.readthedocs.io/en/latest/)
- [pgvector Similarity Search Testing](https://github.com/pgvector/pgvector#querying)
- [Google Cloud Speech-to-Text Testing Best Practices](https://cloud.google.com/speech-to-text/docs/testing)

### Performance Considerations
- Mock external API calls in unit tests to avoid rate limits and costs
- Use database transactions with rollback for test isolation
- Benchmark transcription performance to ensure it doesn't bottleneck video processing
- Test memory cleanup for temporary audio files

### Quality Assurance
- Achieve >90% code coverage for transcription and embedding modules
- Validate that similarity search results are deterministic and relevant
- Ensure test fixtures are representative of real-world video content
- Test both successful and failure scenarios comprehensively

---

*Template Version: 1.0*  
*Last Updated: 2024-01-15*  
*Created By: AI Assistant*  
*Task Type: Comprehensive Testing Infrastructure* 
