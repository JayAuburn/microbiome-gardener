# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Migrate Chat from OpenRouter to Gemini for Unified AI Stack

### Goal Statement
**Goal:** Replace OpenRouter integration with Google Gemini for chat functionality to create a unified AI stack that uses Google Cloud services for both embedding generation (already implemented) and conversational AI. This will simplify the architecture, reduce external dependencies, potentially improve performance through co-location, and create a more coherent RAG system where embeddings and chat use the same provider.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM with pgvector for embeddings
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **AI Stack:** Currently split between OpenRouter (chat) and Google Vertex AI (embeddings)
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/chat/ChatInterface.tsx` - Main chat UI
  - `components/chat/MessageBubble.tsx` - Message display
  - `components/chat/MessageInput.tsx` - User input
  - `app/actions/chat.ts` - Chat server actions
  - `app/api/chat/route.ts` - Chat API endpoint using OpenRouter

### Current State
The RAG SaaS template currently has a **split AI architecture**:

**Chat Functionality (OpenRouter):**
- Uses `@openrouter/ai-sdk-provider` for conversational AI
- Configured in `app/api/chat/route.ts` with various model options
- Supports streaming responses via Vercel AI SDK
- Environment variable: `OPENROUTER_API_KEY`

**Embedding Functionality (Google Vertex AI):**
- Uses Google Cloud Vertex AI text-embedding-004 model
- Configured for 1408 dimensions for cross-modal compatibility
- Integrated in RAG processor and search API
- Environment variables: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_ACCESS_TOKEN`

**Issues with Current Split:**
- Two different AI providers increase complexity
- Different authentication methods (API key vs service account)
- Potential latency from geographically separated services
- Inconsistent model behavior between embeddings and chat
- Additional billing relationships and API management

## 3. Context & Problem Definition

### Problem Statement
The current architecture splits AI functionality between OpenRouter (chat) and Google Vertex AI (embeddings), creating unnecessary complexity and potential consistency issues. Since we're already using Google Cloud for embeddings, storage, and other services, consolidating to Google Gemini for chat would:

1. **Simplify architecture** - Single AI provider instead of two
2. **Improve consistency** - Same provider for embeddings and chat ensures model compatibility
3. **Reduce latency** - Co-located services in same Google Cloud region
4. **Streamline billing** - Single Google Cloud bill instead of multiple providers
5. **Enhanced RAG performance** - Gemini models are optimized to work with Google's embedding models

### Success Criteria
- [ ] Chat functionality works identically to current OpenRouter implementation
- [ ] Streaming responses maintained for real-time user experience
- [ ] All existing chat features preserved (message history, conversation management)
- [ ] Vector search integration enhanced with Gemini's RAG-optimized features
- [ ] Performance equal or better than current OpenRouter setup
- [ ] Single Google Cloud authentication for all AI services
- [ ] Environment simplified by removing OpenRouter dependency

---

## 4. Technical Requirements

### Functional Requirements
- Chat interface must support real-time streaming responses using Gemini
- User can select from available Gemini models (Gemini 1.5 Pro, Gemini 1.5 Flash)
- Vector search results must be seamlessly integrated into chat context
- Conversation history preserved and managed identically to current system
- Message display supports markdown, code blocks, and rich formatting
- Error handling gracefully manages API failures and rate limits

### Non-Functional Requirements
- **Performance:** Response times ≤ 2 seconds for first token, full streaming experience
- **Security:** Uses existing Google Cloud service account authentication
- **Usability:** Zero disruption to end user experience during migration
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Support latest Chrome, Firefox, Safari, Edge browsers

### Technical Constraints
- Must use Google Cloud Vertex AI Gemini models only
- Cannot modify existing database schema for conversations/messages
- Must maintain compatibility with existing UsageTracker component
- Authentication must use existing Google Cloud service account
- Must preserve streaming capability for real-time responses

---

## 5. Data & Database Changes

### Database Schema Changes
**No database changes required** - existing conversations and messages tables are sufficient.

### Data Model Updates
**Type updates needed** for model selection:
```typescript
// Update existing model types to reflect Gemini options
export type SupportedModel = 
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro-latest'
  | 'gemini-1.5-flash-latest';

// Enhanced message metadata for Gemini features
interface MessageMetadata {
  model: SupportedModel;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  // Vector search context when RAG is used
  searchContext?: {
    query: string;
    results: number;
    similarity_threshold: number;
  };
}
```

### Data Migration Plan
- [ ] **No migration needed** - existing message/conversation data is compatible
- [ ] **Model field updates** - Update admin interface to show Gemini models only
- [ ] **Default model configuration** - Set sensible defaults for new conversations

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MUTATIONS (Server Actions)** → `app/actions/chat.ts`
- [ ] **Keep existing Server Actions** - `createConversation()`, `sendMessage()` 
- [ ] **Update implementations** to use Gemini instead of OpenRouter
- [ ] Must use `'use server'` directive and `revalidatePath()` after mutations

**QUERIES (Data Fetching)** → Direct in Server Components (already implemented correctly)
- [ ] **No changes needed** - existing conversation/message queries work unchanged

### Server Actions
- [ ] **`sendMessage`** - Update to use Gemini API instead of OpenRouter
- [ ] **`createConversation`** - Update default model to Gemini option
- [ ] **Integration with vector search** - Enhance to include document context

### Database Queries
- [ ] **No changes needed** - existing query patterns remain the same

### API Routes (Main Changes)
- [ ] **`app/api/chat/route.ts`** - Complete rewrite to use Google Vertex AI Gemini
  - Replace `@openrouter/ai-sdk-provider` with direct Google AI calls
  - Implement streaming using Gemini's streaming API
  - Integrate vector search results as context
  - Maintain compatibility with Vercel AI SDK patterns

### External Integrations
- **Google Vertex AI Gemini** - Primary integration for conversational AI
  - Uses existing service account authentication
  - Endpoint: `https://aiplatform.googleapis.com/v1/projects/{project}/locations/{region}/publishers/google/models/gemini-*:streamGenerateContent`
- **Enhanced RAG Integration** - Combine vector search with chat context

---

## 7. Frontend Changes

### New Components
- [ ] **`components/chat/ModelSelector.tsx`** - Dropdown for Gemini model selection
  - Props: `selectedModel`, `onModelChange`, `availableModels`
  - Replaces OpenRouter model selector with Gemini options

### Page Updates
- [ ] **`/chat` pages** - No visual changes, but enhanced RAG integration
- [ ] **Admin model management** - Update to show Gemini models only

### State Management
- **Model Selection State** - Update to use Gemini model identifiers
- **Streaming Response Handling** - Maintain existing patterns but with Gemini API
- **Vector Search Integration** - Enhance chat state to include document context

---

## 8. Implementation Plan

### Phase 1: Google Gemini API Integration
**Goal:** Replace OpenRouter with Gemini API for basic chat functionality

- [ ] **Task 1.1:** Update environment configuration
  - Files: `lib/env.ts`
  - Details: Remove `OPENROUTER_API_KEY`, ensure Google Cloud vars are sufficient
- [ ] **Task 1.2:** Create Gemini API client
  - Files: `lib/gemini-client.ts`
  - Details: Implement Google Vertex AI Gemini client with authentication
- [ ] **Task 1.3:** Replace chat API route
  - Files: `app/api/chat/route.ts`
  - Details: Complete rewrite using Gemini streaming API

### Phase 2: Enhanced RAG Integration
**Goal:** Leverage Gemini's RAG capabilities with vector search

- [ ] **Task 2.1:** Enhance chat actions with vector search
  - Files: `app/actions/chat.ts`
  - Details: Integrate document search before sending to Gemini
- [ ] **Task 2.2:** Update chat interface for context display
  - Files: `components/chat/ChatInterface.tsx`, `components/chat/SearchResults.tsx`
  - Details: Show document sources when RAG context is used

### Phase 3: Model Management & Polish
**Goal:** Complete migration with improved model selection

- [ ] **Task 3.1:** Update model selector component
  - Files: `components/chat/ModelSelector.tsx`
  - Details: Replace OpenRouter models with Gemini options
- [ ] **Task 3.2:** Update admin interface
  - Files: `app/(protected)/admin/models/`
  - Details: Configure Gemini models, remove OpenRouter references
- [ ] **Task 3.3:** Environment cleanup and testing
  - Files: Documentation, environment templates
  - Details: Remove OpenRouter dependencies, test end-to-end

---

## 9. File Structure & Organization

### New Files to Create
```
templates/rag-saas/apps/web/
├── lib/
│   └── gemini-client.ts              # Google Gemini API client and utilities
├── components/chat/
│   └── ModelSelector.tsx             # Updated for Gemini models
└── app/api/chat/
    └── route.ts                      # Completely rewritten for Gemini
```

### Files to Modify
- [ ] **`lib/env.ts`** - Remove OpenRouter vars, ensure Google Cloud coverage
- [ ] **`app/actions/chat.ts`** - Integrate vector search with Gemini calls
- [ ] **`components/chat/ChatInterface.tsx`** - Enhanced RAG context display
- [ ] **`app/(protected)/admin/models/`** - Update for Gemini model management
- [ ] **`package.json`** - Remove OpenRouter dependencies

### Dependencies to Add
```json
{
  "dependencies": {
    "@google-ai/generativelanguage": "^2.0.0"
  }
}
```

### Dependencies to Remove
```json
{
  "dependencies": {
    "@openrouter/ai-sdk-provider": "^0.7.2"
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Gemini API Rate Limiting:** Implement exponential backoff and user feedback
  - **Handling:** Queue requests, show wait times, graceful degradation
- [ ] **Authentication Failures:** Handle service account token expiration
  - **Handling:** Automatic token refresh, fallback error messages
- [ ] **Vector Search Failures:** Chat continues without RAG context
  - **Handling:** Log error, inform user, proceed with standard chat

### Edge Cases
- [ ] **Large Document Context:** Handle when vector search returns huge context
  - **Solution:** Truncate context intelligently, prioritize most relevant chunks
- [ ] **Model Switching Mid-Conversation:** Maintain conversation context
  - **Solution:** Include conversation history in model switch
- [ ] **Concurrent Requests:** Handle multiple simultaneous chat requests
  - **Solution:** Request queuing and proper async handling

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **Uses existing Google Cloud service account** - no new auth needed
- [ ] **Same user permissions** as current chat system
- [ ] **Vector search respects user data isolation** - only search user's documents

### Input Validation
- [ ] **Message content validation** - prevent injection attacks
- [ ] **Model selection validation** - ensure only supported Gemini models
- [ ] **Context length limits** - prevent token limit exploitation

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# Remove these (OpenRouter)
# OPENROUTER_API_KEY=your_openrouter_key

# Ensure these exist (Google Cloud - should already be configured)
GOOGLE_CLOUD_PROJECT_ID=your-rag-saas-project
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
GOOGLE_CLOUD_ACCESS_TOKEN=your-access-token
```

### Additional Configuration
- **Gemini Model Defaults:** Set in admin interface or environment
- **RAG Integration Settings:** Vector search thresholds and limits
- **Rate Limiting:** Configure request limits for Gemini API

---

## 13. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **TASK DOCUMENT COMPLETED** ✅
2. **AWAITING USER APPROVAL** - Do not start coding until explicit approval
3. **IMPLEMENTATION PHASES** - Only after approval, execute in order

### Communication Preferences
- [ ] Provide progress updates at each phase completion
- [ ] Flag any Google Cloud API quota or billing concerns
- [ ] Suggest optimizations for RAG integration during implementation
- [ ] Confirm Gemini model selection with user before finalizing

### Code Quality Standards
- [ ] Follow TypeScript best practices with strict typing
- [ ] Maintain existing error handling patterns
- [ ] **Ensure responsive design** works across all breakpoints
- [ ] **Test in both light and dark themes**
- [ ] **Verify streaming performance** on slow connections
- [ ] Add comprehensive comments for Gemini integration code

---

## 14. Notes & Additional Context

### Research Links
- [Google Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Vertex AI Streaming](https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/send-multimodal-prompts#stream)
- [RAG with Gemini Best Practices](https://cloud.google.com/vertex-ai/docs/generative-ai/rag/overview)

### Migration Benefits
- **Unified Stack:** Single AI provider for all functionality
- **Better RAG:** Gemini optimized for retrieval-augmented generation
- **Cost Optimization:** Consolidated billing and potential volume discounts
- **Improved Performance:** Co-located services in same Google Cloud region
- **Enhanced Features:** Access to Gemini's multimodal capabilities for future expansion

### Future Considerations
- **Multimodal Support:** Gemini supports images/video for future document processing
- **Function Calling:** Gemini supports structured function calls for enhanced RAG
- **Larger Context Windows:** Gemini 1.5 Pro supports up to 2M tokens

---

*Template Version: 1.0*  
*Last Updated: 12/23/2024*  
*Task: Migrate Chat to Gemini for Unified AI Stack* 
