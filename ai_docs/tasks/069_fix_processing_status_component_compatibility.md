# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
<!-- Provide a clear, specific title for this task -->
**Title:** Fix Processing Status Component Compatibility Issues

### Goal Statement
<!-- One paragraph describing the high-level objective -->
**Goal:** Resolve compatibility mismatches between the database schema (`document_processing_jobs.ts`), actual rag-processor service implementation, and the `ProcessingStatusIndicator.tsx` component to ensure accurate status and stage tracking for document processing workflows.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
<!-- This is a straightforward compatibility fix with only one viable solution -->
**❌ SKIP STRATEGIC ANALYSIS WHEN:**
- Only one obvious technical solution exists
- It's a straightforward bug fix or minor enhancement 
- The implementation pattern is clearly established in the codebase

**Analysis:** This is a clear compatibility fix where we need to align three components that are currently out of sync. There's only one logical approach: update the database schema and component mappings to match the actual processor implementation.

---

## 3. Project Analysis & Current State

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
- **Frameworks & Versions:** Next.js 15.x, React 19.x
- **Language:** TypeScript with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by middleware for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** `ProcessingStatusIndicator.tsx` for status display, Drizzle schema for data modeling

### Current State
<!-- Describe what exists today based on actual analysis -->
Based on detailed analysis of the codebase, we have identified critical compatibility issues between three key components:

1. **Database Schema (`document_processing_jobs.ts`)**:
   - Status enum: `["pending", "processing", "processed", "error", "retry_pending", "cancelled", "partially_processed"]`
   - Missing: `"retry_in_progress"`, `"retry_exhausted"`

2. **ProcessingStatusIndicator Component**:
   - Expects statuses: `["pending", "processing", "processed", "error", "retry_pending", "retry_in_progress", "retry_exhausted", "cancelled", "partially_processed"]`
   - Expects stages: `["downloading", "extracting_text", "transcribing_audio", "extracting_frames", "generating_embeddings", "storing"]`

3. **Actual rag-processor Services**:
   - Uses different stage names: `["downloading", "extracting_text", "transcribing_video", "extracting_keyframes", "extracting_audio", "transcribing_audio", "generating_embeddings", "storing"]`
   - Has additional stages: `"extracting_keyframes"`, `"extracting_audio"`, `"transcribing_video"`

## 3. Context & Problem Definition

### Problem Statement
<!-- What specific problem are you solving? -->
The `ProcessingStatusIndicator.tsx` component cannot properly display processing status and stages because:

1. **Status Enum Mismatch**: The database schema is missing `"retry_in_progress"` and `"retry_exhausted"` statuses that the component expects for comprehensive retry workflow display.

2. **Stage Name Misalignment**: The component expects simplified stage names (`"transcribing_audio"`, `"extracting_frames"`) but the actual rag-processor services use more specific names (`"transcribing_video"`, `"extracting_keyframes"`, `"extracting_audio"`).

3. **Missing Stage Coverage**: The component doesn't handle several stages that the processor actually uses, particularly for video processing workflows.

This causes:
- Inaccurate status displays for users
- Missing progress indicators during processing
- Potential runtime errors when unexpected statuses/stages are encountered

### Success Criteria
<!-- How will you know this is complete and successful? -->
- [ ] Database schema includes all status enums that the component expects
- [ ] Component handles all stage names that the rag-processor services actually use
- [ ] Processing status displays work correctly for all document types (documents, audio, video)
- [ ] No runtime errors when processing jobs progress through all stages
- [ ] Status indicators show appropriate progress for retry workflows

---

## 4. Technical Requirements

### Functional Requirements
<!-- What should the system do? -->
- Database schema must support all retry workflow statuses including `"retry_in_progress"` and `"retry_exhausted"`
- Component must correctly map and display all actual stage names used by rag-processor services
- Status indicator must show appropriate icons and progress for video-specific stages
- Component must handle all status transitions including retry scenarios
- Stage progression must be logical and sequential for all processing types

### Non-Functional Requirements
<!-- Performance, security, usability, etc. -->
- **Performance:** No impact on existing query performance
- **Security:** No changes to authentication or authorization
- **Usability:** Clear visual feedback for all processing stages and retry states
- **Responsive Design:** Status indicators must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Backward compatible with existing processing jobs in database

### Technical Constraints
<!-- What limitations exist? -->
- Cannot change existing status values in database (only add new ones)
- Must maintain compatibility with existing rag-processor service implementations
- Cannot break existing processing job workflows
- Must use existing Drizzle migration system for schema changes

---

## 5. Data & Database Changes

### Database Schema Changes
<!-- If any database changes are needed -->
```sql
-- Add missing status enum values to existing enum
ALTER TYPE "document_processing_job_status" ADD VALUE 'retry_in_progress';
ALTER TYPE "document_processing_job_status" ADD VALUE 'retry_exhausted';
```

### Data Model Updates
<!-- Changes to TypeScript types, Drizzle schemas, etc. -->
```typescript
// In document_processing_jobs.ts - Update status enum
export const documentProcessingJobStatusEnum = pgEnum(
  "document_processing_job_status",
  [
    "pending",
    "processing", 
    "processed",
    "error",
    "retry_pending",
    "retry_in_progress",    // ← ADD THIS
    "retry_exhausted",      // ← ADD THIS
    "cancelled",
    "partially_processed",
  ]
);

// Update TypeScript type to match
export type ProcessingStatus = typeof documentProcessingJobStatusEnum.enumValues[number];
```

### Data Migration Plan
<!-- How to handle existing data -->
- [ ] Enum values are additive only - no existing data needs migration
- [ ] New status values will only be used for future processing jobs
- [ ] Existing jobs will continue to use current status values

### 🚨 MANDATORY: Down Migration Safety Protocol
**CRITICAL REQUIREMENT:** Before running ANY database migration, you MUST create the corresponding down migration file following the `drizzle_down_migration.md` template process:

- [ ] **Step 1: Generate Migration** - Run `npm run db:generate` to create the migration file
- [ ] **Step 2: Create Down Migration** - Follow `drizzle_down_migration.md` template to analyze the migration and create the rollback file
- [ ] **Step 3: Create Subdirectory** - Create `drizzle/migrations/[timestamp_name]/` directory  
- [ ] **Step 4: Generate down.sql** - Create the `down.sql` file with safe rollback operations
- [ ] **Step 5: Verify Safety** - Ensure all operations use `IF EXISTS` and include appropriate warnings
- [ ] **Step 6: Apply Migration** - Only after down migration is created, run `npm run db:migrate`

**🛑 NEVER run `npm run db:migrate` without first creating the down migration file!**

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [ ] No new mutations required for this fix
- [ ] Existing document actions will continue to work unchanged

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components
- [ ] Existing status/stage queries remain unchanged
- [ ] Component will continue to receive data through existing props

**Complex Queries** → `lib/[feature].ts`
- [ ] No new complex queries required

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**
- [ ] No new API routes required for this compatibility fix

### Server Actions
<!-- New or modified server actions for mutations -->
- [ ] No new server actions required
- [ ] Existing document processing actions remain unchanged

### Database Queries
<!-- How you'll fetch data - be explicit about the choice -->
- [ ] **Direct in Server Components** - Existing job status queries continue to work
- [ ] **No changes to query patterns** - This is purely a schema alignment fix

### External Integrations
<!-- Third-party APIs, services, etc. -->
- No external integration changes required
- rag-processor services continue to use existing stage names

---

## 7. Frontend Changes

### New Components
<!-- Components to create in components/ directory, organized by feature -->
- [ ] No new components required

### Component Updates
<!-- Existing components that need changes -->
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Update stage mapping to handle all actual processor stages

**Component Requirements:**
- **Stage Mapping Updates**: Map actual processor stage names to display names
- **Status Handling**: Support new retry status values
- **Icon Updates**: Ensure appropriate icons for video-specific stages
- **Responsive Design**: Maintain existing responsive behavior
- **Theme Support**: Continue to support both light and dark modes
- **Accessibility**: Maintain existing ARIA labels and accessibility features

### Page Updates
<!-- Pages that need changes -->
- [ ] No page updates required - changes are contained to the status component

### State Management
<!-- How data flows through the app -->
- Existing data flow remains unchanged
- Component receives status/stage data through existing props
- No new state management required

---

## 8. Implementation Plan

### Phase 1: Database Schema Updates
**Goal:** Add missing status enum values to support full retry workflow

- [ ] **Task 1.1:** Update Database Schema
  - Files: `lib/drizzle/schema/document_processing_jobs.ts`
  - Details: Add `"retry_in_progress"` and `"retry_exhausted"` to status enum
- [ ] **Task 1.2:** Generate Database Migration
  - Command: `npm run db:generate`
  - Details: Generate migration file for enum updates
- [ ] **Task 1.3:** Create Down Migration (MANDATORY)
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template to create safe rollback
- [ ] **Task 1.4:** Apply Migration
  - Command: `npm run db:migrate`
  - Details: Only run after down migration is created and verified

### Phase 2: Component Stage Mapping Updates
**Goal:** Update ProcessingStatusIndicator to handle all actual processor stages

- [ ] **Task 2.1:** Update Stage Mapping Logic
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Map actual processor stage names to appropriate display names and icons
- [ ] **Task 2.2:** Add Video Processing Stage Support
  - Files: `components/documents/ProcessingStatusIndicator.tsx`  
  - Details: Add handling for `"transcribing_video"`, `"extracting_keyframes"`, `"extracting_audio"`
- [ ] **Task 2.3:** Update Status Type Definitions
  - Files: `components/documents/ProcessingStatusIndicator.tsx`
  - Details: Update TypeScript types to include new retry statuses

### Phase 3: Testing and Validation
**Goal:** Ensure all processing workflows display correctly

- [ ] **Task 3.1:** Test Document Processing Flow
  - Details: Verify status display for standard document processing
- [ ] **Task 3.2:** Test Video Processing Flow
  - Details: Verify stage progression for video files with all stages
- [ ] **Task 3.3:** Test Audio Processing Flow
  - Details: Verify stage progression for audio files
- [ ] **Task 3.4:** Test Retry Workflows
  - Details: Verify new retry status displays work correctly

---

## 9. File Structure & Organization

### New Files to Create
```
drizzle/migrations/[timestamp]/
└── down.sql                          # Down migration for enum changes
```

### Files to Modify
- [ ] **`lib/drizzle/schema/document_processing_jobs.ts`** - Add missing status enum values
- [ ] **`components/documents/ProcessingStatusIndicator.tsx`** - Update stage mapping and status handling

### Dependencies to Add
```json
{
  "dependencies": {},
  "devDependencies": {}
}
```
**No new dependencies required** - this is a pure compatibility fix using existing tools.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Unknown Status Value:** Component receives status not in enum
  - **Handling:** Fallback to "unknown" status with generic icon
- [ ] **Unknown Stage Value:** Component receives stage not in mapping
  - **Handling:** Display raw stage name with default processing icon
- [ ] **Migration Failure:** Database migration fails during deployment
  - **Handling:** Use down migration to rollback, investigate enum conflict

### Edge Cases
- [ ] **Partial Processing Status:** Jobs stuck in intermediate states
  - **Solution:** Ensure status transitions are properly handled in display logic
- [ ] **Legacy Jobs:** Existing jobs with old status values
  - **Solution:** Maintain backward compatibility with existing status values
- [ ] **Multi-stage Processing:** Video files with complex stage progression
  - **Solution:** Ensure stage order is logical and progress indicators work correctly

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] No changes to authentication or authorization required
- [ ] Status display continues to respect existing access controls
- [ ] No new permission requirements

### Input Validation
- [ ] Status and stage values come from trusted database sources
- [ ] Component already handles unknown values gracefully
- [ ] No new user input validation required

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# No new environment variables required
# Existing database configuration continues to work
```

---

## 13. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This is a straightforward compatibility fix with no strategic alternatives needed.

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT (Complete) ✅**
   - [x] Task document created with comprehensive analysis
   - [x] All sections filled with specific implementation details

2. **GET APPROVAL (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed

3. **IMPLEMENT (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **🚨 MANDATORY: For database changes, create down migration file BEFORE running `npm run db:migrate`**
     - [ ] Follow `drizzle_down_migration.md` template process
     - [ ] Create `drizzle/migrations/[timestamp]/down.sql` file
     - [ ] Verify all operations use `IF EXISTS` and include warnings
     - [ ] Only then run `npm run db:migrate`
   - [ ] Test each component as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Test all components in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling for unknown status/stage values
- [ ] Include comprehensive comments for stage mapping logic
- [ ] **🚨 MANDATORY: Create down migration files before running ANY database migration**
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA)
- [ ] Use semantic HTML elements

### Architecture Compliance
- [ ] **✅ VERIFY: No new data access patterns required**
- [ ] **✅ VERIFY: Using existing component update patterns**
- [ ] **✅ VERIFY: Following established Drizzle migration workflow**

---

## 14. Notes & Additional Context

### Research Links
- Previous analysis of rag-processor services shows actual stage names used
- ProcessingStatusIndicator.tsx analysis shows expected vs actual stage mapping
- Database schema analysis shows missing status enum values

### Key Findings from Codebase Analysis
- **Actual Stages Used by rag-processor**:
  - Common: `"downloading"`, `"storing"`, `"generating_embeddings"`
  - Documents: `"extracting_text"`
  - Video: `"transcribing_video"`, `"extracting_keyframes"`, `"extracting_audio"`, `"transcribing_audio"`
  - Audio: `"transcribing_audio"`

- **Component Expected Stages**:
  - `"downloading"`, `"extracting_text"`, `"transcribing_audio"`, `"extracting_frames"`, `"generating_embeddings"`, `"storing"`

- **Mapping Strategy**:
  - `"transcribing_video"` → `"transcribing_audio"` (display name)
  - `"extracting_keyframes"` → `"extracting_frames"` (display name)
  - `"extracting_audio"` → `"transcribing_audio"` (logical progression)

---

## 15. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** ✅ No API contract changes - purely additive enum values
- [ ] **Database Dependencies:** ✅ No existing data affected - new enum values only used for future jobs
- [ ] **Component Dependencies:** ✅ Component changes maintain backward compatibility
- [ ] **Authentication/Authorization:** ✅ No changes to permissions or access patterns

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** ✅ Minimal - component receives same data structure, improved handling
- [ ] **UI/UX Cascading Effects:** ✅ Improved status display, no breaking changes to parent components
- [ ] **State Management:** ✅ No state management changes required
- [ ] **Routing Dependencies:** ✅ No routing changes required

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** ✅ No performance impact - enum additions don't affect query performance
- [ ] **Bundle Size:** ✅ No new dependencies, minimal code changes
- [ ] **Server Load:** ✅ No additional server load
- [ ] **Caching Strategy:** ✅ No caching changes needed

#### 4. **Security Considerations**
- [ ] **Attack Surface:** ✅ No new attack vectors introduced
- [ ] **Data Exposure:** ✅ No changes to data exposure
- [ ] **Permission Escalation:** ✅ No permission changes
- [ ] **Input Validation:** ✅ Enhanced handling of unknown values (more secure)

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** ✅ Improved user experience - better status visibility
- [ ] **Data Migration:** ✅ No user action required
- [ ] **Feature Deprecation:** ✅ No features removed
- [ ] **Learning Curve:** ✅ No new features for users to learn - same interface, better feedback

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** ✅ Slightly reduced complexity through better alignment
- [ ] **Dependencies:** ✅ No new dependencies
- [ ] **Testing Overhead:** ✅ Minimal additional testing required
- [ ] **Documentation:** ✅ Code comments will document stage mapping logic

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
**No red flag issues identified** - This is a low-risk compatibility fix with only positive impacts.

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Database Migration Required:** Adding enum values requires migration (low risk, additive only)
- [ ] **Component Logic Updates:** Stage mapping logic becomes slightly more complex (manageable)

### Mitigation Strategies

#### Database Changes
- [ ] **Backup Strategy:** Standard backup procedures before migration
- [ ] **Rollback Plan:** Down migration removes new enum values safely
- [ ] **Staging Testing:** Test enum additions in staging environment first
- [ ] **Gradual Migration:** Enum values are additive - no gradual migration needed

#### Component Changes
- [ ] **Fallback Handling:** Unknown status/stage values have graceful fallbacks
- [ ] **Testing Strategy:** Test with all processor stage combinations
- [ ] **Compatibility:** Maintain backward compatibility with existing status values

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [x] **Complete Impact Analysis:** All sections analyzed - very low risk
- [x] **Identify Critical Issues:** No critical issues - this is a positive compatibility fix
- [x] **Propose Mitigation:** Standard migration safety procedures documented
- [x] **Alert User:** No significant risks identified
- [x] **Recommend Alternatives:** No alternatives needed - straightforward fix

### Impact Analysis Summary

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
✅ None - All changes are additive and backward compatible

**Performance Implications:**
✅ Positive - Better error handling, no performance degradation

**Security Considerations:**
✅ Neutral to positive - Enhanced handling of unexpected values

**User Experience Impacts:**
✅ Positive - Better processing status visibility and accuracy

**Mitigation Recommendations:**
✅ Standard database migration safety procedures
✅ Test in staging environment before production deployment

**🟢 LOW RISK ASSESSMENT:**
This is a straightforward compatibility fix with only positive impacts. The changes align existing systems that should have been synchronized from the beginning.
```

---

*Template Version: 1.2*  
*Last Updated: 7/7/2025*  
*Created By: Brandon Hancock* 
