# AI Task Template - Update Landing Page for RAGI Branding

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Update Landing Page for RAGI Branding and RAG-Focused Messaging

### Goal Statement
**Goal:** Transform the current multi-model chat application landing page into a compelling showcase for RAGI (RAG AI), emphasizing its core capabilities of intelligent document querying through advanced AI chat with Gemini models and comprehensive artifact management. The new landing page should clearly communicate the two-pillar value proposition: smart AI conversations powered by user's own documents and robust document/media upload capabilities.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5 with strict mode  
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/landing/` directory with 6 sections (Hero, Features, Problem, Pricing, FAQ, CTA)
  - `components/ui/` for base styles and patterns
  - Green color variables defined in Tailwind config with gemini, anthropic, openai brand colors
  - Existing theme system with light/dark mode support

### Current State
The landing page currently positions the application as a multi-model chat platform that allows users to switch between different AI providers (Gemini, Anthropic, OpenAI) while maintaining conversation context. The hero section showcases a chat interface demo with model switching capabilities.

**Existing Landing Page Structure:**
- **HeroSection.tsx** - Features multi-model chat demo with current branding
- **FeaturesSection.tsx** - Highlights model switching and context preservation
- **ProblemSection.tsx** - Addresses general AI chat fragmentation
- **PricingSection.tsx** - Subscription tiers
- **FAQSection.tsx** - General multi-model chat questions
- **CTASection.tsx** - Sign-up call-to-action

**Current Chat & Document Capabilities:**
- Chat functionality with Gemini 2.5 Flash and Pro models already implemented
- Document upload system exists (`/documents` page with DocumentUpload and DocumentList components)
- RAG functionality implemented via `/api/search` and document chunks system
- Video transcription capabilities from task 025

## 3. Context & Problem Definition

### Problem Statement
The current landing page messaging focuses on multi-model AI chat switching, which doesn't effectively communicate the application's core RAG value proposition. Users landing on the page don't immediately understand that this is a specialized tool for querying their own documents and media through AI chat. The branding needs to shift from "multi-model chat platform" to "intelligent document analysis and querying system" to attract the right users and set proper expectations.

### Success Criteria
- [ ] Landing page clearly positions RAGI as a RAG-focused application
- [ ] Two core capabilities are prominently featured: AI chat with Gemini models + document/media upload
- [ ] Green color scheme is consistently applied throughout the design
- [ ] Interactive demos showcase both chat and document upload workflows
- [ ] Messaging appeals to users who want to chat with their own documents/media
- [ ] Maintains responsive design and accessibility standards
- [ ] Preserves existing authentication and signup flow integration

---

## 4. Technical Requirements

### Functional Requirements
- Update application branding from current name to "RAGI" throughout landing page
- Feature Gemini 2.5 Flash and Gemini 2.5 Pro as the primary chat models
- Showcase document upload capabilities for text files, images, and videos
- Demonstrate RAG workflow: upload → process → query through chat
- Highlight intelligent search and retrieval from uploaded documents
- Maintain existing signup/authentication flow integration
- Include pricing information relevant to document processing and storage
- Update FAQ section to address RAG-specific questions

### Non-Functional Requirements
- **Performance:** Page load time under 2 seconds, optimized images and assets
- **Security:** No changes to authentication, maintain existing security patterns
- **Usability:** Clear user journey from landing to signup to first document upload
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode with new green color scheme
- **Compatibility:** Modern browser support (Chrome 90+, Firefox 88+, Safari 14+)

### Technical Constraints
- Must use existing Tailwind CSS configuration and component patterns
- Cannot modify authentication system or protected route structure
- Must maintain existing API endpoints and database schema
- Green color scheme must work with existing dark/light theme system
- Must preserve existing component architecture and reusability

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required. The application already has:
- Document upload and storage capabilities
- User management and authentication
- Conversation and message tracking
- AI model configuration

### Data Model Updates
No data model changes needed. Existing schemas support the RAG functionality:
- `documents` table for uploaded files
- `document_chunks` for vector search
- `conversations` and `messages` for chat history
- `ai_models` for Gemini model configuration

### Data Migration Plan
No data migration required. This is purely a frontend/landing page update.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

No new server actions or API changes required. The task uses existing:
- Document upload API (`/api/documents`)
- Chat API with RAG integration (`/api/chat`)
- Search API for document querying (`/api/search`)

### Server Actions
No new server actions needed.

### Database Queries
No new database queries required.

### API Routes (Rarely Needed)
No new API routes needed.

### External Integrations
No changes to external integrations.

---

## 7. Frontend Changes

### New Components
- [ ] **`components/landing/RAGDemoSection.tsx`** - Interactive demo showing document upload → chat workflow
- [ ] **`components/landing/DocumentShowcase.tsx`** - Visual showcase of supported file types (text, images, videos)
- [ ] **`components/landing/GeminiModelHighlight.tsx`** - Feature highlight for Gemini 2.5 Flash/Pro capabilities

### Page Updates
- [ ] **`components/landing/HeroSection.tsx`** - Complete rebrand to RAGI with RAG-focused messaging and demo
- [ ] **`components/landing/FeaturesSection.tsx`** - Update features to highlight document intelligence, smart search, multimedia support
- [ ] **`components/landing/ProblemSection.tsx`** - Reframe problem as information scattered across documents/files
- [ ] **`components/landing/PricingSection.tsx`** - Update pricing to reflect document storage and processing limits
- [ ] **`components/landing/FAQSection.tsx`** - RAG-specific questions about file types, processing, privacy
- [ ] **`components/landing/CTASection.tsx`** - Update CTA to encourage document upload trial

### State Management
- Local state for demo interactions (file upload simulation, chat preview)
- No global state changes required
- Maintain existing theme and user context patterns

---

## 8. Implementation Plan

### Phase 1: Brand Identity & Color Scheme Update
**Goal:** Establish RAGI branding and implement green color scheme

- [ ] **Task 1.1:** Update Tailwind color configuration for green theme
  - Files: `tailwind.config.ts`
  - Details: Define primary green color palette, update CSS variables for light/dark themes
- [ ] **Task 1.2:** Update global CSS and theme variables
  - Files: `app/globals.css`
  - Details: Define green color scheme CSS variables for both light and dark themes
- [ ] **Task 1.3:** Update site metadata and branding references
  - Files: `app/layout.tsx`, `lib/metadata.ts`
  - Details: Change application name to RAGI, update descriptions

### Phase 2: Hero Section RAG Transformation  
**Goal:** Transform hero from multi-model chat to RAG-focused messaging

- [ ] **Task 2.1:** Redesign hero headline and messaging
  - Files: `components/landing/HeroSection.tsx`
  - Details: Update title to emphasize "Chat with Your Documents", highlight Gemini models
- [ ] **Task 2.2:** Create RAG workflow demo interface
  - Files: `components/landing/HeroSection.tsx`
  - Details: Replace current chat demo with document upload + chat workflow
- [ ] **Task 2.3:** Implement green color scheme in hero section
  - Files: `components/landing/HeroSection.tsx`
  - Details: Apply new green theme colors throughout the section

### Phase 3: Content Section Updates
**Goal:** Update all content sections to reflect RAG capabilities

- [ ] **Task 3.1:** Redesign Features Section for RAG
  - Files: `components/landing/FeaturesSection.tsx`
  - Details: Highlight document intelligence, smart search, Gemini models, multimedia support
- [ ] **Task 3.2:** Update Problem Section messaging  
  - Files: `components/landing/ProblemSection.tsx`
  - Details: Reframe problem as information scattered across documents/files
- [ ] **Task 3.3:** Create RAG Demo Section
  - Files: `components/landing/RAGDemoSection.tsx` (new)
  - Details: Interactive demo showing upload → process → query workflow

### Phase 4: Supporting Content & Final Polish
**Goal:** Complete the transformation with pricing, FAQ, and CTA updates

- [ ] **Task 4.1:** Update Pricing for RAG capabilities
  - Files: `components/landing/PricingSection.tsx`
  - Details: Adjust pricing tiers to reflect document storage and processing limits
- [ ] **Task 4.2:** Create RAG-focused FAQ section
  - Files: `components/landing/FAQSection.tsx`
  - Details: Address questions about file types, processing time, privacy, search accuracy
- [ ] **Task 4.3:** Update CTA and signup flow messaging
  - Files: `components/landing/CTASection.tsx`
  - Details: Encourage users to "Upload your first document" rather than just "chat"

---

## 9. File Structure & Organization

### New Files to Create
```
apps/web/
├── components/landing/
│   ├── RAGDemoSection.tsx            # Interactive RAG workflow demo
│   ├── DocumentShowcase.tsx          # Supported file types showcase
│   └── GeminiModelHighlight.tsx      # Gemini model feature highlight
```

### Files to Modify
- [ ] **`tailwind.config.ts`** - Add green color palette, update primary colors
- [ ] **`app/globals.css`** - Update CSS variables for green theme
- [ ] **`app/layout.tsx`** - Update site title to RAGI
- [ ] **`lib/metadata.ts`** - Update metadata descriptions for RAG focus
- [ ] **`components/landing/HeroSection.tsx`** - Complete RAG-focused redesign
- [ ] **`components/landing/FeaturesSection.tsx`** - Update features for document intelligence
- [ ] **`components/landing/ProblemSection.tsx`** - Reframe problem for RAG context
- [ ] **`components/landing/PricingSection.tsx`** - Update pricing for document processing
- [ ] **`components/landing/FAQSection.tsx`** - RAG-specific FAQ content
- [ ] **`components/landing/CTASection.tsx`** - Update CTA messaging

### Dependencies to Add
No new dependencies required. Using existing:
- Tailwind CSS for styling
- Lucide React for icons
- Next.js built-in components
- Existing shadcn/ui components

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Demo Interaction Failures:** When interactive demos fail to load or respond
  - **Handling:** Graceful fallback to static images, clear error messaging
- [ ] **Theme Switching Issues:** Green theme not applying correctly in dark mode
  - **Handling:** CSS variable fallbacks, validation of theme transitions
- [ ] **Mobile Layout Issues:** New content not responsive on smaller screens
  - **Handling:** Mobile-first design approach, thorough testing on 320px+ screens

### Edge Cases
- [ ] **Large Screen Displays:** Content layout on ultrawide monitors (1440px+)
  - **Solution:** Max-width containers and proper content centering
- [ ] **Slow Internet Connections:** Demo videos/images loading slowly
  - **Solution:** Optimized assets, progressive loading, placeholder content
- [ ] **Accessibility Navigation:** Screen readers and keyboard navigation
  - **Solution:** Proper ARIA labels, semantic HTML, focus management

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] No changes to authentication system - maintains existing Supabase Auth
- [ ] No new protected routes - all landing page content is public
- [ ] Preserves existing middleware and route protection

### Input Validation
- [ ] Demo interactions are client-side only - no server-side processing
- [ ] No new form inputs requiring validation on landing page
- [ ] Maintains existing CSRF protection patterns

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required. Existing configuration sufficient for landing page updates.

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
This task document has been created and needs user approval before implementation begins.

### Communication Preferences
- [ ] Confirm green color scheme preferences and hex values
- [ ] Validate RAGI name and any specific branding requirements
- [ ] Clarify priority order if implementation phases need adjustment
- [ ] Request feedback on demo complexity and interactivity level

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **TASK DOCUMENT REVIEW (Current Step)**
   - [ ] **Present this task document** to user for review and approval
   - [ ] **Gather feedback** on green color scheme, branding, and messaging approach
   - [ ] **Confirm implementation priorities** and any adjustments needed

2. **IMPLEMENTATION (After Approval)**
   - [ ] Start with Phase 1: Brand Identity & Color Scheme Update
   - [ ] **Create loading.tsx and error.tsx** for any new route (none needed for this task)
   - [ ] Test each component as built with green theme
   - [ ] **Create components in `components/landing/` directory following existing patterns**
   - [ ] **Test all components in both light and dark themes with green scheme**
   - [ ] **Verify responsive behavior on mobile (320px+), tablet (768px+), and desktop (1024px+)**
   - [ ] Document any deviations from approved plan

### Code Quality Standards
- [ ] Follow existing TypeScript patterns and component structure
- [ ] Implement proper error boundaries for new interactive demos
- [ ] Include comprehensive comments for color scheme changes
- [ ] **Ensure responsive design using Tailwind mobile-first breakpoints**
- [ ] **Test green theme in both light and dark mode thoroughly**
- [ ] **Verify mobile usability with touch interactions for demos**
- [ ] Follow accessibility guidelines (WCAG AA) for new interactive elements

---

## 14. Notes & Additional Context

### Key Messaging Themes for RAGI
- **Document Intelligence:** "Turn your documents into interactive knowledge"
- **Smart Search:** "Find answers buried in your files instantly"  
- **Multimedia Support:** "Upload text, images, videos - chat with all of it"
- **Gemini Power:** "Powered by Google's advanced Gemini AI models"
- **Privacy First:** "Your documents stay secure and private"

### Green Color Scheme Considerations
- Primary green for CTAs and highlights
- Muted green variants for backgrounds and accents
- Ensure sufficient contrast ratios for accessibility
- Test with existing brand color integrations (Gemini blue/purple/pink)

### Competitive Differentiation
- Focus on multimedia RAG capabilities (not just text)
- Emphasis on Gemini model quality and speed
- User-friendly upload and query experience
- Privacy and data security messaging

---

*Template Version: 1.0*  
*Task Created: January 2025*  
*Created By: Brandon Hancock* 
