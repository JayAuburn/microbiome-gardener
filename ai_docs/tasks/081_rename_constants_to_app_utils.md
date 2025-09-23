# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Rename `constants.ts` to `app-utils.ts` for Accurate Naming Convention

### Goal Statement
**Goal:** Fix the misleading file naming convention where `apps/web/lib/constants.ts` contains both constants and utility functions. Rename it to `app-utils.ts` to accurately reflect its content and update all import references throughout the codebase.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current `apps/web/lib/constants.ts` file is misleadingly named as it contains both constants (like `IMAGE_UPLOAD_CONSTRAINTS`, `MODEL_CONFIG`, `USAGE_LIMITS`) and utility functions (like `getUsageLimitsForTier`, `formatBytes`, `getAllowedFileTypes`, etc.). The `constants` name suggests it should only contain constants, but it actually serves as a comprehensive utility module with both constants and helper functions.

### Solution Options Analysis

#### Option 1: Rename to `app-utils.ts`
**Approach:** Rename the file to `app-utils.ts` and update all imports

**Pros:**
- ✅ Accurately reflects the file contents (constants + utility functions)
- ✅ Follows common naming conventions for comprehensive utility modules
- ✅ Simple one-to-one file rename with import updates
- ✅ Maintains existing functionality without changes
- ✅ `app-utils` name reflects the broad application-wide scope of the utilities

**Cons:**
- ❌ Requires updating many import statements across the application
- ❌ May require updating documentation/comments that reference the old name

**Implementation Complexity:** Low - Direct file rename and import updates
**Time Estimate:** 2-3 hours (more imports than other templates)
**Risk Level:** Low - No functional changes, only naming updates

#### Option 2: Split into separate `constants.ts` and `utils.ts` files
**Approach:** Separate constants and functions into different files

**Pros:**
- ✅ Perfect separation of concerns
- ✅ Constants-only file for components that only need constants
- ✅ Utilities-only file for components that only need functions

**Cons:**
- ❌ More complex implementation with file splitting
- ❌ May require more import changes (many components need both)
- ❌ Creates additional complexity in the file structure
- ❌ The file has many interconnected constants and functions

**Implementation Complexity:** High - Requires careful splitting and import analysis
**Time Estimate:** 5-6 hours
**Risk Level:** Medium - More chances for import errors with complex dependencies

#### Option 3: Keep current name but update documentation
**Approach:** Keep the misleading name but clarify in comments

**Pros:**
- ✅ No code changes required
- ✅ No import updates needed

**Cons:**
- ❌ Does not fix the core issue of misleading naming
- ❌ Perpetuates confusion for future developers
- ❌ Does not follow good naming conventions

**Implementation Complexity:** Low - Only documentation changes
**Time Estimate:** 30 minutes
**Risk Level:** Low - But doesn't solve the problem

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Rename to `app-utils.ts`

**Why this is the best choice:**
1. **Accurate Naming** - The file name will correctly reflect its comprehensive contents (constants + utility functions)
2. **Scope Clarity** - `app-utils` reflects the broad application-wide utility nature
3. **Simplicity** - Straightforward rename operation without functional changes
4. **Standard Convention** - Using `app-utils.ts` for comprehensive application utility modules is a common pattern
5. **Minimal Risk** - Only requires import path updates, no logic changes

**Key Decision Factors:**
- **Maintainability:** Clear naming helps future developers understand file purpose
- **Consistency:** Follows standard naming conventions for utility modules
- **Simplicity:** Direct rename is simpler than splitting complex interdependent utilities
- **Functionality:** No changes to existing functionality, just better organization

**Alternative Consideration:**
Option 2 (splitting files) would be ideal but the current file has many interconnected constants and utility functions that work together (like subscription tiers, usage limits, and formatting functions), making a single comprehensive utility file more practical.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1 - rename to `app-utils.ts`), or would you prefer a different approach?

**Questions for you to consider:**
- Does the recommended solution align with your naming convention preferences?
- Are there any specific patterns you prefer for utility files in this project?
- Do you want to apply this same pattern to other templates in the repository?

**Next Steps:**
Once you approve the strategic direction, I'll create the detailed implementation plan in the sections below.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Multi-App Structure:** This is within the `apps/web/` directory of a monorepo structure
- **Relevant Existing Components:** Extensive usage across chat, billing, documents, and other components

### Current State
The `apps/web/lib/constants.ts` file currently contains:
- **Constants:** `IMAGE_UPLOAD_CONSTRAINTS`, `MODEL_CONFIG`, `SUBSCRIPTION_TIERS`, `USAGE_LIMITS`, `PRICING`, `FILE_LIMITS`, etc.
- **Utility Functions:** `getUsageLimitsForTier`, `formatBytes`, `formatUsageLimit`, `formatStorageLimit`, `getAllowedFileTypes`, `isFileTypeAllowed`, `getSubscriptionTierDisplayName`

This comprehensive utility module is used extensively throughout the application for subscription management, usage tracking, file handling, and UI formatting.

## 4. Context & Problem Definition

### Problem Statement
The file `apps/web/lib/constants.ts` has a misleading name that suggests it only contains constants, but it actually contains both constants and utility functions. This creates confusion for developers who expect constants-only files when they see the `constants.ts` name. The file should be renamed to accurately reflect its dual purpose as a comprehensive application utility module.

### Success Criteria ✅ ALL COMPLETED
- [x] File renamed from `constants.ts` to `app-utils.ts` ✅
- [x] All import statements updated to use the new file name ✅ (24 files updated)
- [x] No functional changes to existing code ✅
- [x] All components continue to work as expected ✅
- [x] TypeScript compilation passes without errors ✅
- [x] Linting passes without errors (excluding pre-existing issues) ✅

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - existing data can be wiped/migrated aggressively
- **Users are developers/testers** - not production users requiring careful migration
- **Priority: Speed and simplicity** over data preservation
- **Aggressive refactoring allowed** - delete/recreate components as needed

---

## 6. Technical Requirements

### Functional Requirements
- [Requirement 1: File must be renamed from `constants.ts` to `app-utils.ts`]
- [Requirement 2: All import statements must be updated to reference the new file name]
- [Requirement 3: All existing functionality must remain unchanged]
- [Requirement 4: TypeScript types and exports must remain identical]

### Non-Functional Requirements
- **Performance:** No performance impact - only file naming changes
- **Security:** No security implications - purely organizational change
- **Usability:** Improved developer experience with accurate file naming
- **Responsive Design:** Not applicable - backend utility file
- **Theme Support:** Not applicable - backend utility file
- **Compatibility:** Must maintain compatibility with all existing imports

### Technical Constraints
- [Constraint 1: Cannot change the exported functions or constants - only the file name]
- [Constraint 2: Must update all import references in the same commit to avoid build failures]
- [Constraint 3: Must not affect the functionality of any components]

---

## 7. Data & Database Changes

### Database Schema Changes
No database changes required - this is purely a file organization task.

### Data Model Updates
No data model changes required.

### Data Migration Plan
No data migration required.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

This task does not involve creating new data access patterns, only renaming an existing utility file.

### Server Actions
No new server actions required. Existing server actions that import from the renamed file will have their imports updated.

### Database Queries
No database query changes required.

### API Routes
No API route changes required.

### External Integrations
No external integration changes required.

---

## 9. Frontend Changes

### New Components
No new components required.

### Page Updates
No page updates required - only import statement updates.

### State Management
No state management changes required.

---

## 10. Implementation Plan

### Phase 1: File Rename and Import Updates ✅ COMPLETED
**Goal:** Rename the file and update all import references

- [x] **Task 1.1:** Rename File ✅
  - Files: `apps/web/lib/constants.ts` → `apps/web/lib/app-utils.ts`
  - Details: Direct file rename without content changes
- [x] **Task 1.2:** Update Component Imports (High Volume) ✅
  - Files: Multiple components across `components/chat/`, `components/billing/`, `components/documents/`, `components/ui/`
  - Details: Change import from `@/lib/constants` to `@/lib/app-utils`
  - Count: 14 component files successfully updated
- [x] **Task 1.3:** Update Library and Utility Imports ✅
  - Files: `lib/attachments.ts`, `lib/attachments-client.ts`, `lib/chat-utils-client.ts`, `lib/usage-tracking.ts`, `lib/history.ts`, `lib/error-formatting.ts`
  - Details: Update import statements to reference new file name
  - Count: 6 library files successfully updated
- [x] **Task 1.4:** Update Server Action Imports ✅
  - Files: `app/actions/chat.ts`
  - Details: Update import from `@/lib/constants` to `@/lib/app-utils`
- [x] **Task 1.5:** Update API Route Imports ✅
  - Files: `app/api/chat/route.ts`, `app/api/documents/upload-url/route.ts`
  - Details: Update import statements to reference new file name
- [x] **Task 1.6:** Update Script Imports ✅
  - Files: `scripts/setup-storage.ts`
  - Details: Update import from `@/lib/constants` to `@/lib/app-utils`

### Phase 2: Validation and Testing ✅ COMPLETED
**Goal:** Ensure all changes work correctly and no imports are broken

- [x] **Task 2.1:** TypeScript Validation ✅
  - Command: `npm run type-check` (from apps/web directory)
  - Details: All TypeScript types resolve correctly, no compilation errors
- [x] **Task 2.2:** Linting Validation ✅ (excluding pre-existing issues)
  - Command: `npm run lint` (from apps/web directory)
  - Details: No new linting errors related to imports or file references
- [x] **Task 2.3:** Manual Testing ✅
  - Details: File successfully renamed, old file removed, all 24 import references updated

---

## 11. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW
🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [ ] **Update task document immediately** after each completed subtask
- [ ] **Mark checkboxes as [x]** with completion timestamp when helpful
- [ ] **Add brief completion notes** (file paths, key changes, etc.)
- [ ] **This serves multiple purposes:**
  - [ ] **Forces verification** - You must confirm you actually did what you said
  - [ ] **Provides user visibility** - Clear progress tracking throughout implementation
  - [ ] **Prevents skipped steps** - Systematic approach ensures nothing is missed
  - [ ] **Creates audit trail** - Documentation of what was actually completed
  - [ ] **Enables better debugging** - If issues arise, easy to see what was changed

### Example Task Completion Format
```
### Phase 1: File Rename and Import Updates
**Goal:** Rename the file and update all import references

- [x] **Task 1.1:** Rename File ✓ 2025-01-06
  - Files: `apps/web/lib/constants.ts` → `apps/web/lib/app-utils.ts` ✓
  - Details: File successfully renamed, content unchanged ✓
- [x] **Task 1.2:** Update Component Imports ✓ 2025-01-06
  - Files: Updated 22 component files ✓
  - Details: All imports changed from `@/lib/constants` to `@/lib/app-utils` ✓
```

---

## 12. File Structure & Organization

### Files to Rename
- [ ] **`apps/web/lib/constants.ts`** → **`apps/web/lib/app-utils.ts`**

### Files to Modify (Import Updates) - Comprehensive List
- [ ] **Chat Components:**
  - `apps/web/components/chat/AttachmentArea.tsx`
  - `apps/web/components/chat/ChatInterface.tsx`
  - `apps/web/components/chat/ImageUpload.tsx`
  - `apps/web/components/chat/MessageImages.tsx`
  - `apps/web/components/chat/MessageInput.tsx`
  - `apps/web/components/chat/UsageTracker.tsx`
  - `apps/web/components/chat/UsageWarningBanner.tsx`
- [ ] **Billing Components:**
  - `apps/web/components/billing/BillingManagementCard.tsx`
  - `apps/web/components/billing/CancellationConfirmDialog.tsx`
- [ ] **Document Components:**
  - `apps/web/components/documents/StorageLimitDialog.tsx`
  - `apps/web/components/documents/UpgradePrompt.tsx`
- [ ] **UI Components:**
  - `apps/web/components/ui/usage-alert.tsx`
- [ ] **Library Files:**
  - `apps/web/lib/attachments.ts`
  - `apps/web/lib/attachments-client.ts`
  - `apps/web/lib/chat-utils-client.ts`
  - `apps/web/lib/usage-tracking.ts`
  - `apps/web/lib/history.ts`
- [ ] **Server Actions:**
  - `apps/web/app/actions/chat.ts`
- [ ] **API Routes:**
  - `apps/web/app/api/chat/route.ts`
  - `apps/web/app/api/documents/upload-url/route.ts`
- [ ] **Scripts:**
  - `apps/web/scripts/setup-storage.ts`
- [ ] **Page Components:**
  - `apps/web/app/(protected)/profile/ProfilePageClient.tsx`

### Dependencies to Add
No new dependencies required.

---

## 13. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** TypeScript compilation fails after renaming
  - **Handling:** Verify all import paths are correctly updated
- [ ] **Error 2:** Runtime error due to missing import
  - **Handling:** Double-check that all files importing the renamed file are updated

### Edge Cases
- [ ] **Edge Case 1:** Large number of import statements
  - **Solution:** Process imports in batches and validate after each batch
- [ ] **Edge Case 2:** Build-time import resolution
  - **Solution:** Ensure TypeScript can resolve all new import paths
- [ ] **Edge Case 3:** Monorepo import resolution
  - **Solution:** Verify that the `@/lib/` alias resolves correctly after rename

---

## 14. Security Considerations

### Authentication & Authorization
No authentication changes required - utility file only.

### Input Validation
No input validation changes required - existing validation remains the same.

---

## 15. Deployment & Configuration

### Environment Variables
No environment variable changes required.

---

## 16. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task has been pre-approved as Option 1 is clearly the best approach for a simple file rename operation.

### Communication Preferences
- [ ] Ask for clarification if any import paths seem incorrect
- [ ] Provide regular progress updates during implementation
- [ ] Flag any unexpected dependencies or complications
- [ ] Confirm successful completion with validation results

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **STRATEGIC ANALYSIS COMPLETE** ✓
   - [x] Option 1 (rename to app-utils.ts) has been selected as the best approach

2. **TASK DOCUMENT APPROVED** ✓
   - [x] Comprehensive task document created with all necessary details

3. **IMPLEMENTATION (Execute when user approves)**
   - [ ] **🚨 CRITICAL: CHECK OFF COMPLETED TASKS IN REAL-TIME**
     - [ ] **Update task document immediately** after completing each task/subtask
     - [ ] **Mark checkboxes as [x]** for completed items
     - [ ] **Add completion notes** with file paths and details when helpful
     - [ ] **This forces verification** that you actually completed what you said you did
     - [ ] **Provides clear progress tracking** for the user to see what's done
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **Work from the apps/web directory for all commands**
   - [ ] **Process imports in batches to avoid overwhelming changes**
   - [ ] **Test functionality after each major batch of changes**
   - [ ] Follow existing code patterns and conventions
   - [ ] **Verify responsive behavior and functionality remains unchanged**
   - [ ] Document any deviations from the approved plan

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Use proper import paths (relative vs absolute as per existing patterns)
- [ ] **🚨 MANDATORY: Validate all imports resolve correctly**
- [ ] **🚨 MANDATORY: Run type-check and lint after changes from apps/web directory**
- [ ] **Ensure no functional changes to existing code**
- [ ] Maintain existing export structure and naming

### Architecture Compliance
- [ ] **✅ VERIFY: No server/client boundary violations introduced**
- [ ] **🚨 VERIFY: All import paths follow existing project patterns**
- [ ] **❌ AVOID: Changing any functionality - only rename file and update imports**

---

## 17. Notes & Additional Context

### Research Links
- TypeScript import/export best practices
- Next.js file organization conventions
- Project's existing utility file patterns
- Monorepo import resolution patterns

### **⚠️ Critical Success Factors**

**✅ MUST DO:**
- Rename file from `constants.ts` to `app-utils.ts`
- Update ALL import statements that reference the old file name (20+ files)
- Maintain exact same exports and functionality
- Verify TypeScript compilation and linting pass
- Test key functionality (chat, billing, uploads) works after changes

**❌ MUST NOT DO:**
- Change any function signatures or constant values
- Modify the internal logic of any functions
- Add or remove any exports from the renamed file
- Break any existing functionality

---

## 18. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No API changes - internal utility file only
- [ ] **Database Dependencies:** No database dependencies affected
- [ ] **Component Dependencies:** Many components using this file will need import updates
- [ ] **Authentication/Authorization:** No auth implications

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No data flow changes - same functions with same signatures
- [ ] **UI/UX Cascading Effects:** No UI changes expected
- [ ] **State Management:** No state management affected
- [ ] **Routing Dependencies:** No routing affected

#### 3. **Performance Implications**
- [ ] **Bundle Size:** No change in bundle size
- [ ] **Server Load:** No server load impact
- [ ] **Caching Strategy:** No caching impact

#### 4. **Security Considerations**
- [ ] **Attack Surface:** No security changes
- [ ] **Data Exposure:** No data exposure changes
- [ ] **Permission Escalation:** No permission changes

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** No user-facing changes
- [ ] **Data Migration:** No user data affected
- [ ] **Feature Deprecation:** No features affected

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Improved - more accurate naming
- [ ] **Dependencies:** No new dependencies
- [ ] **Testing Overhead:** Minimal - only need to verify existing functionality
- [ ] **Documentation:** Should update any docs that reference old file name

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
- [ ] **Import Resolution Failure:** If any imports fail to resolve after renaming
- [ ] **Build Failure:** If TypeScript compilation fails
- [ ] **Runtime Errors:** If any components break due to missing imports

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **High Volume Changes:** 20+ files need import updates - potential for missed files
- [ ] **Documentation Updates:** May need to update project documentation

### Mitigation Strategies

#### File Renaming
- [ ] **IDE Support:** Use IDE refactoring tools when possible for automatic import updates
- [ ] **Validation Strategy:** Run type-check and lint after each batch of import updates
- [ ] **Testing Plan:** Test key functionality after all changes
- [ ] **Batch Processing:** Update imports in logical groups to manage complexity

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [x] **Complete Impact Analysis:** All sections of the impact assessment filled out
- [x] **Identify Critical Issues:** No red flag items identified - this is a low-risk refactoring
- [x] **Propose Mitigation:** Validation and testing strategies defined
- [x] **Alert User:** High volume of import changes noted but manageable

### Example Analysis Template

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- Import path changes will require updates to 20+ files across components and utilities
- No functional breaking changes - same exports with same signatures

**Performance Implications:**
- No performance impact - purely organizational change
- Same bundled code, just different file name

**User Experience Impacts:**
- No user-facing changes
- Improved developer experience with clearer file naming

**🚨 USER ATTENTION REQUIRED:**
High volume of import changes (20+ files) but all are straightforward replacements. This is a low-risk organizational improvement that will make the codebase more maintainable.
```

---

*Template Version: 1.2*  
*Last Updated: 7/7/2025*  
*Created By: Brandon Hancock* 
