# ShipKit CLI - AI App Template Generator

> **Instructions:** This task creates a comprehensive CLI tool that allows users to generate AI SaaS applications from predefined templates with customizable features.

---

## 1. Task Overview

### Task Title
**Title:** Build ShipKit CLI Tool for AI SaaS Template Generation

### Goal Statement
**Goal:** Create a professional CLI tool (`create-shipkit-app`) that enables users to generate production-ready AI applications in under 3 minutes. The CLI should provide an intuitive interface for selecting AI app types (Chat, RAG, Agent), optional billing features, and automatically configure the appropriate tech stack for rapid deployment and monetization.

---

## 2. Project Analysis & Current State

### Technology & Architecture
- **CLI Framework:** Node.js with TypeScript
- **CLI Libraries:** Commander.js (command parsing), Inquirer.js (interactive prompts), chalk (colored output), ora (loading spinners), fs-extra (file operations)
- **Template Source:** Private GitHub repository with multiple template directories
- **Distribution:** NPM package published as `create-shipkit-app`
- **Template Storage:** Single private GitHub repo with organized template structure
- **Modification Strategy:** Dynamic file removal and content modification during project generation

### Current State
Currently have a production-ready Chat SaaS template (`shipkit-chat-template`) with full features including:
- Next.js 15 App Router with TypeScript
- Supabase authentication and database
- OpenRouter AI integration
- Stripe billing and subscriptions
- shadcn/ui components with Tailwind CSS
- Usage tracking and analytics
- Mobile-responsive design

## 3. Context & Problem Definition

### Problem Statement
AI developers face significant friction when starting new projects - they must configure authentication, databases, AI integrations, billing systems, and deployment pipelines from scratch. This process typically takes weeks and requires deep technical knowledge across multiple platforms. Current templates are either too basic (not production-ready) or too generic (not AI-specific).

### Success Criteria
- [ ] Users can generate a working AI SaaS application in under 3 minutes
- [ ] CLI supports 3 AI application types: Chat, RAG, and Agent (Phase 1: Chat only)
- [ ] Billing features can be toggled on/off during generation
- [ ] Generated projects are immediately deployable to production
- [ ] CLI provides clear next steps and documentation after generation
- [ ] Template system supports easy expansion for future AI app types

---

## 4. Technical Requirements

### Functional Requirements
- CLI prompts users for AI app type selection (Chat, RAG, Agent)
- Optional billing/monetization feature toggle
- Automatic project scaffolding with appropriate dependencies
- Dynamic file modification based on user choices
- Environment file generation with required variables
- Quickstart documentation generation
- Template validation and error handling

### Non-Functional Requirements
- **Performance:** Project generation completes in under 30 seconds
- **Security:** Private GitHub repository access with user authentication
- **Usability:** Intuitive prompts with clear descriptions and examples
- **Responsive Design:** Generated templates must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Generated templates must support both light and dark mode using existing theme system
- **Compatibility:** Works on macOS, Windows, and Linux
- **Extensibility:** Easy template addition without CLI modifications

### Technical Constraints
- Must work with private GitHub repositories (authentication required)
- Generated projects must maintain existing code quality standards
- File modifications must preserve TypeScript type safety
- Templates must be deployable to Vercel with minimal configuration

---

## 5. Data & Database Changes

### Template Repository Structure
```
shipkit/
├── templates/
│   ├── chat/                    # Current chat template
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── package.json
│   │   └── ...
│   ├── rag/                     # Future RAG template
│   └── agent/                   # Future Agent template
├── cli/
│   ├── src/
│   ├── package.json
│   └── README.md
└── docs/
    ├── quickstart-chat.md
    ├── quickstart-rag.md
    └── quickstart-agent.md
```

### Schema Modifications for No-Billing Mode
```typescript
// users.ts modifications when billing disabled:
// REMOVE these fields:
- stripe_customer_id
- stripe_subscription_id
- subscription_status
- current_period_start
- current_period_end

// KEEP these fields:
- id, email, full_name (core user data)
- role, created_at, updated_at (app functionality)
- subscription_tier (default to "free" only)
```

### Data Migration Plan
- [ ] No database migrations required for CLI tool
- [ ] Generated templates will include their own migration scripts
- [ ] Template validation to ensure schema consistency

---

## 6. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**CLI Tool Architecture:**
- [ ] **Template Manager** - `src/templates.ts` - Download and process templates
- [ ] **File Processors** - `src/processors/` - Modify files based on user choices
- [ ] **GitHub Integration** - `src/github.ts` - Private repository access

### CLI Architecture
- **Entry Point:** `bin/create-shipkit-app.js` - Main CLI executable
- **Core Logic:** `src/cli.ts` - Command parsing and orchestration
- **Template Manager:** `src/templates.ts` - Template downloading and processing
- **File Processor:** `src/processors.ts` - File modification and removal logic
- **GitHub Integration:** `src/github.ts` - Private repository access
- **Update System:** `src/updater.ts` - Simple template update functionality

### Template Processing Pipeline
1. **Download Template** - Clone from private GitHub repository
2. **Remove Billing Features** - Delete files and modify schemas if needed
3. **Install Dependencies** - Run npm install automatically
4. **Generate Environment** - Create .env.local from .env.example
5. **Create Documentation** - Add quickstart guide specific to template

### Template Update System
```bash
# Simple Update Commands:
npx shipkit update                    # Check for updates and show available changes
npx shipkit update --apply            # Apply latest template updates
```

**Basic Update Flow:**
1. **Check Updates** - Compare local template with latest GitHub version
2. **Show Changes** - Display changelog and list of modified files
3. **Apply Updates** - Copy updated files from latest template (user confirms overwrites)
4. **Self-Update** - Update the CLI tool itself when new versions are available

### External Integrations
- GitHub API for private repository access and template updates
- NPM registry for CLI tool distribution and self-updates
- Template validation and processing
- Conflict detection and resolution system

---

## 7. Frontend Changes

### CLI User Interface
```bash
# Interactive prompts using Inquirer.js:
npx create-shipkit-app my-ai-startup

? What AI app are you building?
  🤖 AI Chat App (like ChatGPT)
  📚 AI Document Q&A (RAG)  
  🎯 AI Agent/Assistant

? Include billing from day 1? (Recommended for monetization) (Y/n)

✨ Setting up your AI startup...
📦 Installing dependencies
📝 Creating environment files (.env.example → .env.local)  
🔧 Setting up database schema
📚 Adding quickstart documentation
✅ Ready to build in 3 minutes!
```

### Generated Project Structure
Templates maintain existing component organization with conditional removal:
- Core components (chat, auth, ui) - Always included
- Billing components - Removed if billing disabled
- Analytics components - Removed if billing disabled
- Schema modifications - Field removal from database schemas

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

---

## 8. Implementation Plan

### Phase 1: CLI Foundation & Chat Template
**Goal:** Create working CLI that generates Chat SaaS applications

- [ ] **Task 1.1:** Set up CLI project structure
  - Files: `cli/package.json`, `cli/src/index.ts`, `cli/bin/create-shipkit-app.js`
  - Details: Initialize Node.js project with TypeScript and CLI dependencies
  
- [ ] **Task 1.2:** Implement core CLI logic
  - Files: `cli/src/cli.ts`, `cli/src/prompts.ts`
  - Details: Command parsing, interactive prompts, and user input validation
  
- [ ] **Task 1.3:** Build GitHub integration
  - Files: `cli/src/github.ts`
  - Details: Private repository access, template downloading, and authentication
  
- [ ] **Task 1.4:** Create file processing system
  - Files: `cli/src/processors/`, `cli/src/processors/billing-remover.ts`
  - Details: File deletion, content modification, and schema field removal

### Phase 2: Template Processing & Generation
**Goal:** Complete project generation with file modifications

- [ ] **Task 2.1:** Implement billing feature removal
  - Files: `cli/src/processors/billing-remover.ts`, `cli/src/processors/schema-modifier.ts`
  - Details: Remove Stripe components, clean database schemas, update imports
  
- [ ] **Task 2.2:** Add environment file generation
  - Files: `cli/src/generators/env-generator.ts`
  - Details: Create .env.local from template, customize based on features
  
- [ ] **Task 2.3:** Implement post-generation setup
  - Files: `cli/src/post-setup.ts`
  - Details: npm install, documentation generation, success messaging

### Phase 3: Testing & Publishing
**Goal:** Validate CLI functionality and publish to NPM

- [ ] **Task 3.1:** Create comprehensive tests
  - Files: `cli/tests/`, `cli/tests/integration.test.ts`
  - Details: Test all template combinations, file modifications, and error cases
  
- [ ] **Task 3.2:** Build and publish CLI
  - Files: `cli/build.js`, `cli/package.json`
  - Details: TypeScript compilation, NPM publishing, version management

---

## 9. File Structure & Organization

### New CLI Project Structure
```
create-shipkit-app/
├── bin/
│   └── create-shipkit-app.js           # CLI executable
├── src/
│   ├── index.ts                        # Main entry point
│   ├── cli.ts                          # Command parsing logic
│   ├── prompts.ts                      # Interactive user prompts
│   ├── github.ts                       # GitHub API integration
│   ├── processors/
│   │   ├── billing-remover.ts          # Remove billing features
│   │   ├── schema-modifier.ts          # Modify database schemas
│   │   └── file-cleaner.ts             # Clean imports and references
│   ├── generators/
│   │   ├── env-generator.ts            # Environment file creation
│   │   └── docs-generator.ts           # Documentation generation
│   ├── updater.ts                      # Simple update functionality
│   └── utils/
│       ├── file-utils.ts               # File system utilities
│       └── logger.ts                   # Colored output and logging
├── tests/
│   ├── integration.test.ts             # End-to-end CLI testing
│   └── processors.test.ts              # File processing tests
├── package.json
├── tsconfig.json
└── README.md
```

### Template Repository Organization
```
shipkit-templates-private/
├── templates/
│   └── chat/                           # Copy of current shipkit-chat-template
├── docs/
│   ├── quickstart-chat.md              # Chat-specific setup guide
│   ├── deployment-guide.md             # Deployment instructions
│   └── api-keys-guide.md               # Service configuration help
└── scripts/
    ├── prepare-templates.js            # Template validation scripts
    └── update-templates.js             # Sync with main repositories
```

### Dependencies to Add
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.2.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.0",
    "fs-extra": "^11.0.0",
    "simple-git": "^3.19.0",
    "tar": "^6.2.0"
  },
  "devDependencies": {
    "@types/inquirer": "^9.0.0",
    "@types/fs-extra": "^11.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

---

## 10. Error Handling & Edge Cases

### Error Scenarios
- [ ] **GitHub Authentication Failure**
  - **Handling:** Clear error message with setup instructions for GitHub access
- [ ] **Network Connection Issues**
  - **Handling:** Retry mechanism with user-friendly timeout messages
- [ ] **Template Download Failure**
  - **Handling:** Validate template integrity, provide manual download instructions
- [ ] **File System Permissions**
  - **Handling:** Check write permissions, suggest alternative directory locations

### Edge Cases
- [ ] **Existing Directory with Same Name**
  - **Solution:** Prompt user to choose different name or overwrite
- [ ] **Incomplete Template Modification**
  - **Solution:** Rollback mechanism to restore original template state
- [ ] **Missing Required Dependencies**
  - **Solution:** Pre-flight checks for Node.js, npm, and git installations

---

## 11. Security Considerations

### Authentication & Authorization
- [ ] GitHub private repository access requires user authentication
- [ ] CLI must securely handle GitHub personal access tokens
- [ ] No sensitive data stored in generated templates (API keys remain as examples)

### Input Validation
- [ ] Project name validation (valid directory names, no special characters)
- [ ] Template selection validation against available options
- [ ] GitHub repository access validation before processing

### Data Protection
- [ ] GitHub tokens are not logged or stored permanently
- [ ] Generated .env.local files contain only example values
- [ ] User data is not transmitted outside of GitHub API calls

---

## 12. Deployment & Configuration

### Environment Variables
```bash
# CLI Development Environment
GITHUB_TOKEN=ghp_your_github_token_here
TEMPLATE_REPO_URL=https://github.com/username/shipkit-templates-private
NPM_REGISTRY=https://registry.npmjs.org/
```

### NPM Package Configuration
```json
{
  "name": "create-shipkit-app",
  "version": "1.0.0",
  "description": "Create AI SaaS applications with ShipKit templates",
  "bin": {
    "create-shipkit-app": "./bin/create-shipkit-app.js"
  },
  "keywords": ["ai", "saas", "nextjs", "template", "shipkit", "chatgpt", "rag", "agent"],
  "homepage": "https://shipkit.ai",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/create-shipkit-app"
  }
}
```

---

## 13. AI Agent Instructions

### Communication Preferences
- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates during implementation
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **PLAN FIRST (Required)**
   - [ ] **Present the complete implementation plan** based on this task document
   - [ ] **Summarize all phases, files to create, and key technical decisions**
   - [ ] **Wait for explicit user approval** before writing ANY code
   - [ ] **Ask for feedback and incorporate changes** to the plan if needed

2. **IMPLEMENT SECOND (Only after approval)**
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] Create CLI project structure first
   - [ ] Implement core functionality before advanced features
   - [ ] Test each component as you build it
   - [ ] Follow existing code patterns and conventions
   - [ ] **Test CLI with both billing enabled and disabled modes**
   - [ ] **Verify template generation works end-to-end**
   - [ ] Document any deviations from the approved plan

🛑 **NEVER start coding without user approval of the plan first!**

### Code Quality Standards
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling for all file operations
- [ ] Include comprehensive comments for CLI logic
- [ ] Ensure cross-platform compatibility (Windows, macOS, Linux)
- [ ] Use semantic versioning for CLI releases
- [ ] Follow accessibility guidelines for generated templates

---

## 14. Notes & Additional Context

### User Experience Goals
The CLI should feel as polished as `create-next-app` or `create-react-app` with:
- Fast project generation (under 30 seconds)
- Clear, helpful prompts with context
- Beautiful colored output with progress indicators
- Comprehensive error messages with actionable solutions
- Immediate next steps after generation

### Template Expansion Strategy
- Phase 1: Chat template only (prove the concept)
- Phase 2: Add RAG template for document Q&A applications
- Phase 3: Add Agent template for autonomous AI assistants
- Phase 4: Community-driven template marketplace

### Post-Generation User Experience
```bash
🎉 Your AI Chat App is ready!

📁 Project created in ./my-ai-startup/

⚡ Quick start:
  cd my-ai-startup
  npm run dev

🔧 Next steps:
  1. Follow QUICKSTART.md to configure your services
  2. Add your API keys to .env.local
  3. Run database setup: npm run db:setup

📚 Documentation: ./docs/quickstart.md
🚀 Deploy guide: ./docs/deploy.md
💬 Community: https://discord.gg/shipkit
```

### Research Links
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Inquirer.js Interactive Prompts](https://github.com/SBoudrias/Inquirer.js)
- [create-next-app Source Code](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [GitHub API for Private Repositories](https://docs.github.com/en/rest/repos/repos)

---

## 15. Context & Background Information

### Key Decisions Made During Planning

**Distribution Strategy:**
- **Chosen:** Single private GitHub repository (`shipkit`) with user invitation system
- **Rejected:** NPM private packages (too complex), multiple repos (harder to manage)
- **Implementation:** Users purchase course → get invited to private GitHub repo → CLI downloads from private repo

**Template Architecture:**
- **Approach:** Single master template with feature removal during generation
- **Billing Toggle:** When "No billing" selected, CLI removes entire files (Stripe components) and modifies database schemas
- **File Modification:** Smart removal from `users.ts` (remove stripe_customer_id, subscription_status, etc.) while keeping core fields

**CLI Technology Stack:**
- **Framework:** Node.js with TypeScript
- **Libraries:** Commander.js, Inquirer.js, chalk, ora, fs-extra, simple-git
- **Distribution:** NPM package `create-shipkit-app`
- **User Experience:** Interactive prompts matching create-next-app quality

**Phase Rollout Strategy:**
- **Phase 1:** Chat template only (prove concept)
- **Phase 2:** Add RAG template 
- **Phase 3:** Add Agent template
- **Community Alerts:** New templates announced via Discord/community

### Template Repository Structure & Migration

**ShipKit Repo Organization:**
```
shipkit/ (private GitHub repo)
├── templates/
│   ├── chat/           # Full Next.js project (current shipkit-chat-template)
│   ├── rag/            # Future: Document Q&A template  
│   └── agent/          # Future: AI Agent template
├── cli/                # CLI source code
├── docs/               # Template documentation
└── scripts/            # Template preparation scripts
```

**Migration Strategy for Current Chat App:**
1. **Create new ShipKit repo** with proper structure
2. **Copy entire current project** into `templates/chat/`
3. **Template-ize the chat app:**
   - Replace hardcoded values with template variables
   - Create `.env.example` with placeholder values
   - Update `package.json` name to `{{project-name}}`
   - Remove personal API keys/secrets
4. **Test CLI generation** from template
5. **Add template-specific documentation**

**Each Template = Complete Next.js Project:**
- Self-contained and independently deployable
- Full package.json with all dependencies
- Complete file structure (app/, components/, lib/)
- Template-specific documentation and setup guides
- CLI copies entire directory and modifies as needed

### CLI User Experience Requirements

**Command Structure:**
```bash
npx create-shipkit-app my-ai-startup

? What AI app are you building?
  🤖 AI Chat App (like ChatGPT)
  📚 AI Document Q&A (RAG)  
  🎯 AI Agent/Assistant

? Include billing from day 1? (Recommended for monetization) (Y/n)
```

**Post-Generation Experience:**
- Automatic `npm install`
- `.env.local` creation from `.env.example`
- Clear next steps with links to documentation
- No automatic database setup (covered in quickstart docs)

**Quality Standards:**
- Generation completes in under 30 seconds
- Professional output with colored text and progress indicators
- Comprehensive error handling with actionable messages
- Cross-platform compatibility (Windows, macOS, Linux)

### Business Context

**Course Integration:**
- CLI is part of paid course/template bundle
- Goal: Help developers launch AI apps in under 2 weeks
- Action-oriented approach (not long educational course)
- Templates designed for rapid monetization

**Pricing Strategy:**
- Single offering (avoid complex tiers)
- Course + templates bundle
- Private GitHub repo access after purchase
- Community support included

**Success Metrics:**
- Users can generate working AI app in under 3 minutes
- Generated projects are immediately deployable
- Templates support real-world production use cases
- Easy expansion for future AI app types

### Technical Implementation Notes

**File Modification Strategy:**
- **Delete entire files:** Stripe components, billing pages, analytics components
- **Modify existing files:** Remove billing fields from database schemas, clean imports
- **Preserve functionality:** Core chat, auth, and AI features always remain
- **Type safety:** Ensure TypeScript compilation after modifications

**Template Processing Pipeline:**
1. Download template from private GitHub repo
2. Apply user selections (remove billing if disabled)
3. Replace template variables (project name, etc.)
4. Install dependencies automatically
5. Generate documentation and next steps

**Error Handling Priorities:**
- GitHub authentication failures
- Network connectivity issues
- File system permissions
- Existing directory conflicts
- Template integrity validation

### Future Expansion Plans

**Template Roadmap:**
- **Chat Template:** Production-ready ChatGPT-like interface (current)
- **RAG Template:** Document Q&A with vector search and citations
- **Agent Template:** Autonomous AI with tool calling and workflows
- **Community Templates:** User-contributed templates via marketplace

**Deployment Targets by Template:**
- **Chat:** Vercel only (simple frontend + API)
- **RAG:** Vercel + GCP (document processing, vector storage)
- **Agent:** Vercel + AWS Lambda (background job processing)

**CLI Evolution:**
- Start with basic template copying
- Add advanced configuration options
- Support custom template sources
- Enable template marketplace integration

---

*Template Version: 1.0*  
*Last Updated: 12/28/2024*  
*Created By: Brandon Hancock*
