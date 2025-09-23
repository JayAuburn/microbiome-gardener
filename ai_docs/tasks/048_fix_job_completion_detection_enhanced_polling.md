# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix Job Completion Detection with Enhanced Polling Strategy

### Goal Statement
**Goal:** Eliminate the race condition where users must manually refresh to see completed document processing jobs by implementing an enhanced polling strategy that reliably detects job state transitions from "processing" to "completed" within 60 seconds, providing immediate user feedback and notifications.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/documents/DocumentList.tsx` - Main document list with current polling logic
  - `components/documents/ProcessingStatusIndicator.tsx` - Status display components
  - `lib/documents.ts` - Database queries for document and job data
  - `app/api/documents/processing-status/route.ts` - Current polling endpoint

### Current State
The document processing system has a critical UX issue where users must manually refresh to see completed jobs. The current polling mechanism:

1. **Active polling**: `fetchProcessingStatus()` polls every 4 seconds for jobs with status `["pending", "processing", "retry_pending"]`
2. **Job completes**: Python service updates database: `status = "processed"`, `stage = "completed"`
3. **Next poll**: Job no longer appears in active jobs response (filtered out)
4. **Polling stops**: System detects no active jobs, stops polling, triggers full refresh via `setRefreshTrigger()`
5. **Race condition**: The transition between steps 3-4 can miss the completion, requiring manual refresh

The polling logic in `DocumentList.tsx` has been recently optimized to use a trigger-based refresh system to avoid circular dependencies, but the core issue remains: **there's a gap between when jobs complete and when the UI detects the completion**.

## 3. Context & Problem Definition

### Problem Statement
Users experience a frustrating UX where document processing jobs get "stuck" in the "processing" state even after completion. This happens because:

1. **Race condition**: The polling mechanism has a window where completed jobs are filtered out of the active jobs response but haven't triggered the full refresh yet
2. **Network timing**: If a poll request occurs between job completion and database update, the completion can be missed
3. **No completion notifications**: Users have no feedback when jobs actually complete
4. **Trust issues**: Users lose confidence in the system and manually refresh, defeating the purpose of real-time updates

This creates a poor user experience where users think the system is broken or slow, when in reality the jobs are completing successfully.

### Success Criteria
- [ ] Users never need to manually refresh to see completed jobs
- [ ] Job completion is detected within 60 seconds of actual completion
- [ ] Users receive immediate visual feedback when jobs complete (toast notifications)
- [ ] System handles network interruptions gracefully
- [ ] Polling logic is robust against race conditions
- [ ] No impact on system performance or database load

---

## 4. Technical Requirements

### Functional Requirements
- **Enhanced polling endpoint**: API returns both active jobs AND recently completed jobs (within 60 seconds)
- **Transition detection**: Frontend detects when jobs change from "processing" to "completed"  
- **Completion notifications**: Toast notifications appear when jobs complete
- **Grace period polling**: Continue polling briefly after no active jobs to catch stragglers
- **Optimistic updates**: Show completion state immediately when detected
- **Error recovery**: Handle network failures and temporary service interruptions

### Non-Functional Requirements
- **Performance**: No significant increase in API response time or database queries
- **Reliability**: 99%+ completion detection rate (no missed transitions)
- **Responsiveness**: Completion detected within 60 seconds
- **Responsive Design**: Toast notifications work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support**: All UI components support both light and dark mode
- **Accessibility**: Toast notifications follow WCAG AA guidelines with proper ARIA labels

### Technical Constraints
- **Backwards compatibility**: Must not break existing polling functionality
- **Database performance**: Cannot significantly increase query load
- **Network efficiency**: Minimize additional API calls and data transfer
- **Existing architecture**: Build on current polling system, no major architectural changes

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required. The existing `document_processing_jobs` table already has the necessary fields:
- `status` - Job status (pending, processing, processed, error)
- `updated_at` - Timestamp for filtering recently completed jobs
- `document_id` - Link to documents table

### Data Model Updates
```typescript
// Enhanced API response type
interface ProcessingStatusResponse {
  activeJobs: DocumentWithProcessingJob[];
  recentlyCompleted: DocumentWithProcessingJob[];
  timestamp: string;
  hasActiveProcessing: boolean;
}

// Job transition tracking
interface JobTransition {
  jobId: string;
  documentId: string;
  filename: string;
  oldStatus: string;
  newStatus: string;
  transitionTime: string;
}
```

### Data Migration Plan
No data migration required - using existing data structures.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

#### **QUERIES (Data Fetching)** → `lib/documents.ts`
- [ ] **Enhanced Query Function** - `getActiveAndRecentProcessingJobs()` in `lib/documents.ts`
- [ ] **Rationale**: Complex query with time-based filtering and multiple status conditions

#### **API Routes** → `app/api/documents/processing-status/route.ts`
- [ ] **Enhanced Processing Status Endpoint** - Modify existing route to include recent completions
- [ ] **Rationale**: External polling endpoint, already exists for this purpose

### Enhanced Database Queries
```typescript
// New function in lib/documents.ts
export async function getActiveAndRecentProcessingJobs(
  userId: string,
  recentWindowSeconds: number = 60
): Promise<{
  activeJobs: DocumentWithProcessingJob[];
  recentlyCompleted: DocumentWithProcessingJob[];
}> {
  // Query active jobs (current logic)
  const activeJobs = await getActiveProcessingJobs(userId);
  
  // Query recently completed jobs (new logic)
  const recentlyCompleted = await db
    .select(/* same fields as activeJobs */)
    .from(documents)
    .innerJoin(documentProcessingJobs, eq(documents.id, documentProcessingJobs.documentId))
    .where(
      and(
        eq(documents.user_id, userId),
        inArray(documentProcessingJobs.status, ['processed', 'error']),
        gte(documentProcessingJobs.updated_at, 
          new Date(Date.now() - recentWindowSeconds * 1000))
      )
    )
    .orderBy(desc(documentProcessingJobs.updated_at));
    
  return { activeJobs, recentlyCompleted };
}
```

### API Routes Enhancement
- [ ] **Enhanced `/api/documents/processing-status` endpoint** - Return both active and recently completed jobs
- [ ] **Query parameter**: `?includeRecent=true` to include recently completed jobs
- [ ] **Response format**: Include both `activeJobs` and `recentlyCompleted` arrays

---

## 7. Frontend Changes

### New Components
- [ ] **`components/documents/CompletionToast.tsx`** - Toast notification for job completion
- [ ] **`components/documents/EnhancedPollingIndicator.tsx`** - Improved "Live" indicator with last updated timestamp

### Component Updates
- [ ] **`components/documents/DocumentList.tsx`** - Enhanced polling logic with transition detection
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Add completion animation effects

### State Management
- **Job state tracking**: Track previous job states to detect transitions
- **Toast notifications**: Use `sonner` library for completion notifications
- **Optimistic updates**: Immediately update UI when completion detected
- **Grace period**: Extend polling briefly after no active jobs found

### Enhanced Polling Logic
```typescript
// In DocumentList.tsx
const useEnhancedPolling = () => {
  const [previousJobStates, setPreviousJobStates] = useState<Map<string, string>>(new Map());
  const [gracePeriodEnd, setGracePeriodEnd] = useState<Date | null>(null);
  
  const fetchEnhancedStatus = async () => {
    const response = await fetch('/api/documents/processing-status?includeRecent=true');
    const data: ProcessingStatusResponse = await response.json();
    
    // Detect job transitions
    const transitions = detectJobTransitions(data.activeJobs, data.recentlyCompleted, previousJobStates);
    
    // Handle completion notifications
    transitions.forEach(transition => {
      if (transition.newStatus === 'completed') {
        toast.success(`Processing completed for "${transition.filename}"`);
      } else if (transition.newStatus === 'error') {
        toast.error(`Processing failed for "${transition.filename}"`);
      }
    });
    
    // Update state tracking
    const newStates = new Map();
    [...data.activeJobs, ...data.recentlyCompleted].forEach(job => {
      newStates.set(job.id, job.status);
    });
    setPreviousJobStates(newStates);
    
    return data.activeJobs;
  };
  
  // Grace period logic for continued polling
  const shouldContinuePolling = (activeJobs: DocumentWithProcessingJob[]) => {
    if (activeJobs.length > 0) {
      setGracePeriodEnd(null);
      return true;
    }
    
    if (!gracePeriodEnd) {
      setGracePeriodEnd(new Date(Date.now() + 15000)); // 15 second grace period
      return true;
    }
    
    return Date.now() < gracePeriodEnd.getTime();
  };
};
```

---

## 8. Implementation Plan

### Phase 1: Backend Enhancement
**Goal:** Enhance the processing status API to return recently completed jobs

- [ ] **Task 1.1:** Update `lib/documents.ts` with enhanced query function
  - Files: `lib/documents.ts`
  - Details: Add `getActiveAndRecentProcessingJobs()` function with 60-second window
- [ ] **Task 1.2:** Modify processing status API endpoint
  - Files: `app/api/documents/processing-status/route.ts`
  - Details: Add support for `includeRecent` query parameter, return enhanced response format
- [ ] **Task 1.3:** Update TypeScript types
  - Files: `lib/documents.ts`
  - Details: Add `ProcessingStatusResponse` and `JobTransition` interfaces

### Phase 2: Frontend Polling Enhancement
**Goal:** Implement enhanced polling logic with transition detection

- [ ] **Task 2.1:** Create enhanced polling hook
  - Files: `components/documents/DocumentList.tsx`
  - Details: Add job state tracking, transition detection, grace period logic
- [ ] **Task 2.2:** Implement completion notifications
  - Files: `components/documents/DocumentList.tsx`
  - Details: Add toast notifications for job completions and failures
- [ ] **Task 2.3:** Add optimistic updates
  - Files: `components/documents/DocumentList.tsx`
  - Details: Immediately update UI when transitions detected

### Phase 3: User Experience Improvements
**Goal:** Add visual feedback and error handling

- [ ] **Task 3.1:** Enhance polling indicator
  - Files: `components/documents/DocumentList.tsx`
  - Details: Add "last updated" timestamp, improved visual feedback
- [ ] **Task 3.2:** Add error recovery
  - Files: `components/documents/DocumentList.tsx`
  - Details: Handle network failures, retry logic, graceful degradation
- [ ] **Task 3.3:** Add completion animations
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Smooth transitions, completion effects

---

## 9. File Structure & Organization

### Files to Create
No new files needed - enhancing existing components.

### Files to Modify
- [ ] **`lib/documents.ts`** - Add enhanced query function for active and recent jobs
- [ ] **`app/api/documents/processing-status/route.ts`** - Support recent completions parameter
- [ ] **`components/documents/DocumentList.tsx`** - Enhanced polling logic with transition detection
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Add completion animations

### Dependencies to Add
No new dependencies required - using existing `sonner` for toasts.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Network interruption during polling** 
  - **Handling:** Implement retry logic with exponential backoff, show connection status
- [ ] **API endpoint returns error**
  - **Handling:** Graceful degradation, show last known state, retry mechanism
- [ ] **Database query timeout**
  - **Handling:** Return cached results, log error, continue polling

### Edge Cases
- [ ] **Job completes between API calls**
  - **Solution:** 60-second window ensures completion is captured in next poll
- [ ] **Multiple jobs complete simultaneously**
  - **Solution:** Batch process transitions, show grouped notifications
- [ ] **Job status changes multiple times quickly**
  - **Solution:** Only notify on final stable state, debounce notifications
- [ ] **User navigates away during processing**
  - **Solution:** Clean up polling on component unmount, resume on return

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **User-scoped queries**: All queries filtered by authenticated user ID
- [ ] **No sensitive data exposure**: Job status and metadata only, no file contents
- [ ] **Rate limiting**: Existing API rate limiting applies to enhanced endpoint

### Input Validation
- [ ] **Query parameter validation**: Validate `includeRecent` parameter
- [ ] **Time window bounds**: Ensure recent window parameter is within reasonable limits
- [ ] **User ID validation**: Verify user authentication on all requests

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required - using existing database and API configuration.

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if polling intervals need adjustment
- [ ] Provide progress updates after each phase completion
- [ ] Flag any performance concerns with database queries
- [ ] Suggest improvements for user notification patterns

### Implementation Approach - CRITICAL WORKFLOW
1. **CREATE TASK DOCUMENT FIRST** ✅ (This document)
2. **GET APPROVAL SECOND** (Wait for user approval)
3. **IMPLEMENT THIRD** (Only after approval)
   - Start with Phase 1 (Backend) and complete fully before Phase 2
   - Test enhanced API endpoint thoroughly
   - Verify polling logic with multiple job scenarios
   - Test completion notifications in both light and dark themes
   - Ensure mobile responsiveness of toast notifications

### Code Quality Standards
- [ ] Follow TypeScript best practices with strict mode
- [ ] Add comprehensive error handling for network failures
- [ ] Include detailed logging for debugging polling issues
- [ ] Ensure responsive design for toast notifications (mobile-first)
- [ ] Test components in both light and dark mode
- [ ] Verify accessibility of toast notifications (WCAG AA)

### Architecture Compliance
- [ ] **✅ VERIFIED: Using correct data access pattern**
  - [ ] Enhanced queries → lib functions (`lib/documents.ts`)
  - [ ] API endpoint → existing polling route (appropriate use case)
- [ ] **❌ AVOIDED: Creating unnecessary new API routes**
- [ ] **🔍 CONFIRMED: Building on existing polling infrastructure**

---

## 14. Notes & Additional Context

### Performance Considerations
- **Database impact**: Additional query for recently completed jobs, but filtered by user and time window
- **Network overhead**: Slightly larger API responses, but includes useful data
- **Client memory**: Job state tracking adds minimal memory usage
- **Polling frequency**: Same 4-second interval, no increase in request frequency

### User Experience Flow
1. User uploads document → sees "processing" status
2. Backend processes file → updates database to "completed"
3. Within 60 seconds, next poll includes job in "recently completed"
4. Frontend detects transition → shows toast notification
5. Document status updates to "completed" immediately
6. User sees completion without manual refresh

### Testing Strategy
- **Unit tests**: Test transition detection logic with various job state scenarios
- **Integration tests**: Test full polling cycle with mock job completions
- **Manual testing**: Upload documents and verify completion detection
- **Performance tests**: Verify no significant impact on API response times

---

*Template Version: 1.0*  
*Last Updated: [Current Date]*  
*Created By: AI Assistant* 
