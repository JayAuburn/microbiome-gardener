# Build Admin Model Management Page with Role-Based Access

> This document outlines creating an admin-only interface for managing AI models, including adding user roles and implementing proper authorization checks.

---

## 1. Task Overview

### Task Title
**Title:** Build Admin Model Management Page with Role-Based Access Control

### Goal Statement
**Goal:** Create a secure admin interface that allows administrators to view, edit, activate/deactivate, and add new AI models. This includes implementing a role-based permission system to ensure only authorized users can access model management functionality, providing administrators with full control over the available AI models in the system.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3 (latest), React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM v0.44.2
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/ui/table.tsx`, `components/ui/button.tsx`, `components/ui/dialog.tsx` for admin interface
  - `app/actions/models.ts` already exists with soft delete functionality
  - `lib/drizzle/schema/users.ts` for user role management

### Current State
The system currently has:
- Basic AI model soft delete functionality implemented via `app/actions/models.ts`
- User authentication through Supabase Auth
- Users table without role-based access control (all users have same permissions)
- AI models table with `is_active` field for soft delete functionality
- No admin interface for model management
- No role-based authorization system

**Missing Components:**
- User role field and authorization logic
- Admin-only routes and middleware
- Admin interface for viewing/managing models
- Forms for adding/editing models
- Proper admin access control

## 3. Context & Problem Definition

### Problem Statement
Currently, there is no secure way for administrators to manage AI models in the system. The soft delete functionality exists in the backend, but there&rsquo;s no user interface to access it. Additionally, the system lacks role-based access control, meaning any authenticated user could potentially access admin functionality if it existed. This creates both a usability problem (no way to manage models) and a security risk (no access control).

### Success Criteria
- [ ] Only users with &ldquo;admin&rdquo; role can access the admin model management page
- [ ] Admins can view all models (active and inactive) in a clear, organized table
- [ ] Admins can toggle models between active/inactive states
- [ ] Admins can edit existing model details (provider, name, etc.)
- [ ] Admins can add new models to the system
- [ ] Non-admin users are denied access with clear error messaging
- [ ] All changes are properly validated and logged
- [ ] Interface is responsive and follows existing design patterns

---

## 4. Technical Requirements

### Functional Requirements
- **Role-Based Access:** Only users with &ldquo;admin&rdquo; role can access `/admin/models`
- **Model Viewing:** Display all models in sortable table with status indicators
- **Model Status Management:** Toggle models between active/inactive with confirmation
- **Model Editing:** Edit provider name, model name, and other model properties
- **Model Creation:** Add new models with proper validation
- **Audit Trail:** Log all admin actions for accountability
- **Error Handling:** Graceful handling of permission errors and validation failures

### Non-Functional Requirements
- **Performance:** Page load under 2 seconds, table pagination for large model lists
- **Security:** Proper authorization checks on both client and server side
- **Usability:** Intuitive interface following existing design patterns
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Works with existing authentication and database systems

### Technical Constraints
- **Must use existing authentication:** Cannot modify Supabase Auth implementation
- **Must preserve data integrity:** Cannot break existing conversations or model references
- **Must follow existing patterns:** Use established component and routing patterns
- **Must be secure by default:** All admin routes protected, no client-side only checks

---

## 5. Data & Database Changes

### Database Schema Changes
```sql
-- Add role field to users table
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';
-- Add check constraint for valid roles
ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('member', 'admin'));
-- Add index for role-based queries
CREATE INDEX idx_users_role ON users(role);
```

### Data Model Updates
```typescript
// Update users schema in lib/drizzle/schema/users.ts
export const users = pgTable("users", {
  // ... existing fields ...
  role: text("role", {
    enum: ["member", "admin"],
  }).default("member").notNull(),
}, (t) => [
  // Add index for role-based queries
  index("role_idx").on(t.role),
]);

// Add role-related types
export type UserRole = "member" | "admin";
export type AdminUser = User & { role: "admin" };
```

### Data Migration Plan
- [ ] **Migration 1:** Add role column with default &ldquo;member&rdquo; value
- [ ] **Migration 2:** Create admin user (manual process via database)
- [ ] **Migration 3:** Add role index for performance
- [ ] **Validation:** Ensure all existing users have &ldquo;member&rdquo; role
- [ ] **Testing:** Verify role-based queries work correctly

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**MUTATIONS (Server Actions)** → `app/actions/[feature].ts`
- [ ] **Server Actions File** - Extend `app/actions/models.ts` - Add admin model management actions
- [ ] **New Admin Actions** - `createModel`, `updateModel`, `toggleModelStatus`

**QUERIES (Data Fetching)** → Choose based on complexity:

**Complex Queries** → `lib/[feature].ts`
- [ ] **Query Functions in lib/models.ts** - Add admin-specific model queries
- [ ] **Authorization Helper** - `lib/auth.ts` - Create admin role checking utilities

### Server Actions
- [ ] **`createModel`** - Create new AI model with validation
- [ ] **`updateModel`** - Update existing model details (name, provider, etc.)
- [ ] **`toggleModelStatus`** - Activate/deactivate models (uses existing soft delete)
- [ ] **`getAdminModelStats`** - Get model statistics for admin dashboard

### Database Queries
- [ ] **Admin Model Queries** - Complex queries with statistics and sorting in `lib/models.ts`
- [ ] **Role Authorization** - Helper functions for checking admin access

### API Routes (Rarely Needed)
**No new API routes needed** - All functionality handled via Server Actions and direct queries

### External Integrations
**No external integrations required**

---

## 7. Frontend Changes

### New Components
- [ ] **`components/admin/ModelManagementTable.tsx`** - Main table showing all models
  - Props: `models: AiModel[]`, `onStatusToggle: (id: string) => void`, `onEdit: (model: AiModel) => void`
  - Sortable columns, status badges, action buttons
- [ ] **`components/admin/ModelEditDialog.tsx`** - Modal for editing model details
  - Props: `open: boolean`, `model: AiModel | null`, `onSave: (model: AiModel) => void`
  - Form validation, loading states
- [ ] **`components/admin/AddModelDialog.tsx`** - Modal for adding new models
  - Props: `open: boolean`, `onSave: (modelData: NewModel) => void`
  - Required field validation, provider/name inputs
- [ ] **`components/admin/AdminGuard.tsx`** - Wrapper component for admin route protection
  - Props: `children: ReactNode`, `fallback?: ReactNode`
  - Server-side role checking, error boundaries

### Page Updates
- [ ] **`/admin/models/page.tsx`** - New admin model management page
  - Server component with admin role check
  - Fetches all models and renders management interface
- [ ] **`/admin/layout.tsx`** - Admin section layout
  - Admin navigation, breadcrumbs, role verification

### State Management
- **Admin Role Context:** Server-side role checking with client-side state for UI
- **Model Management State:** Local state for table sorting, filtering, modal states
- **Form State:** React Hook Form for model creation/editing with validation

---

## 8. Implementation Plan

### Phase 1: Database Schema and Authorization Infrastructure
**Goal:** Add role-based access control foundation

- [ ] **Task 1.1:** Update users table schema with role field
  - Files: `lib/drizzle/schema/users.ts`, `drizzle/migrations/`
  - Details: Add role enum field, create migration, update TypeScript types
- [ ] **Task 1.2:** Create authorization helper functions
  - Files: `lib/auth.ts`
  - Details: `isUserAdmin()`, `requireAdmin()`, role checking utilities
- [ ] **Task 1.3:** Update existing model actions with admin checks
  - Files: `app/actions/models.ts`
  - Details: Add role verification to existing soft delete functions

### Phase 2: Admin Route Protection and Layout
**Goal:** Create secure admin section with proper access control

- [ ] **Task 2.1:** Create admin layout and route protection
  - Files: `app/admin/layout.tsx`, `components/admin/AdminGuard.tsx`
  - Details: Role-based access control, admin navigation structure
- [ ] **Task 2.2:** Create admin models page structure
  - Files: `app/admin/models/page.tsx`, `app/admin/models/loading.tsx`, `app/admin/models/error.tsx`
  - Details: Server component with model fetching and admin verification

### Phase 3: Model Management Interface
**Goal:** Build the core admin interface for model management

- [ ] **Task 3.1:** Create model management table component
  - Files: `components/admin/ModelManagementTable.tsx`
  - Details: Sortable table, status badges, action buttons, responsive design
- [ ] **Task 3.2:** Build model editing functionality
  - Files: `components/admin/ModelEditDialog.tsx`, update `app/actions/models.ts`
  - Details: Edit form with validation, update server action

### Phase 4: Model Creation and Advanced Features
**Goal:** Complete the admin interface with model creation and refinements

- [ ] **Task 4.1:** Create add model functionality
  - Files: `components/admin/AddModelDialog.tsx`, extend `app/actions/models.ts`
  - Details: New model form, validation, creation server action
- [ ] **Task 4.2:** Add model statistics and admin dashboard features
  - Files: Update admin pages with stats, usage tracking
  - Details: Model usage stats, active/inactive counts, recent changes

### Phase 5: Testing and Security Hardening
**Goal:** Ensure security and reliability of admin system

- [ ] **Task 5.1:** Comprehensive admin access testing
  - Files: All admin components and actions
  - Details: Test role-based access, error handling, edge cases
- [ ] **Task 5.2:** Security audit and cleanup
  - Files: Review all admin code
  - Details: Ensure no client-side only checks, proper error handling

---

## 9. File Structure & Organization

### New Files to Create
```
project-root/
├── app/admin/
│   ├── layout.tsx                    # Admin section layout with role protection
│   └── models/
│       ├── page.tsx                  # Model management page
│       ├── loading.tsx               # Loading state
│       └── error.tsx                 # Error boundary
├── components/admin/
│   ├── AdminGuard.tsx                # Role-based access control wrapper
│   ├── ModelManagementTable.tsx     # Main admin table component
│   ├── ModelEditDialog.tsx          # Modal for editing models
│   └── AddModelDialog.tsx           # Modal for adding models
└── lib/
    └── auth.ts                       # Authorization helper functions
```

### Files to Modify
- [ ] **`lib/drizzle/schema/users.ts`** - Add role field and types
- [ ] **`app/actions/models.ts`** - Add admin checks and new model management actions
- [ ] **`lib/models.ts`** - Add admin-specific model queries
- [ ] **`drizzle/migrations/`** - New migration for role field

### Dependencies to Add
**No new dependencies required** - All functionality uses existing shadcn/ui components and patterns

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** Non-admin user tries to access `/admin/models`
  - **Handling:** Redirect to home with &ldquo;Access denied&rdquo; message
- [ ] **Error 2:** Admin tries to deactivate last active model
  - **Handling:** Warning dialog preventing action, must keep at least one active
- [ ] **Error 3:** Model update fails due to validation errors
  - **Handling:** Show field-specific error messages, maintain form state
- [ ] **Error 4:** Network error during model operations
  - **Handling:** Retry mechanism, proper error messaging, optimistic updates

### Edge Cases
- [ ] **Edge Case 1:** User role changes while on admin page
  - **Solution:** Middleware redirects, session validation on actions
- [ ] **Edge Case 2:** Multiple admins editing same model simultaneously
  - **Solution:** Optimistic locking, conflict resolution messaging
- [ ] **Edge Case 3:** Admin tries to delete model referenced by conversations
  - **Solution:** Use existing soft delete system, show conversation count warning

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] **Server-Side Verification:** All admin actions verify role on server side
- [ ] **Route Protection:** Middleware blocks non-admin access to `/admin/*` routes
- [ ] **Action Authorization:** Every server action checks user role before execution
- [ ] **Client-Side Guards:** UI components hide admin features from non-admins

### Input Validation
- [ ] **Model Data Validation:** Validate provider names, model names, required fields
- [ ] **Role Validation:** Ensure only valid roles can be assigned
- [ ] **SQL Injection Prevention:** Use parameterized queries through Drizzle ORM
- [ ] **XSS Prevention:** Proper input sanitization and output encoding

---

## 12. Deployment & Configuration

### Environment Variables
**No new environment variables required** - Uses existing Supabase configuration

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates after each phase
- [ ] Flag any security concerns immediately
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
   - [ ] **Create `loading.tsx` and `error.tsx` files alongside admin `page.tsx`**
   - [ ] Test each component as you build it in both light and dark themes
   - [ ] Follow existing code patterns and conventions from `components/ui/` and `app/actions/`
   - [ ] **Always create components in `components/admin/` directory**
   - [ ] **Verify all admin access controls work properly**
   - [ ] **Test responsive behavior on mobile, tablet, and desktop**
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices with proper type safety
- [ ] Add comprehensive error handling for all admin operations
- [ ] Include detailed comments for security-critical code
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode thoroughly**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA) for admin interface
- [ ] Use semantic HTML elements and proper ARIA labels
- [ ] **Security First:** Server-side validation for all admin actions

---

## 14. Notes & Additional Context

### User Experience Flow
**Admin Access:**
1. Admin logs in normally → Goes to `/admin/models` → Role checked → Interface loads
2. Admin sees table with all models (active/inactive clearly marked)
3. Admin can click &ldquo;Add Model&rdquo; → Modal opens → Form validation → Model created
4. Admin can click edit icon → Modal opens with current data → Updates saved
5. Admin can toggle active/inactive → Confirmation dialog → Status changed

**Non-Admin Access:**
1. Regular user tries to access `/admin/models` → Redirected with access denied message
2. No admin navigation or buttons visible to regular users

### Technical Notes
- Role field added to users table is extensible for future roles (moderator, etc.)
- All admin actions use existing soft delete pattern to preserve data integrity
- Admin interface uses existing shadcn/ui components for consistency
- Server-side role checking prevents client-side bypass attempts

### Security Architecture
- **Defense in Depth:** Role checks at middleware, page, component, and action levels
- **Principle of Least Privilege:** Only admin role can access admin functionality
- **Fail Secure:** Access denied by default, explicit grants required

---

*Task Version: 1.0*  
*Created: December 2024*  
*Author: Claude (based on user requirements)*
