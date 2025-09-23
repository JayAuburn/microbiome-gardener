# Update Profile Page for New Pricing Structure

> **Task 037:** Update the profile page to reflect the new pricing structure and usage tracking system that aligns with the landing page's Starter/Pro/Ultra tiers.
> 
> **Status:** ✅ **COMPLETED**

---

## 1. Task Overview

### Task Title
**Title:** Update Profile Page for New Pricing Structure

### Goal Statement
**Goal:** Align the profile page's subscription plans, usage tracking, and billing management with the new pricing structure introduced in the landing page. Replace the outdated message-based limits with document/storage/request-based limits to provide a consistent user experience across the application.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15 App Router with React Server Components and Client Components
- **Database:** PostgreSQL with Drizzle ORM
- **Subscription Management:** Stripe integration with webhook handling
- **UI Components:** shadcn/ui with Tailwind CSS styling
- **Authentication:** Supabase Auth integration

### Current Issues Identified
1. **Pricing Mismatch:** Profile page shows outdated pricing (Free $0, Basic $9.99, Pro $19.99)
2. **Usage Structure:** Uses old message-based limits (premium/standard messages) instead of new document/storage/request structure
3. **Display Names:** Inconsistent tier naming between landing page and profile page
4. **Actions:** Subscription checkout functions need updating for new pricing

### Landing Page (Correct) Structure
- **Starter**: $0 - 10 documents, 100 MB storage, 10 requests/day
- **Pro**: $29 - 1,000 documents, 5 GB storage, 1,000 requests/month  
- **Ultra**: $99 - unlimited documents, 50 GB storage, unlimited requests

---

## 3. Implementation Plan

### Phase 1: Update Profile Page Client Component ✅
**File:** `apps/web/app/(protected)/profile/ProfilePageClient.tsx`

**Changes Made:**
- Updated type definitions from message-based to document/storage/request-based structure
- Replaced usage display with new metrics (documents, storage, requests with reset periods)
- Updated pricing plans to reflect Starter/Pro/Ultra structure ($0/$29/$99)
- Added proper progress bars with color coding for usage levels
- Updated action imports to use new checkout functions
- Added utility function imports for formatting bytes and usage limits

### Phase 2: Update Subscription Actions ✅
**File:** `apps/web/app/actions/subscriptions.ts`

**Changes Made:**
- Updated tier mapping logic for new pricing structure
- Renamed `createBasicCheckoutSession` to `createProCheckoutSession` for $29 plan
- Added `createUltraCheckoutSession` for $99 plan
- Updated comments and documentation to reflect new pricing
- Maintained backward compatibility with legacy function names
- Updated sync logic to map Stripe price IDs to correct database tiers

### Phase 3: Update Server Component Data Fetching ✅
**File:** `apps/web/app/(protected)/profile/page.tsx`

**Changes Made:**
- Updated function call to use existing `getUserUsageStats` with new structure
- Maintained same import pattern for consistency

### Phase 4: Update Usage Tracking Function ✅
**File:** `apps/web/lib/usage-tracking.ts`

**Changes Made:**
- Updated `getUserUsageStats` function to return new structure with documents/storage/requests
- Integrated with existing `getNewUserUsageStats` for data consistency
- Added fallback handling for cases where usage data is unavailable
- Maintained backward compatibility for legacy code

### Phase 5: Update Billing Components ✅
**Files:** 
- `apps/web/components/billing/BillingManagementCard.tsx`
- `apps/web/components/billing/CancellationConfirmDialog.tsx`

**Changes Made:**
- Updated tier display names using centralized `getSubscriptionTierDisplayName`
- Updated pricing display ($29 for Pro, $99 for Ultra)
- Updated feature loss descriptions in cancellation dialog
- Changed "Free plan" references to "Starter plan"
- Updated support tier descriptions (Email support, Priority support)

### Phase 6: Utility Functions ✅
**File:** `apps/web/lib/constants.ts`

**Verified Available Functions:**
- `formatBytes()` - Format storage sizes (100 MB, 5 GB, etc.)
- `formatUsageLimit()` - Handle unlimited cases (-1 → "Unlimited")
- `getSubscriptionTierDisplayName()` - Consistent tier naming
- `getUsageLimitsForTier()` - Get limits for any tier

---

## 4. Technical Implementation Details

### Database Tier Mapping
The implementation maintains backward compatibility with the existing database schema:

```typescript
// Database Storage → Display Mapping
"free" → "Starter" ($0)
"basic" → "Pro" ($29) 
"pro" → "Ultra" ($99)
```

### Stripe Price ID Mapping
```typescript
STRIPE_BASIC_PRICE_ID → Pro Plan ($29) → "basic" in DB
STRIPE_PRO_PRICE_ID → Ultra Plan ($99) → "pro" in DB
```

### Usage Structure Transformation
```typescript
// Old Structure (Messages)
{
  premium: { used: number, limit: number },
  nonPremium: { used: number, limit: number }
}

// New Structure (Documents/Storage/Requests)
{
  documents: { used: number, limit: number },
  storage: { used: number, limit: number },
  requests: { used: number, limit: number, resetPeriod: string }
}
```

---

## 5. Testing & Verification

### Functionality Tests ✅
- [x] Profile page loads without errors
- [x] Usage statistics display correctly
- [x] Pricing plans show correct amounts ($0/$29/$99)
- [x] Tier names display consistently (Starter/Pro/Ultra)
- [x] Checkout buttons work for both Pro and Ultra plans
- [x] Progress bars show usage correctly with color coding
- [x] Billing management card shows updated pricing

### Code Quality ✅
- [x] TypeScript compilation passes
- [x] ESLint rules pass with no errors
- [x] All imports resolve correctly
- [x] Type definitions are consistent
- [x] No unused variables or functions

### Integration Tests ✅
- [x] Subscription actions work with new pricing
- [x] Usage tracking returns new structure
- [x] Billing components display correctly
- [x] Tier mapping functions work properly

---

## 6. Files Modified

### Core Implementation
1. **ProfilePageClient.tsx** - Main profile page component with new usage display
2. **page.tsx** - Server component data fetching
3. **subscriptions.ts** - Subscription action functions with new pricing
4. **usage-tracking.ts** - Updated getUserUsageStats function

### Supporting Components  
5. **BillingManagementCard.tsx** - Updated pricing and tier display
6. **CancellationConfirmDialog.tsx** - Updated feature loss descriptions

### Utilities Used
7. **constants.ts** - Formatting functions and tier mapping (existing)

---

## 7. Impact Assessment

### User Experience Improvements
- **Consistent Pricing:** Profile page now matches landing page pricing exactly
- **Clear Usage Metrics:** Document/storage/request limits are more intuitive than message limits
- **Better Visual Feedback:** Progress bars with color coding provide clear usage status
- **Accurate Billing Info:** Subscription management shows correct pricing for each tier

### Developer Experience
- **Type Safety:** All components use consistent TypeScript interfaces
- **Maintainability:** Centralized utility functions for formatting and tier mapping
- **Backward Compatibility:** Legacy functions maintained for existing code
- **Code Quality:** All linting and type checking passes

### Business Impact
- **Pricing Clarity:** Clear presentation of $0/$29/$99 pricing structure
- **Conversion Optimization:** Proper upgrade paths from Starter → Pro → Ultra
- **Feature Communication:** Clear display of what users get at each tier
- **Billing Transparency:** Accurate pricing in billing management

---

## 8. Completion Summary

✅ **All objectives completed successfully:**

1. **Pricing Alignment:** Profile page now matches landing page pricing structure
2. **Usage Migration:** Successfully transitioned from message-based to document/storage/request-based usage tracking
3. **Component Updates:** All billing and subscription components updated with new pricing
4. **Type Safety:** Maintained full TypeScript type safety throughout
5. **Code Quality:** All code passes linting and type checking
6. **User Experience:** Consistent and intuitive usage tracking across the application

The profile page now provides a cohesive experience that aligns with the new pricing structure and gives users clear visibility into their usage across documents, storage, and requests.

---

*Task Document Version: 1.0*  
*Created: January 2025*  
*Status: Awaiting Approval* 
