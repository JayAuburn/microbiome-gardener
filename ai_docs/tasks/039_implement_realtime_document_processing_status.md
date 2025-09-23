# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement Real-time Document Processing Status Updates with Detailed Progress Tracking and Error Inspection

### Goal Statement
**Goal:** Transform the document management experience by providing real-time updates on document processing status, detailed progress tracking through processing stages, and comprehensive error inspection capabilities. Users should see live updates as documents move through downloading, analyzing, splitting, embedding, and saving stages, with clear feedback when errors occur and detailed error information for troubleshooting.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Toast System:** Sonner (already configured and working)
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, API routes for mutations
- **Relevant Existing Components:** 
  - `components/documents/DocumentList.tsx` - Document listing with basic status
  - `lib/drizzle/schema/document_processing_jobs.ts` - Rich processing stage tracking
  - `app/api/documents/route.ts` - Current documents API (no processing job data)

### Current State
**Based on file analysis:**
- Documents page fetches basic document info once on load with manual refresh
- `document_processing_jobs` table exists with rich processing stage data but isn't used in UI
- Processing stages include: downloading, analyzing, splitting, transcribing/parsing, embedding, saving
- Error messages are stored in `errorMessage` field but not displayed to users
- No real-time updates - users must manually refresh to see processing progress
- Processing job records are created during upload but never queried for status display

## 3. Context & Problem Definition

### Problem Statement
Users currently experience a poor document processing experience due to:
1. **No real-time feedback** - Documents show "Processing" status indefinitely until manual refresh
2. **No progress indication** - Users can't tell if processing is progressing or stuck
3. **No stage visibility** - Rich processing stage data (downloading, analyzing, etc.) is hidden from users
4. **No error inspection** - When processing fails, users see generic "Error" status with no details
5. **No processing estimates** - Users have no idea how long processing will take
6. **Manual refresh required** - Users must constantly refresh to check processing status

This creates frustration and uncertainty, especially for large documents or when processing fails.

### Success Criteria
- [ ] Real-time processing status updates without manual refresh
- [ ] Detailed progress tracking showing current processing stage
- [ ] Visual progress indicators (progress bars, stage indicators)
- [ ] Comprehensive error inspection with detailed error messages
- [ ] Processing time estimates and stage-specific feedback
- [ ] Automatic UI updates when processing completes or fails
- [ ] Toast notifications for processing completion and errors
- [ ] Responsive design working across all devices

---

## 4. Technical Requirements

### Functional Requirements
- **Real-time Updates**: Automatic polling every 3-5 seconds for processing documents
- **Progress Tracking**: Show current processing stage (downloading, analyzing, splitting, etc.)
- **Stage Indicators**: Visual representation of processing pipeline progress
- **Error Inspection**: Click to view detailed error messages and timestamps
- **Processing Estimates**: Show estimated time remaining based on file size and type
- **Completion Notifications**: Toast messages when processing succeeds or fails
- **Auto-refresh**: Stop polling when all documents are in final states (completed/error)

### Non-Functional Requirements
- **Performance:** Polling should be efficient - only query documents in processing states
- **Battery Life:** Intelligent polling that pauses when page is not visible
- **Network Efficiency:** Minimal data transfer with optimized queries
- **Responsive Design:** Progress indicators work on mobile, tablet, and desktop
- **Theme Support:** All new components support light and dark mode
- **Accessibility:** Screen reader support for progress updates and error messages

### Technical Constraints
- Must use existing `document_processing_jobs` table structure
- Cannot modify database schema significantly
- Must maintain backward compatibility with existing document API
- Should use existing toast notification system

---

## 5. Data & Database Changes

### Database Schema Changes
**No changes required** - The existing `document_processing_jobs` table already contains all necessary data:
- `processingStage`: Current stage (downloading, analyzing, splitting, etc.)
- `status`: Overall status (pending, processing, processed, error)
- `errorMessage`: Detailed error information
- `processingStartedAt`: Processing start time
- `completedAt`: Processing completion time
- `fileSize`: For progress estimates
- `retryCount`: For error analysis

### Data Model Updates
**TypeScript interfaces needed for enhanced document data:**
```typescript
interface DocumentWithProcessingJob {
  id: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  chunkCount?: number;
  processingError?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  // Enhanced processing job data
  processingJob?: {
    id: string;
    status: ProcessingJobStatus;
    processingStage: ProcessingStage;
    errorMessage?: string;
    processingStartedAt?: string;
    completedAt?: string;
    retryCount: number;
  };
}
```

### Data Migration Plan
**No migration required** - All data already exists in the database.

---

## 6. Query Functions & Backend Changes

### New Query Functions

#### **`getActiveProcessingJobs(userId)`**
- **Purpose**: Get processing status for all user documents with active processing jobs
- **Location**: `lib/documents.ts`
- **Response**: Documents with processing job data for real-time updates
- **Optimization**: Only returns documents in non-final states (pending, processing, retry_pending)

#### **`getDocumentProcessingDetails(documentId, userId)`**
- **Purpose**: Get detailed processing information for a specific document
- **Location**: `lib/documents.ts`
- **Response**: Complete processing job history, error details, stage timings
- **Use Case**: Error inspection modal and detailed progress views

### Enhanced Existing Actions

#### **`getDocumentsAction()` (Enhanced)**
- **Addition**: Include processing job data in response when available
- **Optimization**: LEFT JOIN with document_processing_jobs table
- **Backward Compatible**: Existing structure maintained, processing job data optional

### Database Queries
**New complex queries in `lib/documents.ts`:**
- `getDocumentsWithProcessingStatus()` - JOIN documents with processing jobs
- `getDocumentProcessingDetails(documentId)` - Detailed processing job info
- `getActiveProcessingJobs(userId)` - Only documents currently processing

---

## 7. Frontend Changes

### New Components

#### **`components/documents/ProcessingStatusIndicator.tsx`**
- **Purpose**: Visual indicator for current processing stage
- **Features**: Progress bar, stage icons, estimated time remaining
- **Props**: `processingStage`, `fileSize`, `startTime`, `error`

#### **`components/documents/ProcessingStageDisplay.tsx`**
- **Purpose**: Detailed stage-by-stage progress visualization
- **Features**: Stepper component showing completed/current/pending stages
- **Props**: `currentStage`, `stages`, `errors`

#### **`components/documents/ErrorInspectionModal.tsx`**
- **Purpose**: Modal for viewing detailed error information
- **Features**: Error message, retry count, processing timeline, retry button
- **Props**: `errorData`, `documentId`, `onRetry`

#### **`components/documents/ProcessingProgressCard.tsx`**
- **Purpose**: Enhanced card layout for processing documents
- **Features**: Progress bar, stage indicator, time estimates, error handling
- **Props**: `document`, `onErrorInspect`, `onRetry`

### Enhanced Existing Components

#### **`components/documents/DocumentList.tsx`**
- **Additions**: Real-time polling, processing progress display, error inspection
- **New State**: `pollingInterval`, `processingDocuments`, `errorModalOpen`
- **New Methods**: `startPolling()`, `stopPolling()`, `handleProcessingUpdate()`

#### **`app/(protected)/documents/page.tsx`**
- **Additions**: Processing completion notifications, error handling
- **New Features**: Toast notifications for processing events

### State Management
**Enhanced DocumentList state management:**
- `pollingInterval: NodeJS.Timeout | null` - Polling timer management
- `processingDocuments: Set<string>` - Track documents currently processing
- `errorInspectionDoc: DocumentWithProcessingJob | null` - Error modal state
- `isPolling: boolean` - Polling state management

---

## 8. Implementation Plan

### Phase 1: Backend Query Functions Enhancement
**Goal:** Create query functions that provide rich processing status data

- [ ] **Task 1.1:** Create enhanced documents query with processing job data
  - Files: `lib/documents.ts`
  - Details: JOIN query to include processing job information
  
- [ ] **Task 1.2:** Create processing status query function
  - Files: `lib/documents.ts`
  - Details: Optimized function for real-time polling of processing documents
  
- [ ] **Task 1.3:** Create processing details query function
  - Files: `lib/documents.ts`
  - Details: Detailed processing job information for error inspection

### Phase 2: Real-time Polling Implementation
**Goal:** Implement intelligent polling system for processing updates

- [ ] **Task 2.1:** Add polling logic to DocumentList component
  - Files: `components/documents/DocumentList.tsx`
  - Details: useEffect hooks for polling, visibility API integration, cleanup
  
- [ ] **Task 2.2:** Implement processing status updates
  - Files: `components/documents/DocumentList.tsx`
  - Details: Update document list based on polling results, handle state transitions
  
- [ ] **Task 2.3:** Add completion notifications
  - Files: `components/documents/DocumentList.tsx`
  - Details: Toast notifications when processing completes or fails

### Phase 3: Progress Visualization Components
**Goal:** Create rich UI components for processing progress display

- [ ] **Task 3.1:** Create ProcessingStatusIndicator component
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Progress bar with stage indicators and time estimates
  
- [ ] **Task 3.2:** Create ProcessingStageDisplay component
  - Files: `components/documents/ProcessingStageDisplay.tsx`
  - Details: Stepper component for detailed stage visualization
  
- [ ] **Task 3.3:** Create ProcessingProgressCard component
  - Files: `components/documents/ProcessingProgressCard.tsx`
  - Details: Enhanced card layout for processing documents

### Phase 4: Error Inspection and Handling
**Goal:** Comprehensive error inspection and retry capabilities

- [ ] **Task 4.1:** Create ErrorInspectionModal component
  - Files: `components/documents/ErrorInspectionModal.tsx`
  - Details: Modal for viewing detailed error information
  
- [ ] **Task 4.2:** Integrate error inspection into DocumentList
  - Files: `components/documents/DocumentList.tsx`
  - Details: Click handlers for error inspection, modal state management
  
- [ ] **Task 4.3:** Add retry functionality (if supported by backend)
  - Files: Multiple components
  - Details: Retry buttons and retry status handling

### Phase 5: Polish and Optimization
**Goal:** Performance optimization and user experience refinement

- [ ] **Task 5.1:** Optimize polling performance
  - Files: `components/documents/DocumentList.tsx`
  - Details: Intelligent polling intervals, pause when page not visible
  
- [ ] **Task 5.2:** Add processing time estimates
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Calculate estimates based on file size and processing stage
  
- [ ] **Task 5.3:** Test responsive design and accessibility
  - Files: All new components
  - Details: Mobile testing, screen reader support, keyboard navigation

---

## 9. File Structure & Organization

### New Files to Create
```
apps/web/
├── components/documents/
│   ├── ProcessingStatusIndicator.tsx   # Progress bar and stage indicator
│   ├── ProcessingStageDisplay.tsx      # Detailed stage stepper
│   ├── ErrorInspectionModal.tsx        # Error details modal
│   └── ProcessingProgressCard.tsx      # Enhanced processing card
└── lib/
    └── documents.ts                    # Complex document queries (already exists, will enhance)
```

### Files to Modify
- [ ] **`components/documents/DocumentList.tsx`** - Add polling, progress display, error inspection
- [ ] **`app/(protected)/documents/page.tsx`** - Add processing completion notifications
- [ ] **`lib/documents.ts`** - Enhance with processing status query functions (already exists)

### Dependencies to Add
**None** - All functionality uses existing libraries (React, Tailwind, shadcn/ui, Sonner)

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Polling Failures:** Handle network errors during polling gracefully
  - **Handling:** Exponential backoff, show connection status, retry logic
- [ ] **Processing Stuck:** Detect documents stuck in processing state
  - **Handling:** Show "Processing may be delayed" message after timeout
- [ ] **Multiple Processing Jobs:** Handle documents with multiple processing job records
  - **Handling:** Use most recent processing job, show processing history
- [ ] **Missing Processing Job:** Handle documents without processing job records
  - **Handling:** Fallback to basic document status display

### Edge Cases
- [ ] **Page Visibility:** Pause polling when page is not visible
  - **Solution:** Use document.visibilityState API to pause/resume polling
- [ ] **Network Offline:** Handle offline scenarios gracefully
  - **Solution:** Detect offline state, show offline indicator, resume when online
- [ ] **Large File Processing:** Handle very long processing times
  - **Solution:** Adaptive polling intervals, progress time estimates
- [ ] **Processing Job Cleanup:** Handle orphaned processing jobs
  - **Solution:** Background cleanup service or manual cleanup utilities

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] All new API endpoints require user authentication
- [ ] Processing job data filtered by user ownership
- [ ] No sensitive processing details exposed to unauthorized users

### Input Validation
- [ ] Document ID validation in processing details API
- [ ] User ID validation in all queries
- [ ] Rate limiting for polling endpoints

---

## 12. Deployment & Configuration

### Environment Variables
**None needed** - Uses existing database and authentication configuration

### Performance Considerations
- [ ] Database indexing on document_processing_jobs table for efficient queries
- [ ] Polling optimization to minimize server load
- [ ] Caching strategies for processing status data

---

## 13. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (Required)** ✅ **COMPLETED**
   - [x] Created task document `039_implement_realtime_document_processing_status.md`
   - [x] Analyzed existing codebase and processing job schema
   - [x] Used next incremental number (039)

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 (Backend Query Functions Enhancement) and complete fully before Phase 2
   - [ ] Create new query functions for processing status data
   - [ ] Implement intelligent polling system with cleanup
   - [ ] Create progress visualization components
   - [ ] Add error inspection capabilities
   - [ ] Test all components in both light and dark themes
   - [ ] Verify responsive behavior on mobile, tablet, and desktop
   - [ ] Test polling performance and battery impact

### Code Quality Standards
- [ ] Use existing processing job schema without modifications
- [ ] Implement efficient database queries with proper indexing
- [ ] Add comprehensive error handling for all network operations
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability and touch interactions**
- [ ] Follow accessibility guidelines for progress indicators and error messages
- [ ] Use TypeScript strict mode for all new components

### Real-time Implementation Guidelines
- [ ] Use `setInterval` with cleanup for polling (not recursive setTimeout)
- [ ] Implement Page Visibility API to pause polling when page not visible
- [ ] Use efficient queries that only fetch processing documents
- [ ] Add exponential backoff for polling errors
- [ ] Implement proper cleanup on component unmount

---

## 14. Notes & Additional Context

### Processing Stages Reference
From `document_processing_jobs.ts`:
- **DOWNLOADING**: File being downloaded from storage
- **ANALYZING**: File type and content analysis
- **SPLITTING**: Breaking document into chunks
- **TRANSCRIBING**: Audio/video transcription (for multimedia files)
- **PARSING**: Document parsing (for text documents)
- **EMBEDDING**: Vector embedding generation
- **SAVING**: Saving chunks and embeddings to database

### Stage-Specific Considerations
- **Video/Audio files**: longer processing times, transcription stage
- **Large documents**: chunking stage may take significant time
- **Images**: OCR processing during analyzing stage
- **Error-prone stages**: downloading (network), transcribing (AI service), embedding (AI service)

### User Experience Priorities
1. **Immediate feedback**: Show processing starts immediately
2. **Progress visibility**: Users can see processing is advancing
3. **Error transparency**: Clear error messages with actionable information
4. **Time estimates**: Help users understand expected wait times
5. **Completion notifications**: Don't make users constantly check

### Performance Optimization Targets
- **Polling frequency**: 3-5 seconds for processing documents
- **Query optimization**: Sub-100ms response times for processing status
- **Battery efficiency**: Pause polling when page not visible
- **Network efficiency**: Minimal data transfer in polling requests

---

*Template Version: 1.0*  
*Last Updated: 12/30/2024*  
*Created By: AI Assistant*

