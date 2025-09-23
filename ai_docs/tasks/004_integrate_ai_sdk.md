# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Integrate Multi-Provider Chat with Vercel AI SDK

### Goal Statement
**Goal:** To implement real-time, streaming chat functionality using the Vercel AI SDK. This will connect our chat interface to live AI models from OpenAI, Google, and xAI, handle dynamic model switching on the backend, and persist conversation history to the database.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js (latest, App Router), React 19
- **Language:** TypeScript 5 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Supabase Auth managed by `middleware.ts`
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching. The `ChatInterface` is a Client Component.
- **Relevant Existing Components:** `components/chat/ChatInterface.tsx` is the main client component for the chat UI.

### Current State
The chat interface is visually complete but functionally a placeholder. The `ChatContainer` component simulates an AI response with a `setTimeout` function. There is no connection to any actual AI service. The database currently lacks the `conversations` and `messages` tables required to store chat history.

## 3. Context & Problem Definition

### Problem Statement
The chat feature is the core of the application, but it is not functional. Users can type messages, but there is no AI interaction, no real-time streaming, and no persistence. To make this a viable product, we need to wire the frontend to a backend that can handle requests to multiple AI providers and save the results.

### Success Criteria
- [ ] New `conversations` and `messages` tables are created in the database via a Drizzle migration.
- [ ] A new API route (`/api/chat`) is created to handle chat streaming.
- [ ] The API route can dynamically use the OpenAI, Google, or xAI provider based on the request body.
- [ ] The `ChatInterface.tsx` component is refactored to use the `useChat` hook from `@ai-sdk/react`.
- [ ] Users can send a message and receive a real-time, streaming response from the selected model.
- [ ] A new server action is created to persist the conversation messages to the database after a response is successfully received.

---

## 4. Technical Requirements

### Functional Requirements
- The user must be able to select a model from any supported provider (OpenAI, Google, xAI).
- The `useChat` hook must send the selected model's ID and conversation history to `/api/chat`.
- The API route must instantiate the correct provider's SDK based on the model ID.
- The entire conversation (user message and full assistant response) must be saved to the database.
- API Keys for all providers must be managed securely as environment variables.

### Non-Functional Requirements
- **Performance:** AI responses must begin streaming to the client in under 3 seconds.
- **Security:** All API keys and direct AI provider calls must be handled exclusively on the server-side within the API route.

---

## 5. Data & Database Changes

### Database Schema Changes
Two new tables are required. We will create `lib/drizzle/schema/conversations.ts` and `lib/drizzle/schema/messages.ts` and then run a migration.

```typescript
// lib/drizzle/schema/conversations.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { aiModels } from "./ai_models";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: text("title"),
  active_model_id: uuid("active_model_id").references(() => aiModels.id),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// lib/drizzle/schema/messages.ts
import { pgTable, text, timestamp, uuid, pgEnum, index } from "drizzle-orm/pg-core";
import { conversations } from "./conversations";

export const messageSenderEnum = pgEnum("message_sender", ["user", "assistant"]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversation_id: uuid("conversation_id").notNull().references(() => conversations.id),
  sender: messageSenderEnum("sender").notNull(),
  content: text("content").notNull(),
  model_id: uuid("model_id"), // Can be null for user messages
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    conversationIdIdx: index("conversation_id_idx").on(table.conversation_id),
  };
});
```

### Data Migration Plan
- [ ] Create the new schema files as defined above.
- [ ] Update `lib/drizzle/schema/index.ts` to export the new tables.
- [ ] Run `npm run db:generate` to create a new migration file.
- [ ] Run `npm run db:migrate` to apply the migration to the database.

---

## 6. API & Backend Changes

### Data Access Pattern
- **API Route:** An API route at `app/api/chat/route.ts` will handle all AI interactions.
- **Server Actions:** A Server Action in `app/actions/chat.ts` will be used for database writes.

### API Routes
- **`POST /api/chat`**:
  - Receives `{ messages: Message[], data: { modelId: string } }` from the `useChat` hook.
  - Fetches the selected model's details (especially `provider_name`) from the database.
  - Uses a `switch` statement on `provider_name` to instantiate the correct AI provider (`openai(model.model_name)`, etc.).
  - Calls `streamText` with the model and messages.
  - Returns the `StreamingTextResponse`.

### Server Actions
- **`saveConversation(messages: Message[])`**:
  - This action will be called by the `onFinish` callback of the `useChat` hook.
  - It will find or create a conversation record.
  - It will write the user message and the full assistant message to the `messages` table.

---

## 7. Frontend Changes

### Components to Modify
- **`components/chat/ChatInterface.tsx`**:
  - This component will be significantly refactored to use the `useChat` hook.
  - The local `messages` and `isLoading` state will be removed and replaced by state from `useChat`.
  - The `handleSendMessage` logic will be replaced by the `handleSubmit` function from the hook.
  - The `onFinish` callback will be added to call our new server action for saving messages.
  - The `body` of the `useChat` hook options will be used to pass the `currentModel.id` to the API route.

### New Components
- No new visual components are needed.

---

## 8. Implementation Plan

### Phase 1: Database Setup
**Goal:** Create the necessary database tables for storing conversations.
- [ ] Task 1.1: Create `lib/drizzle/schema/conversations.ts`.
- [ ] Task 1.2: Create `lib/drizzle/schema/messages.ts`.
- [ ] Task 1.3: Update `lib/drizzle/schema/index.ts` to export the new schemas.
- [ ] Task 1.4: Run `npm run db:generate` and `npm run db:migrate`.

### Phase 2: Backend API Route
**Goal:** Create the dynamic, multi-provider API route for streaming.
- [ ] Task 2.1: Create the `app/api/chat/route.ts` file.
- [ ] Task 2.2: Implement the logic to get the model from the DB based on the ID from the request.
- [ ] Task 2.3: Implement the `switch` statement to instantiate the correct `openai`, `google`, or `xai` provider.
- [ ] Task 2.4: Use `streamText` and return a `StreamingTextResponse`.

### Phase 3: Frontend Integration with `useChat`
**Goal:** Connect the UI to the backend API using the Vercel AI SDK.
- [ ] Task 3.1: Refactor `ChatInterface.tsx` to use the `useChat` hook.
- [ ] Task 3.2: Remove the old state management (`useState` for messages/loading).
- [ ] Task 3.3: Pass the `currentModel.id` in the `body` of the `handleSubmit` function.
- [ ] Task 3.4: Render the `messages` from `useChat` in the `ChatMessages` component.

### Phase 4: Data Persistence
**Goal:** Save conversation history to the database.
- [ ] Task 4.1: Create `app/actions/chat.ts`.
- [ ] Task 4.2: Implement the `saveConversation` server action.
- [ ] Task 4.3: Implement the `onFinish` callback in `useChat` to call the new server action.

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── app/api/chat/
│   └── route.ts                      # Backend AI streaming endpoint
├── app/actions/
│   └── chat.ts                       # Server Action for saving messages
├── lib/drizzle/schema/
│   ├── conversations.ts              # New conversations table schema
│   └── messages.ts                   # New messages table schema
└── drizzle/migrations/
    └── [new_migration_file].sql      # Generated by Drizzle
```

### Files to Modify
- `components/chat/ChatInterface.tsx`
- `lib/drizzle/schema/index.ts`

### Dependencies to Add
```json
{
  "dependencies": {
    "ai": "latest",
    "@ai-sdk/react": "latest",
    "@ai-sdk/openai": "latest",
    "@ai-sdk/google": "latest",
    "@ai-sdk/xai": "latest"
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- **API Key Missing:** The API route should handle cases where a provider's API key is not set.
- **Invalid Model ID:** The API route should return a 404 or 400 error if the model ID from the client is not found in the database.
- **Database Write Failure:** The `onFinish` callback should handle potential errors from the `saveConversation` server action.

---

## 11. Security Considerations

### Authentication & Authorization
- The `/api/chat` route must be protected and should only be accessible by authenticated users. We can check the user session at the beginning of the `POST` handler.
- Server actions will inherently be protected by the auth middleware.

### Input Validation
- The content of user messages should be sanitized before being displayed, although the Vercel AI SDK and React handle most of this automatically.

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# Add these to .env.local
OPENAI_API_KEY=your_openai_key_here
GOOGLE_GENERATIVE_LANGUAGE_API_KEY=your_google_key_here
XAI_API_KEY=your_xai_key_here
```

---

*Template Version: 1.0*
*Last Updated: 6/23/2025*
*Created By: AI Assistant* 
