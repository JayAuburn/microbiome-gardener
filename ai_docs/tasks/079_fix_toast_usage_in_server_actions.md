# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix Toast Usage in Server Actions - Move Client-Side Notifications to Frontend

### Goal Statement
**Goal:** Remove improper usage of `toast` notifications from server actions and implement proper error handling pattern where server actions return error states and client-side code handles toast notifications. This ensures proper separation of concerns between server-side logic and client-side UI feedback.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current implementation has `toast.error()` calls directly in server actions (`app/actions/chat.ts`), which is architecturally incorrect because:
- Server actions run on the server side without DOM access
- Toast notifications from `sonner` require browser/client-side execution
- This violates the proper separation between server logic and client UI feedback
- It can cause runtime errors or silent failures

This is a straightforward architectural fix with one clear solution pattern, so strategic analysis of multiple options is not needed.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3 with App Router, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS, sonner for toast notifications
- **Authentication:** Supabase Auth managed by middleware.ts
- **Key Architectural Patterns:** Server Actions for mutations, proper client/server separation
- **Relevant Existing Components:** `toast` from sonner library used in client components

### Current State
The `app/actions/chat.ts` file contains three violations of proper toast usage:
1. Line 74: `toast.error(`Upload failed: ${uploadError.message}`);` in `uploadFileToStorage`
2. Line 85: `toast.error(`Failed to generate signed URL: ${urlError?.message || "Unknown error"}`);` in `uploadFileToStorage`
3. Line 99: `toast.error("Failed to upload file");` in `uploadFileToStorage`

The server actions currently return error objects but also incorrectly attempt to show toast notifications on the server side. Client components that call these server actions need to be updated to handle the error responses and show appropriate toast notifications.

## 4. Context & Problem Definition

### Problem Statement
Server actions in `app/actions/chat.ts` are incorrectly using `toast.error()` calls, which attempt to execute client-side DOM manipulation code on the server side. This creates an architectural violation where server-side business logic is mixed with client-side UI feedback. The proper pattern is for server actions to return structured error responses and let client-side code handle toast notifications based on those responses.

### Success Criteria
- [ ] Remove all `toast` imports and calls from server actions
- [ ] Server actions return proper structured error responses without attempting UI feedback
- [ ] Client-side code calling server actions handles error responses and shows appropriate toast notifications
- [ ] No runtime errors related to server-side toast usage
- [ ] Proper separation of concerns between server logic and client UI feedback

---

## 5. Technical Requirements

### Functional Requirements
- Server actions must return structured response objects with success/error states
- Client components must handle server action responses and show toast notifications
- Error messages must be preserved and properly displayed to users
- File upload error handling must remain comprehensive and user-friendly

### Non-Functional Requirements
- **Performance:** No impact on performance, may slightly improve by removing unnecessary server-side operations
- **Security:** Maintain existing security validations and error handling
- **Usability:** Users must continue to receive clear error feedback through toast notifications
- **Responsive Design:** No impact on responsive design
- **Theme Support:** No impact on theme support
- **Compatibility:** Must work with existing server action patterns

### Technical Constraints
- Must maintain existing server action interfaces for backward compatibility
- Cannot change the overall error handling logic, only move toast notifications to client side
- Must preserve all existing validation and error messages

---

## 6. Data & Database Changes

### Database Schema Changes
No database changes required.

### Data Model Updates
No data model changes required.

### Data Migration Plan
No data migration required.

---

## 7. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

This task follows proper architectural patterns:
- **Server Actions** (`app/actions/chat.ts`) - Handle mutations and return structured responses
- **No API Routes needed** - This is internal error handling, not external integration

### Server Actions
- [ ] **`uploadFileToStorage`** - Remove toast calls, ensure proper error return structure
- [ ] **`upsertConversationAndUserMessage`** - Verify error propagation from uploadFileToStorage
- [ ] **All server actions** - Audit for any other improper toast usage

### Database Queries
No changes to database query patterns required.

### External Integrations
No changes to external integrations required.

---

## 8. Frontend Changes

### New Components
No new components required.

### Page Updates
- [ ] **Chat pages that call server actions** - Update to handle error responses and show toast notifications
- [ ] **Any components using `upsertConversationAndUserMessage`** - Add proper error handling with toast notifications

### State Management
- Add proper error state handling in components that call the affected server actions
- Ensure toast notifications are triggered based on server action response states

---

## 9. Implementation Plan

### Phase 1: Audit and Remove Server-Side Toast Usage
**Goal:** Remove all improper toast usage from server actions

- [ ] **Task 1.1:** Remove Toast Import and Calls from Server Actions
  - Files: `app/actions/chat.ts`
  - Details: Remove `import { toast } from "sonner";` and all `toast.error()` calls
- [ ] **Task 1.2:** Verify Server Action Return Types
  - Files: `app/actions/chat.ts`
  - Details: Ensure all functions return proper structured error responses

### Phase 2: Identify Client-Side Callers
**Goal:** Find all client components that call the affected server actions

- [ ] **Task 2.1:** Search for Server Action Usage
  - Search pattern: `upsertConversationAndUserMessage`, `uploadFileToStorage` usage
  - Details: Identify all client components that need error handling updates
- [ ] **Task 2.2:** Analyze Current Error Handling
  - Files: Client components calling the server actions
  - Details: Determine current error handling patterns and what needs to be added

### Phase 3: Implement Client-Side Error Handling
**Goal:** Add proper toast notifications in client components

- [ ] **Task 3.1:** Update Client Components with Toast Error Handling
  - Files: Components identified in Phase 2
  - Details: Add error response handling and toast notifications
- [ ] **Task 3.2:** Test Error Scenarios
  - Details: Verify all error cases properly show toast notifications to users

### Phase 4: Validation and Testing
**Goal:** Ensure complete functionality with proper architecture

- [ ] **Task 4.1:** Test File Upload Error Scenarios
  - Details: Test invalid file types, size limits, upload failures
- [ ] **Task 4.2:** Verify No Server-Side Toast Dependencies
  - Details: Ensure no remaining server-side toast usage anywhere in actions

---

## 10. File Structure & Organization

### New Files to Create
No new files required.

### Files to Modify
- [ ] **`app/actions/chat.ts`** - Remove toast imports and calls, ensure proper error returns
- [ ] **Client components calling server actions** - Add toast error handling (to be identified in Phase 2)

### Dependencies to Add
No new dependencies required.

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **File upload validation errors** - Must show clear toast messages about file type/size issues
  - **Handling:** Client components check server action response and show specific error toasts
- [ ] **Supabase storage errors** - Must show meaningful error messages to users
  - **Handling:** Preserve original error messages in server response, display via client toast
- [ ] **Network/connection errors** - Must handle server action failures gracefully
  - **Handling:** Client components have try/catch blocks with generic error toasts

### Edge Cases
- [ ] **Multiple simultaneous uploads** - Each should show individual error toasts if needed
  - **Solution:** Ensure error handling works for batch operations
- [ ] **Server action timeout** - Must show appropriate user feedback
  - **Solution:** Client-side timeout handling with toast notifications

---

## 12. Security Considerations

### Authentication & Authorization
No changes to authentication/authorization patterns.

### Input Validation
All existing server-side validation remains unchanged - only moving UI feedback to client side.

---

## 13. Deployment & Configuration

### Environment Variables
No environment variable changes required.

---

## 14. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
This is a straightforward architectural fix with one clear solution, so strategic analysis was not needed.

### Communication Preferences
- [ ] Provide clear explanation of changes made to server actions
- [ ] Flag any client components that need error handling updates
- [ ] Confirm all error scenarios still provide user feedback

### Implementation Approach - CRITICAL WORKFLOW

1. **CREATE TASK DOCUMENT** ✅ (Current step)
2. **GET APPROVAL** (Wait for user confirmation)
3. **IMPLEMENT** (Only after approval)

### Code Quality Standards
- [ ] Follow TypeScript best practices with explicit return types
- [ ] Add proper error handling with early returns
- [ ] Use async/await instead of .then() chaining
- [ ] Ensure responsive design and theme support
- [ ] Follow accessibility guidelines

### Architecture Compliance
- [ ] **✅ VERIFY: Proper separation of server and client concerns**
- [ ] **✅ VERIFY: Server actions only handle business logic and return structured responses**
- [ ] **✅ VERIFY: Client components handle UI feedback based on server responses**

---

## 15. Notes & Additional Context

### Research Links
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Sonner Toast Library Documentation](https://sonner.emilkowal.ski/)

---

## 16. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No breaking changes to server action interfaces
- [ ] **Component Dependencies:** Client components calling server actions will need updates
- [ ] **Authentication/Authorization:** No impact on auth patterns

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No changes to data flow, only error handling UI feedback
- [ ] **UI/UX Cascading Effects:** May require updates to multiple client components
- [ ] **State Management:** Minimal impact - only error handling state changes

#### 3. **Performance Implications**
- [ ] **Server Load:** Slight improvement by removing unnecessary server-side operations
- [ ] **Bundle Size:** No impact on bundle size
- [ ] **Client Performance:** No significant impact

#### 4. **Security Considerations**
- [ ] **Attack Surface:** No new attack vectors introduced
- [ ] **Data Exposure:** No risk of data exposure
- [ ] **Input Validation:** All existing validation remains intact

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** No disruption to user workflows
- [ ] **Error Feedback:** Error feedback will be preserved and properly implemented
- [ ] **Learning Curve:** No impact on user experience

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Slight improvement in architectural clarity
- [ ] **Testing Overhead:** Minimal additional testing required

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
No critical red flags identified for this architectural fix.

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Client Component Updates:** Multiple client components may need updates for error handling
- [ ] **Testing Requirements:** All error scenarios must be manually tested to ensure toast notifications work

### Mitigation Strategies

#### Error Handling
- [ ] **Comprehensive Testing:** Test all error scenarios to ensure proper toast notifications
- [ ] **Fallback Handling:** Ensure generic error toasts for unexpected error cases
- [ ] **Error Message Preservation:** Maintain all existing error message content

🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- None - This is an internal architectural improvement

**Performance Implications:**
- Slight server performance improvement by removing unnecessary client-side operations
- No impact on client-side performance

**User Experience Impacts:**
- Error feedback will remain the same from user perspective
- Proper architectural separation improves maintainability

**Mitigation Recommendations:**
- Thoroughly test all error scenarios after implementation
- Ensure no error cases are missed during client-side error handling implementation

**🚨 USER ATTENTION REQUIRED:**
This task requires identifying and updating all client components that call the affected server actions. The changes are straightforward but need comprehensive testing to ensure no error feedback is lost.

---

*Template Version: 1.2*  
*Last Updated: 1/21/2025*  
*Created By: Claude* 
