# Stripe Subscription Integration

> **Task Document:** Implement comprehensive Stripe subscription integration for AI chat platform with message-based rate limiting

---

## 1. Task Overview

### Task Title
**Title:** Implement Stripe Subscription Integration with Message-Based Rate Limiting

### Goal Statement
**Goal:** Integrate Stripe subscriptions to monetize the AI chat platform with a tiered pricing model based on message usage limits. Users will be able to subscribe to Basic ($9.99/month) or Pro ($19.99/month) plans, manage their subscriptions through Stripe's Customer Portal, and have their usage tracked via premium/non-premium message categorization.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Environment Management:** @t3-oss/env-nextjs for environment variable validation
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** `components/ui/button.tsx`, `components/ui/card.tsx`, existing auth patterns

### Current State
- **Users Table:** Currently has `subscription_tier` field with enum `["free", "basic", "premium"]` but no Stripe integration
- **Pricing Page:** Displays three tiers (Free $0, Pro $19.99, Premium $49.99) but buttons are non-functional
- **Profile Page:** Currently shows "Coming Soon" placeholder
- **Rate Limiting:** No current implementation for message limits
- **AI Models:** Schema exists but no premium/non-premium classification

## 3. Context & Problem Definition

### Problem Statement
The AI chat platform currently operates entirely on a free model with no revenue generation or usage controls. Users have unlimited access to expensive AI models (like GPT-4, Claude 3.5 Sonnet, Gemini 2.5 Pro) which creates unsustainable cost exposure. Without proper monetization and usage limits, the platform cannot scale sustainably while providing access to premium AI capabilities.

### Success Criteria
- [ ] Users can subscribe to Basic ($9.99/month) and Pro ($19.99/month) plans via Stripe
- [ ] Subscription status is accurately tracked and synced between Stripe and application database
- [ ] Message-based rate limiting enforces usage limits based on subscription tier
- [ ] Premium AI models are properly classified and counted separately from non-premium models
- [ ] Users can manage their subscriptions through Stripe Customer Portal
- [ ] Real-time usage tracking prevents overuse while providing clear feedback to users

---

## 4. Technical Requirements

### Functional Requirements
- **Subscription Management:** Users can subscribe, upgrade, downgrade, and cancel subscriptions through Stripe
- **Usage Tracking:** System tracks premium and non-premium message usage per billing cycle
- **Rate Limiting:** System enforces message limits based on subscription tier and resets monthly
- **Sync Mechanism:** Application syncs subscription status with Stripe on app load and via webhooks
- **Customer Portal:** Users can access Stripe Customer Portal for billing management
- **Model Classification:** AI models are categorized as premium or non-premium for usage tracking

### Non-Functional Requirements
- **Performance:** Subscription status checks must complete within 200ms
- **Security:** All Stripe webhooks must be verified using signature validation
- **Usability:** Subscription management must be intuitive with clear usage feedback
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Reliability:** Webhook failures must not prevent users from accessing the application

### Technical Constraints
- Must use existing Supabase authentication system
- Must maintain existing database schema compatibility
- Must follow Next.js 15 App Router patterns
- Must use existing shadcn/ui component library
- Cannot require complex webhook reliability infrastructure

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- Update users table to include Stripe integration fields
ALTER TABLE users 
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'incomplete')),
ADD COLUMN current_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN current_period_end TIMESTAMP WITH TIME ZONE;

-- Update subscription_tier enum to match new pricing
ALTER TABLE users 
ALTER COLUMN subscription_tier TYPE TEXT,
ADD CONSTRAINT subscription_tier_check 
CHECK (subscription_tier IN ('free', 'basic', 'pro'));

-- Add premium model classification to ai_models
ALTER TABLE ai_models 
ADD COLUMN is_premium_model BOOLEAN DEFAULT false NOT NULL;

-- Create user_usage table for tracking message usage
CREATE TABLE user_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    premium_messages_used INTEGER DEFAULT 0 NOT NULL,
    non_premium_messages_used INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, billing_period_start)
);

-- Create index for efficient usage lookups
CREATE INDEX user_usage_lookup_idx ON user_usage(user_id, billing_period_start);

-- Create webhook_events table for idempotency
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

### Data Model Updates
```typescript
// Update users schema
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  
  // Subscription fields
  subscription_tier: text("subscription_tier", {
    enum: ["free", "basic", "pro"],
  }).default("free"),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  subscription_status: text("subscription_status", {
    enum: ["active", "canceled", "past_due", "incomplete"]
  }),
  current_period_start: timestamp("current_period_start", { withTimezone: true }),
  current_period_end: timestamp("current_period_end", { withTimezone: true }),
});

// Add usage table
export const userUsage = pgTable("user_usage", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  billing_period_start: timestamp("billing_period_start", { withTimezone: true }).notNull(),
  premium_messages_used: integer("premium_messages_used").default(0).notNull(),
  non_premium_messages_used: integer("non_premium_messages_used").default(0).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique().on(table.user_id, table.billing_period_start),
  index("user_usage_lookup_idx").on(table.user_id, table.billing_period_start)
]);

// Update ai_models schema
export const aiModels = pgTable("ai_models", {
  // ... existing fields
  is_premium_model: boolean("is_premium_model").default(false).notNull(),
});

// Webhook events table
export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey(),
  stripe_event_id: text("stripe_event_id").unique().notNull(),
  event_type: text("event_type").notNull(),
  processed_at: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// New types
export type SubscriptionTier = "free" | "basic" | "pro";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete";

export type UsageLimits = {
  premium_messages: number;
  non_premium_messages: number;
};

export const USAGE_LIMITS: Record<SubscriptionTier, UsageLimits> = {
  free: { premium_messages: 20, non_premium_messages: 200 },
  basic: { premium_messages: 100, non_premium_messages: 1000 },
  pro: { premium_messages: 300, non_premium_messages: 3000 },
};
```

### Data Migration Plan
- [ ] Create migration file to add new columns to users table
- [ ] Create migration file to add is_premium_model to ai_models table
- [ ] Create migration file for user_usage table
- [ ] Create migration file for webhook_events table
- [ ] Seed ai_models with premium classification (GPT-4, Claude 3.5 Sonnet, Gemini 2.5 Pro as premium)
- [ ] All existing users remain on "free" tier with new limits

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MUTATIONS (Server Actions)** → `app/actions/subscriptions.ts`
- [ ] **Server Actions File** - `app/actions/subscriptions.ts` - ONLY mutations (create subscription, sync status)
- [ ] Examples: `createCheckoutSession()`, `createCustomerPortalSession()`, `syncSubscriptionStatus()`
- [ ] Must use `'use server'` directive and `revalidatePath()` after mutations

**QUERIES (Data Fetching)** → Direct in Server Components
- [ ] **Direct in Server Components** - Simple subscription status queries
- [ ] **Usage Functions in lib/subscriptions.ts** - Complex usage calculations and limit checks

### Server Actions
- [ ] **`createCheckoutSession`** - Creates Stripe checkout session for subscription
- [ ] **`createCustomerPortalSession`** - Creates Stripe customer portal session for billing management
- [ ] **`syncSubscriptionStatus`** - Syncs subscription status from Stripe API
- [ ] **`incrementMessageUsage`** - Increments usage counters for premium/non-premium messages

### Database Queries
- [ ] **Direct in Server Components** - Simple subscription status checks
- [ ] **Usage Functions in lib/subscriptions.ts** - Complex usage calculations, limit checks, billing period management

### API Routes
- [ ] **`/api/webhooks/stripe`** - Handles Stripe webhook events for subscription changes
- [ ] **`/api/subscriptions/sync`** - Manual sync endpoint for subscription status updates

### External Integrations
- **Stripe API** - Subscription management, customer portal, webhook handling
- **Environment Variables** - STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET

---

## 7. Frontend Changes

### New Components
- [ ] **`components/subscriptions/SubscriptionCard.tsx`** - Displays current subscription status and usage
- [ ] **`components/subscriptions/UpgradePrompt.tsx`** - Prompts users to upgrade when limits reached
- [ ] **`components/subscriptions/PricingCards.tsx`** - Interactive pricing cards with Stripe integration
- [ ] **`components/subscriptions/UsageIndicator.tsx`** - Shows current usage vs limits
- [ ] **`components/subscriptions/BillingButton.tsx`** - Manage subscription button for profile page

### Page Updates
- [ ] **`/profile`** - Add subscription management section with current plan and billing portal access
- [ ] **`/pricing`** - Update pricing section to use functional Stripe checkout buttons
- [ ] **`/chat`** - Add usage indicators and upgrade prompts when limits are approached

### State Management
- **Subscription Context** - Global context for subscription status and usage limits
- **Usage Tracking** - Local state for real-time usage updates during chat sessions
- **App-level Sync** - Fetch subscription status on app load and periodically refresh

---

## 8. Implementation Plan

### Phase 1: Database Schema and Core Infrastructure
**Goal:** Set up database schema and Stripe integration foundation

- [ ] **Task 1.1:** Create database migrations for schema changes
  - Files: `drizzle/migrations/`, `lib/drizzle/schema/users.ts`, `lib/drizzle/schema/subscriptions.ts`
  - Details: Add Stripe fields to users, create usage table, add premium model classification
- [ ] **Task 1.2:** Update environment configuration
  - Files: `lib/env.ts`
  - Details: Add Stripe environment variables with validation
- [ ] **Task 1.3:** Install and configure Stripe dependencies
  - Files: `package.json`
  - Details: Add stripe, @stripe/stripe-js packages

### Phase 2: Subscription Management Core Logic
**Goal:** Implement subscription creation, syncing, and usage tracking

- [ ] **Task 2.1:** Create subscription utility functions
  - Files: `lib/subscriptions.ts`
  - Details: Usage calculation, limit checking, billing period management
- [ ] **Task 2.2:** Create subscription server actions
  - Files: `app/actions/subscriptions.ts`
  - Details: Checkout session creation, customer portal, status syncing
- [ ] **Task 2.3:** Implement Stripe webhook handler
  - Files: `app/api/webhooks/stripe/route.ts`
  - Details: Handle subscription events with proper verification and idempotency

### Phase 3: User Interface and Experience
**Goal:** Build user-facing subscription management interface

- [ ] **Task 3.1:** Create subscription components
  - Files: `components/subscriptions/`
  - Details: Subscription cards, usage indicators, upgrade prompts
- [ ] **Task 3.2:** Update profile page with subscription management
  - Files: `app/(protected)/profile/page.tsx`
  - Details: Current plan display, billing portal access, usage statistics
- [ ] **Task 3.3:** Update pricing page with functional checkout
  - Files: `components/landing/PricingSection.tsx`
  - Details: Connect pricing cards to Stripe checkout sessions

### Phase 4: Usage Tracking and Rate Limiting
**Goal:** Implement message-based rate limiting and usage tracking

- [ ] **Task 4.1:** Add premium model classification
  - Files: `lib/drizzle/schema/ai_models.ts`, seed data
  - Details: Mark expensive models as premium, update existing records
- [ ] **Task 4.2:** Implement usage tracking in chat flow
  - Files: `app/api/chat/route.ts`, chat components
  - Details: Increment usage counters, check limits before processing
- [ ] **Task 4.3:** Add usage indicators to chat interface
  - Files: `components/chat/ChatHeader.tsx`, `components/chat/ChatInterface.tsx`
  - Details: Show current usage, upgrade prompts when limits approached

### Phase 5: App-level Sync and Polish
**Goal:** Implement hybrid sync strategy and final polish

- [ ] **Task 5.1:** Implement app-level subscription sync
  - Files: `app/layout.tsx`, middleware
  - Details: Sync subscription status on app load, periodic refresh
- [ ] **Task 5.2:** Add error handling and user feedback
  - Files: All subscription-related components
  - Details: Proper error states, loading indicators, success messages
- [ ] **Task 5.3:** Testing and final integration
  - Files: All components
  - Details: End-to-end testing, mobile responsiveness, theme compatibility

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── app/actions/
│   └── subscriptions.ts                  # Server actions for subscription management
├── app/api/webhooks/stripe/
│   └── route.ts                         # Stripe webhook handler
├── components/subscriptions/
│   ├── SubscriptionCard.tsx             # Current subscription display
│   ├── UpgradePrompt.tsx               # Upgrade prompts and CTAs
│   ├── PricingCards.tsx                # Interactive pricing with Stripe
│   ├── UsageIndicator.tsx              # Usage tracking display
│   └── BillingButton.tsx               # Billing portal access
├── lib/
│   ├── subscriptions.ts                # Subscription utilities and calculations
│   └── stripe.ts                       # Stripe client configuration
└── contexts/
    └── SubscriptionContext.tsx         # Global subscription state
```

### Files to Modify
- [ ] **`lib/env.ts`** - Add Stripe environment variables
- [ ] **`lib/drizzle/schema/users.ts`** - Add Stripe and subscription fields
- [ ] **`lib/drizzle/schema/ai_models.ts`** - Add premium model classification
- [ ] **`lib/drizzle/schema/index.ts`** - Export new schemas
- [ ] **`app/(protected)/profile/page.tsx`** - Add subscription management interface
- [ ] **`components/landing/PricingSection.tsx`** - Make pricing functional with Stripe
- [ ] **`app/api/chat/route.ts`** - Add usage tracking and rate limiting
- [ ] **`components/chat/ChatInterface.tsx`** - Add usage indicators

### Dependencies to Add
```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0"
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Stripe API Failures:** Webhook processing fails, checkout session creation fails
  - **Handling:** Proper error logging, graceful degradation, retry mechanisms
- [ ] **Subscription Sync Issues:** Stripe and database get out of sync
  - **Handling:** App-level sync on user action, manual sync endpoint
- [ ] **Usage Limit Edge Cases:** Concurrent requests, billing period transitions
  - **Handling:** Database transactions, proper locking, grace period handling
- [ ] **Webhook Replay Attacks:** Malicious webhook events
  - **Handling:** Signature verification, idempotency checks

### Edge Cases
- [ ] **Billing Period Transitions:** User usage during billing cycle change
  - **Solution:** Create new usage record for new period, maintain historical data
- [ ] **Subscription Downgrades:** User exceeds new limits after downgrade
  - **Solution:** Graceful degradation, allow finishing current conversations
- [ ] **Payment Failures:** Subscription becomes past_due
  - **Solution:** Temporary access maintenance, clear upgrade prompts

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Subscription management requires authenticated user session
- [ ] Stripe customer ID must belong to authenticated user
- [ ] Usage tracking only accessible to subscription owner

### Input Validation
- [ ] Webhook signature verification for all Stripe events
- [ ] Subscription tier validation against allowed values
- [ ] Usage increment validation to prevent manipulation

### Data Protection
- [ ] Stripe customer IDs are not exposed in client-side code
- [ ] Webhook events are processed securely with proper verification
- [ ] Usage data is protected and only accessible to authorized users

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...              # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...         # Stripe publishable key  
STRIPE_WEBHOOK_SECRET=whsec_...            # Webhook endpoint secret

# Stripe Product IDs (to be configured in Stripe Dashboard)
STRIPE_BASIC_PRICE_ID=price_...            # Basic plan price ID
STRIPE_PRO_PRICE_ID=price_...              # Pro plan price ID
```

### Stripe Dashboard Configuration
**Note:** Configure these in Stripe Dashboard separately:
- [ ] Create products for Basic ($9.99/month) and Pro ($19.99/month)
- [ ] Configure webhook endpoint for subscription events
- [ ] Set up customer portal configuration
- [ ] Add price IDs to environment variables

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if Stripe configuration details are unclear
- [ ] Provide regular progress updates for each phase
- [ ] Flag any cost or security concerns immediately
- [ ] Suggest improvements for user experience when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [ ] **Present the complete implementation plan** based on this task document
   - [ ] **Summarize all phases, database changes, and Stripe integration points**
   - [ ] **Explain the hybrid webhook + app sync strategy**
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **For any new page route, create `loading.tsx` and `error.tsx` files alongside `page.tsx`**
   - [ ] Test each component with mock Stripe data as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Always create components in `components/subscriptions/` directory**
   - [ ] Keep pages minimal - only import and use components
   - [ ] **Test all components in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] **Test subscription flows with Stripe test mode**
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper Stripe type definitions
- [ ] Add comprehensive error handling for all Stripe API calls
- [ ] Include proper webhook signature verification
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA)
- [ ] Use semantic HTML elements and proper ARIA labels

---

## 14. Notes & Additional Context

### Stripe Integration Strategy
- **Hybrid Approach:** Webhooks for real-time updates + app-level sync for reliability
- **Customer Portal:** Stripe-hosted billing management for simplicity
- **Usage-Based Limits:** Message-based rate limiting with premium/non-premium classification
- **Billing Cycle:** Monthly recurring subscriptions with usage reset on billing date

### Key Integration Points
- **Profile Page:** Primary subscription management interface
- **Chat Interface:** Usage tracking and limit enforcement
- **Pricing Page:** Stripe checkout integration for new subscriptions
- **Webhook Handler:** Real-time subscription status updates

### Cost Optimization
- **Premium Model Classification:** Expensive models (GPT-4, Claude 3.5 Sonnet, Gemini 2.5 Pro) have lower limits
- **Usage Tracking:** Precise tracking prevents cost overruns
- **Tier Structure:** Balanced pricing that covers AI API costs while provides value

---

*Template Version: 1.0*  
*Last Updated: 12/28/2024*  
*Created By: Brandon Hancock* 
