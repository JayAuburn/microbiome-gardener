# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Fix Server/Client Boundary Violations in Lib Directory - Split Mixed Server/Client Utilities

### Goal Statement
**Goal:** Eliminate server/client boundary violations across the entire `/lib` directory by splitting files that mix server-only imports with client-safe utilities. This prevents runtime errors where client components attempt to import server-only modules, following the successful pattern established with `chat-utils.ts` → `chat-utils-client.ts`.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
This is a straightforward architectural fix following an established pattern with one clear solution approach, so strategic analysis is not needed.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3 with App Router, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Supabase Auth managed by middleware.ts
- **Key Architectural Patterns:** Server Components for data fetching, Server Actions for mutations, proper client/server separation
- **Relevant Existing Components:** Recently implemented `chat-utils.ts` + `chat-utils-client.ts` pattern as the reference implementation

### Current State
Based on comprehensive analysis of `/lib` directory, multiple files violate server/client boundaries by mixing server-only imports (like `@/lib/supabase/server`, `next/headers`, database operations) with client-safe utility functions. This creates the same error we just resolved: `"You're importing a component that needs 'next/headers'. That only works in a Server Component"`.

## 4. Context & Problem Definition

### Problem Statement
Several files in `/lib` contain mixed server-side imports and client-safe utility functions, creating server/client boundary violations when client components try to import these utilities. This results in build-time or runtime errors where Next.js attempts to bundle server-only modules for client-side execution. The problem mirrors the `chat-utils.ts` issue we recently resolved, but affects multiple files across the lib directory.

### Success Criteria
- [ ] All server/client boundary violations in `/lib` directory are eliminated
- [ ] Client components can safely import client-safe utilities without pulling in server dependencies
- [ ] Server functionality remains unchanged with proper structured responses
- [ ] No build-time or runtime errors related to server/client boundary violations
- [ ] Proper architectural separation following established patterns

---

## 5. Technical Requirements

### Functional Requirements
- All existing client-safe utility functions must remain accessible to client components
- Server-side operations must continue to work without modification
- Import paths for client components must be updated to use new client-safe files
- Backward compatibility maintained through re-exports where appropriate

### Non-Functional Requirements
- **Performance:** No impact on performance, may slightly improve by reducing unnecessary server-side bundling
- **Security:** Maintain existing security validations and server-side operations
- **Usability:** No impact on user experience - purely architectural improvement
- **Responsive Design:** No impact on responsive design
- **Theme Support:** No impact on theme support
- **Compatibility:** Must work with existing import patterns and not break dependent components

### Technical Constraints
- Must maintain existing function signatures and interfaces
- Cannot change overall business logic, only separate concerns
- Must follow established `chat-utils` → `chat-utils-client` pattern
- All existing functionality must be preserved

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
- **Server-side functions** remain in original files for server component usage
- **Client-safe utilities** moved to separate `-client.ts` files
- **No API Routes needed** - This is internal architectural separation

### Server Actions
No changes to server actions required - they already use proper server-side functions.

### Database Queries
No changes to database query patterns required.

### External Integrations
No changes to external integrations required.

---

## 8. Frontend Changes

### New Components
No new components required.

### Page Updates
Client components importing from affected lib files will need their import statements updated to use the new client-safe files.

### State Management
No changes to state management patterns required.

---

## 9. Implementation Plan

### Phase 1: Split lib/attachments.ts (HIGH PRIORITY)
**Goal:** Separate server-side attachment operations from client-safe utilities

- [ ] **Task 1.1:** Create lib/attachments-client.ts
  - Files: `lib/attachments-client.ts` (new)
  - Details: Extract client-safe utilities: `getFileExtension`, `generateImagePath`, `formatFileSize`, type definitions
- [ ] **Task 1.2:** Update lib/attachments.ts
  - Files: `lib/attachments.ts`
  - Details: Remove client-safe utilities, add re-exports from client file, keep server operations
- [ ] **Task 1.3:** Update Client Component Imports
  - Files: All components importing client utilities from `@/lib/attachments`
  - Details: Update imports to use `@/lib/attachments-client` for client-safe functions

### Phase 2: Split lib/documents.ts (HIGH PRIORITY)
**Goal:** Separate server-side document operations from client-safe utilities

- [ ] **Task 2.1:** Create lib/documents-client.ts
  - Files: `lib/documents-client.ts` (new)
  - Details: Extract client-safe utilities: `getDocumentDisplayName`, `formatDocumentType`, type definitions
- [ ] **Task 2.2:** Update lib/documents.ts
  - Files: `lib/documents.ts`
  - Details: Remove client-safe utilities, add re-exports from client file, keep server operations
- [ ] **Task 2.3:** Update Client Component Imports
  - Files: Components importing client utilities from `@/lib/documents`
  - Details: Update imports to use `@/lib/documents-client` for client-safe functions

### Phase 3: Fix lib/file-validation.ts (MEDIUM PRIORITY)
**Goal:** Remove server import from otherwise client-safe file

- [ ] **Task 3.1:** Remove Server Import Dependency
  - Files: `lib/file-validation.ts`
  - Details: Replace `IMAGE_UPLOAD_CONSTRAINTS` import from server-dependent source with direct constant or client-safe import
- [ ] **Task 3.2:** Verify Client-Safe Status
  - Files: `lib/file-validation.ts`
  - Details: Ensure file contains only client-safe imports and functions

### Phase 4: Comprehensive Testing and Validation
**Goal:** Ensure all boundary violations are resolved and functionality preserved

- [ ] **Task 4.1:** Search for Remaining Violations
  - Details: Comprehensive search for any remaining server/client boundary violations in lib directory
- [ ] **Task 4.2:** Test Client Component Imports
  - Details: Verify all client components can import their required utilities without server dependency errors
- [ ] **Task 4.3:** Test Server Functionality
  - Details: Verify all server-side operations continue to work correctly
- [ ] **Task 4.4:** Run Build and Type Checks
  - Details: Ensure no build-time errors and TypeScript validation passes

---

## 10. File Structure & Organization

### New Files to Create
```
lib/
├── attachments-client.ts         # Client-safe attachment utilities
├── documents-client.ts           # Client-safe document utilities
└── (existing files modified)
```

### Files to Modify
- [ ] **`lib/attachments.ts`** - Remove client utilities, add re-exports, keep server operations
- [ ] **`lib/documents.ts`** - Remove client utilities, add re-exports, keep server operations  
- [ ] **`lib/file-validation.ts`** - Remove server import dependency
- [ ] **Client components** - Update import statements to use new client-safe files

### Dependencies to Add
No new dependencies required.

---

## 11. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Import resolution errors** - Must ensure all import paths resolve correctly after changes
  - **Handling:** Systematic testing of all import statements and build verification
- [ ] **Missing utility functions** - Must ensure no client-safe functions are accidentally omitted
  - **Handling:** Comprehensive audit of extracted functions and their usage patterns
- [ ] **Server functionality breaks** - Must ensure server operations continue working
  - **Handling:** Testing of all server-side operations after refactoring

### Edge Cases
- [ ] **Complex import chains** - Some components may have nested imports that pull in server dependencies
  - **Solution:** Trace all import chains and ensure complete separation
- [ ] **Type definition dependencies** - TypeScript types may create implicit dependencies
  - **Solution:** Extract shared types to separate files if needed

---

## 12. Security Considerations

### Authentication & Authorization
No changes to authentication/authorization patterns.

### Input Validation
All existing server-side validation remains unchanged - only moving client-safe utilities.

---

## 13. Deployment & Configuration

### Environment Variables
No environment variable changes required.

---

## 14. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
This is a straightforward architectural fix following an established pattern, so strategic analysis was not needed.

### Communication Preferences
- [ ] Provide clear explanation of each file split and why it's necessary
- [ ] Flag any client components that need import updates
- [ ] Confirm all server functionality remains intact

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
- [ ] **Never add migration history comments** - keep code clean per commenting best practices

### Architecture Compliance
- [ ] **✅ VERIFY: Proper separation of server and client concerns**
- [ ] **✅ VERIFY: Client-safe utilities accessible without server dependencies**
- [ ] **✅ VERIFY: Server operations preserved and functional**

---

## 15. Notes & Additional Context

### Research Links
- [Next.js Server/Client Components Documentation](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Successfully implemented chat-utils pattern](Already completed in codebase)

---

## 16. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No breaking changes to server operations or data contracts
- [ ] **Component Dependencies:** Client components will need import statement updates
- [ ] **Authentication/Authorization:** No impact on auth patterns

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No changes to data flow, only import organization
- [ ] **UI/UX Cascading Effects:** May require updates to multiple client components
- [ ] **State Management:** No impact on state management patterns

#### 3. **Performance Implications**
- [ ] **Server Load:** Slight improvement by removing unnecessary server-side bundling attempts
- [ ] **Bundle Size:** Potential slight improvement by proper client/server separation
- [ ] **Client Performance:** No significant impact

#### 4. **Security Considerations**
- [ ] **Attack Surface:** No new attack vectors introduced
- [ ] **Data Exposure:** No risk of data exposure
- [ ] **Input Validation:** All existing validation remains intact

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** No disruption to user workflows
- [ ] **Error Feedback:** Eliminates server/client boundary error messages
- [ ] **Learning Curve:** No impact on user experience

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Improvement in architectural clarity
- [ ] **Testing Overhead:** Minimal additional testing required

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
No critical red flags identified for this architectural improvement.

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Multiple File Updates:** Several client components will need import statement updates
- [ ] **Systematic Testing Required:** All affected import chains must be tested for proper resolution

### Mitigation Strategies

#### Import Updates
- [ ] **Comprehensive Search:** Use grep/search tools to find all affected imports
- [ ] **Systematic Testing:** Test each updated component individually
- [ ] **Build Verification:** Run full build process to catch any missed imports

🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- None - This is internal architectural improvement maintaining existing interfaces

**Performance Implications:**
- Slight improvement by eliminating server/client boundary violations
- No negative performance impact

**User Experience Impacts:**
- Eliminates build-time and runtime errors for developers
- No visible impact on end users

**Mitigation Recommendations:**
- Systematically update all import statements in client components
- Thoroughly test all import chains after changes
- Use build process to verify no boundary violations remain

**🚨 USER ATTENTION REQUIRED:**
This task requires updating import statements in multiple client components. The changes are straightforward following the established chat-utils pattern, but comprehensive testing is needed to ensure no imports are missed.

---

*Template Version: 1.2*  
*Last Updated: 1/21/2025*  
*Created By: Claude* 
