# Integrate OpenRouter with Vercel AI SDK

> **Instructions:** This task migrates the current multi-provider chat system to use OpenRouter as a unified interface for all LLM models, simplifying API key management and reducing code complexity.

---

## 1. Task Overview

### Task Title
**Title:** Integrate OpenRouter with Vercel AI SDK to Replace Multiple API Providers

### Goal Statement
**Goal:** Replace the current system that uses separate API keys and providers (OpenAI, Google, Anthropic, xAI) with OpenRouter as a unified interface. This will simplify configuration, reduce the number of API keys needed from 4+ to just 1, and make it easier to add new models without code changes.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Current AI Integration:** Vercel AI SDK with multiple provider-specific clients
- **Relevant Existing Components:** 
  - `app/api/chat/route.ts` - Main chat API endpoint
  - `app/actions/chat.ts` - Server actions for conversation management
  - `components/chat/CurrentModelDropdown.tsx` - Model selection UI
  - `lib/drizzle/schema/ai_models.ts` - Database schema for AI models

### Current State
The system currently manages multiple AI providers with separate configurations:
- **OpenAI Provider:** Uses `@ai-sdk/openai` with `OPENAI_API_KEY`
- **Google Provider:** Uses `@ai-sdk/google` with `GOOGLE_GENERATIVE_LANGUAGE_API_KEY`
- **Anthropic Provider:** Uses `@ai-sdk/anthropic` with `ANTHROPIC_API_KEY`
- **xAI Provider:** Uses `@ai-sdk/xai` with `XAI_API_KEY`

The `app/api/chat/route.ts` contains a large switch statement to handle different providers, making it complex to maintain and requiring separate API keys for each provider.

## 3. Context & Problem Definition

### Problem Statement
The current multi-provider system has several issues:
1. **Complex Configuration:** Requires managing 4+ different API keys
2. **Code Complexity:** Large switch statement with provider-specific logic
3. **Maintenance Overhead:** Adding new models requires code changes
4. **Error Handling:** Different error patterns for each provider
5. **Cost Management:** Difficult to track usage across multiple providers

OpenRouter solves these issues by providing a unified interface to hundreds of models through a single API key.

### Success Criteria
- [ ] Replace all provider-specific code with OpenRouter integration
- [ ] Reduce required environment variables from 4+ API keys to 1 OpenRouter key
- [ ] Maintain existing chat functionality without breaking changes
- [ ] Support all currently available models through OpenRouter
- [ ] Simplify the API route handler by removing provider switch logic
- [ ] Update environment configuration and documentation

---

## 4. Technical Requirements

### Functional Requirements
- System continues to support model selection via dropdown
- Chat streaming functionality remains unchanged for users
- All existing models remain available (mapped to OpenRouter equivalents)
- Server actions for conversation management remain unchanged
- Database schema for ai_models table continues to work

### Non-Functional Requirements
- **Performance:** No degradation in response times
- **Security:** Secure API key management through environment variables
- **Usability:** No user-facing changes to chat interface
- **Responsive Design:** No impact on existing responsive design
- **Theme Support:** No impact on existing theme system
- **Compatibility:** Maintain compatibility with existing conversation history

### Technical Constraints
- Must use OpenRouter's model naming conventions
- Cannot modify existing conversation or message data
- Must maintain backward compatibility with existing UI components

---

## 5. Data & Database Changes

### Database Schema Changes
**No database schema changes required.** The existing `ai_models` table structure remains unchanged.

### Data Model Approach
**No database migration needed.** Instead of updating the database, we'll construct OpenRouter model identifiers dynamically in the API route using the existing `provider_name` and `model_name` fields.

```typescript
// Dynamic mapping approach in API route
const providerMap: Record<string, string> = {
  'OpenAI': 'openai',
  'Google': 'google',
  'Anthropic': 'anthropic', 
  'xAI': 'x-ai'
};

// Construct OpenRouter model name: "openai/gpt-4.1"
const openrouterModelName = `${providerMap[model.provider_name]}/${model.model_name}`;
```

This approach keeps the database clean and makes the migration much simpler:
- Current: `provider_name: "OpenAI", model_name: "gpt-4.1"` → OpenRouter: `"openai/gpt-4.1"`
- Current: `provider_name: "Anthropic", model_name: "claude-4-opus-20250514"` → OpenRouter: `"anthropic/claude-4-opus-20250514"`
- Current: `provider_name: "xAI", model_name: "grok-3"` → OpenRouter: `"x-ai/grok-3"`

---

## 6. API & Backend Changes

### Data Access Pattern (Choose One)
**Standard Approach (Recommended):**
- [x] **Server Actions File** - `app/actions/chat.ts` - No changes needed for conversation management
- [x] **Direct Queries in Server Components** - Continue using existing pattern

### Server Actions
No changes needed to existing server actions in `app/actions/chat.ts` as they handle conversation and message management, not AI provider logic.

### Database Queries
No changes needed to existing query patterns.

### API Routes (Update Required)
- [x] **`app/api/chat/route.ts`** - Complete rewrite to use OpenRouter instead of multiple providers

### External Integrations
- **OpenRouter API:** Single unified interface to multiple AI providers
- **Configuration:** One `OPENROUTER_API_KEY` replaces multiple provider keys

---

## 7. Frontend Changes

### New Components
No new components needed. Existing components will continue to work with updated model data.

### Page Updates
No page updates required. The chat interface remains unchanged.

### State Management
No changes to state management. The model selection and chat flow remain the same.

---

## 8. Implementation Plan

### Phase 1: Environment and Dependencies Setup
**Goal:** Install OpenRouter provider and update environment configuration

- [ ] **Task 1.1:** Install OpenRouter AI SDK Provider
  - Command: `npm install @openrouter/ai-sdk-provider`
  - Details: Add the official OpenRouter provider for Vercel AI SDK
- [ ] **Task 1.2:** Update Environment Variables
  - Files: `.env.local`, `lib/env.ts`
  - Details: Add `OPENROUTER_API_KEY` and update validation schema
- [ ] **Task 1.3:** Remove Unused Dependencies
  - Files: `package.json`
  - Details: Remove `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/xai`

### Phase 2: Update API Route Handler
**Goal:** Replace multi-provider logic with OpenRouter integration

- [ ] **Task 2.1:** Rewrite Chat API Route
  - Files: `app/api/chat/route.ts`
  - Details: Replace provider switch statement with OpenRouter client
- [ ] **Task 2.2:** Update Error Handling
  - Files: `app/api/chat/route.ts`
  - Details: Simplify error handling for single provider

### Phase 3: Testing and Documentation
**Goal:** Verify functionality and update documentation

- [ ] **Task 3.1:** Test Chat Functionality
  - Details: Verify all models work through OpenRouter with dynamic model mapping
- [ ] **Task 3.2:** Test Each Provider
  - Details: Test at least one model from each provider (OpenAI, Google, Anthropic, xAI)
- [ ] **Task 3.3:** Update Documentation
  - Files: README.md, environment setup docs
  - Details: Update setup instructions for OpenRouter

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── lib/
│   └── env.ts                        # Update with OPENROUTER_API_KEY
```

### Files to Modify
- [ ] **`app/api/chat/route.ts`** - Complete rewrite to use OpenRouter with dynamic model mapping
- [ ] **`lib/env.ts`** - Add OPENROUTER_API_KEY validation
- [ ] **`package.json`** - Add OpenRouter provider, remove old providers

### Dependencies to Add
```json
{
  "dependencies": {
    "@openrouter/ai-sdk-provider": "^0.0.19"
  }
}
```

### Dependencies to Remove
```json
{
  "dependencies": {
    "@ai-sdk/openai": "remove",
    "@ai-sdk/google": "remove", 
    "@ai-sdk/anthropic": "remove",
    "@ai-sdk/xai": "remove"
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** OpenRouter API key missing or invalid
  - **Handling:** Return 500 error with clear message about API key configuration
- [ ] **Error 2:** Model not available on OpenRouter
  - **Handling:** Return 404 error with message about model availability
- [ ] **Error 3:** OpenRouter API rate limits
  - **Handling:** Return 429 error with retry information

### Edge Cases
- [ ] **Edge Case 1:** Model name format changes
  - **Solution:** Document OpenRouter naming convention and create mapping if needed
- [ ] **Edge Case 2:** Provider-specific features no longer available
  - **Solution:** Use OpenRouter's equivalent features or providerOptions

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] OpenRouter API key stored securely in environment variables
- [ ] No changes to existing user authentication system
- [ ] API route continues to verify user session before processing

### Input Validation
- [ ] Continue validating modelId parameter
- [ ] Validate messages array structure
- [ ] Maintain existing input sanitization

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# Replace multiple provider keys with single OpenRouter key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Remove these (no longer needed):
# OPENAI_API_KEY=
# GOOGLE_GENERATIVE_LANGUAGE_API_KEY=
# ANTHROPIC_API_KEY=
# XAI_API_KEY=
```

### Dynamic OpenRouter Model Mapping
```typescript
// Provider name mapping to OpenRouter format (used in API route)
const providerMap: Record<string, string> = {
  'OpenAI': 'openai',
  'Google': 'google', 
  'Anthropic': 'anthropic',
  'xAI': 'x-ai'
};

// Example usage in app/api/chat/route.ts:
// Database: provider_name="OpenAI", model_name="gpt-4.1" 
// OpenRouter: openrouterModelName = "openai/gpt-4.1"
const openrouterModelName = `${providerMap[model.provider_name]}/${model.model_name}`;
```

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if OpenRouter model names are unclear
- [ ] Provide regular progress updates
- [ ] Flag any models that aren't available on OpenRouter
- [ ] Suggest OpenRouter alternatives for any unsupported features

### Implementation Approach
- [ ] Start with Phase 1 and complete fully before moving to Phase 2
- [ ] Test the OpenRouter integration thoroughly before removing old providers
- [ ] Keep a backup of the old `route.ts` file before rewriting
- [ ] Verify all environment variables are properly configured
- [ ] Test with at least one model from each original provider

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling for OpenRouter-specific errors
- [ ] Include comprehensive comments about OpenRouter integration
- [ ] Maintain existing code style and patterns
- [ ] Ensure proper typing for OpenRouter provider

---

## 14. Notes & Additional Context

### Research Links
- [OpenRouter Vercel AI SDK Documentation](https://openrouter.ai/docs/community/frameworks#vercel-ai-sdk)
- [OpenRouter AI SDK Provider GitHub](https://github.com/openrouterteam/ai-sdk-provider)
- [OpenRouter Models List](https://openrouter.ai/models)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai)

### Implementation Notes
Based on the OpenRouter documentation, the key changes are:

1. **Replace provider imports** with `createOpenRouter` from `@openrouter/ai-sdk-provider`
2. **Dynamic model naming** - construct OpenRouter format `${provider}/${model}` from database fields
3. **Single API key configuration** instead of multiple provider keys
4. **No database changes** - keep existing schema and use dynamic mapping

The simplified approach means:
- Database keeps current structure: `provider_name: "OpenAI", model_name: "gpt-4.1"`
- API route dynamically creates: `"openai/gpt-4.1"` for OpenRouter
- Zero migration effort, full backward compatibility

The OpenRouter provider supports all the same Vercel AI SDK features like `streamText`, so the integration should be seamless.

---

*Task Created: December 28, 2024*  
*Template Version: 1.0*  
*Created By: AI Assistant* 
