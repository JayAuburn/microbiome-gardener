# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Build Comprehensive Chat History Page with Sidebar Navigation and Conversation Management

### Goal Statement
**Goal:** Create a fully functional history page that displays user conversations organized by time periods (Today, Yesterday, This Week) with a sidebar navigation and main table view. Users should be able to view, rename, and delete conversations with modern hover interactions and responsive mobile design.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/separator.tsx`, `components/ui/skeleton.tsx` for base styles

### Current State
The current history page (`app/(protected)/history/page.tsx`) is a placeholder showing "History - Coming Soon" message. The database schema already exists with `conversations` and `messages` tables with proper relationships and indexes. User authentication is handled by existing middleware, and the database contains:

- `conversations` table with: id, user_id, title, active_model_id, created_at, updated_at
- `messages` table with: id, conversation_id, sender, content, model_id, created_at
- Proper foreign key relationships and indexes for performance

## 3. Context & Problem Definition

### Problem Statement
Users currently have no way to view their chat history, manage past conversations, or navigate between different chat sessions. The current history page is a placeholder, and users lose track of their conversations once they navigate away. This creates a poor user experience where conversations cannot be revisited, organized, or managed.

### Success Criteria
- [ ] Users can view all their conversations organized by time periods (Today, Yesterday, This Week)
- [ ] Users can see conversation titles, dates, and models used in a clean table format
- [ ] Users can hover over conversations to reveal rename and delete actions
- [ ] Users can rename conversation titles inline
- [ ] Users can delete conversations with confirmation
- [ ] Page loads efficiently with pagination (Load More button)
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Loading and error states are properly handled

---

## 4. Technical Requirements

### Functional Requirements
- User can view conversations organized by time periods in a sidebar
- User can see conversation details in a table format with Name, Date, Model columns
- User can hover over table rows to reveal rename/delete actions
- User can rename conversations by clicking rename action
- User can delete conversations with confirmation dialog
- User can click "Load More" to fetch additional conversations (pagination)
- User can click on conversation names to navigate to that chat
- System groups conversations by updated_at timestamp

### Non-Functional Requirements
- **Performance:** Page loads within 2 seconds, conversations display within 1 second
- **Security:** Only authenticated users can view their own conversations, proper authorization checks
- **Usability:** Intuitive hover interactions, clear visual feedback, accessible keyboard navigation
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Works in all modern browsers with JavaScript enabled

### Technical Constraints
- Must use existing authentication system (Supabase Auth)
- Must use existing database schema without modifications
- Must maintain consistency with existing UI patterns and components
- Cannot modify sidebar layout or navigation structure
- Must follow Next.js 15 async params pattern

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required. Will use existing tables:

```sql
-- Using existing tables:
-- conversations: id, user_id, title, active_model_id, created_at, updated_at
-- messages: id, conversation_id, sender, content, model_id, created_at
-- ai_models: id, provider_name, model_name, is_active, created_at, updated_at
```

### Data Model Updates
```typescript
// New types for history page components
export type ConversationWithModel = Conversation & {
  model_name?: string;
  provider_name?: string;
  message_count?: number;
};

export type GroupedConversations = {
  today: ConversationWithModel[];
  yesterday: ConversationWithModel[];
  thisWeek: ConversationWithModel[];
  older: ConversationWithModel[];
};

export type PaginationInfo = {
  hasMore: boolean;
  offset: number;
  limit: number;
};
```

### Data Migration Plan
- [ ] No migrations required - using existing schema
- [ ] Verify existing conversations have proper timestamps
- [ ] Ensure proper indexes exist for performance (already in place)

---

## 6. API & Backend Changes

### Data Access Pattern (Choose One)

**Standard Approach (Recommended):**
- [x] **Server Actions File** - `app/actions/history.ts` - All mutations (rename, delete)
- [x] **Direct Queries in Server Components** - Conversation queries directly in `async` Server Components

### Server Actions
- [ ] **`renameConversation`** - Updates conversation title with validation
- [ ] **`deleteConversation`** - Soft delete conversation and associated messages
- [ ] **`loadMoreConversations`** - Pagination helper for loading additional conversations

### Database Queries
- [ ] **Direct in Server Components** - Complex query with joins to get conversations with model info
- [ ] **Time-based Grouping** - Query to group conversations by updated_at timestamp periods

### API Routes (Rarely Needed)
Not required for this implementation - using Server Actions and direct queries.

### External Integrations
No external integrations required.

---

## 7. Frontend Changes

### New Components
- [ ] **`components/history/HistorySidebar.tsx`** - Sidebar showing time-grouped conversation list
- [ ] **`components/history/ConversationTable.tsx`** - Main table showing conversation details
- [ ] **`components/history/ConversationRow.tsx`** - Individual table row with hover actions
- [ ] **`components/history/RenameDialog.tsx`** - Modal for renaming conversations
- [ ] **`components/history/DeleteConfirmDialog.tsx`** - Confirmation dialog for deletion
- [ ] **`components/history/LoadMoreButton.tsx`** - Pagination button component

**Component Requirements:**
- **Responsive Design:** Mobile-first approach with proper breakpoint handling
- **Theme Support:** Full light/dark mode support using CSS variables
- **Accessibility:** WCAG AA compliance, keyboard navigation, screen reader support

### Page Updates
- [ ] **`app/(protected)/history/page.tsx`** - Complete rewrite with server component pattern
- [ ] **`app/(protected)/history/loading.tsx`** - Loading skeleton for history page
- [ ] **`app/(protected)/history/error.tsx`** - Error boundary for history page

### State Management
- Client-side state for UI interactions (hover states, dialog open/close)
- Server state management through Server Actions and revalidation
- No global state required - all data fetched fresh on page load

---

## 8. Implementation Plan

### Phase 1: Core Data Fetching & Page Structure
**Goal:** Establish basic page structure with data fetching

- [ ] **Task 1.1:** Create `app/actions/history.ts` server actions file
  - Files: `app/actions/history.ts`
  - Details: Implement renameConversation, deleteConversation, loadMoreConversations actions
- [ ] **Task 1.2:** Rewrite `app/(protected)/history/page.tsx` with data fetching
  - Files: `app/(protected)/history/page.tsx`
  - Details: Implement async server component with conversation queries and time grouping
- [ ] **Task 1.3:** Create loading and error pages
  - Files: `app/(protected)/history/loading.tsx`, `app/(protected)/history/error.tsx`
  - Details: Loading skeleton UI and error boundary components

### Phase 2: Sidebar Component
**Goal:** Build time-grouped conversation sidebar

- [ ] **Task 2.1:** Create `components/history/HistorySidebar.tsx`
  - Files: `components/history/HistorySidebar.tsx`
  - Details: Sidebar with Today/Yesterday/This Week sections, responsive design

### Phase 3: Main Table Components
**Goal:** Build conversation table with hover interactions

- [ ] **Task 3.1:** Create `components/history/ConversationTable.tsx`
  - Files: `components/history/ConversationTable.tsx`
  - Details: Main table layout with headers and responsive design
- [ ] **Task 3.2:** Create `components/history/ConversationRow.tsx`
  - Files: `components/history/ConversationRow.tsx`
  - Details: Individual row with hover actions for rename/delete
- [ ] **Task 3.3:** Create `components/history/LoadMoreButton.tsx`
  - Files: `components/history/LoadMoreButton.tsx`
  - Details: Pagination button with loading states

### Phase 4: Interactive Dialogs
**Goal:** Add rename and delete functionality

- [ ] **Task 4.1:** Create `components/history/RenameDialog.tsx`
  - Files: `components/history/RenameDialog.tsx`
  - Details: Modal dialog for renaming conversations with validation
- [ ] **Task 4.2:** Create `components/history/DeleteConfirmDialog.tsx`
  - Files: `components/history/DeleteConfirmDialog.tsx`
  - Details: Confirmation dialog for conversation deletion

### Phase 5: Integration & Polish
**Goal:** Final integration and mobile optimization

- [ ] **Task 5.1:** Integrate all components in main page
- [ ] **Task 5.2:** Test responsive behavior and mobile experience
- [ ] **Task 5.3:** Verify theme support and accessibility

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── app/(protected)/history/
│   ├── page.tsx                      # Main history page (rewrite)
│   ├── loading.tsx                   # Loading skeleton
│   └── error.tsx                     # Error boundary
├── components/history/
│   ├── HistorySidebar.tsx           # Time-grouped sidebar
│   ├── ConversationTable.tsx        # Main table component
│   ├── ConversationRow.tsx          # Table row with hover actions
│   ├── RenameDialog.tsx             # Rename modal
│   ├── DeleteConfirmDialog.tsx      # Delete confirmation
│   └── LoadMoreButton.tsx           # Pagination button
└── app/actions/
    └── history.ts                    # Server actions for history
```

### Files to Modify
- [ ] **`app/(protected)/history/page.tsx`** - Complete rewrite from placeholder to full implementation

### Dependencies to Add
No new dependencies required - using existing shadcn/ui components and libraries.

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **No Conversations:** Show empty state with helpful message and link to start chatting
  - **Handling:** Render empty state component with call-to-action
- [ ] **Database Connection Failure:** Handle database errors gracefully 
  - **Handling:** Show error page with retry option
- [ ] **Unauthorized Access:** Handle auth failures
  - **Handling:** Redirect handled by middleware
- [ ] **Rename Validation Errors:** Handle invalid conversation names
  - **Handling:** Show validation errors in rename dialog

### Edge Cases
- [ ] **Very Long Conversation Titles:** Truncate with ellipsis and tooltip
  - **Solution:** Use CSS text-overflow and title attribute
- [ ] **Many Conversations (100+):** Efficient pagination and loading
  - **Solution:** Implement proper pagination with load more button
- [ ] **Concurrent Edits:** Handle multiple users editing same conversation
  - **Solution:** Use optimistic updates with error handling and revalidation

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] Only authenticated users can access history page (handled by middleware)
- [ ] Users can only view/edit their own conversations (user_id filtering)
- [ ] Server actions validate user ownership before mutations

### Input Validation
- [ ] Conversation titles validated for length and content
- [ ] Conversation IDs validated as proper UUIDs
- [ ] All user inputs sanitized against XSS

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required - using existing database and auth configuration.

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [ ] **Present the complete implementation plan** based on this task document
   - [ ] **Summarize all phases, files to modify, and key technical decisions**
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **Create `loading.tsx` and `error.tsx` files alongside `page.tsx`**
   - [ ] Test each component as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Always create components in `components/history/` directory**
   - [ ] Keep pages minimal - only import and use components
   - [ ] **Test all components in both light and dark themes**
   - [ ] **Verify responsive behavior on mobile, tablet, and desktop**
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with strict typing
- [ ] Add proper error handling and validation
- [ ] Include comprehensive comments for complex logic
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA)
- [ ] Use semantic HTML elements
- [ ] **Never use `eslint-disable` for exhaustive-deps or unescaped-entities**
- [ ] **Follow Next.js 15 async params pattern**
- [ ] **Escape apostrophes and quotes in JSX text nodes**

---

## 14. Notes & Additional Context

### Design Specifications
- Sidebar shows conversations grouped by time periods
- Main area shows table with Name, Date, Model columns  
- Hover interactions reveal rename/delete actions (no action column)
- Modern, clean UI following existing design patterns
- Load More button for pagination instead of traditional pagination controls

### Key Technical Decisions
- Using Server Components for data fetching and initial render
- Server Actions for mutations (rename, delete)
- Direct database queries in Server Components (no separate data layer needed)
- Hover-based actions instead of action column for cleaner UI
- Time grouping based on `updated_at` timestamp
- "New Conversation" as fallback for null titles

---

*Template Version: 1.0*  
*Last Updated: 12/26/2024*  
*Created By: Brandon Hancock* 
