# Python AI Task Template - Video Transcription Setup

> **Instructions:** This template helps you create comprehensive task documents for AI-driven Python development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Setup Video Transcript Capabilities for RAG Processor

### Goal Statement
**Goal:** Add video transcription functionality to the RAG processor so that when video chunks are processed and stored in the vector database, their audio content is transcribed and stored as metadata. This enables users to see contextual transcript information when video results are returned from similarity searches, providing better understanding of video content before clicking through.

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
  - `main.py` - RAGProcessor class with video chunking and multimodal embedding generation
  - `config.py` - Configuration management with environment variables
  - Database schema in `apps/web/lib/drizzle/schema/document_chunks.ts` with metadata JSONB field

### Current State
The RAG processor currently:
- ✅ Processes video files from Google Cloud Storage
- ✅ Creates 2-minute video chunks using ffmpeg
- ✅ Generates multimodal embeddings (1408 dimensions) for video chunks
- ✅ Stores video chunk metadata in PostgreSQL with pgvector
- ✅ Uses hybrid SDK approach (Google Gen AI for text, Vertex AI for multimodal)
- ❌ **Missing:** Audio extraction and transcription from video chunks
- ❌ **Missing:** Transcript storage in chunk metadata for search result context

## 3. Context & Problem Definition

### Problem Statement
When users perform similarity searches that return video results, they currently only see the video file reference without context about what is spoken in that video segment. Users need to click through to watch each video to understand its relevance to their query. This creates a poor user experience, especially when searching for specific topics like "how to create an AI chat app" where the spoken content is the primary value.

The RAG processor currently chunks videos into 2-minute segments and generates multimodal embeddings, but it doesn't extract or transcribe the audio content. This means search results lack the contextual information users need to quickly evaluate video relevance.

### Success Criteria
- [ ] Audio is successfully extracted from 2-minute video chunks
- [ ] Audio chunks are transcribed using Google Cloud Speech-to-Text or Google Gen AI capabilities
- [ ] Transcripts are stored in the document_chunks metadata field with proper structure
- [ ] Transcripts include timing information relative to the original video
- [ ] The system handles various video formats and audio qualities gracefully
- [ ] Performance impact is minimized by processing audio extraction and transcription asynchronously
- [ ] Error handling covers edge cases like silent videos or poor audio quality

---

## 4. Technical Requirements

### Functional Requirements
- Extract audio from 2-minute video chunks created by existing video processing pipeline
- Transcribe extracted audio using Google Cloud Speech-to-Text API or Google Gen AI SDK
- Store transcripts in document_chunks.metadata JSONB field with structured format
- Include timing offsets relative to the original video for accurate context
- Handle multiple audio formats (mp3, wav, aac) extracted from various video containers
- Process transcription asynchronously to avoid blocking video embedding generation
- Provide fallback handling for videos with no audio or poor quality audio

### Non-Functional Requirements
- **Performance:** Audio extraction and transcription should not significantly delay video processing
- **Security:** API credentials for Speech-to-Text stored securely in Google Secret Manager
- **Scalability:** Handle concurrent transcription requests for multiple video chunks
- **Reliability:** Graceful error handling for transcription failures, corrupted audio, or API limits
- **Observability:** Structured logging for transcription success/failure rates and performance metrics

### Technical Constraints
- Must maintain compatibility with existing video chunking and embedding pipeline
- Cannot modify existing database schema (use existing metadata JSONB field)
- Must work within Google Cloud Function execution time limits
- Audio files should be temporary (deleted after transcription to save storage costs)
- Must be compatible with existing hybrid SDK approach (Google Gen AI + Vertex AI)

---

## 5. Data & Database Changes

### Database Schema Changes
No schema changes required - will use existing `document_chunks.metadata` JSONB field:

```json
// Enhanced metadata structure with transcript
{
  "source": "video_filename.mp4",
  "chunk_index": 0,
  "video_segment": {
    "start_time": 0.0,
    "end_time": 120.0,
    "duration": 120.0
  },
  "transcript": {
    "text": "In this tutorial, we'll learn how to create an AI chat application using FastAPI and OpenAI...",
    "confidence": 0.95,
    "language": "en-US",
    "transcript_timestamp": "2024-01-15T10:30:00Z",
    "words": [
      {
        "word": "tutorial",
        "start_time": 2.5,
        "end_time": 3.1,
        "confidence": 0.98
      }
    ]
  }
}
```

### Data Model Updates
No new database models needed. Will enhance existing metadata structure stored in JSONB field.

### Data Migration Plan
- [ ] No migration needed - new transcript data will be added to metadata field for new video processing
- [ ] Existing video chunks without transcripts will continue to work normally
- [ ] Optional: Background job to process existing video chunks and add transcripts

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MANDATORY: Follow these Python patterns strictly:**

**BUSINESS LOGIC** → `rag_processor/main.py` RAGProcessor class methods
- [ ] **Audio Extraction Service** - New method to extract audio from video chunks
- [ ] **Transcription Service** - New method to transcribe audio using Google Cloud Speech-to-Text
- [ ] **Metadata Enhancement** - Update existing metadata storage with transcript data

**CONFIGURATION** → `rag_processor/config.py`
- [ ] **Speech-to-Text Settings** - Add API configuration and language settings
- [ ] **Audio Processing Settings** - Temporary file paths, supported formats, quality settings

### API Endpoints
No new API endpoints required - enhances existing Google Cloud Storage event processing.

### Database Operations
- [ ] **Enhanced Metadata Storage** - Store transcript data in existing document_chunks.metadata JSONB field
- [ ] **Query Optimization** - Ensure JSONB transcript data is searchable if needed later

### External Integrations
- **Google Cloud Speech-to-Text API** - For audio transcription with word-level timing
- **ffmpeg** - Already available for audio extraction from video chunks
- **Google Secret Manager** - For secure storage of Speech-to-Text API credentials

---

## 7. Python Module & Code Organization

### New Modules/Files
- [ ] **`rag_processor/audio_transcription.py`** - Audio extraction and transcription service
- [ ] **`rag_processor/speech_client.py`** - Google Cloud Speech-to-Text client wrapper

**Module Organization Pattern:**
```
rag-processor/
├── rag_processor/
│   ├── main.py                    # Enhanced RAGProcessor with transcription
│   ├── config.py                  # Updated with Speech-to-Text settings
│   ├── audio_transcription.py     # NEW: Audio processing and transcription
│   └── speech_client.py           # NEW: Speech-to-Text API client
├── tests/
│   ├── test_audio_transcription.py # NEW: Transcription service tests
│   └── fixtures/
│       ├── test_1min.mp4          # Existing test video
│       └── expected_transcript.json # NEW: Expected transcription output
```

**Code Quality Requirements:**
- **Type Hints:** All functions must have complete type annotations including async returns
- **Documentation:** Docstrings for all public functions with examples
- **Error Handling:** Custom exception types for transcription failures
- **Async/Await:** All I/O operations (file processing, API calls) use async patterns

### Dependency Management
```toml
[project.dependencies]
# Existing dependencies maintained
"google-cloud-speech>=2.24.0"     # For audio transcription
"pydub>=0.25.1"                   # For audio format conversion if needed

[dependency-groups.dev]
# Add testing dependencies for audio processing
"pytest-mock>=3.12.0"             # For mocking Speech-to-Text API calls
```

---

## 8. Implementation Plan

### Phase 1: Audio Extraction Infrastructure
**Goal:** Set up reliable audio extraction from video chunks

- [ ] **Task 1.1:** Create `audio_transcription.py` module with audio extraction
  - Files: `rag_processor/audio_transcription.py`
  - Details: Extract audio from video chunks using existing ffmpeg, handle multiple formats
- [ ] **Task 1.2:** Add configuration for audio processing
  - Files: `rag_processor/config.py`
  - Details: Temporary file paths, audio quality settings, supported formats
- [ ] **Task 1.3:** Create tests for audio extraction
  - Files: `tests/test_audio_transcription.py`
  - Details: Test extraction with existing `test_1min.mp4` file

### Phase 2: Speech-to-Text Integration
**Goal:** Integrate Google Cloud Speech-to-Text API with proper error handling

- [ ] **Task 2.1:** Create Speech-to-Text client wrapper
  - Files: `rag_processor/speech_client.py`
  - Details: Async client with retry logic, credential management
- [ ] **Task 2.2:** Implement transcription service
  - Files: `rag_processor/audio_transcription.py`
  - Details: Transcribe extracted audio, handle timing and confidence data
- [ ] **Task 2.3:** Add transcription tests with mock API responses
  - Files: `tests/test_audio_transcription.py`, `tests/fixtures/expected_transcript.json`
  - Details: Mock Speech-to-Text responses, test error scenarios

### Phase 3: Integration with Existing Pipeline
**Goal:** Seamlessly integrate transcription into existing video processing workflow

- [ ] **Task 3.1:** Enhance RAGProcessor.generate_multimodal_embeddings
  - Files: `rag_processor/main.py`
  - Details: Add transcription step to video chunk processing
- [ ] **Task 3.2:** Update metadata storage format
  - Files: `rag_processor/main.py`
  - Details: Store structured transcript data in document_chunks.metadata
- [ ] **Task 3.3:** End-to-end testing with real video files
  - Files: Test with existing `test_1min.mp4` and `test.mp4`
  - Details: Verify complete pipeline from video → chunks → embeddings → transcripts

---

## 9. File Structure & Organization

### New Files to Create
```
rag-processor/
├── rag_processor/
│   ├── audio_transcription.py           # Audio processing and transcription service
│   └── speech_client.py                 # Google Cloud Speech-to-Text client wrapper
├── tests/
│   ├── test_audio_transcription.py      # Comprehensive transcription tests
│   └── fixtures/
│       └── expected_transcript.json     # Expected transcription outputs for testing
└── pyproject.toml                       # Updated with new dependencies
```

**File Organization Rules:**
- **Service Classes**: Audio transcription logic in dedicated service class
- **Client Wrappers**: Speech-to-Text API wrapper with proper async patterns
- **Configuration**: All transcription settings centralized in config.py
- **Testing**: Comprehensive tests with mocked API responses and real audio fixtures
- **Type Hints**: Complete type annotations for all transcription-related functions

### Files to Modify
- [ ] **`rag_processor/main.py`** - Integrate transcription into RAGProcessor.generate_multimodal_embeddings
- [ ] **`rag_processor/config.py`** - Add Speech-to-Text API configuration
- [ ] **`pyproject.toml`** - Add google-cloud-speech and audio processing dependencies

### Dependencies to Add
```toml
[project.dependencies]
"google-cloud-speech>=2.24.0"     # Primary transcription service
"pydub>=0.25.1"                   # Audio format handling (optional)

[dependency-groups.dev]
"pytest-mock>=3.12.0"             # For mocking API calls in tests
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Video chunk has no audio track
  - **Handling:** Log warning, store empty transcript with metadata indicating no audio
- [ ] **Error 2:** Speech-to-Text API rate limiting or quota exceeded
  - **Handling:** Exponential backoff retry, queue for later processing
- [ ] **Error 3:** Audio extraction fails due to corrupted video
  - **Handling:** Log error, continue with embedding generation, skip transcription
- [ ] **Error 4:** Transcription returns low confidence or empty result
  - **Handling:** Store partial transcript with confidence metrics for user awareness

### Edge Cases
- [ ] **Edge Case 1:** Very short video chunks (< 10 seconds)
  - **Solution:** Adjust Speech-to-Text settings for short audio segments
- [ ] **Edge Case 2:** Non-English audio content
  - **Solution:** Auto-detect language or configure multiple language support
- [ ] **Edge Case 3:** Multiple speakers in video
  - **Solution:** Use Speech-to-Text speaker diarization features

### Custom Exception Handling
```python
# rag_processor/audio_transcription.py
class AudioExtractionError(Exception):
    """Audio extraction from video failed"""
    pass

class TranscriptionError(Exception):
    """Audio transcription failed"""
    pass

class NoAudioTrackError(AudioExtractionError):
    """Video chunk contains no audio track"""
    pass
```

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Store Speech-to-Text API credentials in Google Secret Manager
- [ ] Use Google Cloud IAM for service-to-service authentication
- [ ] Ensure Cloud Function has minimal required permissions for Speech-to-Text

### Input Validation
- [ ] Validate video file formats before audio extraction
- [ ] Sanitize temporary file paths to prevent directory traversal
- [ ] Limit audio file size and duration to prevent resource exhaustion

### Data Protection
- [ ] Delete temporary audio files immediately after transcription
- [ ] Ensure transcript data doesn't contain sensitive information logging
- [ ] Use secure temporary directories with proper permissions

---

## 12. Testing Strategy

### Test Structure
```python
# tests/test_audio_transcription.py
import pytest
from unittest.mock import AsyncMock, patch
from rag_processor.audio_transcription import AudioTranscriptionService

@pytest.fixture
def transcription_service():
    return AudioTranscriptionService()

@pytest.fixture
def mock_speech_client():
    return AsyncMock()
```

### Test Categories
- [ ] **Unit Tests** - Audio extraction methods, transcription formatting
- [ ] **Integration Tests** - Speech-to-Text API integration with mock responses
- [ ] **Edge Case Tests** - Silent videos, corrupted audio, API failures
- [ ] **Performance Tests** - Large video files, concurrent transcription requests

### Testing Commands
```bash
# Run transcription-specific tests
uv run --group test pytest tests/test_audio_transcription.py

# Run with coverage for audio transcription module
uv run --group test pytest --cov=rag_processor.audio_transcription

# Test with real video files (integration)
uv run --group test pytest tests/test_audio_transcription.py::test_real_video_transcription
```

---

## 13. Deployment & Configuration

### Environment Variables
```bash
# Add these to .env or deployment environment
GOOGLE_CLOUD_SPEECH_PROJECT_ID=your-project-id
SPEECH_TO_TEXT_LANGUAGE_CODE=en-US
AUDIO_EXTRACTION_TEMP_DIR=/tmp/audio_extraction
TRANSCRIPTION_TIMEOUT_SECONDS=300
ENABLE_SPEAKER_DIARIZATION=false
```

### Secret Manager Configuration
```bash
# Store Speech-to-Text service account key
gcloud secrets create speech-to-text-credentials --data-file=service-account-key.json
```

### Performance Monitoring
```python
# Add to main.py
logger.info(
    "Video transcription completed",
    video_chunk=chunk_path,
    transcript_length=len(transcript_text),
    confidence=average_confidence,
    processing_time_seconds=processing_time
)
```

---

## 14. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **This task document has been created following the standard operating procedure**

### Implementation Approach - READY FOR APPROVAL
🚨 **AWAITING USER APPROVAL TO PROCEED:**

This comprehensive task document outlines the complete approach for adding video transcription capabilities to the RAG processor. The implementation will:

1. **Extract audio** from existing 2-minute video chunks using ffmpeg
2. **Transcribe audio** using Google Cloud Speech-to-Text API with timing information
3. **Store transcripts** in the existing document_chunks.metadata JSONB field
4. **Integrate seamlessly** with the current video processing pipeline
5. **Handle edge cases** like silent videos, API failures, and multi-language content

### Key Technical Decisions
- **Google Cloud Speech-to-Text API** chosen for robust transcription with word-level timing
- **Existing metadata field** used to avoid database schema changes
- **Async processing** to maintain performance of video embedding generation
- **Comprehensive error handling** for production reliability

### Ready for Implementation
- [ ] **Phase 1**: Audio extraction infrastructure (3 tasks)
- [ ] **Phase 2**: Speech-to-Text integration (3 tasks)  
- [ ] **Phase 3**: Pipeline integration (3 tasks)

**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed", "Go ahead", "Approved", "Start implementation", "Looks good", "Begin", "Execute the plan", "That works", "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific implementation details, requests for changes or modifications

---

## 15. Notes & Additional Context

### Research Links
- [Google Cloud Speech-to-Text API Documentation](https://cloud.google.com/speech-to-text/docs)
- [Google Gen AI SDK Documentation](https://googleapis.github.io/python-genai/index) 
- [FFmpeg Audio Extraction Commands](https://ffmpeg.org/ffmpeg.html#audio-options)
- [PostgreSQL JSONB Functions](https://www.postgresql.org/docs/current/functions-json.html)

### Performance Considerations
- Audio extraction adds ~5-10 seconds per 2-minute video chunk
- Speech-to-Text API typically processes 1 minute of audio in 15-30 seconds
- Async processing prevents blocking video embedding generation
- Temporary files cleaned up immediately to minimize storage costs

### Future Enhancements
- Support for multiple languages with auto-detection
- Speaker diarization for multi-speaker videos
- Integration with video search results to highlight relevant transcript segments
- Real-time transcription for live video streams

---

*Template Version: 1.0*  
*Last Updated: 2024-01-15*  
*Created By: AI Assistant*  
*Task Type: Video Transcription Infrastructure* 
