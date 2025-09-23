# Add Stripe-Compliant Legal Pages (Terms of Service, Privacy Policy, Cookie Policy)

## 1. Task Overview

### Task Title
**Title:** Add Stripe-Compliant Legal Pages (Terms of Service, Privacy Policy, Cookie Policy)

### Goal Statement
**Goal:** Create comprehensive legal compliance pages (Terms of Service, Privacy Policy, and Cookie Policy) that meet Stripe's merchant requirements and provide proper legal protection for the SaaS application. These pages will replace the current placeholder "#" links in the footer and ensure full compliance with payment processing, data protection, and subscription service regulations.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3 (latest), React 19
- **Language:** TypeScript 5 with strict mode
- **Database & ORM:** Supabase (PostgreSQL) via Drizzle ORM 0.44.2
- **UI & Styling:** shadcn/ui components with Tailwind CSS 3.4.1 for styling, next-themes 0.4.6 for dark/light mode
- **Authentication:** Supabase Auth (@supabase/ssr latest) managed by `middleware.ts` for protected routes
- **Payment Processing:** Stripe 18.2.1 with full webhook integration (@stripe/stripe-js 7.4.0)
- **Key Architectural Patterns:** Next.js App Router with Server Components, Server Actions for mutations, (public) route group for public pages
- **Relevant Existing Components:** Footer component in `components/landing/Footer.tsx` with placeholder legal links, established responsive design patterns

### Current State
**Existing Infrastructure:**
- Footer component (`components/landing/Footer.tsx`) already contains a "Legal" section with placeholder links:
  - Privacy Policy → "#"
  - Terms of Service → "#" 
  - Cookie Policy → "#"
- Public layout exists in `app/(public)/layout.tsx` with consistent Navbar + main content + Footer structure
- Stripe integration is fully operational with subscription management, webhooks, and payment processing
- App uses subscription tiers (free, basic, pro) with recurring billing
- Theme system supports both light and dark modes across all components

**Compliance Gap:**
- No actual legal pages exist - all links are placeholders
- Stripe requires merchants to have proper Terms of Service and Privacy Policy
- Missing legally required disclosures for subscription services, payment processing, and data handling

## 3. Context & Problem Definition

### Problem Statement
The application currently has full Stripe payment processing and subscription management but lacks the legally required compliance pages. This creates significant business and legal risks:

1. **Stripe Compliance Risk:** Stripe requires merchants to have proper legal documentation, and missing pages could lead to account restrictions
2. **Legal Liability:** Without proper Terms of Service and Privacy Policy, the business has inadequate protection against disputes and data protection violations
3. **User Trust:** Professional SaaS applications require transparent legal documentation to build user confidence
4. **Regulatory Compliance:** GDPR, CCPA, and other data protection laws require privacy policies for services processing user data
5. **Subscription Service Requirements:** Recurring billing services need specific terms regarding cancellation, refunds, and billing cycles

### Success Criteria
- [ ] Create comprehensive Terms of Service page covering subscription services, payment processing, and platform usage
- [ ] Create detailed Privacy Policy page compliant with GDPR, CCPA, and other data protection regulations
- [ ] Create Cookie Policy explaining tracking and analytics usage
- [ ] All pages must be professionally written, legally sound, and specific to the application's functionality
- [ ] Pages must be fully responsive, accessible, and support both light/dark themes
- [ ] Footer links must be updated to link to actual pages instead of "#"
- [ ] All legal pages must be publicly accessible (no authentication required)

---

## 4. Technical Requirements

### Functional Requirements
- User can access Terms of Service from footer link on any public page
- User can access Privacy Policy from footer link on any public page  
- User can access Cookie Policy from footer link on any public page
- All legal pages render properly in both light and dark themes
- Pages are SEO-optimized with proper meta tags and structured content
- Content is easily updatable for future legal changes
- Pages load quickly and are accessible without authentication

### Non-Functional Requirements
- **Performance:** Pages must load in under 2 seconds on standard connections
- **Security:** No authentication required - publicly accessible content
- **Usability:** Clear navigation, readable typography, professional appearance
- **Responsive Design:** Must work perfectly on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Full compatibility with existing light/dark mode system using CSS variables
- **Compatibility:** Cross-browser support for modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility:** WCAG AA compliance with proper headings, navigation, and screen reader support
- **SEO:** Proper meta descriptions, title tags, and semantic HTML structure

### Technical Constraints
- Must use existing (public) route group structure
- Must maintain consistency with existing design system and component patterns
- Cannot modify database schema - these are static content pages
- Must follow established file organization patterns
- Content must be maintainable by non-technical team members in the future

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- No database changes required - legal pages are static content
-- All content will be maintained in React components/markdown
```

### Data Model Updates
```typescript
// No data model changes required
// Legal content will be static/hardcoded in components
```

### Data Migration Plan
- [ ] No migrations needed - static content implementation

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**Static Content - No Database Operations Required**
- [ ] **No Server Actions Needed** - Legal pages are static content without dynamic data
- [ ] **No Database Queries** - Content is hardcoded in React components
- [ ] **No API Routes Required** - Static pages served via Next.js App Router

### Server Actions
- [ ] **No server actions required** - Static content pages

### Database Queries
- [ ] **No database queries needed** - Static legal content

### API Routes (Rarely Needed)
- [ ] **No API routes required** - Static pages only

### External Integrations
- No third-party integrations required for legal pages

---

## 7. Frontend Changes

### New Components
- [ ] **`components/legal/LegalPageWrapper.tsx`** - Shared wrapper component for consistent legal page styling and layout
- [ ] **`components/legal/TableOfContents.tsx`** - Navigation component for long legal documents with smooth scrolling
- [ ] **`components/legal/LastUpdated.tsx`** - Component displaying last updated date for legal documents

**Component Organization Pattern:**
- Use `components/legal/` directory for legal-specific components
- Keep shared legal styling and navigation patterns centralized
- Follow existing responsive design and theme patterns

**Component Requirements:**
- **Responsive Design:** Mobile-first approach with proper text sizing and spacing for legal documents
- **Theme Support:** Full dark/light mode compatibility using existing CSS variables  
- **Accessibility:** Proper heading hierarchy, skip links, screen reader optimized
- **Typography:** Professional, readable fonts with appropriate line height for legal text

### Page Updates
- [ ] **`app/(public)/terms/page.tsx`** - Complete Terms of Service page with Stripe-specific clauses
- [ ] **`app/(public)/privacy/page.tsx`** - Comprehensive Privacy Policy with data handling details
- [ ] **`app/(public)/cookies/page.tsx`** - Cookie Policy explaining tracking and analytics
- [ ] **`components/landing/Footer.tsx`** - Update legal links to point to actual pages instead of "#"

**Page Requirements:**
- Each page needs `loading.tsx` and `error.tsx` alongside `page.tsx`
- Proper SEO meta tags and structured data
- Professional legal document formatting
- Easy-to-scan sections with clear headings

### State Management
- No complex state management required - static content pages
- Use local state only for table of contents navigation and smooth scrolling

---

## 8. Implementation Plan

### Phase 1: Foundation & Components
**Goal:** Set up the legal page infrastructure and shared components

- [ ] **Task 1.1:** Create legal components directory and shared wrapper
  - Files: `components/legal/LegalPageWrapper.tsx`, `components/legal/TableOfContents.tsx`, `components/legal/LastUpdated.tsx`
  - Details: Build reusable components for consistent legal page styling, navigation, and metadata

- [ ] **Task 1.2:** Create base legal page routes
  - Files: `app/(public)/terms/page.tsx`, `app/(public)/terms/loading.tsx`, `app/(public)/terms/error.tsx`
  - Details: Set up Terms of Service route with proper Next.js App Router structure

### Phase 2: Terms of Service Implementation
**Goal:** Create comprehensive Terms of Service covering all platform features

- [ ] **Task 2.1:** Implement Terms of Service content
  - Files: `app/(public)/terms/page.tsx`
  - Details: Write comprehensive terms covering subscription services, payment processing, user responsibilities, and platform usage

- [ ] **Task 2.2:** Add Stripe-specific terms and billing clauses
  - Files: Update `app/(public)/terms/page.tsx`
  - Details: Include specific language for recurring billing, cancellations, refunds, and payment processing

### Phase 3: Privacy Policy Implementation
**Goal:** Create GDPR/CCPA compliant Privacy Policy

- [ ] **Task 3.1:** Create Privacy Policy route structure
  - Files: `app/(public)/privacy/page.tsx`, `app/(public)/privacy/loading.tsx`, `app/(public)/privacy/error.tsx`
  - Details: Set up Privacy Policy page with proper loading and error handling

- [ ] **Task 3.2:** Implement comprehensive Privacy Policy content
  - Files: `app/(public)/privacy/page.tsx`
  - Details: Cover data collection, processing, storage, sharing, user rights, and compliance with major privacy laws

### Phase 4: Cookie Policy & Navigation Updates
**Goal:** Complete cookie policy and integrate all legal pages with navigation

- [ ] **Task 4.1:** Create Cookie Policy
  - Files: `app/(public)/cookies/page.tsx`, `app/(public)/cookies/loading.tsx`, `app/(public)/cookies/error.tsx`
  - Details: Document all cookies, tracking, and analytics used by the application

- [ ] **Task 4.2:** Update Footer navigation
  - Files: `components/landing/Footer.tsx`
  - Details: Replace "#" placeholder links with proper routes to legal pages

### Phase 5: Testing & Optimization
**Goal:** Ensure all legal pages work perfectly across devices and themes

- [ ] **Task 5.1:** Responsive design testing
  - Details: Test all legal pages on mobile, tablet, and desktop breakpoints

- [ ] **Task 5.2:** Theme compatibility testing
  - Details: Verify proper appearance in both light and dark modes

- [ ] **Task 5.3:** Accessibility audit
  - Details: Ensure WCAG AA compliance with proper headings, navigation, and screen reader support

---

## 9. File Structure & Organization

### New Files to Create
```
shipkit-chat-template/
├── app/(public)/
│   ├── terms/
│   │   ├── page.tsx                  # Terms of Service content
│   │   ├── loading.tsx               # Loading state for terms page
│   │   └── error.tsx                 # Error boundary for terms page
│   ├── privacy/
│   │   ├── page.tsx                  # Privacy Policy content  
│   │   ├── loading.tsx               # Loading state for privacy page
│   │   └── error.tsx                 # Error boundary for privacy page
│   └── cookies/
│       ├── page.tsx                  # Cookie Policy content
│       ├── loading.tsx               # Loading state for cookies page
│       └── error.tsx                 # Error boundary for cookies page
└── components/legal/
    ├── LegalPageWrapper.tsx          # Shared layout wrapper for legal pages
    ├── TableOfContents.tsx           # TOC navigation for long documents
    └── LastUpdated.tsx               # Last updated date component
```

### Files to Modify
- [ ] **`components/landing/Footer.tsx`** - Update legal section links from "#" to proper routes

---

## 10. Legal Content Requirements

### Terms of Service Must Include:
- Service description and scope
- User responsibilities and prohibited activities
- Subscription and billing terms (recurring, cancellation, refunds)
- Payment processing through Stripe
- Intellectual property rights
- Limitation of liability and disclaimers
- Termination clauses
- Dispute resolution and governing law

### Privacy Policy Must Include:
- Types of data collected (personal, usage, payment info)
- How data is collected (forms, cookies, analytics)
- Purpose of data processing
- Data sharing and third-party services (Stripe, Supabase, analytics)
- Data retention and deletion policies
- User rights (access, correction, deletion, portability)
- Security measures and breach notification
- International data transfers
- Contact information for privacy inquiries
- GDPR and CCPA compliance sections

### Cookie Policy Must Include:
- Types of cookies used (essential, analytics, preferences)
- Purpose of each cookie category
- Third-party cookies (analytics, payment processing)
- How to manage cookie preferences
- Impact of disabling cookies

---

## 11. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [ ] **Present the complete implementation plan** based on this task document
   - [ ] **Summarize all phases, legal content requirements, and key technical decisions**
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **For each legal page route, create `loading.tsx` and `error.tsx` files alongside `page.tsx`**
   - [ ] **Create components in `components/legal/` directory following established patterns**
   - [ ] Test each legal page in both light and dark themes as you build it
   - [ ] **Ensure mobile responsiveness on 320px+ width devices**
   - [ ] **Verify accessibility with proper heading hierarchy and navigation**
   - [ ] Document any legal content that should be reviewed by legal counsel

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper typing
- [ ] Add comprehensive comments for legal content sections
- [ ] **Ensure responsive design with mobile-first Tailwind breakpoints**
- [ ] **Test components thoroughly in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA) with semantic HTML
- [ ] Use proper SEO meta tags and structured content
- [ ] Write professional, legally-sound content appropriate for a SaaS platform

---

*Task: Add Stripe-Compliant Legal Pages*  
*Last Updated: 6/23/2025*
