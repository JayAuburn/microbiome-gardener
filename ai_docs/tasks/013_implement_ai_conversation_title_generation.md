# AI-Powered Conversation Title Generation

> **Instructions:** This task implements automatic conversation title generation using AI to replace the current 50-character truncation with intelligent summaries that help users identify conversations in their chat history.

---

## 1. Task Overview

### Task Title
**Title:** Implement AI-powered conversation title generation using async server actions

### Goal Statement
**Goal:** Automatically generate meaningful conversation titles using AI when new conversations are created, replacing the current 50-character truncation with intelligent summaries. This will improve user experience in the chat history by providing descriptive, contextual titles that help users quickly identify and find their conversations.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **AI Provider:** OpenRouter API with access to multiple models including Google Gemini Flash 2.5
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** `app/actions/chat.ts` for conversation management, `lib/env.ts` for API key configuration

### Current State
Currently, when a new conversation is created in `upsertConversationAndUserMessage()` (line 34 in `app/actions/chat.ts`), the title is set using simple truncation:

```typescript
const title = userMessageContent.substring(0, 50);
```

The conversation schema supports a `title` field (text, nullable) in the `conversations` table. The history page displays these titles, with "New Conversation" as fallback when title is null.

## 3. Context & Problem Definition

### Problem Statement
The current conversation naming system uses a simple 50-character truncation of the user's first message, which often results in incomplete, unclear titles that don't help users identify conversations in their history. This makes it difficult for users to quickly find and return to specific conversations, especially when they have many conversations or when the first message is long or doesn't clearly indicate the conversation topic.

### Success Criteria
- [ ] New conversations automatically receive AI-generated descriptive titles (≤100 chars)
- [ ] Title generation happens in background without impacting chat performance
- [ ] Fallback system works when AI generation fails (shows user message)
- [ ] Existing truncated titles remain unchanged (no retroactive updates)
- [ ] Generated titles appear in chat history within 5-10 seconds of conversation creation

---

## 4. Technical Requirements

### Functional Requirements
- **AI Title Generation:** System generates concise, descriptive titles for new conversations based on the first user message
- **Background Processing:** Title generation happens asynchronously without blocking conversation creation
- **Fallback Handling:** If AI generation fails, conversation title remains null (UI shows user message as fallback)
- **Model Selection:** Use Google Gemini Flash 2.5 via OpenRouter for fast, cost-effective summarization
- **Length Constraints:** Generated titles must be 100 characters or less

### Non-Functional Requirements
- **Performance:** Conversation creation latency remains unchanged (< 500ms)
- **Reliability:** AI generation failures don't affect core chat functionality
- **Cost Efficiency:** Use fast, inexpensive model (Gemini Flash 2.5) for title generation
- **Error Handling:** Graceful degradation when AI service is unavailable
- **Security:** All AI API calls authenticated with existing OpenRouter credentials

### Technical Constraints
- **No External Infrastructure:** Must use existing Next.js server actions, no queues or background jobs
- **Existing API Keys:** Use current OpenRouter API key configuration
- **Database Schema:** Work with existing conversations table structure
- **No Retroactive Updates:** Only apply to new conversations, don't modify existing ones

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required. The existing `conversations` table already supports the `title` field:

```sql
-- Existing schema (no changes needed)
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text, -- Already supports nullable text for titles
  active_model_id uuid REFERENCES ai_models(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
```

### Data Model Updates
No TypeScript type changes required. Current schema types already support nullable title:

```typescript
// Existing types (no changes needed)
export type Conversation = {
  id: string;
  user_id: string;
  title: string | null; // Already nullable
  active_model_id: string | null;
  created_at: Date;
  updated_at: Date;
};
```

### Data Migration Plan
- [ ] No migrations needed - existing schema supports the feature
- [ ] Existing conversations with truncated titles remain unchanged
- [ ] New conversations will receive AI-generated titles going forward

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MUTATIONS (Server Actions)** → `app/actions/chat.ts`
- [ ] **Modify existing `upsertConversationAndUserMessage`** - Add async title generation call
- [ ] **Add new `generateConversationTitleAsync`** - Background AI title generation
- [ ] **Add new `updateConversationTitle`** - Update conversation title after generation

**QUERIES (Data Fetching)** → No changes needed
- [ ] **Existing history queries** - Already handle nullable titles correctly

### Server Actions
- [ ] **`generateConversationTitleAsync`** - Async function that generates AI title and updates conversation
- [ ] **`updateConversationTitle`** - Helper function to update conversation title in database
- [ ] **Modified `upsertConversationAndUserMessage`** - Add fire-and-forget async title generation call

### API Integration
- [ ] **OpenRouter Integration** - Use existing OpenRouter client to call Google Gemini Flash 2.5
- [ ] **Prompt Engineering** - Create effective prompt for conversation title generation
- [ ] **Error Handling** - Graceful handling of AI API failures

---

## 7. Frontend Changes

### Component Updates
No frontend component changes required. The existing components already handle nullable titles correctly:

- [ ] **`components/history/ConversationRow.tsx`** - Already displays fallback for null titles
- [ ] **`lib/history.ts`** - Already handles nullable titles in queries
- [ ] **History page** - Already shows "New Conversation" when title is null

### State Management
No state management changes needed. Title updates will be reflected when users navigate back to history page due to server-side rendering.

---

## 8. Implementation Plan

### Phase 1: Core AI Title Generation Function
**Goal:** Create the async title generation function with OpenRouter integration

- [ ] **Task 1.1: Create AI title generation function**
  - Files: `app/actions/chat.ts`
  - Details: Add `generateConversationTitleAsync()` function that:
    - Accepts conversation ID and user message content
    - Creates OpenRouter client
    - Calls Gemini Flash 2.5 with optimized prompt
    - Updates conversation title in database
    - Handles errors gracefully

- [ ] **Task 1.2: Create title update helper**
  - Files: `app/actions/chat.ts`
  - Details: Add `updateConversationTitle()` server action for database updates

### Phase 2: Integration with Conversation Creation
**Goal:** Integrate title generation with existing conversation creation flow

- [ ] **Task 2.1: Modify conversation creation**
  - Files: `app/actions/chat.ts`
  - Details: Update `upsertConversationAndUserMessage()` to:
    - Remove truncation logic for new conversations (set title to null initially)
    - Add fire-and-forget call to `generateConversationTitleAsync()`
    - Ensure no impact on conversation creation performance

- [ ] **Task 2.2: Add error handling and logging**
  - Files: `app/actions/chat.ts`
  - Details: Add comprehensive error handling and logging for AI generation failures

### Phase 3: Testing and Optimization
**Goal:** Ensure reliability and optimize performance

- [ ] **Task 3.1: Test AI title generation**
  - Files: Various test conversations
  - Details: Test with different message types, lengths, and edge cases

- [ ] **Task 3.2: Optimize prompts and performance**
  - Files: `app/actions/chat.ts`
  - Details: Refine AI prompts for better title quality and consistency

---

## 9. File Structure & Organization

### New Functions to Add
```
app/actions/
└── chat.ts                           # Add new async functions
    ├── generateConversationTitleAsync() # AI title generation
    ├── updateConversationTitle()        # Database update helper
    └── upsertConversationAndUserMessage() # Modified to trigger title generation
```

### Files to Modify
- [ ] **`app/actions/chat.ts`** - Add AI title generation functions and modify conversation creation
- [ ] **`lib/env.ts`** - Already has OPENROUTER_API_KEY (no changes needed)

### Dependencies to Add
No new dependencies required. Will use existing:
- `@openrouter/ai-sdk-provider` - Already installed
- `ai` package - Already installed  
- `drizzle-orm` - Already installed

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **OpenRouter API Failure** - Network issues, rate limits, or service downtime
  - **Handling:** Log error, leave title as null, conversation creation continues normally
- [ ] **Invalid API Response** - Malformed or empty response from AI
  - **Handling:** Log error, leave title as null, fallback to user message display
- [ ] **Database Update Failure** - Unable to update conversation title
  - **Handling:** Log error, retry once, then give up gracefully
- [ ] **Long User Messages** - Messages exceeding AI context limits
  - **Handling:** Truncate message for AI processing while preserving original in database

### Edge Cases
- [ ] **Empty or Very Short Messages** - Single words or very brief messages
  - **Solution:** Handle gracefully, may result in title same as message
- [ ] **Non-English Messages** - Messages in other languages
  - **Solution:** Gemini Flash 2.5 handles multiple languages well
- [ ] **Code or Technical Content** - Programming code or technical discussions
  - **Solution:** Prompt engineering to handle technical content appropriately

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] All AI generation calls authenticate with existing OpenRouter API key
- [ ] Conversation ownership verified before title updates
- [ ] No user input passed directly to AI without sanitization

### Input Validation
- [ ] Validate conversation ID format and existence
- [ ] Sanitize user message content before AI processing
- [ ] Limit message length sent to AI to prevent prompt injection

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# Already configured (no changes needed)
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Configuration
- [ ] AI model selection: `google/gemini-flash-2.5`
- [ ] Title length limit: 100 characters
- [ ] Timeout for AI calls: 10 seconds

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if prompt engineering needs refinement
- [ ] Provide progress updates after each phase
- [ ] Flag any OpenRouter API issues immediately
- [ ] Suggest prompt improvements based on testing results

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [x] **Present the complete implementation plan** - This document serves as the plan
   - [x] **Summarize all phases, files to modify, and key technical decisions** - Covered above
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Test each function as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper error handling
- [ ] Add comprehensive comments for AI integration code
- [ ] Use existing OpenRouter patterns from `app/api/chat/route.ts`
- [ ] Ensure async functions don't block main conversation flow
- [ ] Follow existing naming conventions and code style

---

## 14. Technical Implementation Details

### AI Prompt Engineering
The prompt for title generation should:
- Be concise and specific about the task
- Provide context about the conversation purpose
- Specify length constraints (≤100 characters)
- Handle various message types (questions, statements, technical content)
- Generate descriptive, user-friendly titles

### Example Prompt Structure:
```
Generate a concise, descriptive title for a chat conversation based on this first user message. 
The title should be:
- Maximum 100 characters
- Descriptive and helpful for finding the conversation later
- Professional and clear
- In the same language as the user message

User message: "[USER_MESSAGE]"

Respond with only the title, no additional text.
```

### Performance Considerations
- Fire-and-forget async execution to avoid blocking conversation creation
- 10-second timeout for AI calls to prevent hanging
- Graceful degradation when AI service is unavailable
- Efficient database updates with minimal queries

---

## 15. Notes & Additional Context

### Future Enhancements
- Could add user preference to disable AI title generation
- Could implement retroactive title generation for existing conversations
- Could add title regeneration functionality
- Could implement A/B testing for different prompt strategies

### Monitoring & Analytics
- Log AI generation success/failure rates
- Monitor title generation latency
- Track user satisfaction with generated titles (future feature)

---

*Task Version: 1.0*  
*Created: December 2024*  
*Author: AI Assistant* 
