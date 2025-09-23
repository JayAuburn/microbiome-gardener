# Implement Soft Delete for AI Models with Hybrid Conversation Loading

> This document outlines implementing soft delete functionality for AI models to resolve foreign key constraint issues while preserving user conversation history.

---

## 1. Task Overview

### Task Title
**Title:** Implement Soft Delete for AI Models with Hybrid Conversation Loading Pattern

### Goal Statement
**Goal:** Replace hard deletion of AI models with a soft delete system to prevent foreign key constraint errors while preserving user conversation history. When users load conversations with inactive models, they can seamlessly continue the conversation by selecting a new active model, maintaining a professional user experience without data loss.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3 (latest), React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM v0.44.2
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/chat/CurrentModelDropdown.tsx` for model selection UI
  - `components/ui/alert.tsx` for notifications
  - `lib/history.ts` for conversation queries with model lookups

### Current State
The `ai_models` table already has an `is_active` boolean field (defaults to `true`), but the system currently:
- Attempts hard deletion of models which fails due to foreign key constraints
- The `conversations.active_model_id` references `ai_models.id` without ON DELETE handling
- Model dropdown only shows active models via `is_active` filtering
- Conversation loading assumes the referenced model exists and is active
- No UI handling for conversations with inactive models

**Current Error:** "Unable to delete rows as one of them is currently referenced by a foreign key constraint from the table 'conversations'"

## 3. Context & Problem Definition

### Problem Statement
Users and administrators cannot delete AI models from the system because existing conversations reference them via foreign key constraints. This prevents model cleanup, deprecation of old models, or removal of problematic models. Hard deletion would destroy user conversation history, which is unacceptable for a chat application where conversation history is valuable user data.

### Success Criteria
- [ ] Administrators can "delete" models without foreign key constraint errors
- [ ] User conversations are never lost or broken
- [ ] Users can seamlessly continue conversations that used inactive models
- [ ] Clear UI indication when a conversation used an inactive model
- [ ] Smooth model migration flow when sending new messages
- [ ] No breaking changes to existing active conversations

---

## 4. Technical Requirements

### Functional Requirements
- **Model Management:** Administrators can soft delete models (set `is_active = false`)
- **Conversation Loading:** Users can load any conversation regardless of model status
- **Hybrid Continuation:** When sending messages in conversations with inactive models, users select a new active model
- **Status Indication:** Clear visual indication when a conversation used an inactive model
- **Model Migration:** Seamlessly continue conversations with newly selected models
- **History Preservation:** All past messages remain visible and searchable

### Non-Functional Requirements
- **Performance:** No additional query overhead for active model conversations
- **Security:** Only authenticated users can access their conversations, only admin can manage model status
- **Usability:** Intuitive flow for selecting replacement models, clear status messaging
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Backward compatible with all existing conversations

### Technical Constraints
- **Cannot modify existing conversation data:** Must preserve all `active_model_id` references
- **Cannot add CASCADE deletes:** Would destroy user data
- **Must use existing UI patterns:** Follow current component structure and styling
- **Must maintain query performance:** Existing conversation loading speed cannot degrade

---

## 5. Data & Database Changes

### Database Schema Changes
**No schema changes required** - the `ai_models` table already has `is_active` boolean field.

### Data Model Updates
```typescript
// Update type exports to clarify soft delete behavior
// lib/drizzle/schema/ai_models.ts - Add helper types

export type ActiveAiModel = AiModel & { is_active: true };
export type InactiveAiModel = AiModel & { is_active: false };

// Add utility functions for model queries
export const getActiveModels = () => 
  db.select().from(aiModels).where(eq(aiModels.is_active, true));

export const getModelById = (id: string) =>
  db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
```

### Data Migration Plan
- [ ] **No migration needed** - `is_active` field already exists with proper defaults
- [ ] **Seed script update** - Ensure all existing models have `is_active = true`
- [ ] **Admin tooling** - Create method to soft delete models (set `is_active = false`)

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [ ] **Server Actions File** - `app/actions/chat.ts` - Add model migration logic for conversations
- [ ] **No new server actions needed** - Extend existing conversation update actions

**QUERIES (Data Fetching)** → Choose based on complexity:

**Complex Queries** → `lib/[feature].ts`
- [ ] **Query Functions in lib/history.ts** - Update conversation queries to handle inactive models
- [ ] **Query Functions in lib/models.ts** - New file for model-specific queries

### Server Actions
- [ ] **`updateConversationModel`** - Update conversation to use new active model when user selects replacement
- [ ] **`softDeleteModel`** (Admin only) - Set model `is_active = false` instead of hard delete

### Database Queries
- [ ] **Update lib/history.ts** - Modify conversation queries to gracefully handle inactive models
- [ ] **Create lib/models.ts** - Centralized model querying with active/inactive handling
- [ ] **Direct in Server Components** - Simple active model queries for dropdowns

### API Routes (Rarely Needed)
**No new API routes needed** - All functionality handled via Server Actions and direct queries

### External Integrations
**No external integrations required**

---

## 7. Frontend Changes

### New Components
- [ ] **`components/chat/InactiveModelBanner.tsx`** - Shows when conversation uses inactive model
  - Props: `inactiveModel: AiModel`, `onSelectNewModel: () => void`
  - Responsive banner with clear messaging and action button
- [ ] **`components/chat/ModelMigrationDialog.tsx`** - Modal for selecting replacement model
  - Props: `open: boolean`, `availableModels: AiModel[]`, `onSelect: (model: AiModel) => void`
  - Modal dialog with model selection dropdown and confirmation

### Page Updates
- [ ] **`/chat/[[...conversationId]]/page.tsx`** - Handle conversations with inactive models
  - Add inactive model detection and banner display
  - Modify message sending flow to check model status
- [ ] **`/history/page.tsx`** - Show model status in conversation list
  - Update conversation display to indicate inactive models

### State Management
- **Conversation Loading:** Check model status on conversation load, show appropriate UI
- **Model Selection State:** Track when user needs to select replacement model
- **Message Sending Flow:** Block sending until active model selected for inactive model conversations

---

## 8. Implementation Plan

### Phase 1: Backend Data Layer Updates
**Goal:** Update data queries to handle inactive models gracefully

- [ ] **Task 1.1:** Create `lib/models.ts` with model query utilities
  - Files: `lib/models.ts`
  - Details: Centralized functions for getting active models, checking model status, and getting model by ID
- [ ] **Task 1.2:** Update `lib/history.ts` to handle inactive models
  - Files: `lib/history.ts`
  - Details: Modify `getConversationsGrouped` to show "Inactive" status for inactive models instead of "Unknown"
- [ ] **Task 1.3:** Add model migration server action
  - Files: `app/actions/chat.ts`
  - Details: Add `updateConversationModel` function to migrate conversation to new active model

### Phase 2: UI Components for Inactive Model Handling
**Goal:** Create user interface for handling conversations with inactive models

- [ ] **Task 2.1:** Create `InactiveModelBanner` component
  - Files: `components/chat/InactiveModelBanner.tsx`
  - Details: Alert banner showing inactive model name with "Select New Model" button
- [ ] **Task 2.2:** Create `ModelMigrationDialog` component
  - Files: `components/chat/ModelMigrationDialog.tsx`
  - Details: Modal dialog with model dropdown for selecting replacement, confirmation flow

### Phase 3: Chat Interface Integration
**Goal:** Integrate inactive model handling into chat flow

- [ ] **Task 3.1:** Update `ChatInterface` to detect inactive models
  - Files: `components/chat/ChatInterface.tsx`
  - Details: Add model status checking, show banner when model inactive, prevent message sending
- [ ] **Task 3.2:** Update chat page to handle inactive model conversations
  - Files: `app/(protected)/chat/[[...conversationId]]/page.tsx`
  - Details: Pass model status to ChatInterface, handle migration flow

### Phase 4: History Page Enhancements
**Goal:** Show model status in conversation history

- [ ] **Task 4.1:** Update conversation history display
  - Files: `components/history/ConversationRow.tsx`
  - Details: Show "Inactive Model" badge for conversations with inactive models
- [ ] **Task 4.2:** Update history page loading
  - Files: `app/(protected)/history/page.tsx`
  - Details: Ensure history queries handle inactive models properly

### Phase 5: Admin Soft Delete Functionality
**Goal:** Provide admin interface for soft deleting models

- [ ] **Task 5.1:** Add soft delete server action
  - Files: `app/actions/models.ts` (new)
  - Details: Create admin-only action to set `is_active = false` on models
- [ ] **Task 5.2:** Update model management UI (if exists)
  - Files: TBD based on existing admin interface
  - Details: Replace hard delete with soft delete action

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── lib/
│   └── models.ts                     # Model query utilities and helpers
├── components/chat/
│   ├── InactiveModelBanner.tsx       # Banner for inactive model notifications
│   └── ModelMigrationDialog.tsx      # Modal for selecting replacement model
└── app/actions/
    └── models.ts                     # Admin model management actions (soft delete)
```

### Files to Modify
- [ ] **`lib/history.ts`** - Update conversation queries to handle inactive models gracefully
- [ ] **`app/actions/chat.ts`** - Add conversation model migration functionality
- [ ] **`components/chat/ChatInterface.tsx`** - Add inactive model detection and handling
- [ ] **`app/(protected)/chat/[[...conversationId]]/page.tsx`** - Integrate inactive model UI flow
- [ ] **`components/history/ConversationRow.tsx`** - Show model status in history
- [ ] **`app/(protected)/history/page.tsx`** - Ensure proper handling of inactive models

### Dependencies to Add
**No new dependencies required** - All functionality uses existing UI components and patterns

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** User tries to send message with inactive model but no active models available
  - **Handling:** Show error message "No active models available. Please contact support."
- [ ] **Error 2:** Model migration fails during message sending
  - **Handling:** Show error, allow user to retry model selection
- [ ] **Error 3:** Conversation references non-existent model (deleted from DB)
  - **Handling:** Show "Unknown Model" status, allow normal migration flow

### Edge Cases
- [ ] **Edge Case 1:** All models are inactive
  - **Solution:** Prevent app from reaching this state, always keep at least one model active
- [ ] **Edge Case 2:** User has conversation with inactive model, but deletes the conversation
  - **Solution:** Normal deletion flow works - no special handling needed
- [ ] **Edge Case 3:** Model is reactivated after being inactive
  - **Solution:** Conversations automatically work again without migration needed

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **Conversation Access:** Users can only access their own conversations (existing middleware)
- [ ] **Model Management:** Only admin users can soft delete models (new requirement)
- [ ] **Model Migration:** Users can only migrate their own conversations to available active models

### Input Validation
- [ ] **Model Selection:** Validate that selected replacement model is active and available
- [ ] **Conversation Ownership:** Ensure user owns conversation before allowing model migration
- [ ] **Admin Actions:** Verify admin privileges before allowing model soft delete

---

## 12. Deployment & Configuration

### Environment Variables
**No new environment variables required**

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates after each phase
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [ ] **Present the complete implementation plan** based on this task document
   - [ ] **Summarize all phases, files to modify, and key technical decisions**
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **Test each component as you build it in both light and dark themes**
   - [ ] Follow existing code patterns and conventions from `components/chat/CurrentModelDropdown.tsx`
   - [ ] **Always create components in `components/[feature]/` directories**
   - [ ] Keep pages minimal - only import and use components
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper type safety
- [ ] Add proper error handling for all async operations
- [ ] Include comprehensive comments for complex model status logic
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode thoroughly**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA) for modal dialogs and alerts
- [ ] Use semantic HTML elements in notification components

---

## 14. Notes & Additional Context

### User Experience Flow
**Current:** User clicks conversation → Loads normally → Can send messages
**New (Inactive Model):** 
1. User clicks conversation → Loads with banner "This conversation used [Model X] which is no longer available"
2. User can scroll through message history normally
3. User types new message → Modal appears: "Select a model to continue this conversation"
4. User selects active model → Message sends with new model → Conversation continues seamlessly

### Technical Notes
- The `is_active` field already exists in `ai_models` table, so this is purely a software behavior change
- No data migration required - all existing models default to `is_active = true`
- Foreign key constraint remains intact - we never delete models, only mark inactive
- Performance impact is minimal - only affects conversation loading queries

---

*Task Version: 1.0*  
*Created: December 2024*  
*Author: Claude (based on user requirements)* 
