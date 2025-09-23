# Update SETUP.md Instructions for ShipKit CLI Integration

## Task Overview

**CRITICAL:** Update the SETUP.md file to reflect the new ShipKit CLI commands and provide clear instructions for both development (repo) and production (global package) usage scenarios.

## Problem Context

The SETUP.md currently shows direct `uv run` commands, but Brandon now has ShipKit CLI integration with npm scripts. Users need clear instructions for:

1. **Development/Demo (from repo):** Uses npm scripts that delegate to uv
2. **Production users (global package):** Need dependency setup instructions
3. **Command consistency:** All templates should use similar command patterns

## Required Changes

### 1. Update Command Examples Throughout SETUP.md

**Replace all instances of:**
```bash
# Old direct commands
cd templates/rag-saas
uv run setup-dev
uv run deploy-rag-processor
uv run deploy-queue-handler
```

**With ShipKit CLI commands:**
```bash
# New ShipKit CLI commands (from repo root)
npm run rag-saas:setup-dev
npm run rag-saas:deploy-processor
npm run rag-saas:deploy-queue
```

### 2. Add Prerequisites Section for Global Package Users

Add a new section after the tool installation that explains:

```markdown
### ShipKit CLI Usage Modes

#### Option 1: Development/Demo Mode (Recommended)
When working from the ShipKit repository:
- All Python dependencies are included
- Use npm scripts: `npm run rag-saas:setup-dev`
- Best for development and demonstrations

#### Option 2: Global Package Mode
When using globally installed ShipKit:
- Requires additional Python setup
- Install dependencies: `pip install uv python-dotenv structlog`
- Use direct commands: `uv run setup-dev`
- Best for end-user production deployments
```

### 3. Update Step 5.5 (GCP Setup Script)

**Current problematic instruction:**
```bash
# Navigate to the template root directory
cd ../../

# Make sure we have the correct environment variables
uv sync

# Run the development setup script (unified top-level approach)
uv run setup-dev
```

**Should become:**
```bash
# Option 1: Using ShipKit CLI (from repo root)
npm run rag-saas:setup-dev

# Option 2: Direct command (if dependencies installed)
cd templates/rag-saas
uv run setup-dev
```

### 4. Update Quick Reference Section (Section 12)

**Replace the entire "Quick Reference: Unified Commands" section with:**

```markdown
## 🚀 Quick Reference: ShipKit CLI Commands

### Development Environment (From ShipKit Repo)
```bash
# All commands run from ShipKit repository root
cd /path/to/shipkit-repo

# 1. Set up development infrastructure (one-time)
npm run rag-saas:setup-dev

# 2. Deploy RAG processor service (includes model setup)
npm run rag-saas:deploy-processor

# 3. Deploy queue handler function
npm run rag-saas:deploy-queue
```

### Production Environment (Global Package)
```bash
# Install ShipKit CLI globally
npm install -g shipkit-ai

# Create new project
shipkit-ai create rag-saas my-rag-app
cd my-rag-app

# Install Python dependencies
pip install uv python-dotenv structlog

# Set up and deploy
cd templates/rag-saas
uv run setup-dev
uv run deploy-rag-processor
uv run deploy-queue-handler
```

### Alternative: Direct Commands (Advanced Users)
```bash
# For users who prefer direct uv commands
cd templates/rag-saas
uv run setup-dev
uv run deploy-rag-processor
uv run deploy-queue-handler
```
```

### 5. Add Troubleshooting for Dependency Issues

Add a new troubleshooting section:

```markdown
### Common ShipKit CLI Issues

**Issue:** `uv: command not found` when using global package
**Solution:** Install Python dependencies first:
```bash
pip install uv python-dotenv structlog
```

**Issue:** `ModuleNotFoundError: No module named 'structlog'`
**Solution:** Ensure you're either:
1. Running from ShipKit repo (recommended), or
2. Have installed Python dependencies globally
```

## Implementation Instructions

1. **Read the current SETUP.md file completely**
2. **Identify all command examples that use direct `uv run` commands**
3. **Replace with appropriate ShipKit CLI commands**
4. **Add the new prerequisites section**
5. **Update the quick reference section**
6. **Add troubleshooting guidance**
7. **Ensure consistency with Brandon's CLI vision**

## Success Criteria

- [ ] All command examples use ShipKit CLI format (`npm run rag-saas:*`)
- [ ] Clear distinction between repo vs global package usage
- [ ] Prerequisites section explains dependency requirements
- [ ] Troubleshooting covers common CLI issues
- [ ] Commands are consistent across all sections
- [ ] Instructions work for both Brandon's demo and end users

## Priority

**CRITICAL** - This directly affects how Brandon demos ShipKit CLI and how users follow the setup instructions.
