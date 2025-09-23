# Update Pricing and Usage Tracking System

> **Instructions:** This task updates the pricing structure and rebuilds the usage tracking system to track documents, storage, and requests instead of the current AI model-based system.

---

## 1. Task Overview

### Task Title
**Title:** Update Pricing Plans and Rebuild Usage Tracking for Document/Storage/Request System

### Goal Statement
**Goal:** Transition from AI model request-based usage tracking to a document and storage-based system with daily/monthly request limits. Update the pricing section to reflect accurate features and remove unsupported functionality while changing Enterprise to Ultra tier.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/ui/card.tsx`, `components/ui/progress.tsx` for usage display
  - `components/landing/PricingSection.tsx` for plan display
  - `components/chat/UsageTracker.tsx` for current usage tracking

### Current State
The current system tracks "Premium" and "Standard" AI model usage (likely requests/messages) with limits based on subscription tiers. The PricingSection contains features that don't exist in the app (community support, team collaboration, analytics, custom integrations, bulk upload, priority processing). The UsageTracker displays AI model request usage with progress bars.

## 3. Context & Problem Definition

### Problem Statement
The current usage tracking system is designed around AI model requests (Premium/Standard) but the business model has shifted to document and storage limits with simplified request tracking. The pricing page advertises features that don't exist in the application, creating false expectations for users. The Enterprise tier naming doesn't align with the intended Ultra branding.

### Success Criteria
- [ ] PricingSection displays accurate plans with correct features and limits
- [ ] UsageTracker shows document count, storage used, and request limits
- [ ] All non-existent features removed from pricing
- [ ] Enterprise tier renamed to Ultra
- [ ] Free tier correctly shows video exclusion
- [ ] Request tracking handles daily vs monthly limits properly

---

## 4. Technical Requirements

### Functional Requirements
- User can see accurate document, storage, and request limits on pricing page
- User can track their current usage against plan limits in real-time
- System tracks documents uploaded, storage consumed, and requests made
- Different request reset periods (daily for free, monthly for pro, unlimited for ultra)
- Usage tracker shows appropriate progress bars and warnings

### Non-Functional Requirements
- **Performance:** Usage stats should load within 2 seconds
- **Security:** Usage data should be user-specific and protected
- **Usability:** Usage display should be clear and intuitive
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Modern browsers with JavaScript enabled

### Technical Constraints
- Must use existing Supabase database and auth system
- Must maintain compatibility with current subscription system
- Must use existing UI components and design patterns
- Cannot modify core authentication or subscription logic

---

## 5. Data & Database Changes

### Database Schema Changes
**Note:** This will likely require database schema analysis to understand current usage tracking tables.

```sql
-- May need to modify existing usage tracking tables
-- to support document count, storage bytes, and request counts
-- with different reset periods (daily vs monthly)
```

### Data Model Updates
```typescript
// Updated usage tracking types
interface UsageStats {
  subscriptionTier: 'free' | 'pro' | 'ultra';
  usage: {
    documents: {
      used: number;
      limit: number;
    };
    storage: {
      used: number; // in bytes
      limit: number; // in bytes
    };
    requests: {
      used: number;
      limit: number;
      resetPeriod: 'daily' | 'monthly' | 'unlimited';
      nextReset?: Date;
    };
  };
}
```

### Data Migration Plan
- [ ] Analyze current usage tracking database schema
- [ ] Create migration plan for existing usage data
- [ ] Implement backward compatibility during transition

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**QUERIES (Data Fetching)** → `lib/usage-tracking.ts`
- [ ] **Complex Query Functions** - Update `getUserUsageStats()` to return document/storage/request data
- [ ] **Usage Calculation Logic** - Functions to calculate storage used, documents count, request limits

**MUTATIONS (Server Actions)** → `app/actions/usage.ts`
- [ ] **Server Actions File** - Update `getCurrentUserUsage()` to return new usage structure
- [ ] **Usage Increment Functions** - Track document uploads, storage usage, request counts

### Server Actions
- [ ] **`getCurrentUserUsage`** - Return document, storage, and request usage stats
- [ ] **`incrementRequestUsage`** - Track chat requests with proper reset periods
- [ ] **`updateStorageUsage`** - Track storage consumption from document uploads

### Database Queries
- [ ] **Complex Queries in lib/usage-tracking.ts** - Calculate current usage across documents, storage, and requests
- [ ] **Aggregation Queries** - Sum storage usage, count documents, track request limits

---

## 7. Frontend Changes

### New Components
- [ ] **`components/chat/UsageTracker.tsx`** - Rebuild to show documents, storage, and requests
- [ ] **`components/landing/PricingSection.tsx`** - Update with accurate plan features and limits

### Component Updates
**UsageTracker.tsx:**
- Replace Premium/Standard model tracking with Documents/Storage/Requests
- Show three progress bars with different metrics
- Handle different reset periods (daily/monthly/unlimited)
- Update visual indicators and warnings

**PricingSection.tsx:**
- Update Starter plan to show file type restrictions (no video)
- Remove non-existent features (community support, team collaboration, analytics, custom integrations, bulk upload, priority processing)
- Rename Enterprise to Ultra
- Update all plan limits to match new system

**Component Requirements:**
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints
- **Theme Support:** CSS variables for colors, support dark mode
- **Accessibility:** WCAG AA guidelines, proper ARIA labels

### Page Updates
- [ ] **Landing page** - Updated pricing section display
- [ ] **Chat interface** - Updated usage tracker display

### State Management
- Usage stats fetched via server actions
- Local state for loading and error handling
- Real-time updates every 30 seconds (existing pattern)

---

## 8. Implementation Plan

### Phase 1: Update Pricing Section
**Goal:** Fix pricing display with accurate features and limits

- [ ] **Task 1.1:** Update PricingSection.tsx with correct plan structure
  - Files: `components/landing/PricingSection.tsx`
  - Details: 
    - Starter: 10 docs, 100MB, 10 requests/day, no video, no support
    - Pro: 1000 docs, 5GB, 1000 requests/month, all files, email support
    - Ultra: unlimited docs, 50GB, unlimited requests, all files, priority support
- [ ] **Task 1.2:** Remove unsupported features from all plans
  - Files: `components/landing/PricingSection.tsx`
  - Details: Remove community support, team collaboration, analytics, custom integrations, bulk upload, priority processing
- [ ] **Task 1.3:** Update file type descriptions
  - Files: `components/landing/PricingSection.tsx`
  - Details: Specify "All file types except video" for Starter plan

### Phase 2: Rebuild Usage Tracking System
**Goal:** Replace AI model tracking with document/storage/request tracking

- [ ] **Task 2.1:** Analyze current usage tracking database schema
  - Files: `lib/usage-tracking.ts`, database schema files
  - Details: Understand current data structure and plan migration
- [ ] **Task 2.2:** Update usage tracking types and interfaces
  - Files: `lib/usage-tracking.ts`
  - Details: Create new TypeScript interfaces for document/storage/request tracking
- [ ] **Task 2.3:** Update server actions for usage fetching
  - Files: `app/actions/usage.ts`
  - Details: Modify getCurrentUserUsage to return new usage structure

### Phase 3: Rebuild UsageTracker Component
**Goal:** Display document, storage, and request usage with progress bars

- [ ] **Task 3.1:** Rebuild UsageTracker.tsx component
  - Files: `components/chat/UsageTracker.tsx`
  - Details: Replace Premium/Standard with Documents/Storage/Requests tracking
- [ ] **Task 3.2:** Implement different reset period handling
  - Files: `components/chat/UsageTracker.tsx`
  - Details: Show daily vs monthly vs unlimited request tracking
- [ ] **Task 3.3:** Update visual indicators and progress bars
  - Files: `components/chat/UsageTracker.tsx`
  - Details: Three progress bars with appropriate color coding and warnings

### Phase 4: Integration and Testing
**Goal:** Ensure all components work together properly

- [ ] **Task 4.1:** Test usage tracking in different subscription tiers
- [ ] **Task 4.2:** Verify pricing page accuracy
- [ ] **Task 4.3:** Test responsive design and theme support

---

## 9. File Structure & Organization

### New Files to Create
```
apps/web/
├── components/
│   ├── chat/
│   │   └── UsageTracker.tsx          # Rebuilt component
│   └── landing/
│       └── PricingSection.tsx        # Updated component
├── app/actions/
│   └── usage.ts                      # Updated server actions
└── lib/
    └── usage-tracking.ts             # Updated query functions
```

### Files to Modify
- [ ] **`components/chat/UsageTracker.tsx`** - Complete rebuild for new metrics
- [ ] **`components/landing/PricingSection.tsx`** - Update plans and remove features
- [ ] **`app/actions/usage.ts`** - Update server actions for new usage structure
- [ ] **`lib/usage-tracking.ts`** - Update database queries and calculations

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Usage stats fail to load
  - **Handling:** Show loading state, retry mechanism, graceful degradation
- [ ] **Error 2:** Database connection issues
  - **Handling:** Cache last known usage, show appropriate error messages
- [ ] **Error 3:** Invalid subscription tier data
  - **Handling:** Default to free tier limits, log error for investigation

### Edge Cases
- [ ] **Edge Case 1:** Usage exceeds plan limits
  - **Solution:** Show over-limit warnings, guide to upgrade
- [ ] **Edge Case 2:** Request reset timing edge cases
  - **Solution:** Handle timezone differences, proper reset calculation
- [ ] **Edge Case 3:** Storage calculation discrepancies
  - **Solution:** Implement consistent storage calculation methods

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Users can only see their own usage statistics
- [ ] Usage data is protected by existing auth middleware
- [ ] No sensitive data exposed in client-side code

### Input Validation
- [ ] Validate subscription tier values
- [ ] Sanitize usage statistics before display
- [ ] Prevent manipulation of usage counts

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# No new environment variables required
# Uses existing database and auth configuration
```

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
Task document created and ready for user approval.

### Implementation Approach - CRITICAL WORKFLOW
🚨 **WAITING FOR USER APPROVAL:**
- [ ] **Task document created** - Ready for review
- [ ] **User approval required** - Do not start coding until approved
- [ ] **Implementation phases defined** - Ready to execute after approval

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling
- [ ] Include comprehensive comments
- [ ] **Ensure responsive design** with mobile-first approach
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability** on devices 320px width and up
- [ ] Follow accessibility guidelines (WCAG AA)

---

## 14. Notes & Additional Context

### Key Changes Summary
1. **Pricing Plans:**
   - Starter: 10 docs, 100MB, 10 requests/day, no video
   - Pro: 1000 docs, 5GB, 1000 requests/month, all files including video
   - Ultra: unlimited docs, 50GB, unlimited requests, all files including video

2. **Usage Tracking:**
   - Documents: Count of uploaded documents
   - Storage: Total bytes consumed
   - Requests: Chat queries with daily/monthly limits

3. **Removed Features:**
   - Community support
   - Team collaboration
   - Analytics & insights
   - Custom integrations
   - Bulk upload & management
   - Priority processing

### Research Links
- Current UsageTracker implementation for reference
- Existing PricingSection for visual consistency
- Subscription tier logic in usage-tracking.ts

---

*Template Version: 1.0*  
*Last Updated: 6/23/2025*  
*Created By: AI Assistant* 
