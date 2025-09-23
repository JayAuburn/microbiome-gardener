# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Improve Document Deletion User Experience with Loading States and Toast Notifications

### Goal Statement
**Goal:** Enhance the document deletion experience by adding visual feedback during deletion operations, implementing toast notifications for success/failure states, and ensuring users have clear confirmation of deletion status. This will improve user confidence and provide better error handling for deletion operations.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Toast System:** Sonner (already configured in `app/layout.tsx` with `<Toaster />`)
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, API routes for mutations
- **Relevant Existing Components:** 
  - `components/documents/DocumentList.tsx` - Contains deletion logic
  - `components/ui/sonner.tsx` - Toast system wrapper
  - `app/api/documents/[id]/route.ts` - Deletion API endpoint

### Current State
**Based on file analysis:**
- Document deletion functionality exists in `DocumentList.tsx` with confirmation dialog
- API endpoint properly deletes documents, chunks, and GCS files in a transaction
- No loading state during deletion - users get no feedback that deletion is happening
- No toast notifications for success/failure - only console logging
- Comments in code indicate toast notifications were planned but not implemented
- Sonner toast system is configured but not used for interactive operations

## 3. Context & Problem Definition

### Problem Statement
When users delete documents, they experience poor UX due to:
1. **No loading feedback** - Users can't tell if deletion is happening or if they should wait
2. **No success confirmation** - Users don't know if deletion was successful
3. **No error feedback** - Failed deletions are only logged to console, leaving users confused
4. **Potential double-clicks** - Without loading states, users might click delete multiple times

This creates uncertainty and frustration, especially for users with slower connections or when dealing with large documents that take time to process.

### Success Criteria
- [ ] Delete button shows loading spinner during deletion operation
- [ ] Success toast notification appears when deletion completes successfully
- [ ] Error toast notification appears when deletion fails
- [ ] Delete button is disabled during deletion to prevent double-clicks
- [ ] User receives clear feedback about what's happening at each step
- [ ] Document is properly removed from UI after successful deletion
- [ ] All associated chunks and embeddings are deleted (already working)

---

## 4. Technical Requirements

### Functional Requirements
- User clicks delete button and sees immediate loading state
- Delete button becomes disabled during operation
- Success toast shows "Document deleted successfully" with document name
- Error toast shows "Failed to delete document" with retry option
- Loading state persists until API response is received
- Document disappears from list only after successful deletion
- Toast notifications auto-dismiss after 4-5 seconds

### Non-Functional Requirements
- **Performance:** Loading state should appear within 100ms of click
- **Security:** Maintains existing authorization checks
- **Usability:** Clear visual feedback for all deletion states
- **Responsive Design:** Toast notifications work on mobile, tablet, and desktop
- **Theme Support:** Toast notifications support both light and dark mode
- **Accessibility:** Proper ARIA labels for loading states and toast messages

### Technical Constraints
- Must use existing Sonner toast system
- Cannot modify API endpoint behavior (already handles all deletion properly)
- Must maintain existing confirmation dialog
- Cannot change database schema or deletion logic

---

## 5. Data & Database Changes

### Database Schema Changes
**None required** - The existing deletion logic already properly handles:
- Deleting document chunks (with foreign key cascade)
- Deleting document records
- Cleaning up GCS files
- Maintaining data integrity with transactions

### Data Model Updates
**None required** - Existing API response structure is sufficient for UI feedback.

### Data Migration Plan
**None required** - No schema changes needed.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES
**No changes needed** - The existing API endpoint `app/api/documents/[id]/route.ts` already:
- Handles authentication properly
- Deletes all associated data in correct order
- Uses database transactions for consistency
- Includes proper error handling
- Returns appropriate success/error responses

### Server Actions
**Not applicable** - Using existing API route pattern

### Database Queries
**No changes needed** - Existing deletion logic is comprehensive

### API Routes
**No changes needed** - `DELETE /api/documents/[id]` already works correctly

### External Integrations
**No changes needed** - GCS file deletion is already handled

---

## 7. Frontend Changes

### New Components
**No new components needed** - All changes will be made to existing `DocumentList.tsx`

### Page Updates
**No page changes** - All updates are within the existing DocumentList component

### State Management
**Local state additions in DocumentList.tsx:**
- `deletingDocumentId: string | null` - Track which document is being deleted
- Update deletion handler to manage loading state
- Add toast notifications using Sonner's `toast` function

---

## 8. Implementation Plan

### Phase 1: Add Loading State Management
**Goal:** Implement loading state tracking for deletion operations

- [ ] **Task 1.1:** Add loading state to DocumentList component
  - Files: `components/documents/DocumentList.tsx`
  - Details: Add `deletingDocumentId` state to track which document is being deleted
  
- [ ] **Task 1.2:** Update delete button to show loading state
  - Files: `components/documents/DocumentList.tsx`
  - Details: Replace Trash2 icon with Loader2 spinner when deleting, disable button

### Phase 2: Implement Toast Notifications
**Goal:** Add success and error toast notifications

- [ ] **Task 2.1:** Import and configure toast function
  - Files: `components/documents/DocumentList.tsx`
  - Details: Import `toast` from 'sonner' and configure success/error notifications
  
- [ ] **Task 2.2:** Add toast notifications to deletion handler
  - Files: `components/documents/DocumentList.tsx`
  - Details: Show success toast with document name, error toast with retry option

### Phase 3: Polish and Error Handling
**Goal:** Ensure robust error handling and user experience

- [ ] **Task 3.1:** Add proper error handling for different failure scenarios
  - Files: `components/documents/DocumentList.tsx`
  - Details: Handle network errors, server errors, and authorization failures
  
- [ ] **Task 3.2:** Test responsive behavior and accessibility
  - Files: `components/documents/DocumentList.tsx`
  - Details: Verify toast notifications work on all screen sizes and with screen readers

---

## 9. File Structure & Organization

### New Files to Create
**None** - All changes are modifications to existing files

### Files to Modify
- [ ] **`components/documents/DocumentList.tsx`** - Add loading states and toast notifications

### Dependencies to Add
**None** - Sonner is already installed and configured

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Network Error:** Show "Connection failed" toast with retry option
  - **Handling:** Use try-catch with specific error messages
- [ ] **Server Error:** Show "Server error occurred" toast
  - **Handling:** Check response status and show appropriate message
- [ ] **Authorization Error:** Show "Not authorized" toast
  - **Handling:** Handle 401/403 responses specifically
- [ ] **Document Not Found:** Show "Document not found" toast
  - **Handling:** Handle 404 response with helpful message

### Edge Cases
- [ ] **Multiple Delete Attempts:** Prevent double-clicks with disabled button
  - **Solution:** Disable button during deletion operation
- [ ] **Component Unmount During Deletion:** Handle cleanup properly
  - **Solution:** Use cleanup functions in useEffect if needed
- [ ] **Slow Network:** Show loading state for extended periods
  - **Solution:** Keep spinner visible until response received

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Existing API endpoint already handles user authentication
- [ ] No additional security measures needed for UI improvements

### Input Validation
- [ ] No new user inputs introduced
- [ ] Existing validation remains in place

---

## 12. Deployment & Configuration

### Environment Variables
**None needed** - No configuration changes required

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
When a user requests any new feature, improvement, or significant change, your **DEFAULT BEHAVIOR** should be:

1. **CREATE A TASK DOCUMENT** in `ai_docs/` using this template
2. **GET USER APPROVAL** of the task document  
3. **IMPLEMENT THE FEATURE** only after approval

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (Required)** ✅ **COMPLETED**
   - [x] Created task document `038_improve_document_deletion_ux.md`
   - [x] Filled out all sections with specific details for document deletion UX
   - [x] Used next incremental number (038)

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Import `toast` from 'sonner' in DocumentList.tsx
   - [ ] Add loading state management with `deletingDocumentId` state
   - [ ] Update delete button to show Loader2 spinner when deleting
   - [ ] Disable delete button during deletion operation
   - [ ] Add success toast: `toast.success("Document deleted successfully")`
   - [ ] Add error toast: `toast.error("Failed to delete document")`
   - [ ] Test all states in both light and dark themes
   - [ ] Verify responsive behavior on mobile, tablet, and desktop
   - [ ] Test error scenarios and edge cases

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed" / "Go ahead" / "Approved" / "Start implementation"
- "Looks good" / "Begin" / "Execute the plan" / "That works"
- "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific implementation details
- Requests for changes or modifications
- No response or silence

🛑 **NEVER start coding without user approval of the task document first!**

### Code Quality Standards
- [ ] Import toast function correctly from 'sonner'
- [ ] Use proper TypeScript types for state management
- [ ] Add comprehensive error handling with try-catch
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA) for loading states

---

## 14. Notes & Additional Context

### Implementation Notes
- Sonner toast system is already configured and working
- The `UpgradeSuccessToast` component shows how custom toast-like notifications are implemented, but for this task we'll use the standard Sonner toast functions
- The API endpoint already returns proper JSON responses with success/error status
- The existing confirmation dialog should remain - loading states and toasts are additional UX improvements

### Testing Checklist
- [ ] Test successful deletion with toast notification
- [ ] Test deletion failure with error toast
- [ ] Test loading state visual feedback
- [ ] Test button disabled state during deletion
- [ ] Test responsiveness on mobile devices
- [ ] Test both light and dark themes
- [ ] Test accessibility with screen readers
- [ ] Test network error scenarios

---

*Template Version: 1.0*  
*Last Updated: 12/30/2024*  
*Created By: AI Assistant* 
