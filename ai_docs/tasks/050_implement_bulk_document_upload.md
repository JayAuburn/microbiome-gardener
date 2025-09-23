# AI Task Template - Bulk Document Upload

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement Bulk Document Upload with Queue Management

### Goal Statement
**Goal:** Transform the current single-file upload system into a robust bulk upload interface that allows users to upload multiple documents simultaneously with individual progress tracking, queue management, and comprehensive error handling. This will significantly improve user experience for users who need to upload many documents at once, reducing the time and effort required to populate their document library.

---

## 2. Project Analysis & Current State

### Technology & Architecture
<!-- 
AI Agent: Analyze the project to fill this out.
- Check `package.json` for versions and dependencies.
- Check `tsconfig.json` for TypeScript configuration.
- Check `tailwind.config.ts` for styling and theme.
- Check `drizzle/schema/` for database schema.
- Check `middleware.ts` for authentication and routing.
- Check `components/` for existing UI patterns. 
-->
- **Frameworks & Versions:** Next.js 15.0.3, React 19.0.0 RC
- **Language:** TypeScript 5.7.2 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/documents/DocumentUpload.tsx` - Single file upload logic
  - `components/documents/UploadDocumentDialog.tsx` - Modal wrapper for uploads
  - `components/documents/DocumentList.tsx` - Document listing with real-time updates
  - `components/ui/progress.tsx` - Progress bar component
  - `components/ui/card.tsx` - Card layout component

### Current State
The current document upload system is built around single-file uploads with the following architecture:

1. **Upload Flow**: User clicks "Upload" → `UploadDocumentDialog` opens → `DocumentUpload` component handles single file selection → Three-step process (get signed URL, upload to GCS, mark complete)
2. **Progress Tracking**: Individual file progress with visual indicators
3. **Error Handling**: Single file error states with retry mechanisms
4. **Real-time Updates**: Document list polls for processing status updates
5. **File Validation**: Comprehensive file type and size validation

**Current Limitations**:
- Users can only upload one document at a time
- No queue management for multiple uploads
- Inefficient for bulk document ingestion
- Poor UX for users with many documents to upload

## 3. Context & Problem Definition

### Problem Statement
The current single-file upload system creates a significant user experience bottleneck for users who need to upload multiple documents. Users must:
- Upload files one at a time
- Wait for each upload to complete before starting the next
- Manually track which files have been uploaded
- Repeat the same upload dialog workflow multiple times

This is particularly problematic for users setting up their document library, importing from other systems, or processing batch documents. The inefficiency leads to user frustration and abandonment of the upload process.

### Success Criteria
- [ ] Users can select and upload multiple files in a single operation
- [ ] Individual progress tracking for each file in the upload queue
- [ ] Queue management with pause/resume/cancel capabilities per file
- [ ] Comprehensive error handling that doesn't block other uploads
- [ ] Concurrent upload processing (configurable limit)
- [ ] Clear visual feedback for overall progress and individual file status
- [ ] Ability to add more files to an ongoing upload queue
- [ ] Maintains all existing single-file upload functionality as fallback

---

## 4. Technical Requirements

### Functional Requirements
- **Multi-file Selection**: User can select multiple files via file picker or drag-and-drop
- **Upload Queue Management**: System manages upload queue with configurable concurrency
- **Individual Progress Tracking**: Each file shows upload progress and status independently
- **Queue Controls**: Users can pause, resume, cancel individual uploads or entire queue
- **Error Isolation**: Failed uploads don't impact other files in the queue
- **Incremental Addition**: Users can add more files to existing upload queue
- **Bulk Operations**: Select all, cancel all, retry all failed uploads
- **File Validation**: Validate all files before starting uploads with detailed error reports

### Non-Functional Requirements
- **Performance**: Support up to 10 concurrent file uploads with 3-5 simultaneous uploads
- **Responsive Design**: Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support**: Must support both light and dark mode using existing theme system
- **Accessibility**: Proper ARIA labels, keyboard navigation, screen reader support
- **Memory Management**: Efficient handling of large file queues without memory leaks
- **Network Resilience**: Retry logic for failed uploads with exponential backoff

### Technical Constraints
- **Existing API**: Must use existing upload API endpoints without breaking changes
- **File Size Limits**: Respect existing file size and type validation rules
- **Browser Support**: Must work on modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Compatibility**: Touch-friendly controls and responsive design
- **Performance**: Maintain fast UI responsiveness even with large upload queues

---

## 5. Data & Database Changes

### Database Schema Changes
No database changes required - using existing document table and upload flow.

### Data Model Updates
```typescript
// Enhanced upload state management types
interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled' | 'paused';
  progress: number;
  error?: string;
  documentId?: string;
  retryCount: number;
  startTime?: Date;
  completedTime?: Date;
}

interface UploadQueue {
  items: UploadQueueItem[];
  globalStatus: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
  concurrentUploads: number;
  maxConcurrentUploads: number;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
}

interface BulkUploadProgress {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  overallProgress: number;
  estimatedTimeRemaining?: number;
  uploadSpeed?: number;
}
```

### Data Migration Plan
No data migration required - this is a UI/UX enhancement that uses existing backend infrastructure.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [x] **Server Actions File** - `app/actions/documents.ts` - ONLY mutations (create, update, delete)
- [x] Already exists for document operations
- [x] No additional server actions needed - reusing existing upload flow

#### **QUERIES (Data Fetching)** → Choose based on complexity:
- [x] **Direct in Server Components** - Using existing document fetching
- [x] **Query Functions in lib/** - Using existing `lib/documents.ts`

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**
- [x] **Using Existing API Routes** - `/api/documents/upload-url` and `/api/documents/[id]/complete`
- [x] No new API routes needed - bulk upload is client-side orchestration

### Server Actions
No new server actions required - leveraging existing upload infrastructure:
- [x] **Existing `uploadDocument`** - Individual file upload process
- [x] **Existing validation** - File type and size validation
- [x] **Existing completion flow** - Document processing pipeline

### Database Queries
Using existing query patterns:
- [x] **Direct in Server Components** - Document fetching in pages
- [x] **Query Functions in lib/documents.ts** - Complex document operations

### API Routes (Only for Special Cases)
Reusing existing API infrastructure:
- [x] **`/api/documents/upload-url`** - Get signed upload URL (existing)
- [x] **`/api/documents/[id]/complete`** - Mark upload complete (existing)
- [x] **No new API routes needed** - bulk functionality is client-side orchestration

### External Integrations
Using existing integrations:
- [x] **Google Cloud Storage** - File upload destination (existing)
- [x] **Supabase** - Authentication and database (existing)

---

## 7. Frontend Changes

### New Components
- [ ] **`components/documents/BulkUploadDialog.tsx`** - Main bulk upload modal interface
- [ ] **`components/documents/BulkUploadArea.tsx`** - Drag-and-drop area for multiple files
- [ ] **`components/documents/UploadQueue.tsx`** - Queue management and file list display
- [ ] **`components/documents/UploadQueueItem.tsx`** - Individual file upload progress and controls
- [ ] **`components/documents/UploadProgress.tsx`** - Overall upload progress summary
- [ ] **`components/documents/BulkUploadControls.tsx`** - Global queue controls (pause all, retry all, etc.)

**Component Organization Pattern:**
- Use `components/documents/` directory for all new bulk upload components
- Keep existing single upload components for backward compatibility
- Maintain consistent styling with existing document components

**Component Requirements:**
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** WCAG AA guidelines, proper ARIA labels, keyboard navigation
- **Performance:** Efficient rendering of large file lists with virtualization if needed

### Page Updates
- [ ] **`/documents`** - Update to use new bulk upload dialog while maintaining existing functionality
  - Replace single upload button with bulk upload option
  - Keep existing `DocumentList` component unchanged
  - Add toggle between single and bulk upload modes

### State Management
- **Upload Queue State**: React state management for queue operations
- **Progress Tracking**: Individual file progress and global progress calculation
- **Error Management**: Per-file error states that don't impact other uploads
- **Queue Persistence**: Optional localStorage persistence for interrupted uploads

---

## 8. Implementation Plan

### Phase 1: Core Bulk Upload Infrastructure
**Goal:** Build the foundation for bulk upload functionality

- [ ] **Task 1.1:** Create upload queue management system
  - Files: `components/documents/UploadQueue.tsx`, `lib/upload-queue.ts`
  - Details: Queue data structure, state management, concurrent upload logic
- [ ] **Task 1.2:** Build bulk upload dialog container
  - Files: `components/documents/BulkUploadDialog.tsx`
  - Details: Modal wrapper, file selection, drag-and-drop area
- [ ] **Task 1.3:** Create individual queue item component
  - Files: `components/documents/UploadQueueItem.tsx`
  - Details: Progress display, individual controls, error states

### Phase 2: Queue Management & Controls
**Goal:** Implement queue operations and user controls

- [ ] **Task 2.1:** Implement queue control system
  - Files: `components/documents/BulkUploadControls.tsx`
  - Details: Pause/resume all, cancel all, retry failed uploads
- [ ] **Task 2.2:** Add file management capabilities
  - Files: `components/documents/BulkUploadArea.tsx`
  - Details: Add/remove files, drag-and-drop, file validation
- [ ] **Task 2.3:** Build overall progress tracking
  - Files: `components/documents/UploadProgress.tsx`
  - Details: Global progress bar, statistics, time estimation

### Phase 3: Integration & Polish
**Goal:** Integrate with existing system and add advanced features

- [ ] **Task 3.1:** Integrate with documents page
  - Files: `app/(protected)/documents/page.tsx`
  - Details: Add bulk upload option, maintain existing functionality
- [ ] **Task 3.2:** Add advanced features
  - Files: Multiple component files
  - Details: Queue persistence, retry logic, error recovery
- [ ] **Task 3.3:** Testing and optimization
  - Files: All components
  - Details: Performance testing, mobile responsiveness, accessibility

---

## 9. File Structure & Organization

### New Files to Create
```
templates/rag-saas/apps/web/
├── components/documents/
│   ├── BulkUploadDialog.tsx          # Main bulk upload modal
│   ├── BulkUploadArea.tsx            # Multi-file drag-and-drop area
│   ├── UploadQueue.tsx               # Queue management container
│   ├── UploadQueueItem.tsx           # Individual file upload item
│   ├── UploadProgress.tsx            # Overall progress display
│   └── BulkUploadControls.tsx        # Global queue controls
├── lib/
│   ├── upload-queue.ts               # Queue management utilities
│   └── upload-concurrency.ts        # Concurrent upload logic
└── hooks/
    └── use-upload-queue.ts           # Custom hook for queue state
```

### Files to Modify
- [ ] **`app/(protected)/documents/page.tsx`** - Add bulk upload option to existing page
- [ ] **`components/documents/DocumentList.tsx`** - Enhanced optimistic updates for bulk uploads
- [ ] **`lib/file-validation.ts`** - Add bulk validation utilities

### Dependencies to Add
```json
{
  "dependencies": {
    "use-debounce": "^10.0.0"
  }
}
```
*Note: For debouncing file selection and progress updates*

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Network Failures:** Individual file upload fails due to network issues
  - **Handling:** Retry with exponential backoff, don't halt other uploads
- [ ] **File Validation Errors:** Some files in selection are invalid
  - **Handling:** Show validation errors, allow upload of valid files
- [ ] **Storage Quota Exceeded:** Upload fails due to storage limits
  - **Handling:** Clear error message, pause queue, allow user to manage storage
- [ ] **Authentication Timeout:** Session expires during long upload process
  - **Handling:** Graceful session refresh, maintain upload state

### Edge Cases
- [ ] **Maximum File Queues:** User selects more than 10 files
  - **Solution:** Show clear limit message, allow user to select subset, batch processing
- [ ] **Mixed File Types:** Valid and invalid files in same selection
  - **Solution:** Pre-filter invalid files, show clear validation summary
- [ ] **Concurrent Tab Usage:** Multiple tabs uploading simultaneously
  - **Solution:** Queue coordination, storage conflict resolution
- [ ] **Mobile Memory Constraints:** Large uploads on mobile devices
  - **Solution:** Reduced concurrency, memory monitoring, graceful degradation

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **File Upload Permissions:** Same as existing single upload - authenticated users only
- [ ] **Rate Limiting:** Respect existing upload rate limits per user
- [ ] **Storage Quotas:** Enforce existing storage limits across bulk uploads

### Input Validation
- [ ] **File Type Validation:** Apply existing file type restrictions to all files
- [ ] **File Size Validation:** Enforce existing size limits per file and total batch
- [ ] **Queue Size Limits:** Limit maximum number of files in queue (e.g., 10 files)

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required - using existing upload configuration.

### Configuration Options
```typescript
// Add to existing config
const UPLOAD_CONFIG = {
  maxConcurrentUploads: 3,
  maxQueueSize: 10,
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds
  progressUpdateInterval: 500, // milliseconds
};
```

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
When a user requests any new feature, improvement, or significant change, your **DEFAULT BEHAVIOR** should be:

1. **CREATE A TASK DOCUMENT** in `ai_docs/` using this template
2. **GET USER APPROVAL** of the task document  
3. **IMPLEMENT THE FEATURE** only after approval

**DO NOT:** Present implementation plans in chat without creating a proper task document first.  
**DO:** Always create comprehensive task documentation that can be referenced later.

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates during implementation
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (Required)**
   - [x] **Created task document** `050_implement_bulk_document_upload.md`
   - [x] **Filled out all sections** with specific details for bulk upload feature
   - [x] **Found latest task number** 049, using 050 for this task
   - [x] **Comprehensive planning** covering all aspects of bulk upload implementation

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **Create all new components in `components/documents/` directory**
   - [ ] Test each component as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Test components in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] Document any deviations from the approved plan

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed"
- "Go ahead"  
- "Approved"
- "Start implementation"
- "Looks good"
- "Begin"
- "Execute the plan"
- "That works"
- "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific implementation details
- Requests for changes or modifications
- "What about..." or "How will you handle..."
- "I'd like to change..."
- "Wait, let me think about..."
- No response or silence

🛑 **NEVER start coding without user approval of the task document first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with strict type checking
- [ ] Add comprehensive error handling for all upload scenarios
- [ ] Include detailed JSDoc comments for all functions
- [ ] **Ensure responsive design with mobile-first approach**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA)
- [ ] Use semantic HTML elements for better screen reader support

### Architecture Compliance
- [ ] **✅ VERIFIED: Using correct data access pattern**
  - [x] Mutations → Existing Server Actions (`app/actions/documents.ts`)
  - [x] Queries → Existing lib functions (`lib/documents.ts`)
  - [x] API routes → Reusing existing upload endpoints
- [ ] **❌ AVOIDED: Creating unnecessary new API routes**
- [ ] **🔍 CONFIRMED: Bulk upload is client-side orchestration of existing upload flow**

---

## 14. Notes & Additional Context

### Research Links
- [MDN File API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [HTML5 Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Web Workers for File Processing](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### Design Considerations
- **Progressive Enhancement:** Start with basic bulk upload, add advanced features incrementally
- **Graceful Degradation:** Fallback to single upload on older browsers
- **User Experience:** Clear visual feedback, intuitive controls, error recovery
- **Performance:** Efficient memory usage, smooth UI updates, background processing

### Future Enhancements
- **Folder Upload:** Support for directory upload with file tree preservation
- **Upload Resume:** Resume interrupted uploads after browser restart
- **Cloud Import:** Direct import from cloud storage providers
- **Metadata Extraction:** Bulk metadata extraction and tagging

---

*Template Version: 1.0*  
*Last Updated: January 16, 2025*  
*Created By: AI Assistant* 
