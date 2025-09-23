# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Implement Storage Limit Validation and Upgrade Prompts

### Goal Statement
**Goal:** Implement comprehensive storage limit validation to prevent users from exceeding their subscription tier limits, provide clear upgrade prompts when limits are reached, and improve the overall user experience around storage management and subscription upgrades.

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
  - `components/ui/button.tsx` for base styles
  - `components/ui/card.tsx` for content layout
  - `components/ui/progress.tsx` for usage visualization
  - `components/ui/alert.tsx` for error messages
  - `components/ui/dialog.tsx` for modals
  - `components/chat/UsageTracker.tsx` for usage display
  - `lib/usage-tracking.ts` for usage calculations
  - `lib/constants.ts` for subscription limits

### Current State
**Critical Security Gap Identified:** The system currently has NO storage limit validation before file uploads, allowing users to exceed their subscription limits without any prevention mechanism.

**Current Issues:**
- Users can upload files that exceed their storage quota (e.g., 95MB used + 10MB upload = 105MB total, exceeding 100MB free tier limit)
- No validation in `/api/documents/upload-url/route.ts` checks remaining storage capacity
- Only file type and individual file size limits are validated
- Users only discover they've exceeded limits through the UsageTracker component polling
- No proactive upgrade prompts when approaching limits
- No user guidance on what to do when limits are exceeded

**Working Components:**
- `UsageTracker` component displays current usage (updated to 5-second polling)
- `getNewUserUsageStats()` function correctly calculates current usage
- Subscription tier limits are properly defined in `lib/constants.ts`
- Upload flow successfully validates file types and individual file sizes

## 3. Context & Problem Definition

### Problem Statement
Users can currently exceed their storage limits without any prevention, creating a poor user experience and potential billing/compliance issues. When a user at 95MB tries to upload a 10MB file, the system allows the upload, resulting in 105MB usage that exceeds their 100MB limit. This creates confusion, potential data integrity issues, and missed opportunities for subscription upgrades.

### Success Criteria
- [ ] **Prevent Storage Limit Violations:** Users cannot exceed their subscription tier storage limits
- [ ] **Clear Error Messages:** Users receive specific, actionable error messages when uploads would exceed limits
- [ ] **Proactive Upgrade Prompts:** Users are prompted to upgrade when approaching or hitting limits
- [ ] **Improved User Experience:** Users understand their storage usage and upgrade options
- [ ] **Real-time Feedback:** Storage validation happens immediately during upload attempt
- [ ] **Graceful Degradation:** System handles edge cases and errors appropriately

---

## 4. Technical Requirements

### Functional Requirements
- **Pre-upload Validation:** System must check remaining storage capacity before allowing any file upload
- **Limit Enforcement:** Users cannot upload files that would exceed their subscription tier storage limit
- **Error Messaging:** Clear, specific error messages when uploads would exceed limits, including remaining space and required space
- **Upgrade Prompts:** Contextual upgrade prompts when users hit storage limits or approach them (80%+ usage)
- **Usage Awareness:** Users can easily see their current storage usage and limits
- **Tier-specific Limits:** Different storage limits enforced based on subscription tier (Free: 100MB, Pro: 5GB, Ultra: 50GB)

### Non-Functional Requirements
- **Performance:** Storage validation must complete within 500ms to avoid delaying uploads
- **Security:** Validation occurs server-side to prevent client-side bypassing
- **Usability:** Error messages are clear and actionable, not technical jargon
- **Responsive Design:** Upgrade prompts work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** All new UI components support both light and dark mode
- **Accessibility:** Error messages and upgrade prompts follow WCAG AA guidelines

### Technical Constraints
- Must use existing `getNewUserUsageStats()` function for usage calculations
- Must maintain backward compatibility with existing upload flow
- Cannot modify existing database schema (use existing `documents` table)
- Must follow existing Server Actions pattern for mutations
- Must use existing shadcn/ui components for consistency

---

## 5. Data & Database Changes

### Database Schema Changes
**No database schema changes required** - using existing `documents` table and `users` table with subscription tiers.

### Data Model Updates
**No new data models required** - using existing usage tracking and subscription systems.

### Data Migration Plan
**No data migration required** - this is a validation and UX enhancement only.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [x] **Server Actions File** - No new server actions needed, using existing upload flow
- [x] **Existing Pattern** - Current upload uses API routes which is appropriate for file upload workflow

#### **QUERIES (Data Fetching)** → Choose based on complexity:
- [x] **Existing Query Functions** - Using existing `getNewUserUsageStats()` from `lib/usage-tracking.ts`
- [x] **Complex Queries** - Storage validation involves user lookup + usage aggregation, appropriate for lib function

#### **API Routes** → `app/api/[endpoint]/route.ts`
- [x] **Existing Pattern** - File uploads appropriately use API routes (`/api/documents/upload-url/route.ts`)
- [x] **Enhancement Required** - Add storage validation to existing upload endpoint

### Server Actions
**No new server actions required** - enhancing existing upload API endpoint.

### Database Queries
**Using existing query infrastructure:**
- [x] **Existing Function** - `getNewUserUsageStats(userId)` in `lib/usage-tracking.ts`
- [x] **Query Pattern** - Complex aggregation query appropriate for lib function

### API Routes (Enhancement of Existing)
**Enhance existing upload endpoint:**
- [x] **`/api/documents/upload-url/route.ts`** - Add storage limit validation before generating signed URL
- [x] **Validation Logic** - Check `currentUsage + fileSize > limit` before proceeding
- [x] **Error Responses** - Return specific error messages with usage details

### External Integrations
**No external integrations required** - using existing subscription and usage tracking systems.

---

## 7. Frontend Changes

### New Components
- [ ] **`components/documents/StorageLimitDialog.tsx`** - Modal dialog for storage limit errors and upgrade prompts
- [ ] **`components/documents/UpgradePrompt.tsx`** - Reusable upgrade prompt component for storage limits
- [ ] **`components/ui/usage-alert.tsx`** - Alert component for storage warnings (80%+ usage)

**Component Organization Pattern:**
- Use `components/documents/` for document-related components
- Reuse existing `components/ui/` components for consistency
- Import upgrade functionality from existing profile/billing components

**Component Requirements:**
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints
- **Theme Support:** Support both light and dark mode
- **Accessibility:** Proper ARIA labels, keyboard navigation, screen reader support

### Page Updates
- [ ] **Upload Flow** - Enhanced error handling and user feedback
- [ ] **Document Pages** - Integration with new storage validation components
- [ ] **Profile/Billing** - Context-aware upgrade prompts from storage limits

### State Management
**Client-side state for UX:**
- Local state for dialog open/closed states
- Error state management in upload components
- Usage tracking component refresh triggers

---

## 8. Implementation Plan

### Phase 1: Server-Side Storage Validation
**Goal:** Implement core storage limit validation in upload API endpoint

- [ ] **Task 1.1:** Add storage validation to upload endpoint
  - Files: `app/api/documents/upload-url/route.ts`
  - Details: 
    - Import `getNewUserUsageStats` from `lib/usage-tracking`
    - Add validation logic after user authentication
    - Check `currentUsage + fileSize > storageLimit`
    - Return appropriate error responses with usage details
    - Include `formatBytes` utility for user-friendly error messages

- [ ] **Task 1.2:** Enhance error response format
  - Files: `app/api/documents/upload-url/route.ts`
  - Details:
    - Create structured error responses with usage details
    - Include remaining space calculations
    - Add upgrade suggestion flags for client-side handling

### Phase 2: Frontend Error Handling and User Experience
**Goal:** Improve client-side error handling and user feedback

- [ ] **Task 2.1:** Create storage limit dialog component
  - Files: `components/documents/StorageLimitDialog.tsx`
  - Details:
    - Modal dialog for storage limit errors
    - Display current usage, limits, and required space
    - Include upgrade call-to-action buttons
    - Support both light and dark themes
    - Mobile-responsive design

- [ ] **Task 2.2:** Enhance document upload error handling
  - Files: `components/documents/DocumentUpload.tsx`
  - Details:
    - Parse storage limit errors from API responses
    - Display storage limit dialog for limit violations
    - Show upgrade prompts for storage errors
    - Maintain existing error handling for other error types

- [ ] **Task 2.3:** Create reusable upgrade prompt component
  - Files: `components/documents/UpgradePrompt.tsx`
  - Details:
    - Reusable component for storage-related upgrade prompts
    - Link to existing profile/billing upgrade flow
    - Display tier-specific benefits and storage limits
    - Mobile-responsive and accessible

### Phase 3: Proactive Usage Warnings and Integration
**Goal:** Implement proactive warnings and integrate with existing systems

- [ ] **Task 3.1:** Add usage warning alerts
  - Files: `components/ui/usage-alert.tsx`
  - Details:
    - Alert component for 80%+ storage usage warnings
    - Color-coded warnings (yellow for 80%, red for 95%)
    - Dismissible alerts with localStorage persistence
    - Upgrade prompt integration

- [ ] **Task 3.2:** Integrate warnings with UsageTracker
  - Files: `components/chat/UsageTracker.tsx`
  - Details:
    - Add usage warning alerts to existing usage display
    - Show upgrade prompts when approaching limits
    - Improve visual hierarchy for storage warnings

- [ ] **Task 3.3:** Enhance upload dialog with proactive warnings
  - Files: `components/documents/UploadDocumentDialog.tsx`
  - Details:
    - Check usage before showing upload dialog
    - Display warnings if user is near storage limits
    - Suggest upgrade before attempting upload if close to limits

### Phase 4: Testing and Polish
**Goal:** Comprehensive testing and user experience refinement

- [ ] **Task 4.1:** Test storage limit validation
  - Test scenarios: Free tier (100MB), Pro tier (5GB), Ultra tier (50GB)
  - Test edge cases: exactly at limit, 1 byte over limit
  - Test error message clarity and actionability

- [ ] **Task 4.2:** Test upgrade flow integration
  - Verify links to profile/billing pages work correctly
  - Test upgrade prompts from different entry points
  - Verify post-upgrade experience (higher limits)

- [ ] **Task 4.3:** Accessibility and responsive testing
  - Test on mobile devices (320px width)
  - Test keyboard navigation and screen readers
  - Test both light and dark mode themes
  - Test error message clarity for non-technical users

---

## 9. File Structure & Organization

### New Files to Create
```
templates/rag-saas/apps/web/
├── components/documents/
│   ├── StorageLimitDialog.tsx        # Storage limit error dialog
│   ├── UpgradePrompt.tsx            # Reusable upgrade prompt component
│   └── UploadDocumentDialog.tsx     # Enhanced with proactive warnings
├── components/ui/
│   └── usage-alert.tsx              # Usage warning alert component
└── lib/
    └── format-utils.ts              # Utility functions for formatting (if needed)
```

### Files to Modify
- [ ] **`app/api/documents/upload-url/route.ts`** - Add storage limit validation logic
- [ ] **`components/documents/DocumentUpload.tsx`** - Enhanced error handling for storage limits
- [ ] **`components/chat/UsageTracker.tsx`** - Add usage warning alerts and upgrade prompts
- [ ] **`components/documents/UploadDocumentDialog.tsx`** - Add proactive storage warnings

### Dependencies to Add
**No new dependencies required** - using existing shadcn/ui components and utility functions.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Storage Limit Exceeded:** User tries to upload file that would exceed limit
  - **Handling:** Return specific error with remaining space and required space
- [ ] **Exactly At Limit:** User at exactly 100MB tries to upload any file
  - **Handling:** Prevent upload and suggest upgrade or file management
- [ ] **Usage Calculation Failure:** `getNewUserUsageStats()` fails or returns null
  - **Handling:** Fail safely - either allow upload with warning or require retry
- [ ] **Network Error During Validation:** API call fails during storage check
  - **Handling:** Show appropriate error message and allow retry

### Edge Cases
- [ ] **Concurrent Uploads:** Multiple users or same user uploading simultaneously
  - **Solution:** Server-side validation handles race conditions appropriately
- [ ] **Storage Calculation Lag:** Recent uploads not yet reflected in usage stats
  - **Solution:** Use real-time calculation or add safety margin
- [ ] **Subscription Tier Change:** User upgrades mid-upload process
  - **Solution:** Validation uses current tier at time of upload request
- [ ] **File Size Estimation:** Compressed files that expand during processing
  - **Solution:** Use uploaded file size for validation, not processed size

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **Server-side Validation:** All storage limit checks happen server-side to prevent bypassing
- [ ] **User Context:** Validation uses authenticated user's subscription tier and usage
- [ ] **Rate Limiting:** Existing upload rate limiting prevents abuse

### Input Validation
- [ ] **File Size Validation:** Validate file size is positive number and within reasonable bounds
- [ ] **User ID Validation:** Ensure user ID from authentication is valid UUID
- [ ] **Subscription Tier Validation:** Validate subscription tier exists and has defined limits

---

## 12. Deployment & Configuration

### Environment Variables
**No new environment variables required** - using existing database and authentication configuration.

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task document has been created following the standard workflow. Proceed with implementation only after user approval.

### Communication Preferences
- [ ] Ask for clarification on error message wording and user experience details
- [ ] Provide progress updates after each phase completion
- [ ] Flag any issues with existing usage tracking functions
- [ ] Suggest alternative approaches if current validation logic has performance issues

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **TASK DOCUMENT CREATED** ✅
   - [x] Created task document `051_implement_storage_limit_validation_and_upgrade_prompts.md`
   - [x] Filled out all sections with specific details
   - [x] Used next incremental number (051)

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of this task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 (Server-side validation) and complete fully
   - [ ] Test storage validation with different file sizes and subscription tiers
   - [ ] Move to Phase 2 (Frontend components) only after Phase 1 is complete
   - [ ] **Test all components in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] **Ensure error messages are clear and actionable for non-technical users**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper error handling
- [ ] Add comprehensive comments explaining storage validation logic
- [ ] **Ensure responsive design (mobile-first approach)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA) for error messages and dialogs
- [ ] Use semantic HTML elements and proper ARIA labels

### Architecture Compliance
- [ ] **✅ VERIFIED: Using correct data access pattern**
  - [x] Enhancement to existing API route (appropriate for file uploads)
  - [x] Using existing lib function for complex usage queries
  - [x] No unnecessary new API routes created
- [ ] **🔍 VALIDATION: Storage checks happen server-side for security**
- [ ] **📱 RESPONSIVE: All new components work on mobile, tablet, and desktop**
- [ ] **🎨 THEME: All new components support light and dark mode**

---

## 14. Notes & Additional Context

### Key Implementation Details
- **Critical Fix:** This addresses a major security/UX gap where users can exceed storage limits
- **User Experience:** Focus on clear, actionable error messages that guide users to solutions
- **Performance:** Storage validation should be fast (<500ms) to not delay uploads
- **Upgrade Flow:** Leverage existing profile/billing upgrade flow rather than creating new paths

### Research Links
- Existing usage tracking system: `lib/usage-tracking.ts`
- Subscription limits: `lib/constants.ts` 
- Upload flow: `app/api/documents/upload-url/route.ts`
- UI components: `components/ui/` directory
- Upgrade flow: `app/(protected)/profile/` pages

### Success Metrics
- **Zero storage limit violations** after implementation
- **Increased upgrade conversion** from storage limit prompts
- **Improved user satisfaction** with clear error messages
- **Reduced support tickets** about storage confusion

---

*Template Version: 1.0*  
*Last Updated: January 2025*  
*Created By: AI Assistant* 
