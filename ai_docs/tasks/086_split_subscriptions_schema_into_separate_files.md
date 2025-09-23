# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Split subscriptions.ts Schema into Separate User Usage and Webhook Event Files

### Goal Statement
**Goal:** Refactor the misnamed `subscriptions.ts` schema file by splitting it into two logically separate files: one for user usage tracking (`user-usage.ts`) and another for Stripe webhook event processing (`webhook-events.ts`). This improves code organization, maintainability, and makes the file structure more intuitive for developers.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
<!-- This is a straightforward refactoring task with one clear approach, so strategic analysis is not needed -->

**❌ SKIP STRATEGIC ANALYSIS:** This is a straightforward file organization refactor with only one logical approach - splitting the file by table responsibility. No multiple viable approaches exist.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** Drizzle schema files in `lib/drizzle/schema/` directory

### Current State
The file `templates/rag-saas/apps/web/lib/drizzle/schema/subscriptions.ts` currently contains:

1. **`userUsage` table** - Tracks message usage per billing period with fields:
   - `id`, `user_id`, `billing_period_start`, `messages_used`, `created_at`, `updated_at`
   - Unique constraint on `user_id` and `billing_period_start`
   - Index for efficient lookups

2. **`stripeWebhookEvents` table** - Handles Stripe webhook idempotency and audit trail with fields:
   - `id`, `stripe_event_id`, `event_type`, `processed_at`, `created_at`
   - Unique constraint on `stripe_event_id`
   - Index for efficient webhook event lookups

3. **Zod validation schemas** for both tables
4. **TypeScript types** for both tables

**Problem:** The filename `subscriptions.ts` is misleading since neither table is actually named "subscriptions" and they serve completely different purposes - user usage tracking vs. webhook event processing.

## 4. Context & Problem Definition

### Problem Statement
The current `subscriptions.ts` schema file is misnamed and contains two unrelated database tables that serve different purposes:
- User usage tracking (billing/quota management)
- Stripe webhook event processing (payment system integration)

This creates confusion for developers who expect to find subscription-related schemas in a file named `subscriptions.ts`, and makes the codebase harder to navigate and maintain. The file should be split into two separate, appropriately named files that reflect their actual purpose.

### Success Criteria
- [x] `userUsage` table and related schemas moved to `user-usage.ts` ✓
- [x] `stripeWebhookEvents` table and related schemas moved to `stripe-webhook-events.ts` ✓
- [x] All imports updated across the codebase to use new file locations ✓
- [x] Original `subscriptions.ts` file removed ✓
- [x] No functionality broken - all existing code continues to work ✓
- [x] TypeScript compilation passes without errors ✓
- [x] Database schema remains unchanged (no migrations needed) ✓

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
- **Preserve all existing functionality** - No behavioral changes to database operations
- **Maintain all table definitions** exactly as they currently exist
- **Preserve all Zod validation schemas** and TypeScript types
- **Update all import statements** throughout the codebase to reference new file locations
- **Remove the original subscriptions.ts file** completely

### Non-Functional Requirements
- **Performance:** No performance impact - purely file organization change
- **Security:** No security implications - same schemas, different files
- **Usability:** Improved developer experience with more intuitive file names
- **Maintainability:** Better code organization and separation of concerns
- **Compatibility:** Full compatibility with existing codebase

### Technical Constraints
- **Must not require database migration** - only file structure changes
- **Must maintain exact same exports** for backward compatibility during transition
- **Must follow existing Drizzle schema patterns** in the codebase
- **Must use consistent file naming** with other schema files

---

## 7. Data & Database Changes

### Database Schema Changes
**No database changes required** - this is purely a code organization refactor that moves existing table definitions to new files without modifying the actual database schema.

### Data Model Updates
**File structure changes only:**
```typescript
// Current: lib/drizzle/schema/subscriptions.ts (contains both tables)
// New: lib/drizzle/schema/user-usage.ts (userUsage table only)
// New: lib/drizzle/schema/stripe-webhook-events.ts (stripeWebhookEvents table only)
```

### Data Migration Plan
**No data migration needed** - this is a code-only refactor with no database schema changes.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **No API or Backend Logic Changes Required**
This refactor only affects:
- [ ] **Import statements** in files that reference these schemas
- [ ] **File organization** in the schema directory
- [ ] **Export statements** to maintain backward compatibility

#### **Files That May Need Import Updates**
- [ ] **Database query files** in `lib/` that import user usage or webhook schemas
- [ ] **Server Actions** in `app/actions/` that perform mutations on these tables  
- [ ] **API routes** in `app/api/` that handle webhook events
- [ ] **Page components** that directly import these schemas for type definitions

---

## 9. Frontend Changes

### New Components
**No new components needed** - this is a backend schema organization change only.

### Page Updates
**No page changes required** - existing pages will continue to work with updated import statements.

### State Management
**No state management changes** - purely file organization refactor.

---

## 10. Implementation Plan

### Phase 1: Create New Schema Files
**Goal:** Create two new properly named schema files with the separated table definitions

- [x] **Task 1.1:** Create User Usage Schema File ✓ 2025-01-15
  - Files: `lib/drizzle/schema/user-usage.ts` ✓
  - Details: Moved `userUsage` table, related Zod schemas, and TypeScript types ✓
- [x] **Task 1.2:** Create Stripe Webhook Events Schema File ✓ 2025-01-15
  - Files: `lib/drizzle/schema/stripe-webhook-events.ts` ✓
  - Details: Moved `stripeWebhookEvents` table (renamed from `webhookEvents`), related Zod schemas, and TypeScript types ✓
- [x] **Task 1.3:** Verify New Files Structure ✓ 2025-01-15
  - Details: Ensure both files follow existing schema patterns and export all necessary items

### Phase 2: Update Import Statements
**Goal:** Update all files that import from the old subscriptions.ts file

- [x] **Task 2.1:** Find All Import References ✓ 2025-01-15
  - Command: Search codebase for imports from `subscriptions.ts` ✓
  - Details: Identified files that need import statement updates ✓
- [x] **Task 2.2:** Update Database Query Files ✓ 2025-01-15
  - Files: `lib/drizzle/schema/index.ts` ✓ 
  - Details: Updated schema index to export from new files instead of subscriptions.ts ✓
- [x] **Task 2.3:** Update Server Actions ✓ 2025-01-15
  - Files: No server action files found importing directly from schema ✓
  - Details: All imports go through schema index.ts which was updated ✓
- [x] **Task 2.4:** Update API Routes ✓ 2025-01-15
  - Files: `app/api/webhooks/stripe/route.ts` ✓
  - Details: Updated `webhookEvents` imports and usages to `stripeWebhookEvents` ✓

### Phase 3: Verification and Cleanup
**Goal:** Ensure everything works correctly and remove the old file

- [x] **Task 3.1:** Handle Main Merge Conflicts ✓ 2025-01-15
  - Details: Main merge restored original subscriptions.ts causing duplicate table definitions ✓
  - Resolution: Identified duplicate issue from Drizzle error ✓
- [x] **Task 3.2:** Remove Original File ✓ 2025-01-15
  - Files: `lib/drizzle/schema/subscriptions.ts` ✓
  - Details: Deleted the original misnamed file to resolve duplicates ✓
- [x] **Task 3.2.1:** Fix Property Naming ✓ 2025-01-15
  - Files: `user-usage.ts`, `stripe-webhook-events.ts`, `app/api/webhooks/stripe/route.ts`, `lib/usage-tracking.ts` ✓
  - Details: Updated all property names to use camelCase (e.g., `user_id` → `userId`) while keeping database column names as snake_case ✓
- [x] **Task 3.3:** Database Schema Verification ✓ 2025-01-15
  - Command: `npm run db:generate` ✓
  - Details: Confirmed "No schema changes, nothing to migrate" - database schema is identical ✓
- [x] **Task 3.4:** TypeScript Compilation Check ✓ 2025-01-15
  - Command: `npm run type-check` ✓
  - Details: TypeScript compilation passes with no errors ✓
- [x] **Task 3.5:** Final Verification ✓ 2025-01-15
  - Command: `npm run lint` ✓
  - Details: ESLint passes with "No ESLint warnings or errors" ✓

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

---

## 12. File Structure & Organization

### New Files to Create
```
templates/rag-saas/apps/web/lib/drizzle/schema/
├── user-usage.ts                     # User usage tracking table and schemas
└── stripe-webhook-events.ts          # Stripe webhook events table and schemas
```

### Files to Modify
- [ ] **Any files importing from `subscriptions.ts`** - Update import paths
- [ ] **Database query files** - Update schema imports
- [ ] **Server action files** - Update schema imports
- [ ] **API route files** - Update webhook schema imports

### Files to Remove
- [ ] **`lib/drizzle/schema/subscriptions.ts`** - Original misnamed file

---

## 13. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Import Error:** Missing import updates causing compilation errors
  - **Handling:** Comprehensive search and replace of all import statements
- [ ] **Type Error:** TypeScript type mismatches after file split
  - **Handling:** Verify all exported types are properly defined in new files
- [ ] **Schema Generation Error:** Drizzle detecting unexpected changes
  - **Handling:** Confirm table definitions are identical in new files

### Edge Cases
- [ ] **Circular Dependencies:** New files creating import cycles
  - **Solution:** Ensure clean separation with no cross-dependencies
- [ ] **Missing Exports:** Required schemas not exported from new files
  - **Solution:** Verify all necessary items are exported from both new files

---

## 14. Security Considerations

### Authentication & Authorization
- [ ] **No security changes** - same table definitions, just different files
- [ ] **Existing permissions preserved** - no changes to access patterns

### Input Validation
- [ ] **Zod schemas preserved** - all validation remains identical
- [ ] **Same validation rules** - no changes to input validation logic

---

## 15. Deployment & Configuration

### Environment Variables
**No environment variable changes needed** - purely code organization refactor.

---

## 16. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This is a straightforward refactoring task, so strategic analysis was skipped and we proceed directly to implementation.

### Communication Preferences
- [ ] Ask for clarification if any import references are unclear
- [ ] Provide regular progress updates during import statement updates
- [ ] Flag any unexpected schema changes during verification
- [ ] Confirm all functionality works correctly after refactor

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE NEW SCHEMA FILES FIRST**
   - [ ] **Split the tables** - Move each table to its appropriately named file
   - [ ] **Include all related schemas** - Zod validation and TypeScript types
   - [ ] **Follow existing patterns** - Use same structure as other schema files

2. **FIND ALL IMPORT REFERENCES**
   - [ ] **Search comprehensively** - Use grep/ripgrep to find all imports
   - [ ] **Document all files** - List every file that needs updating
   - [ ] **Plan update strategy** - Determine which files import what

3. **UPDATE IMPORTS SYSTEMATICALLY**
   - [ ] **Update one file at a time** - Avoid batch changes that are hard to debug
   - [ ] **Test after each update** - Run type checking frequently
   - [ ] **Track progress** - Mark off each file as completed

4. **VERIFY AND CLEANUP**
   - [ ] **Run comprehensive checks** - TypeScript, linting, schema generation
   - [ ] **Remove original file** - Only after everything works
   - [ ] **Final verification** - Ensure no broken references remain

### Code Quality Standards
- [ ] **Maintain exact table definitions** - No changes to actual schema
- [ ] **Preserve all exports** - Ensure nothing is lost in the split
- [ ] **Use consistent naming** - Follow existing schema file patterns
- [ ] **Clean imports** - Remove unused imports, add necessary ones
- [ ] **Proper file headers** - Include appropriate imports and dependencies

---

## 17. Notes & Additional Context

### File Naming Rationale
- **`user-usage.ts`** - Clearly indicates this contains user usage tracking functionality
- **`stripe-webhook-events.ts`** - Clearly indicates this contains Stripe webhook event processing functionality
- **Hyphenated naming** - Consistent with existing schema file naming patterns in the codebase

### Import Pattern Examples
```typescript
// Before (all from one file):
import { userUsage, webhookEvents, UserUsage, WebhookEvent } from '@/lib/drizzle/schema/subscriptions';

// After (split across files):
import { userUsage, UserUsage } from '@/lib/drizzle/schema/user-usage';
import { stripeWebhookEvents, StripeWebhookEvent } from '@/lib/drizzle/schema/stripe-webhook-events';
```

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No API changes - purely internal file organization
- [ ] **Database Dependencies:** No database changes - table definitions remain identical
- [ ] **Component Dependencies:** Import statements need updates but functionality unchanged
- [ ] **Authentication/Authorization:** No changes to permissions or access patterns

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No impact - same schemas, different file locations
- [ ] **UI/UX Cascading Effects:** No UI changes - backend refactor only
- [ ] **State Management:** No changes to state management patterns
- [ ] **Routing Dependencies:** No routing changes required

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** No performance impact - identical table definitions
- [ ] **Bundle Size:** Negligible - same code, different organization
- [ ] **Server Load:** No impact - same operations, better organized code
- [ ] **Caching Strategy:** No caching changes needed

#### 4. **Security Considerations**
- [ ] **Attack Surface:** No changes - same security model
- [ ] **Data Exposure:** No new data exposure risks
- [ ] **Permission Escalation:** No permission changes
- [ ] **Input Validation:** Same Zod schemas, identical validation

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** No user-facing changes
- [ ] **Data Migration:** No user action required
- [ ] **Feature Deprecation:** No features removed or changed
- [ ] **Learning Curve:** No user impact - internal refactor only

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Reduced - better organization, clearer separation
- [ ] **Dependencies:** No new dependencies
- [ ] **Testing Overhead:** No additional testing required
- [ ] **Documentation:** Improved - file names match their contents

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
**None identified** - This is a low-risk refactoring with no breaking changes.

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Temporary Compilation Errors:** During import updates, there may be brief periods where TypeScript compilation fails until all imports are updated
- [ ] **Developer Workflow Impact:** Other developers working on the codebase may need to update their local branches if they have uncommitted changes that import from the old file

### Mitigation Strategies

#### File Organization Changes
- [ ] **Systematic Approach:** Update imports methodically to avoid partial broken states
- [ ] **Testing Strategy:** Run type checking after each file update to catch issues early
- [ ] **Communication:** Notify team members about the refactor to avoid merge conflicts

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [x] **Complete Impact Analysis:** Identified this as a low-risk refactoring
- [x] **Identify Critical Issues:** No red flags, minimal yellow flags identified
- [x] **Propose Mitigation:** Systematic approach and testing strategy planned
- [x] **Alert User:** No significant impacts requiring user attention
- [x] **Recommend Alternatives:** This is the best approach for the stated goal

### Example Analysis Template

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- None - purely internal file organization with no API or behavior changes

**Performance Implications:**
- No performance impact - identical table definitions and queries

**Security Considerations:**
- No security impact - same validation schemas and access patterns

**User Experience Impacts:**
- No user-facing changes - internal code organization only

**Mitigation Recommendations:**
- Use systematic approach to update imports
- Run type checking after each file to catch issues early
- Communicate refactor to team to avoid merge conflicts

**🟢 LOW RISK REFACTOR:**
This is a straightforward file organization improvement with minimal risk and high benefit for code maintainability.
```

---

*Template Version: 1.2*  
*Last Updated: 1/15/2025*  
*Created By: AI Agent* 
