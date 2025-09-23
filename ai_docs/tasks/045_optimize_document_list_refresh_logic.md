# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Optimize Document List Refresh Logic and UX

### Goal Statement
**Goal:** Replace the inefficient document list refresh logic that causes full component remounts with a streamlined approach that provides instant feedback, eliminates unnecessary API calls, and maintains proper state management. This will significantly improve user experience by removing loading flickers, preserving scroll position, and providing optimistic updates when documents are uploaded.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.x with strict mode enabled
- **Database & ORM:** Supabase (PostgreSQL) via Drizzle ORM  
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **State Management:** React useState and useEffect hooks, polling with useRef for intervals
- **Notifications:** Sonner for toast notifications
- **Relevant Existing Components:** 
  - `components/documents/DocumentList.tsx` - Main document listing with polling
  - `components/documents/DocumentUpload.tsx` - File upload with progress tracking
  - `components/documents/UploadDocumentDialog.tsx` - Modal wrapper for upload
  - `components/ui/` - Base components (buttons, cards, badges, etc.)

### Current State
The documents page (`app/(protected)/documents/page.tsx`) implements a refresh mechanism using React's `key` prop to force complete component remounts when documents are uploaded. This approach works functionally but creates multiple UX issues:

**Current Flow:**
1. Upload completes → `DocumentUpload` calls `onUploadComplete(documentId)`
2. Parent page increments `refreshKey` state → `setRefreshKey(prev => prev + 1)`
3. `DocumentList` gets new `key={refreshKey}` → Complete component remount
4. Fresh data fetch → `fetchDocuments()` calls `/api/documents`
5. Polling restarts → If processing documents exist, polling begins from scratch

**Problems Identified:**
- ❌ Full component remount destroys state and causes loading spinners
- ❌ Loss of scroll position and "Live" polling indicator
- ❌ Double API calls: full refresh + immediate polling status fetch
- ❌ Brief UI flickers and unnecessary loading states
- ❌ Polling restarts from scratch even if already active
- ❌ No loading state feedback for manual refresh button clicks
- ❌ Missing optimistic updates for uploaded documents

## 3. Context & Problem Definition

### Problem Statement
The current document list refresh logic uses React's `key` prop to force component remounts, which is heavy-handed and creates poor user experience. Users see unnecessary loading states, lose their scroll position, and experience UI flickers after every document upload. The approach causes redundant API calls and inefficient polling restarts, making the interface feel sluggish despite having real-time capabilities.

This impacts the core user workflow of uploading documents and monitoring their processing status, which is central to the RAG document management feature.

### Success Criteria
- [ ] Document uploads provide instant optimistic feedback without full page refresh
- [ ] No more unnecessary loading spinners after successful uploads
- [ ] Scroll position and component state preserved during refreshes
- [ ] Polling continues seamlessly without restarts when adding new documents
- [ ] Manual refresh button shows proper loading state during operation
- [ ] Elimination of redundant API calls (no more double-fetching)
- [ ] Maintains all existing functionality: real-time polling, status updates, error handling
- [ ] "Live" indicator remains visible and accurate during updates

---

## 4. Technical Requirements

### Functional Requirements
- **Optimistic Updates:** When upload completes, immediately add document to list with "processing" status
- **State Preservation:** Maintain scroll position, polling state, and component state during updates
- **Efficient Polling:** Continue existing polling without interruption when new documents are added
- **Manual Refresh Feedback:** Show loading state on refresh button during API calls
- **Error Handling:** Fall back to full refresh if optimistic updates fail
- **Real-time Updates:** Maintain existing polling functionality for status updates
- **Delete Operations:** Maintain existing delete functionality with proper state updates

### Non-Functional Requirements
- **Performance:** Reduce API calls by 50% (eliminate redundant fetches)
- **User Experience:** Remove all unnecessary loading states and UI flickers
- **Responsiveness:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Accessibility:** Maintain existing ARIA labels and keyboard navigation
- **State Management:** Use efficient React patterns without external state libraries

### Technical Constraints
- **Must use existing API endpoints:** `/api/documents` and `/api/documents/processing-status`
- **Cannot modify database schema:** Work with existing document and processing job tables
- **Must maintain polling behavior:** Real-time updates for processing status are required
- **Preserve existing component interfaces:** Maintain compatibility with upload dialog and error modals

---

## 5. Data & Database Changes

### Database Schema Changes
**No database changes required** - All existing tables and relationships remain unchanged.

### Data Model Updates
**No data model changes needed** - Existing TypeScript interfaces in `lib/documents.ts` are sufficient:
- `DocumentWithProcessingJob` interface
- Existing API response structures
- Current polling and status update patterns

### Data Migration Plan
**No migrations needed** - This is purely a frontend optimization with no backend changes.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**✅ EXISTING APIs TO USE:**
- [ ] **`GET /api/documents`** - Full document list (for initial load and manual refresh)
- [ ] **`GET /api/documents/processing-status`** - Active processing jobs (for polling)
- [ ] **`DELETE /api/documents/{id}`** - Document deletion (existing)

**❌ NO NEW API ROUTES NEEDED** - All functionality can be achieved with existing endpoints.

### Server Actions
**No new server actions required** - Existing upload and delete operations work correctly.

### Database Queries
**No changes to database queries** - Existing query patterns in `lib/documents.ts` are sufficient:
- `getDocumentsWithProcessingStatus()` - Full document list with processing info
- `getActiveProcessingJobs()` - Only documents currently being processed

### API Routes (Only for Special Cases)
**No new API routes needed** - This optimization is purely client-side state management.

### External Integrations
**No external integration changes** - Google Cloud Storage upload flow remains unchanged.

---

## 7. Frontend Changes

### New Components
**No new components needed** - All optimization happens within existing components.

### Modified Components
- [ ] **`app/(protected)/documents/page.tsx`** - Remove `refreshKey` state, implement direct state updates
- [ ] **`components/documents/DocumentList.tsx`** - Add optimistic updates, improve refresh handling
- [ ] **`components/documents/UploadDocumentDialog.tsx`** - Update callback to provide document details for optimistic updates

**Component Requirements:**
- **Responsive Design:** Maintain existing mobile-first approach with Tailwind breakpoints
- **Theme Support:** Preserve existing dark/light mode compatibility
- **Accessibility:** Maintain existing ARIA labels and keyboard navigation patterns

### Page Updates
- [ ] **`/documents`** - Replace `key` prop refresh with direct state management

### State Management
**Improved State Flow:**
1. **Initial Load:** `useEffect` calls `fetchDocuments()` as before
2. **Upload Complete:** Optimistically add document to state, let polling handle status updates
3. **Manual Refresh:** Update state directly, show loading feedback
4. **Polling Updates:** Continue existing pattern but merge with optimistic state
5. **Error Recovery:** Fall back to full refresh if optimistic updates fail

---

## 8. Implementation Plan

### Phase 1: Remove Key-Based Refresh Pattern
**Goal:** Eliminate the root cause of component remounts

- [ ] **Task 1.1:** Update DocumentsPage to remove `refreshKey` state
  - Files: `app/(protected)/documents/page.tsx`
  - Details: Remove `refreshKey` state, remove `key` prop from DocumentList, update handleUploadComplete callback
- [ ] **Task 1.2:** Update DocumentList to accept external refresh commands
  - Files: `components/documents/DocumentList.tsx`
  - Details: Add `refreshTrigger` prop instead of relying on key changes, implement `useEffect` to watch for refresh triggers

### Phase 2: Implement Optimistic Updates
**Goal:** Provide instant feedback for document uploads

- [ ] **Task 2.1:** Add optimistic document insertion to DocumentList
  - Files: `components/documents/DocumentList.tsx`
  - Details: Create `addOptimisticDocument` function, merge optimistic docs with server data
- [ ] **Task 2.2:** Update upload completion callback with document details
  - Files: `components/documents/UploadDocumentDialog.tsx`, `app/(protected)/documents/page.tsx`
  - Details: Pass document details (name, size, etc.) for optimistic update instead of just ID

### Phase 3: Improve Manual Refresh UX
**Goal:** Add proper loading states and eliminate redundant calls

- [ ] **Task 3.1:** Add loading state to manual refresh
  - Files: `components/documents/DocumentList.tsx`
  - Details: Track refresh loading state, show spinner on refresh button during API calls
- [ ] **Task 3.2:** Optimize polling restart logic
  - Files: `components/documents/DocumentList.tsx`
  - Details: Don't restart polling if already active, seamlessly continue existing polling when new processing docs are added

### Phase 4: Error Handling & Testing
**Goal:** Ensure robust error handling and validate all functionality

- [ ] **Task 4.1:** Implement error recovery for optimistic updates
  - Files: `components/documents/DocumentList.tsx`
  - Details: Fall back to full refresh if optimistic update fails, show appropriate error messages
- [ ] **Task 4.2:** Testing and validation
  - Files: All modified files
  - Details: Test upload flow, polling behavior, manual refresh, error scenarios, mobile responsiveness

---

## 9. File Structure & Organization

### New Files to Create
**No new files needed** - All optimization happens within existing file structure.

### Files to Modify
- [ ] **`app/(protected)/documents/page.tsx`** - Remove refreshKey pattern, implement direct state updates
- [ ] **`components/documents/DocumentList.tsx`** - Add optimistic updates, improve state management
- [ ] **`components/documents/UploadDocumentDialog.tsx`** - Update callback interface for optimistic updates

### Dependencies to Add
**No new dependencies required** - All functionality achievable with existing React patterns and libraries.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Optimistic Update Fails:** Document appears immediately but API call fails
  - **Handling:** Remove optimistic document, show error toast, fall back to full refresh
- [ ] **Network Failure During Refresh:** Manual refresh API call fails
  - **Handling:** Show error state, provide retry button, maintain existing document list
- [ ] **Polling Interruption:** WebSocket or polling fails during optimistic update
  - **Handling:** Continue polling attempts, show connection status, allow manual refresh

### Edge Cases
- [ ] **Multiple Rapid Uploads:** User uploads several documents quickly
  - **Solution:** Queue optimistic updates, handle multiple processing documents correctly
- [ ] **Browser Tab Switching:** User switches tabs during upload/processing
  - **Solution:** Maintain existing visibility detection for polling, resume on tab focus
- [ ] **Component Unmount During Upload:** User navigates away during upload
  - **Solution:** Cleanup polling intervals, handle promise cancellation properly

---

## 11. Security Considerations

### Authentication & Authorization
**No changes required** - Existing Supabase auth and middleware patterns remain unchanged.

### Input Validation
**No changes required** - File upload validation and API security remain the same.

---

## 12. Deployment & Configuration

### Environment Variables
**No new environment variables needed** - All existing configuration sufficient.

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task document has been created and requires user approval before implementation begins.

### Communication Preferences
- [ ] Provide regular progress updates during each phase
- [ ] Flag any technical challenges with the optimistic update approach
- [ ] Suggest improvements to the polling logic if discovered during implementation
- [ ] Test thoroughly on mobile devices and different screen sizes

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **GET APPROVAL FIRST (Required)**
   - [ ] **Wait for explicit user approval** of this task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Test each change incrementally to ensure no regressions
   - [ ] Follow existing code patterns and conventions
   - [ ] **Test all functionality in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] Document any deviations from the approved plan

### Code Quality Standards
- [ ] Follow existing TypeScript patterns in the codebase
- [ ] Add comprehensive comments for complex state management logic
- [ ] **Ensure responsive design maintained (mobile-first approach)**
- [ ] **Test optimistic updates work correctly with polling**
- [ ] **Verify no memory leaks in polling intervals**
- [ ] Use existing error handling patterns and toast notifications

### Architecture Compliance
- [ ] **✅ VERIFY: No new API routes created** - All optimization is client-side
- [ ] **✅ VERIFY: Existing API endpoints used efficiently**
- [ ] **✅ VERIFY: No unnecessary API calls introduced**
- [ ] **🔍 DOUBLE-CHECK: Polling behavior remains efficient and doesn't create API spam**

---

## 14. Notes & Additional Context

### Research Links
- [React Key Prop Best Practices](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [Optimistic Updates Pattern](https://react.dev/reference/react/useOptimistic)
- [Efficient Polling Strategies](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

### Performance Benefits Expected
- **50% reduction in API calls** - Eliminate redundant fetch after uploads
- **Instant UI feedback** - Documents appear immediately without loading states  
- **Preserved user context** - No more lost scroll position or state
- **Smoother polling** - No unnecessary polling restarts

### Current Behavior vs Expected Behavior
**Current:** Upload → Full remount → Loading spinner → API call → Polling restart
**Expected:** Upload → Instant document appears → Seamless polling continues → Status updates naturally

---

*Template Version: 1.0*  
*Task Number: 045*  
*Created: January 7, 2025*  
*Priority: High (Core UX Issue)* 
