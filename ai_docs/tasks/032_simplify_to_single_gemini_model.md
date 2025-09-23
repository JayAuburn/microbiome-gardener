# 032 - Simplify to Single Gemini Model

> **Task Overview:** Simplify the AI model system by removing the database-driven model selection and hard-coding gemini-2.5-flash as the single model, eliminating complexity while maintaining core chat functionality.

---

## 1. Task Overview

### Task Title
**Title:** Simplify AI Model System to Use Only Gemini-2.5-Flash

### Goal Statement
**Goal:** Remove the complex database-driven AI model selection system and hard-code gemini-2.5-flash as the single model. This eliminates the need for the ai_models database table, seed scripts, model selection dropdowns, migration dialogs, and admin model management, significantly simplifying the codebase while maintaining core chat functionality.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Current AI Integration:** Google Gemini client with multiple model support
- **Relevant Existing Components:** 
  - `components/chat/ChatInterface.tsx` - Main chat interface with model selection
  - `components/chat/CurrentModelDropdown.tsx` - Model selection dropdown
  - `components/chat/ModelMigrationDialog.tsx` - Migration dialog for inactive models
  - `lib/drizzle/schema/ai_models.ts` - Database schema for AI models
  - `scripts/seed.ts` - Seeds multiple Gemini models

### Current State
The system currently has a complex AI model management system with:
- Database table (`ai_models`) storing multiple Gemini models
- Seed script that creates 5 different Gemini models
- Model selection dropdown in chat interface
- Model migration dialogs for inactive models
- Admin model management page
- Per-model usage tracking
- Premium model logic
- Conversation model persistence

This complexity is unnecessary since the system only uses Google Gemini models and the user wants to standardize on gemini-2.5-flash.

## 3. Context & Problem Definition

### Problem Statement
The current AI model system is over-engineered for the use case. The database-driven model selection, admin management, and migration logic add unnecessary complexity when the requirement is to use a single model (gemini-2.5-flash). This complexity makes the codebase harder to maintain and adds database overhead for no functional benefit.

### Success Criteria
- [ ] Chat system uses only gemini-2.5-flash (hard-coded)
- [ ] All model selection UI components removed
- [ ] Database `ai_models` table removed
- [ ] Seed script removed
- [ ] Admin model management removed
- [ ] Model migration dialogs removed
- [ ] Usage tracking simplified (no per-model tracking)
- [ ] Chat interface simplified and clean
- [ ] All existing conversations continue to work
- [ ] No breaking changes to core chat functionality

---

## 4. Technical Requirements

### Functional Requirements
- Chat system must use gemini-2.5-flash exclusively
- Existing conversations must continue to work without model information
- Chat interface must be clean without model selection dropdown
- Welcome card must show only Gemini capabilities
- Usage tracking must work without per-model granularity
- Admin model management must be removed

### Non-Functional Requirements
- **Performance:** Faster chat page loads (no model queries)
- **Security:** Maintain existing authentication and authorization
- **Usability:** Simpler, cleaner chat interface
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** No breaking changes to existing API endpoints

### Technical Constraints
- Must preserve existing conversation history
- Must maintain existing chat streaming functionality
- Must keep usage tracking for billing purposes
- Must maintain existing authentication flow

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- Remove ai_models table
DROP TABLE IF EXISTS ai_models CASCADE;

-- Remove active_model_id from conversations (if exists)
ALTER TABLE conversations 
DROP COLUMN IF EXISTS active_model_id;
```

### Data Model Updates
```typescript
// Remove ai_models.ts schema entirely
// Update conversations.ts to remove active_model_id reference
// Update any types that reference AiModel
```

### Data Migration Plan
- [ ] Create migration to drop ai_models table
- [ ] Create migration to remove active_model_id from conversations
- [ ] Ensure existing conversations continue to work
- [ ] Clean up any orphaned foreign key references

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**No Changes to Core Pattern:**
- Continue using Server Actions for mutations in `app/actions/`
- Continue using direct queries in Server Components for simple data fetching
- Continue using query functions in `lib/` for complex operations

### Server Actions
- [ ] **Remove `app/actions/models.ts`** - Entire file no longer needed
- [ ] **Update `app/actions/chat.ts`** - Remove model parameters, hard-code gemini-2.5-flash

### Database Queries
- [ ] **Remove all model-related queries** - No more database calls for model selection
- [ ] **Simplify conversation queries** - Remove model joins and active_model_id references
- [ ] **Update usage tracking** - Remove per-model usage tracking

### API Routes
- [ ] **Update `app/api/chat/route.ts`** - Hard-code gemini-2.5-flash, remove model lookup
- [ ] **Remove any admin model management routes** - No longer needed

### External Integrations
- Continue using existing Google Gemini client
- Remove model parameter from Gemini client calls (use default gemini-2.5-flash)

---

## 7. Frontend Changes

### Components to Remove
- [ ] **`components/chat/CurrentModelDropdown.tsx`** - Model selection dropdown
- [ ] **`components/chat/ModelMigrationDialog.tsx`** - Migration dialog for inactive models
- [ ] **`components/chat/InactiveModelBanner.tsx`** - Banner for inactive models
- [ ] **`components/chat/PremiumModelDialog.tsx`** - Premium model selection dialog
- [ ] **`components/admin/AddModelDialog.tsx`** - Admin model creation
- [ ] **`components/admin/ModelActionButton.tsx`** - Admin model actions
- [ ] **`components/admin/ModelEditDialog.tsx`** - Admin model editing
- [ ] **`app/(protected)/admin/models/`** - Entire admin model management page

### Components to Update
- [ ] **`components/chat/ChatInterface.tsx`** - Remove model selection logic, hard-code gemini-2.5-flash
- [ ] **`components/chat/ChatContainer.tsx`** - Remove model dropdown from interface
- [ ] **`components/chat/MessageInput.tsx`** - Remove model selector prop and UI
- [ ] **`components/chat/WelcomeCard.tsx`** - Update to show only Gemini capabilities
- [ ] **`app/(protected)/chat/[[...conversationId]]/page.tsx`** - Remove model fetching logic

### State Management
- Remove all model-related state management
- Remove model persistence in localStorage
- Simplify chat state to focus on messages and conversation

---

## 8. Implementation Plan

### Phase 1: Backend Cleanup
**Goal:** Remove database dependencies and simplify backend

- [ ] **Task 1.1:** Remove AI models database schema
  - Files: `lib/drizzle/schema/ai_models.ts`
  - Details: Delete the entire file and update schema exports
- [ ] **Task 1.2:** Create database migration
  - Files: Create new migration file
  - Details: Drop ai_models table and remove active_model_id from conversations
- [ ] **Task 1.3:** Remove models utility functions
  - Files: `lib/models.ts`
  - Details: Delete the entire file
- [ ] **Task 1.4:** Remove model-related actions
  - Files: `app/actions/models.ts`
  - Details: Delete the entire file

### Phase 2: API Simplification
**Goal:** Hard-code gemini-2.5-flash in API routes

- [ ] **Task 2.1:** Update chat API route
  - Files: `app/api/chat/route.ts`
  - Details: Remove model lookup, hard-code gemini-2.5-flash
- [ ] **Task 2.2:** Update chat actions
  - Files: `app/actions/chat.ts`
  - Details: Remove model parameters, hard-code model ID
- [ ] **Task 2.3:** Update usage tracking
  - Files: `lib/usage-tracking.ts`
  - Details: Remove per-model usage tracking

### Phase 3: Frontend Simplification
**Goal:** Remove model selection UI and simplify chat interface

- [ ] **Task 3.1:** Remove model selection components
  - Files: `components/chat/CurrentModelDropdown.tsx`, `components/chat/ModelMigrationDialog.tsx`, etc.
  - Details: Delete all model selection related components
- [ ] **Task 3.2:** Update chat interface
  - Files: `components/chat/ChatInterface.tsx`
  - Details: Remove model selection logic, hard-code gemini-2.5-flash
- [ ] **Task 3.3:** Update chat container
  - Files: `components/chat/ChatContainer.tsx`
  - Details: Remove model dropdown from props and UI
- [ ] **Task 3.4:** Update message input
  - Files: `components/chat/MessageInput.tsx`
  - Details: Remove model selector completely
- [ ] **Task 3.5:** Update welcome card
  - Files: `components/chat/WelcomeCard.tsx`
  - Details: Show only Gemini capabilities, remove multi-provider content

### Phase 4: Page Updates
**Goal:** Update pages to remove model fetching logic

- [ ] **Task 4.1:** Update chat page
  - Files: `app/(protected)/chat/[[...conversationId]]/page.tsx`
  - Details: Remove model fetching, simplify props
- [ ] **Task 4.2:** Remove admin model management
  - Files: `app/(protected)/admin/models/`
  - Details: Delete entire directory and update admin navigation

### Phase 5: Cleanup and Testing
**Goal:** Final cleanup and validation

- [ ] **Task 5.1:** Remove scripts and utilities
  - Files: `scripts/seed.ts`, `lib/persistence.ts` (model persistence)
  - Details: Delete files and update package.json scripts
- [ ] **Task 5.2:** Update TypeScript types
  - Files: Various files with AiModel references
  - Details: Remove AiModel type usage throughout codebase
- [ ] **Task 5.3:** Test chat functionality
  - Files: Manual testing
  - Details: Ensure chat works with hard-coded model

---

## 9. File Structure & Organization

### Files to Remove
```
apps/web/
├── scripts/
│   └── seed.ts                                    # DELETE - No longer needed
├── lib/
│   ├── drizzle/schema/
│   │   └── ai_models.ts                          # DELETE - Remove schema
│   ├── models.ts                                 # DELETE - Remove utility functions
│   └── persistence.ts                            # DELETE - Model persistence logic
├── app/
│   ├── actions/
│   │   └── models.ts                             # DELETE - Remove model actions
│   └── (protected)/admin/models/                 # DELETE - Entire directory
├── components/
│   ├── chat/
│   │   ├── CurrentModelDropdown.tsx             # DELETE - Model selection
│   │   ├── ModelMigrationDialog.tsx             # DELETE - Migration dialog
│   │   ├── InactiveModelBanner.tsx              # DELETE - Inactive model banner
│   │   └── PremiumModelDialog.tsx               # DELETE - Premium model dialog
│   └── admin/
│       ├── AddModelDialog.tsx                    # DELETE - Admin model creation
│       ├── ModelActionButton.tsx                # DELETE - Admin model actions
│       └── ModelEditDialog.tsx                  # DELETE - Admin model editing
```

### Files to Modify
- [ ] **`lib/drizzle/schema/index.ts`** - Remove ai_models export
- [ ] **`app/api/chat/route.ts`** - Hard-code gemini-2.5-flash
- [ ] **`app/actions/chat.ts`** - Remove model parameters
- [ ] **`components/chat/ChatInterface.tsx`** - Remove model selection
- [ ] **`components/chat/ChatContainer.tsx`** - Remove model dropdown
- [ ] **`components/chat/MessageInput.tsx`** - Remove model selector
- [ ] **`components/chat/WelcomeCard.tsx`** - Update for single model
- [ ] **`app/(protected)/chat/[[...conversationId]]/page.tsx`** - Remove model fetching

### Dependencies to Remove
```json
{
  "dependencies": {
    // No new dependencies to remove
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Existing conversations with model references
  - **Handling:** Ignore model references, use hard-coded gemini-2.5-flash
- [ ] **Error 2:** Usage tracking without model information
  - **Handling:** Track usage without per-model granularity
- [ ] **Error 3:** Admin users expecting model management
  - **Handling:** Remove admin model management entirely

### Edge Cases
- [ ] **Edge Case 1:** API calls with model parameters
  - **Solution:** Ignore model parameters, use hard-coded model
- [ ] **Edge Case 2:** Existing localStorage model preferences
  - **Solution:** Remove model persistence logic completely
- [ ] **Edge Case 3:** TypeScript errors from removed types
  - **Solution:** Remove all AiModel type references

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Maintain existing authentication flow
- [ ] Remove admin model management permissions
- [ ] Keep existing chat authorization

### Input Validation
- [ ] Remove model ID validation (no longer needed)
- [ ] Keep existing message content validation
- [ ] Maintain existing user authentication checks

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# No new environment variables needed
# Existing Google Cloud/Gemini credentials remain unchanged
```

---

## 13. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **GET APPROVAL FIRST (Required)**
   - [ ] **Wait for explicit user approval** of this task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **Create database migration first** - Drop ai_models table and remove active_model_id
   - [ ] **Remove backend dependencies** - Delete models.ts, actions/models.ts, schema/ai_models.ts
   - [ ] **Update API routes** - Hard-code gemini-2.5-flash in chat route
   - [ ] **Remove frontend components** - Delete all model selection components
   - [ ] **Update chat interface** - Remove model selection logic
   - [ ] **Test thoroughly** - Ensure chat works with hard-coded model

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed", "Go ahead", "Approved", "Start implementation", "Looks good", "Begin"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about implementation details, requests for changes, "What about...", etc.

🛑 **NEVER start coding without user approval of the task document first!**

---

## 14. Notes & Additional Context

### Key Simplifications
- **From:** Complex multi-model database system
- **To:** Single hard-coded gemini-2.5-flash model
- **Benefits:** Reduced complexity, faster page loads, easier maintenance
- **Trade-offs:** Less flexibility, but matches current usage patterns

### Migration Strategy
1. **Database First:** Remove ai_models table and references
2. **Backend Second:** Hard-code model in API routes
3. **Frontend Third:** Remove model selection UI
4. **Testing Last:** Validate all functionality works

### Rollback Plan
- Keep the database migration reversible
- Maintain git history for easy rollback
- Document all removed components for potential restoration

---

*Task Document Created: 1/23/2025*  
*Next Task Number: 033*
