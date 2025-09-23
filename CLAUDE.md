# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RAG SaaS is a production-ready Retrieval-Augmented Generation application that enables users to upload documents (PDFs, videos, audio, images) and ask questions about them through an AI-powered chat interface. It features multimodal processing, dual embedding systems, and intelligent document chunking.

## High-Level Architecture

### Three-Component Decoupled Architecture

1. **Web Application** (`apps/web/`)
   - Next.js 15 with App Router and Turbopack
   - Supabase authentication and PostgreSQL with pgvector
   - Stripe billing integration
   - Real-time document processing status

2. **RAG Processor Service** (`apps/rag-processor/`)
   - FastAPI Python service deployed on Cloud Run
   - Document processing with Docling and HybridChunker
   - Dual embedding system (text 768D + multimodal 1408D)
   - Handles actual document processing (8Gi RAM)

3. **Queue Handler Function** (`apps/rag-queue-handler/`)
   - Cloud Function Gen-2 for lightweight queue management
   - Idempotent database operations with unique constraints
   - Cloud Tasks dispatch for asynchronous processing
   - Minimal resource usage (512Mi RAM)

### Data Flow Architecture

```
User Upload → GCS → EventArc → Queue Handler → Cloud Tasks → RAG Processor
                                     ↓
                            Database (Idempotent)
```

## Common Development Commands

### User Development (Web-Only)

```bash
# Install web dependencies only (no Python/ML locally)
npm run setup               # Web app setup
npm run dev                  # Start web app (port 3000)

# Database management (from apps/web directory)
cd apps/web
npm run db:generate          # Generate migrations
npm run db:migrate           # Apply migrations
npm run db:studio            # Open Drizzle Studio
```

### Advanced Users (Backend Deployment)

```bash
# Backend infrastructure and deployment
npm run setup:gcp                    # Setup GCP infrastructure
npm run deploy:processor              # Deploy processor to Cloud Run
npm run deploy:gcs-handler            # Deploy GCS handler function
npm run deploy:task-processor         # Deploy task processor function

# Code quality for Python (if developing backend)
cd apps/rag-processor
uv run --group lint ruff check . --fix
uv run --group lint mypy .
```

### Frontend (Next.js)

```bash
cd apps/web

# Development
npm run dev                  # Development server with Turbopack
npm run build                # Production build
npm run type-check           # TypeScript checking

# Database management (MUST be run from apps/web directory)
npm run db:generate          # Generate Drizzle migrations
npm run db:migrate           # Apply migrations
npm run db:studio            # Open Drizzle Studio
npm run db:rollback          # Rollback last migration
npm run db:status            # Check migration status

# Storage setup
npm run storage:setup        # Configure Supabase storage buckets
```

### Backend (Python/FastAPI)

```bash
cd apps/rag-processor

# Development
uv run python -m rag_processor.main     # Start FastAPI server

# Code quality (MANDATORY after every change)
uv run --group lint ruff check . --fix  # Linting with auto-fix
uv run --group lint mypy .              # Type checking
uv run --group lint ruff format .       # Code formatting

# Deployment
uv run deploy-rag-processor             # Deploy processor to Cloud Run
uv run deploy-gcs-handler               # Deploy GCS handler function
uv run deploy-task-processor            # Deploy task processor function
uv run setup-dev                        # Setup GCP dev infrastructure
```

## Critical Architecture Decisions

### Decoupled Processing Architecture

- **NO MONOLITHIC MODE**: `RUN_MODE="all"` permanently removed
- Queue handler (512Mi) and processor (8Gi) run separately
- Prevents 16x resource waste for queue operations
- Cloud Tasks ensures reliable async processing

### Database Schema & Idempotency

- Unique constraints on `gcs_path` prevent duplicate documents
- Unique constraints on `file_path` in processing jobs
- ON CONFLICT clauses ensure idempotent operations
- Essential for EventArc retry handling

### Dual Embedding System

```python
# Text embeddings (768 dimensions)
match_text_chunks(query_embedding, user_id, threshold, count)

# Multimodal embeddings (1408 dimensions)
match_multimodal_chunks(query_embedding, user_id, threshold, count)
```

### Environment Variables

- **User configures**: `apps/web/.env.local` only
- **Backend services**: Configured automatically during deployment
- **Queue handler**: Environment set during Cloud Function deployment

Key variables for Cloud Tasks:

```bash
# Development environment
CLOUD_TASKS_QUEUE_NAME=rag-processing-queue-dev
PROCESSOR_SERVICE_URL=https://rag-processor-dev-xxxxx.run.app
TASK_SERVICE_ACCOUNT=rag-processor-dev@project.iam.gserviceaccount.com

# Production environment
CLOUD_TASKS_QUEUE_NAME=rag-processing-queue-prod
PROCESSOR_SERVICE_URL=https://rag-processor-prod-xxxxx.run.app
TASK_SERVICE_ACCOUNT=rag-processor-prod@project.iam.gserviceaccount.com
```

## Document Processing Pipeline

### Supported File Types

- **Documents**: PDF, DOCX, TXT (Docling with HybridChunker)
- **Videos**: MP4, MOV, AVI (frame analysis + transcription)
- **Audio**: MP3, WAV, M4A (speech-to-text)
- **Images**: JPG, PNG, GIF (visual analysis + text extraction)

### Processing Stages

1. **Uploading** - File transfer to GCS
2. **Queued** - Task created in Cloud Tasks
3. **Processing** - Active document analysis
4. **Embedding** - Vector generation (dual system)
5. **Completed** - Ready for RAG queries
6. **Failed** - Error with details

### Embedding Strategy

- **Text content** → 768D embeddings for semantic search
- **Visual/audio** → 1408D multimodal embeddings
- Both stored in pgvector with separate indexes
- Combined search results for comprehensive RAG

## Google Cloud Integration

### Required Services

```bash
storage.googleapis.com          # Document storage
run.googleapis.com              # Cloud Run deployment
cloudfunctions.googleapis.com   # Queue handler function
cloudtasks.googleapis.com       # Async task queue
secretmanager.googleapis.com    # Secure credential storage
eventarc.googleapis.com         # Event triggers
artifactregistry.googleapis.com # Docker images
cloudbuild.googleapis.com       # Build pipeline
```

### Service Account Configuration

- `rag-processor-dev@`: Main service account for all components
- `rag-task-invoker@`: Cloud Tasks specific invoker
- Web app uses base64 encoded service account key

### Deployment Commands

```bash
# Backend infrastructure and deployment (advanced users)
npm run setup:gcp                    # Setup GCP infrastructure
npm run deploy:processor              # Deploy processor service
npm run deploy:gcs-handler            # Deploy GCS handler function
npm run deploy:task-processor         # Deploy task processor function

# Alternative direct commands (same result)
PYTHONPATH=scripts uv run setup-dev
PYTHONPATH=scripts uv run deploy-rag-processor
PYTHONPATH=scripts uv run deploy-gcs-handler
PYTHONPATH=scripts uv run deploy-task-processor
```

## Database Architecture

### Core Tables

- `users` - User profiles with Stripe integration
- `documents` - Document metadata and processing status
- `document_chunks` - Processed chunks with dual embeddings
- `document_processing_jobs` - Async job tracking
- `conversations` - Chat sessions
- `messages` - Chat history
- `user_usage` - Usage tracking for billing
- `webhook_events` - Stripe webhook idempotency

### RPC Functions for Vector Search

```sql
-- Text search (768D)
match_text_chunks(query_embedding, user_id, threshold, count)

-- Multimodal search (1408D)
match_multimodal_chunks(query_embedding, user_id, threshold, count)
```

## Development Workflow

### Adding New Features

1. Check existing patterns in similar components
2. Use relative imports in Python (`.services`, `.models`)
3. Always add type annotations (Python and TypeScript)
4. Run linters before committing
5. Test with both embedding systems

### Testing Document Processing

```bash
# Test web app locally
npm run dev                    # Start web app (port 3000)

# Upload test document via web UI
# Note: Document processing requires backend deployment

# Check Cloud Run logs (if backend deployed)
gcloud run logs read rag-processor-dev --limit=50  # For development
gcloud run logs read rag-processor-prod --limit=50  # For production
gcloud functions logs read rag-queue-handler-dev --gen2 --limit=50  # For development
gcloud functions logs read rag-queue-handler-prod --gen2 --limit=50  # For production
```

### Common Issues & Solutions

**Document stuck in "Processing"**

- Check Cloud Run logs for errors
- Verify Gemini API key is valid
- Check file size limits (1GB max)

**Embeddings not generating**

- Verify `google-genai` package version
- Check multimodal model availability
- Monitor token limits (8192 for transcripts)

**Queue handler not triggering**

- Verify EventArc configuration
- Check GCS bucket permissions
- Ensure service account has correct roles

## Important Patterns

### Python Import Style

```python
# Always use relative imports for internal modules
from .services.processing_service import process_file_from_gcs
from .models.api_models import ProcessingRequest
```

### Error Handling

```python
# Use proper exception chaining
try:
    result = process_document()
except Exception as e:
    raise ProcessingError("Failed to process") from e
```

### Database Operations

```python
# Always use idempotent operations
INSERT INTO documents (...)
ON CONFLICT (gcs_path)
DO UPDATE SET updated_at = NOW()
```

### Frontend Data Fetching

```typescript
// Use server actions for mutations
export async function uploadDocument(formData: FormData) {
  "use server";
  // Implementation
}

// Use direct queries for complex reads
const chunks = await db
  .select()
  .from(documentChunks)
  .where(eq(documentChunks.userId, userId));
```

## Package Management

### Python (uv)

```bash
uv add "package>=1.0.0"          # Add dependency
uv add --group dev "tool>=1.0.0" # Add dev dependency
uv sync                          # Sync all dependencies
```

### Node.js (npm)

```bash
npm install package              # Add dependency
npm install -D package           # Add dev dependency
npm install                      # Install all
```

## Testing Commands

### Run Tests

```bash
# Frontend tests
cd apps/web
npm run test

# Backend tests
cd apps/rag-processor
uv run --group test pytest

# End-to-end test
npm run rag-processor:test:pipeline
```

### Linting & Type Checking

```bash
# TypeScript
npm run type-check --workspace=web

# Python
cd apps/rag-processor
uv run --group lint mypy .
uv run --group lint ruff check .
```

## Deployment Tips

### Cloud Run Timeout Configuration

Large PDFs may require longer timeouts. Current settings:

- Default: 900 seconds (15 minutes)
- For large documents: Consider 1200-1800 seconds
- Adjust with: `--timeout=1800` in deployment

### Resource Allocation

- Queue Handler: 512Mi RAM (lightweight operations)
- RAG Processor: 8Gi RAM (model loading + processing)
- Separate scaling prevents resource waste

### Monitoring & Debugging

```bash
# View Cloud Run logs
gcloud run logs read rag-processor-dev --limit=100  # For development
gcloud run logs read rag-processor-prod --limit=100  # For production

# Monitor Cloud Tasks queue
gcloud tasks queues describe rag-processing-queue-dev --location=us-central1  # For development
gcloud tasks queues describe rag-processing-queue-prod --location=us-central1  # For production

# Check function logs
gcloud functions logs read rag-queue-handler-dev --gen2 --limit=50  # For development
gcloud functions logs read rag-queue-handler-prod --gen2 --limit=50  # For production
```

## Current Architecture State

The codebase implements a fully decoupled architecture with:

- Removed EventArc dependencies from processor
- Queue handler as Cloud Function Gen-2
- Cloud Tasks for reliable async processing
- Idempotent database operations throughout
- Unique constraints for deduplication
- Dual embedding system for enhanced search
