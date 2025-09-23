# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Refactor CurrentModelDropdown to Fetch Models from Database

### Goal Statement
**Goal:** To refactor the `CurrentModelDropdown.tsx` component to dynamically fetch the list of available AI models from the `ai_models` table in the database. This will replace the current hardcoded prop-driven system, ensuring the UI is always in sync with the centrally-managed list of models.

---

## 2. Project Analysis & Current State

### Technology Stack Analysis
- **`package.json`**: Next.js (App Router), React 19, TypeScript, Drizzle ORM, Supabase client, Tailwind CSS.
- **`tsconfig.json`**: Standard Next.js configuration with strict mode enabled and path aliases (`@/*`).
- **`tailwind.config.ts`**: Standard shadcn/ui setup with custom colors for AI providers (`openai`, `anthropic`, `gemini-blue`).
- **Database Schema**: Drizzle schema is defined in `lib/drizzle/schema/`, featuring `users` and `ai_models` tables.
- **Existing Components**: `CurrentModelDropdown.tsx` exists as a client component that accepts `currentModel` and `availableModels` as props.
- **Middleware & Auth**: Supabase middleware (`middleware.ts`) handles session management for protected routes.

### Current Infrastructure
- **Framework & Versions:** Next.js (latest, App Router), React ^19.0.0, TypeScript ^5
- **Key Dependencies:** Drizzle ORM, Supabase, shadcn/ui, Tailwind CSS
- **Existing Architecture:** Next.js App Router with Server Components and Client Components. Server Actions are used for mutations. Direct database queries in Server Components are an established pattern.

### Current State
The `CurrentModelDropdown.tsx` component is currently a "dumb" client component. It relies entirely on its parent to provide a list of available AI models via props. It uses a local, hardcoded `AIModel` interface that is now out of sync with the official `AiModel` type generated from our Drizzle schema. The component needs to be integrated into our new database-first model management system.

---

## 3. Context & Problem Definition

### Problem Statement
The model selection dropdown is not connected to our database. Its model list is passed via props, and it uses an outdated, local TypeScript interface. This creates several problems:
- The UI is decoupled from the single source of truth (the `ai_models` table).
- Adding or deactivating a model in the database requires manual code changes in whatever parent component constructs the model list.
- The component uses a stale `AIModel` type definition.

### Success Criteria
- [x] The dropdown no longer defines a local `AIModel` interface and instead imports the official `AiModel` type from `lib/drizzle/schema`.
- [x] A server-side function is created to fetch all active models from the `ai_models` table.
- [x] The parent chat page (`app/(protected)/chat/page.tsx`) calls this function to get the list of models.
- [x] The fetched list is passed to the `CurrentModelDropdown` component.
- [x] The dropdown renders the models from the database correctly.
- [x] The provider color mapping is updated to include `xAI`.

---

## 4. Technical Requirements

### Functional Requirements
- The system must fetch all models from the `ai_models` table where `is_active` is `true`.
- The `CurrentModelDropdown.tsx` component must use the official Drizzle-generated `AiModel` type.
- The component must correctly display `model_name` from the database records.
- The component must continue to call the `onModelSelect` function with the complete, correct model object when a user makes a selection.

### Non-Functional Requirements
- **Performance:** The model list should be fetched on the server to avoid client-side round trips.
- **Usability:** The dropdown's appearance and behavior should remain consistent with the existing design.

### Technical Constraints
- Must use the existing Supabase client and Drizzle ORM for database access.
- Must not change the existing `ai_models` database schema.

---

## 5. Data & Database Changes

### Database Schema Changes
No changes are needed. We will be reading from the existing `ai_models` table.

### Data Model Updates
- The local `AIModel` interface in `CurrentModelDropdown.tsx` will be deleted.
- The component will be updated to import and use `AiModel` from `@/lib/drizzle/schema`.

---

## 6. API & Backend Changes

### Data Access Pattern (Choose One)

**Standard Approach (Recommended):**
- [x] **Direct Queries in Server Components** - The model list is simple data needed for the initial render of the chat page. Fetching it directly in the chat page's Server Component is the most efficient approach.

### Database Queries
- A new query will be created to perform `db.select().from(aiModels).where(eq(aiModels.is_active, true))`. This will be placed within the `app/(protected)/chat/page.tsx` Server Component.

---

## 7. Frontend Changes

### Components to Modify
- **`components/chat/CurrentModelDropdown.tsx`**:
  - Remove the local `AIModel` interface.
  - Import the `AiModel` type from `@/lib/drizzle/schema`.
  - Update the `CurrentModelDropdownProps` to use `AiModel`.
  - Update the `providerColors` object to include an entry for `"xAI": "text-white"`.
  - Change references from `model.displayName` to `model.model_name`.
  - Change `model.provider` to `model.provider_name`.

- **`app/(protected)/chat/page.tsx`** (or its parent Server Component):
  - This component will be converted to an `async` Server Component.
  - It will perform the database call to fetch the available models.
  - It will pass the fetched models down to the `CurrentModelDropdown`.

### State Management
- The chat page will continue to manage the state of the `currentModel` using `useState`. The initial state can be set to the first model from the fetched list.

---

## 8. Implementation Plan

### Phase 1: Update the Dropdown Component
**Goal:** Make the `CurrentModelDropdown` component aware of the official database schema.

- [ ] **Task 1.1:** Modify `components/chat/CurrentModelDropdown.tsx`.
  - **Files:** `components/chat/CurrentModelDropdown.tsx`
  - **Details:**
    - Delete the local `AIModel` interface.
    - Import `{ AiModel }` from `@/lib/drizzle/schema`.
    - Update the `CurrentModelDropdownProps` to use `AiModel`.
    - Change references from `model.displayName` to `model.model_name`.
    - Change `model.provider` to `model.provider_name`.

### Phase 2: Implement Server-Side Data Fetching
**Goal:** Fetch the model list on the server and pass it to the UI.

- [ ] **Task 2.1:** Refactor the chat page to be a Server Component that fetches data.
  - **Files:** `app/(protected)/chat/page.tsx`
  - **Details:**
    - Convert the `ChatPage` component into an `async` function.
    - Create a Drizzle database client instance.
    - Write the query to fetch all active models from the `ai_models` table.
    - Pass the fetched `availableModels` array to the client component that renders the dropdown. You may need to create a new client component to wrap the page's stateful logic if `chat/page.tsx` is not already structured this way.

### Phase 3: Polish and Verify
**Goal:** Ensure everything works together seamlessly.

- [ ] **Task 3.1:** Verify model switching still works correctly.
- [ ] **Task 3.2:** Test with an empty `ai_models` table to ensure the UI doesn't break.
- [ ] **Task 3.3:** Confirm the new `xAI` provider color is applied correctly.

---

## 9. File Structure & Organization

### New Files to Create
No new files are expected.

### Files to Modify
- `components/chat/CurrentModelDropdown.tsx`
- `app/(protected)/chat/page.tsx`

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- **Database Fetch Fails:** The server-side fetch for models might fail.
  - **Handling:** The page should render an error state or log the error. For this task, failing gracefully by not rendering the dropdown is acceptable.
- **No Active Models:** The query might return an empty array if no models are active.
  - **Handling:** The dropdown should not be rendered, or a message like "No models available" should be displayed in its place.

---
*Template Version: 1.0*
*Last Updated: 6/23/2025*
*Created By: AI Assistant* 
