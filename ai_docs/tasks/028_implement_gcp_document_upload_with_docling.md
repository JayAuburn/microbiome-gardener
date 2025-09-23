# Implement GCP Document Upload with Docling and Multimodal Embeddings

> **Task:** Implement comprehensive document upload functionality to GCP bucket with docling for document processing and Google multimodal embeddings for image/video processing.

---

## 1. Task Overview

### Task Title
**Title:** Implement GCP Document Upload with Docling and Multimodal Embeddings

### Goal Statement
**Goal:** Build a robust document upload system that supports a wide range of file types, processes documents with docling for text extraction, uses Google multimodal embeddings for images and videos, and stores everything in GCP bucket for scalable document management and AI-powered search capabilities.

---

## 2. Technology Research Results

### Docling Supported File Formats
Based on Context7 research and official documentation:

- **PDF documents** (including complex layouts with tables, figures, headers/footers)
- **Microsoft Word** (DOCX) files  
- **PowerPoint** (PPTX) presentations
- **HTML** documents
- **Excel** (XLSX) spreadsheets
- **Images** embedded in documents
- **Complex document structures** with nested elements

### Google Multimodal Embeddings Supported Formats

**Images:**
- PNG (image/png)
- JPEG (image/jpeg) 
- WebP (image/webp)
- GIF, Animated GIF (first frame only)
- BMP, RAW, ICO, TIFF
- **Maximum image size:** 7 MB
- **Maximum images per prompt:** 3,000

**Videos:**
- AVI, FLV, MKV, MOV, MP4, MPEG, MPG, WEBM, WMV
- **Maximum video length:** No limit, but only 2 minutes analyzed at a time
- **Audio content:** Not considered for embeddings (separate audio processing pipeline)
- **Maximum video file size:** 1 GB (system limit)

**Audio Files:**
- MP3, WAV, FLAC, AAC, OGG
- **Processing:** Audio → transcription → text embeddings (not multimodal)
- **Maximum audio file size:** 1 GB (system limit)
- **Chunking:** 2-minute chunks → transcribe → text embeddings

---

## 3. Implementation Plan

### Phase 1: Web App Infrastructure Setup ✅ **COMPLETED WITH UPDATES**

#### 3.1 Create File Type Validation Utilities ✅ **COMPLETED**
Created `apps/web/lib/file-validation.ts` with:
- ✅ Comprehensive file type mapping for documents, images, videos, audio
- ✅ Audio file support (MP3, WAV, FLAC, AAC, OGG, M4A)
- ✅ Size validation per category (7MB images, 50MB docs, 1GB videos, 1GB audio)
- ✅ Updated file size limits to match system limits (1GB for videos/audio)
- ✅ MIME type verification with proper TypeScript types
- ✅ Error message standardization and file size formatting
- ✅ Helper functions for UI components

#### 3.2 Create Upload URL Generation API ✅ **COMPLETED**
Created `apps/web/app/api/documents/upload-url/route.ts` with:
- ✅ File validation before upload using validation utilities
- ✅ Database record creation with new schema fields
- ✅ Atomic transaction to create both document + processing job
- ✅ Security checks and user authentication via Supabase
- ✅ Signed URL generation for GCS with proper expiration
- ✅ Error handling and comprehensive logging

#### 3.3 Document Processing Trigger API ✅ **REMOVED**
- ✅ Removed `apps/web/app/api/documents/process/route.ts` (not needed)
- ✅ GCS events will trigger processing automatically via background jobs
- ✅ Frontend will poll job status instead of manual triggers
- ✅ Simplified architecture with event-driven processing

#### 3.4 Update Database Schema ✅ **COMPLETED**
Updated `apps/web/lib/drizzle/schema/documents.ts` with:
- ✅ File type categorization fields (`file_category` enum)
- ✅ Added audio category to file_category enum
- ✅ Processing status tracking with new status options
- ✅ Multimodal metadata storage (`processing_metadata` field)
- ✅ Error logging fields and proper indexing
- ✅ Database migration generated (`0010_foamy_proudstar.sql`)
- ✅ Document processing jobs table already exists in schema
- ✅ All schema changes ready for deployment

#### 3.5 Dependencies Added ✅
- ✅ Installed `@google-cloud/storage` for GCS integration
- ✅ All linting checks passing
- ✅ TypeScript compilation successful

**Note:** Python backend components (rag-processor) will be handled separately.

### Phase 2: Frontend Enhancement

#### 3.4 Enhanced File Type Validation
Create `apps/web/lib/file-validation.ts` with:
- Comprehensive file type mapping
- Size validation per file category
- MIME type verification
- Error message standardization

#### 3.5 Enhanced Upload Component
Update `apps/web/components/documents/DocumentUpload.tsx` with:
- Multi-file drag & drop support
- Progress tracking per file
- File type categorization
- Visual feedback for different file types

### Phase 3: API Routes

#### 3.6 Upload URL Generation API
Create `apps/web/app/api/documents/upload-url/route.ts` for:
- Signed URL generation
- File validation
- Database record creation
- Security checks

#### 3.7 Document Processing API
Create `apps/web/app/api/documents/process/route.ts` for:
- Processing trigger
- Status updates
- Result storage
- Error handling

### Phase 4: Database Updates

#### 3.8 Enhanced Schema
Update `apps/web/lib/drizzle/schema/documents.ts` with:
- File type categorization
- Processing status tracking
- Multimodal metadata storage
- Error logging fields

---

## 4. File Type Processing Strategy

### Document Types (Docling)
- **PDF:** Full parsing, table extraction, image extraction
- **DOCX:** Text, formatting, embedded images, tables
- **PPTX:** Slide content, speaker notes, embedded media
- **XLSX:** Cell data, formulas, charts
- **HTML:** Text content, structure preservation

### Image Types (Multimodal Embeddings)
- **PNG/JPEG/WebP:** Direct embedding generation
- **GIF:** First frame extraction
- **BMP/TIFF:** Format conversion if needed
- **Size limit:** 7MB maximum

### Video Types (Multimodal Embeddings)
- **MP4/AVI/MOV:** Video segment analysis (2-minute chunks)
- **Embedding modes:** Essential/Standard/Plus
- **Audio handling:** Ignored for embeddings

---

## 5. Success Criteria

### Functional Requirements
- Support for 15+ file types
- Progress tracking during upload
- Automatic file type detection
- Vector embeddings generation
- Error handling and retry

### Performance Requirements
- Upload: < 30 seconds for 50MB files
- Processing: < 2 minutes for documents, < 5 minutes for videos
- Search: < 500ms response time

---

## 6. Implementation Priority

1. **High Priority:** Document processing (PDF, DOCX, PPTX)
2. **Medium Priority:** Image processing (PNG, JPEG, WebP)
3. **Lower Priority:** Video processing (MP4, MOV)
4. **Future:** Advanced features (OCR, audio transcription)

---

## 7. **User Feedback & Required Updates**

### **Updates Needed Based on User Feedback:**

#### ✅ **Schema Confirmed**
- Document processing jobs schema already exists in `/lib/drizzle/schema/document_processing_jobs.ts`
- All necessary fields and enums are already implemented

#### ⚠️ **File Validation Updates Required**
- **Add audio file support:** MP3, WAV, FLAC, AAC, OGG
- **Add audio size limit:** 1GB (from system design)
- **Add audio as separate category:** Not documents/images/videos

#### ⚠️ **Database Schema Updates Required**
- **Add "audio" to file_category enum** in documents.ts
- **Audio processing strategy:** Audio → transcription → text embeddings (not multimodal)

#### ❌ **Remove Manual Processing Trigger**
- **Remove `/api/documents/process` endpoint** - not needed
- **GCS events trigger processing automatically** via background jobs
- **Frontend polling** will check job status instead

#### ⚠️ **Upload URL API Updates Required**
- **Add atomic transaction:** Create both document + processing job records
- **Question:** Should this happen in upload-url generation or after successful upload?

### **Final Implementation Focus:**
1. ✅ **Add audio file support** to validation system
2. ✅ **Add audio category** to database schema
3. ✅ **Remove manual processing trigger** endpoint
4. ✅ **Add atomic transaction** for document + job creation
5. ✅ **Update file size limits** to use 1GB system limit from main.py

---

## 🎉 **IMPLEMENTATION COMPLETE**

All requested updates have been successfully implemented:

### ✅ **Successfully Completed:**
1. **Audio File Support:** Added MP3, WAV, FLAC, AAC, OGG, M4A support
2. **File Size Limits:** Updated to 1GB for videos/audio (system limit)
3. **Database Schema:** Added audio category to file_category enum
4. **Atomic Transactions:** Document + processing job creation in single transaction
5. **Removed Manual Trigger:** Deleted unnecessary processing endpoint
6. **Migration Generated:** `0010_foamy_proudstar.sql` ready for deployment
7. **Linting:** All changes pass ESLint checks

### 🔄 **Processing Pipeline Integration:**
- **Documents:** PDF, DOCX, etc. → Docling → text embeddings
- **Images:** PNG, JPEG, etc. → multimodal embeddings
- **Videos:** MP4, AVI, etc. → transcription + multimodal embeddings
- **Audio:** MP3, WAV, etc. → transcription → text embeddings

### 🚀 **Ready for Deployment:**
- All web app infrastructure is complete
- Database schema is ready for migration
- Python backend (rag-processor) handles processing automatically
- GCS event triggers will process files without manual intervention
