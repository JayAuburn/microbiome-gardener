# Local Development Workflow with Makefile

> **Instructions:** This task creates a comprehensive Makefile-based development workflow for the rag-saas template, enabling easy concurrent running and testing of both the web application and rag-processor Python service.

---

## 1. Task Overview

### Task Title
**Title:** Create Makefile Local Development Workflow for Concurrent Web and RAG-Processor Testing

### Goal Statement
**Goal:** Implement a comprehensive Makefile that streamlines local development by providing single commands to install dependencies, run both applications concurrently, lint all code, and manage the full development lifecycle. This will dramatically improve developer experience by eliminating the need to manually manage multiple terminals and remember different command patterns for Python (uv) and Node.js (npm) environments.

---

## 2. Project Analysis & Current State

### Technology & Architecture
<!-- 
AI Agent: Analyze the project to fill this out.
- Check `package.json` for versions and dependencies.
- Check `tsconfig.json` for TypeScript configuration.
- Check `tailwind.config.ts` for styling and theme.
- Check `drizzle/schema/` for database schema.
- Check `middleware.ts` for authentication and routing.
- Check `components/` for existing UI patterns. 
-->
- **Root Level:** npm workspace with apps/* pattern, manages both web and rag-processor
- **Web App Technology:** Next.js 15+ with React 19, TypeScript 5+, Tailwind CSS, shadcn/ui components
- **Web App Database:** PostgreSQL via Drizzle ORM with migrations
- **Web App Authentication:** Supabase Auth managed by middleware.ts
- **RAG Processor Technology:** Python 3.10+ with FastAPI, uv for dependency management
- **RAG Processor Dependencies:** Google Cloud services (Storage, Gen AI, Vertex AI), pgvector for embeddings
- **RAG Processor Tools:** ruff for linting, black for formatting, mypy for type checking, pytest for testing
- **Current Architectural Patterns:** Monorepo structure with separate web and Python apps, npm workspaces for JS coordination
- **Existing Development Setup:** Basic npm scripts in root package.json, but requires manual terminal management for concurrent development

### Current State
Based on file analysis, the rag-saas template has:
- **Root package.json** with basic workspace scripts for individual app management
- **Web app** with standard Next.js development scripts (dev, build, lint, type-check)
- **RAG processor** with Python-specific uv commands and dependency groups (dev, lint, test)
- **Manual workflow** requiring developers to run `npm run rag-processor:dev` and `npm run web` in separate terminals
- **Inconsistent command patterns** between Python tools (uv run) and Node.js tools (npm run)
- **No unified linting** or testing commands across both applications
- **No dependency verification** to ensure uv and Node.js are properly installed

## 3. Context & Problem Definition

### Problem Statement
Currently, local development of the rag-saas template requires:
1. **Manual terminal management** - Developers must open multiple terminals and remember different command patterns
2. **Context switching friction** - Different dependency managers (uv vs npm) and command structures create cognitive overhead
3. **Inconsistent developer experience** - No unified commands for common tasks like linting, testing, or running all services
4. **Setup complexity** - New developers must manually install uv, configure environments, and understand the monorepo structure
5. **Testing inefficiency** - No easy way to test the full stack locally with both services running and communicating

This creates barriers to productivity and makes the template less accessible to new developers.

### Success Criteria
- [ ] **Single command installation** - `make install` sets up all dependencies and verifies prerequisites
- [ ] **Concurrent development** - `make dev` runs both web and rag-processor services simultaneously
- [ ] **Unified code quality** - `make lint` checks both Python and TypeScript code with consistent output
- [ ] **Simplified testing** - `make test` runs all test suites across both applications
- [ ] **Easy cleanup** - `make clean` removes all build artifacts and node_modules/virtual environments
- [ ] **Documentation** - Clear commands and help text for all common development tasks

---

## 4. Technical Requirements

### Functional Requirements
- **Dependency Management:** Automatically detect and install uv if missing, verify Node.js availability
- **Concurrent Execution:** Run web dev server (Next.js) and rag-processor API server simultaneously with proper log prefixing
- **Port Management:** Ensure services run on non-conflicting ports with clear documentation
- **Code Quality Integration:** Unified linting that respects existing ruff/black configuration for Python and ESLint/TypeScript for web
- **Environment Setup:** Support for .env.local file management and template copying
- **Process Management:** Graceful shutdown of both services when make dev is interrupted

### Non-Functional Requirements
- **Performance:** Commands should start quickly (< 10 seconds for make dev)
- **Cross-platform:** Makefile should work on macOS, Linux, and Windows (with appropriate tooling)
- **Reliability:** Robust error handling with clear error messages when dependencies are missing
- **Maintainability:** Modular Makefile structure that's easy to extend and modify
- **Developer Experience:** Colored output, progress indicators, and helpful error messages

### Technical Constraints
- **Must preserve existing functionality** - All current npm scripts and uv commands must continue to work
- **Must respect workspace structure** - Cannot modify the apps/* directory organization
- **Must use existing tools** - Cannot introduce new build tools, must work with uv and npm
- **Must support existing environment patterns** - Should work with current .env.local setup

---

## 5. Data & Database Changes

### Database Schema Changes
No database schema changes required for this task.

### Data Model Updates
No data model changes required for this task.

### Data Migration Plan
No data migrations required for this task.

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

This task does not involve API or backend code changes - it focuses solely on developer workflow and tooling improvements.

### Server Actions
No new server actions required.

### Database Queries
No database query changes required.

### API Routes (Only for Special Cases)
No API route changes required.

### External Integrations
No external integration changes required.

---

## 7. Frontend Changes

### New Components
No new components required for this task.

### Page Updates
No page updates required for this task.

### State Management
No state management changes required for this task.

---

## 8. Implementation Plan

### Phase 1: Create Core Makefile Structure
**Goal:** Establish the foundational Makefile with dependency checking and basic commands

- [ ] **Task 1.1:** Create Makefile in root directory
  - Files: `Makefile`
  - Details: Implement install, dependency checking, and help commands
- [ ] **Task 1.2:** Add dependency verification functions  
  - Files: `Makefile`
  - Details: Check for uv installation, Node.js version, and npm availability
- [ ] **Task 1.3:** Implement install command
  - Files: `Makefile`
  - Details: Automatic uv installation if missing, workspace dependency sync

### Phase 2: Concurrent Development Workflow
**Goal:** Enable simultaneous running of both applications with proper process management

- [ ] **Task 2.1:** Implement concurrent dev command
  - Files: `Makefile`
  - Details: Use background processes to run both dev-backend and dev-frontend
- [ ] **Task 2.2:** Add individual service commands
  - Files: `Makefile`
  - Details: dev-backend for rag-processor, dev-frontend for web app
- [ ] **Task 2.3:** Implement proper process cleanup
  - Files: `Makefile`
  - Details: Ensure graceful shutdown of both services

### Phase 3: Code Quality and Testing Integration
**Goal:** Unified commands for linting, formatting, and testing across both applications

- [ ] **Task 3.1:** Implement unified lint command
  - Files: `Makefile`
  - Details: Run ruff/black for Python, ESLint/TypeScript for web
- [ ] **Task 3.2:** Add testing commands
  - Files: `Makefile`
  - Details: pytest for rag-processor, npm test for web (if available)
- [ ] **Task 3.3:** Add cleanup and utility commands
  - Files: `Makefile`
  - Details: Clean build artifacts, reset environments, playground mode

---

## 9. File Structure & Organization

### New Files to Create
```
rag-saas/
├── Makefile                          # Main development workflow commands
└── .makefilerc                       # Optional: Make configuration (if needed)
```

### Files to Modify
- [ ] **`README.md`** - Update with new Makefile commands and development workflow
- [ ] **`.gitignore`** - Ensure Make temporary files are ignored (if any)

### Dependencies to Add
No new dependencies required - this task uses existing tooling (uv, npm, make).

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **Error 1:** uv not installed on system
  - **Handling:** Automatic installation via curl with fallback instructions
- [ ] **Error 2:** Node.js version incompatible  
  - **Handling:** Clear error message with minimum version requirements
- [ ] **Error 3:** Port conflicts during concurrent development
  - **Handling:** Check port availability, provide alternative port suggestions
- [ ] **Error 4:** Process cleanup failure
  - **Handling:** Force kill processes with clear cleanup instructions

### Edge Cases
- [ ] **Edge Case 1:** Running on Windows without proper Make support
  - **Solution:** Clear documentation for Windows users (WSL, Git Bash, or alternatives)
- [ ] **Edge Case 2:** Partial dependency installation failure
  - **Solution:** Granular error reporting and individual component install commands
- [ ] **Edge Case 3:** Environment variable conflicts
  - **Solution:** Environment validation and template copying for .env.local files

---

## 11. Security Considerations

### Authentication & Authorization
No authentication changes required for this development tooling task.

### Input Validation
- [ ] Validate command line arguments passed to Make targets
- [ ] Ensure safe handling of file paths in cleanup commands
- [ ] Verify environment variable handling doesn't expose secrets

### Data Protection
- [ ] Ensure .env files are not accidentally committed or exposed
- [ ] Safe cleanup commands that don't remove important user data

---

## 12. Deployment & Configuration

### Environment Variables
No new environment variables required. The Makefile will work with existing .env.local patterns.

### Makefile Configuration
```makefile
# Example configuration variables at top of Makefile
PYTHON_VERSION := 3.10
NODE_VERSION := 18
UV_VERSION := latest
BACKEND_PORT := 8000
FRONTEND_PORT := 3000
```

---

## 13. AI Agent Instructions

### Default Workflow - TASK DOCUMENTATION FIRST
🎯 **STANDARD OPERATING PROCEDURE:**
When a user requests any new feature, improvement, or significant change, your **DEFAULT BEHAVIOR** should be:

1. **CREATE A TASK DOCUMENT** in `ai_docs/` using this template
2. **GET USER APPROVAL** of the task document  
3. **IMPLEMENT THE FEATURE** only after approval

**DO NOT:** Present implementation plans in chat without creating a proper task document first.  
**DO:** Always create comprehensive task documentation that can be referenced later.

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **CREATE TASK DOCUMENT FIRST (Required)**
   - [ ] **Create a new task document** in the `ai_docs/` directory using this template
   - [ ] **Fill out all sections** with specific details for the requested feature
   - [ ] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/ directory and find the highest numbered task file (e.g., if highest is 028, use 029)
   - [ ] **Name the file** using the pattern `XXX_feature_name.md` (where XXX is the next incremental number)
   - [ ] **Present a summary** of the task document to the user for review

2. **GET APPROVAL SECOND (Required)**
   - [ ] **Wait for explicit user approval** of the task document before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the task document if needed
   - [ ] **Update the task document** based on user feedback

3. **IMPLEMENT THIRD (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Create the Makefile with proper structure and error handling
   - [ ] Test each command as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Use PHONY targets appropriately** for commands that don't create files
   - [ ] **Include help text** for all major commands
   - [ ] **Ensure cross-platform compatibility** where possible
   - [ ] Document any deviations from the approved plan

### What Constitutes "Explicit User Approval"
**✅ APPROVAL RESPONSES (Start coding immediately):**
- "Proceed"
- "Go ahead"  
- "Approved"
- "Start implementation"
- "Looks good"
- "Begin"
- "Execute the plan"
- "That works"
- "Yes, continue"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about specific implementation details
- Requests for changes or modifications
- "What about..." or "How will you handle..."
- "I'd like to change..."
- "Wait, let me think about..."
- No response or silence

🛑 **NEVER start coding without user approval of the task document first!**

### Code Quality Standards
- [ ] Follow Makefile best practices and conventions
- [ ] Add comprehensive comments explaining complex targets
- [ ] Include proper error handling and user feedback
- [ ] **Ensure idempotent operations** where appropriate (safe to run multiple times)
- [ ] **Use .PHONY appropriately** for targets that don't create files
- [ ] **Include help target** with clear documentation of all commands
- [ ] Test cross-platform compatibility (focus on macOS/Linux, document Windows considerations)

### Architecture Compliance
- [ ] **✅ VERIFY: Preserves existing project structure and workflows**
- [ ] **✅ VERIFY: Uses existing dependency managers (uv, npm) without introducing new tools**
- [ ] **✅ VERIFY: Maintains workspace pattern and npm script compatibility**
- [ ] **❌ AVOID: Breaking existing development workflows**
- [ ] **❌ AVOID: Introducing unnecessary complexity or dependencies**

---

## 14. Notes & Additional Context

### Reference Implementation
The Makefile pattern is inspired by the excellent ADK example provided by the user:
- Automatic dependency installation (uv)
- Concurrent backend/frontend development
- Unified linting across multiple languages
- Clean separation of concerns with focused targets

### Make Command Reference
Key commands that will be implemented:
- `make install` - Setup all dependencies
- `make dev` - Run both services concurrently  
- `make dev-backend` - Run only rag-processor
- `make dev-frontend` - Run only web app
- `make lint` - Check code quality for both apps
- `make test` - Run all test suites
- `make clean` - Clean build artifacts
- `make help` - Show all available commands

### Platform Considerations
- **macOS/Linux:** Native Make support, straightforward implementation
- **Windows:** Requires Git Bash, WSL, or Make for Windows - document alternatives

---

*Template Version: 1.0*  
*Last Updated: January 16, 2025*  
*Created By: Claude Sonnet* 
