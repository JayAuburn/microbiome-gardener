# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Improve Document Error Display and Formatting in DocumentList

### Goal Statement
**Goal:** Enhance the error display in the DocumentList component by implementing user-friendly error messages, better formatting, proper text wrapping, and improved visual presentation to replace the current poor display of raw technical error messages that overflow containers and confuse users.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** `components/ui/alert.tsx`, `components/documents/DocumentList.tsx`, `components/documents/ErrorInspectionModal.tsx`

### Current State
Based on analysis of the DocumentList component and user screenshot:

**Current Error Display Issues:**
1. **Raw Technical Messages:** Database connection errors show full technical details like "connection to server at 'aws-0-us-east-2.pooler.supabase.com' (3.13.175.194), port 5432 failed: FATAL: MaxClientsInSessionMode: max clients reached"
2. **Poor Formatting:** Long error messages overflow containers and break visual layout
3. **No Text Wrapping:** Error text extends beyond container boundaries
4. **Inconsistent Styling:** Different error types have different visual treatments
5. **No Error Categorization:** All errors show raw messages regardless of type or user relevance
6. **Poor UX:** Users see confusing technical jargon instead of actionable guidance

**Current Error Display Locations in DocumentList.tsx:**
- Processing job error display (lines 733-742)
- Legacy error display for documents without processing job (lines 745-754)
- Error inspection modal for detailed error viewing

## 3. Context & Problem Definition

### Problem Statement
The current error display in DocumentList shows raw technical error messages that:
- Confuse users with database internals and technical jargon
- Break the visual layout with poor text wrapping and overflow
- Provide no actionable guidance for users to resolve issues
- Create inconsistent visual presentation across different error types
- Make the application appear broken or unprofessional

This severely impacts user experience, especially during database connectivity issues or processing failures where users need clear, actionable guidance instead of technical diagnostics.

### Success Criteria
- [ ] All error messages display user-friendly, actionable text instead of raw technical details
- [ ] Error containers properly wrap text and maintain visual layout integrity
- [ ] Consistent visual styling across all error types and states
- [ ] Error messages categorized by type with appropriate guidance for each
- [ ] Technical details logged for debugging but hidden from user interface
- [ ] Responsive error display that works on mobile, tablet, and desktop
- [ ] Support for both light and dark themes in error styling

---

## 4. Technical Requirements

### Functional Requirements
- Error messages must be translated from technical to user-friendly language
- Error containers must properly wrap long text without breaking layout
- Users should receive actionable guidance for resolving common errors
- Technical error details should be preserved for debugging/logging
- Error display should be consistent across processing job errors and legacy errors
- Error inspection modal should show both user-friendly and technical details
- Different error categories should have appropriate visual indicators (colors, icons)

### Non-Functional Requirements
- **Performance:** Error message transformation should be instantaneous (<50ms)
- **Security:** Technical error details should not expose sensitive infrastructure information in UI
- **Usability:** Error messages should be scannable and actionable within 3 seconds of reading
- **Responsive Design:** Error displays must work properly on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Error styling must support both light and dark mode using existing theme system
- **Compatibility:** Error display improvements should work across all modern browsers

### Technical Constraints
- Must maintain existing error inspection modal functionality
- Cannot modify underlying error generation from backend processing
- Must preserve technical error details for debugging purposes
- Should maintain backward compatibility with existing error structures
- Must work with current toast notification system

---

## 5. Data & Database Changes

### Database Schema Changes
No database changes required - this is purely a frontend presentation improvement.

### Data Model Updates
```typescript
// Enhanced error processing types
interface ProcessedError {
  userMessage: string;        // User-friendly message
  userGuidance?: string;      // Actionable guidance
  category: ErrorCategory;    // Error type for styling
  severity: 'low' | 'medium' | 'high';
  technicalDetails: string;   // Original error for debugging
  timestamp: string;
}

type ErrorCategory = 
  | 'connectivity'     // Database/network issues
  | 'processing'       // Document processing failures
  | 'validation'       // Input validation errors
  | 'permissions'      // Access/auth issues
  | 'system'          // General system errors
  | 'storage'         // File storage issues
```

### Data Migration Plan
No migration needed - purely presentation layer changes.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**No API or backend changes required** - this is a frontend-only improvement focusing on error presentation and formatting.

### Server Actions
No new server actions needed.

### Database Queries
No database query changes needed.

### API Routes (Only for Special Cases)
No API routes needed for this task.

### External Integrations
No external integrations required.

---

## 7. Frontend Changes

### New Components
- [ ] **`components/documents/EnhancedErrorDisplay.tsx`** - Comprehensive error display component with user-friendly messaging and proper formatting
- [ ] **`lib/error-processing.ts`** - Utility functions for converting technical errors to user-friendly messages
- [ ] **`lib/error-categories.ts`** - Error categorization and mapping logic

**Component Organization Pattern:**
- Error processing utilities in `lib/` for reusability
- Enhanced error display component in `components/documents/` for feature-specific use
- Maintain existing error inspection modal but enhance its display

**Component Requirements:**
- **Responsive Design:** Error containers must wrap properly on all screen sizes
- **Theme Support:** Full support for light/dark mode error styling
- **Accessibility:** Proper ARIA labels, error announcements for screen readers

### Page Updates
- [ ] **`DocumentList.tsx`** - Replace current error display sections with EnhancedErrorDisplay component
- [ ] **`ErrorInspectionModal.tsx`** - Enhance to show both user-friendly and technical error views

### State Management
- Error processing will be handled through utility functions
- No additional global state required
- Local state for error display modes (user-friendly vs technical)

---

## 8. Implementation Plan

### Phase 1: Error Processing Foundation
**Goal:** Create the error processing and categorization infrastructure

- [ ] **Task 1.1:** Create error processing utilities
  - Files: `lib/error-processing.ts`, `lib/error-categories.ts`
  - Details: Implement error message transformation logic, categorization mapping, user-friendly message templates
- [ ] **Task 1.2:** Define error display types and interfaces
  - Files: `lib/types/errors.ts`
  - Details: TypeScript interfaces for processed errors, error categories, severity levels

### Phase 2: Enhanced Error Display Component
**Goal:** Build the new error display component with proper formatting

- [ ] **Task 2.1:** Create EnhancedErrorDisplay component
  - Files: `components/documents/EnhancedErrorDisplay.tsx`
  - Details: Responsive error container with text wrapping, theme support, category-based styling
- [ ] **Task 2.2:** Implement error message transformation
  - Files: `components/documents/EnhancedErrorDisplay.tsx`
  - Details: Integration with error processing utilities, user-friendly message display

### Phase 3: DocumentList Integration
**Goal:** Replace existing error displays with enhanced component

- [ ] **Task 3.1:** Update processing job error display
  - Files: `components/documents/DocumentList.tsx`
  - Details: Replace lines 733-742 with EnhancedErrorDisplay component
- [ ] **Task 3.2:** Update legacy error display
  - Files: `components/documents/DocumentList.tsx`
  - Details: Replace lines 745-754 with consistent error display
- [ ] **Task 3.3:** Enhance ErrorInspectionModal
  - Files: `components/documents/ErrorInspectionModal.tsx`
  - Details: Add toggle between user-friendly and technical error views

### Phase 4: Testing and Refinement
**Goal:** Ensure all error scenarios display properly across devices and themes

- [ ] **Task 4.1:** Test error display responsiveness
  - Files: All error display components
  - Details: Verify proper text wrapping and layout on mobile, tablet, desktop
- [ ] **Task 4.2:** Validate theme support
  - Files: All error display components
  - Details: Test error styling in both light and dark modes
- [ ] **Task 4.3:** Accessibility validation
  - Files: All error display components
  - Details: Screen reader testing, keyboard navigation, ARIA labels

---

## 9. File Structure & Organization

### New Files to Create
```
templates/rag-saas/apps/web/
├── lib/
│   ├── error-processing.ts              # Error message transformation utilities
│   ├── error-categories.ts              # Error categorization and mapping
│   └── types/
│       └── errors.ts                    # Error-related TypeScript interfaces
└── components/documents/
    └── EnhancedErrorDisplay.tsx         # New error display component
```

### Files to Modify
- [ ] **`components/documents/DocumentList.tsx`** - Replace error display sections with EnhancedErrorDisplay
- [ ] **`components/documents/ErrorInspectionModal.tsx`** - Enhance with dual error view modes

### Dependencies to Add
```json
{
  "dependencies": {
    // No new dependencies required - using existing Tailwind and shadcn/ui
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Database Connection Errors:** Transform technical connection details to "Temporary connection issue. Please try again in a moment."
  - **Handling:** Category: 'connectivity', Severity: 'high', Guidance: "If this persists, please contact support."
- [ ] **Processing Timeout Errors:** Convert timeout messages to "Document processing is taking longer than expected."
  - **Handling:** Category: 'processing', Severity: 'medium', Guidance: "Large files may take several minutes to process."
- [ ] **Storage Errors:** Transform storage failures to "Unable to access document storage."
  - **Handling:** Category: 'storage', Severity: 'high', Guidance: "Please try uploading again or contact support."

### Edge Cases
- [ ] **Very Long Error Messages:** Ensure proper text wrapping and truncation if needed
  - **Solution:** Implement text truncation with "Show more" expansion for extremely long errors
- [ ] **Multiple Simultaneous Errors:** Handle display of multiple errors for single document
  - **Solution:** Stack errors vertically with clear separation and priority ordering
- [ ] **Unknown Error Types:** Graceful fallback for unrecognized error patterns
  - **Solution:** Default to generic "Processing error occurred" with full technical details in inspection modal

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Error display respects user permissions (no access to other users' error details)
- [ ] Technical error details remain hidden from UI but preserved for debugging

### Input Validation
- [ ] Error message processing validates and sanitizes any dynamic content
- [ ] Prevent XSS through proper error message escaping

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required.

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
When a user requests any new feature, improvement, or significant change, your **DEFAULT BEHAVIOR** should be:

1. **CREATE A TASK DOCUMENT** in `ai_docs/` using this template
2. **GET USER APPROVAL** of the task document  
3. **IMPLEMENT THE FEATURE** only after approval

### Communication Preferences
- [ ] Ask for clarification if error message requirements are unclear
- [ ] Provide regular progress updates during implementation
- [ ] Flag any UX concerns immediately
- [ ] Suggest improvements for error categorization when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (Required)**
   - [✅] **Created task document 049** with specific details for error display improvements
   - [✅] **Filled out all sections** with comprehensive error handling requirements
   - [✅] **Found latest task number 048** and created 049_improve_document_error_display_formatting.md
   - [ ] **Present a summary** of the task document to the user for review

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Create error processing utilities first for foundation
   - [ ] Build EnhancedErrorDisplay component with proper responsive design
   - [ ] Test error display in both light and dark themes
   - [ ] Verify text wrapping and layout integrity on all screen sizes
   - [ ] Document any deviations from the approved plan

### Code Quality Standards
- [ ] Follow TypeScript best practices for error handling
- [ ] Add comprehensive error message mapping
- [ ] Include proper text wrapping and responsive design
- [ ] **Ensure error displays work properly on mobile devices (320px+ width)**
- [ ] **Test error components in both light and dark mode**
- [ ] **Verify error text readability and accessibility**
- [ ] Use semantic HTML elements for error announcements

### Architecture Compliance
- [ ] **✅ VERIFY: No API routes created (frontend-only task)**
- [ ] **✅ VERIFY: Error processing utilities in lib/ directory**
- [ ] **✅ VERIFY: Components organized in components/documents/ for feature specificity**
- [ ] **🔍 DOUBLE-CHECK: Error displays maintain existing functionality while improving presentation**

---

## 14. Notes & Additional Context

### Error Message Examples

**Current (Bad):**
```
connection to server at 'aws-0-us-east-2.pooler.supabase.com' (3.13.175.194), port 5432 failed: FATAL: MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size
```

**Improved (Good):**
```
We're experiencing high traffic right now. Please try again in a moment.

If this continues, please contact support.
```

### Design Patterns
- Use existing shadcn/ui Alert component patterns for consistency
- Implement progressive disclosure (user-friendly first, technical details on demand)
- Follow existing color schemes for error severity (red for high, orange for medium, yellow for low)

### Research Links
- [shadcn/ui Alert Component](https://ui.shadcn.com/docs/components/alert) - For consistent error styling
- [Tailwind CSS Text Wrapping](https://tailwindcss.com/docs/text-wrap) - For proper text handling
- [WCAG Error Message Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html) - For accessibility

---

*Template Version: 1.0*  
*Last Updated: 7/7/2025*  
*Created By: Brandon Hancock* 
