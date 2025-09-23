# Remove Redundant Plan Display from Profile Account Info

> **Instructions:** This task removes the redundant "Current Plan" section from the Account Information card since the same information is already prominently displayed in the adjacent Billing & Subscription Management card.

---

## 1. Task Overview

### Task Title
**Title:** Remove Redundant Plan Display from Profile Account Information Card

### Goal Statement
**Goal:** Eliminate duplicate subscription plan information from the profile page by removing the "Current Plan" section from the Account Information card, since this information is already displayed in the adjacent Billing & Subscription Management card. This improves UI cleanliness and reduces visual redundancy.

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
  - `ProfilePageClient.tsx` - Main profile page component
  - `BillingManagementCard.tsx` - Displays subscription information
  - `Badge` component for plan display

### Current State
The profile page currently displays subscription plan information in two places:

1. **Account Information Card** - Shows "Current Plan" with badge displaying tier (Free, Pro, etc.)
2. **Billing & Subscription Management Card** - Shows detailed subscription information including plan, status, billing dates, etc.

This creates visual redundancy and clutters the Account Information card with information that's better suited for the dedicated billing card.

## 3. Context & Problem Definition

### Problem Statement
The profile page displays the user's subscription plan in two different locations:
- The Account Information card shows a "Current Plan" section with a badge
- The Billing & Subscription Management card shows comprehensive subscription details

This redundancy creates visual clutter and provides no additional value to users, as the billing card already serves as the primary location for subscription information.

### Success Criteria
- [ ] Remove "Current Plan" section from Account Information card
- [ ] Maintain all subscription information in Billing & Subscription Management card
- [ ] Preserve clean, focused Account Information card with only user-specific data
- [ ] Ensure responsive design remains intact
- [ ] Verify both light and dark themes display correctly

---

## 4. Technical Requirements

### Functional Requirements
- Remove the "Current Plan" display section from the Account Information card
- Maintain all existing subscription plan information in the Billing & Subscription Management card
- Preserve all other account information (Email, Full Name, Member Since)

### Non-Functional Requirements
- **Performance:** No impact on page load performance
- **Security:** No security implications
- **Usability:** Cleaner, less cluttered profile page interface
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** No browser compatibility changes

### Technical Constraints
- Must not affect the BillingManagementCard functionality
- Must maintain existing TypeScript types and props
- Must preserve all existing styling patterns

---

## 5. Data & Database Changes

### Database Schema Changes
No database changes required.

### Data Model Updates
No data model changes required.

### Data Migration Plan
No data migration required.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES
No API or backend changes required for this UI-only modification.

### Server Actions
No server action changes required.

### Database Queries
No query changes required.

### API Routes (Only for Special Cases)
No API route changes required.

### External Integrations
No external integration changes required.

---

## 7. Frontend Changes

### New Components
No new components required.

### Page Updates
- [ ] **`/profile`** - Remove "Current Plan" section from Account Information card in ProfilePageClient.tsx

### State Management
No state management changes required - this is a simple UI element removal.

---

## 8. Implementation Plan

### Phase 1: Remove Redundant Plan Display
**Goal:** Clean up the Account Information card by removing the duplicate plan information

- [ ] **Task 1.1:** Remove "Current Plan" section from Account Information card
  - Files: `apps/web/app/(protected)/profile/ProfilePageClient.tsx`
  - Details: Remove the div containing the "Current Plan" label, badge, and conditional "Unlimited" badge
- [ ] **Task 1.2:** Test responsive design and themes
  - Files: `apps/web/app/(protected)/profile/ProfilePageClient.tsx`
  - Details: Verify the card layout remains clean and properly spaced on all screen sizes
- [ ] **Task 1.3:** Verify billing card still displays all subscription information
  - Files: Validation that `BillingManagementCard` component continues to show comprehensive plan details
  - Details: Ensure no information is lost by removing the redundant display

---

## 9. File Structure & Organization

### New Files to Create
No new files required.

### Files to Modify
- [ ] **`apps/web/app/(protected)/profile/ProfilePageClient.tsx`** - Remove the "Current Plan" section from the Account Information card

### Dependencies to Add
No new dependencies required.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **No subscription data:** BillingManagementCard already handles this case appropriately
- [ ] **Different subscription tiers:** All handled by the BillingManagementCard component

### Edge Cases
- [ ] **New users with no subscription:** Will only see account info (email, name, member since) which is appropriate
- [ ] **Users with cancelled subscriptions:** BillingManagementCard shows appropriate status information

---

## 11. Security Considerations

### Authentication & Authorization
No changes to authentication or authorization.

### Input Validation
No input validation changes required.

---

## 12. Deployment & Configuration

### Environment Variables
No environment variable changes required.

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:** This task document is already created and ready for implementation.

### Communication Preferences
- [ ] This is a simple UI cleanup task
- [ ] No user clarification needed
- [ ] Straightforward implementation with minimal risk

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **TASK DOCUMENT CREATED ✅**
   - [x] Task document created with specific details
   - [x] All sections filled out appropriately
   - [x] File numbered as 040 (next incremental number)

2. **GET APPROVAL SECOND (Required)**
   - [ ] Wait for explicit user approval of this task document
   - [ ] Ask for feedback and incorporate changes if needed
   - [ ] Update the task document based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Remove the redundant "Current Plan" section from ProfilePageClient.tsx
   - [ ] Test the layout in both light and dark themes
   - [ ] Verify responsive behavior on mobile, tablet, and desktop
   - [ ] Ensure the BillingManagementCard still shows all necessary subscription information

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Maintain existing code formatting and patterns
- [ ] Ensure responsive design (mobile-first approach with Tailwind breakpoints)
- [ ] Test components in both light and dark mode
- [ ] Verify mobile usability on devices 320px width and up

### Architecture Compliance
- [ ] **✅ VERIFY: This is a simple UI element removal**
- [ ] **✅ CONFIRM: No API routes, server actions, or database changes needed**
- [ ] **✅ MAINTAIN: All existing functionality preserved**

---

## 14. Notes & Additional Context

### Visual Impact
This change will:
- Make the Account Information card more focused on user-specific data (email, name, join date)
- Reduce visual redundancy on the profile page
- Keep all subscription management functionality in the dedicated billing card
- Maintain a clean, professional appearance

### Current Plan Display Location
After this change, subscription plan information will be displayed only in the Billing & Subscription Management card, which is the appropriate location for billing-related information.

---

*Template Version: 1.0*  
*Last Updated: 6/23/2025*  
*Created By: Brandon Hancock* 
