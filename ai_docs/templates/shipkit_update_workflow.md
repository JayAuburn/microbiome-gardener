# ShipKit Update Workflow Template

> **Template Purpose:** Guide AI agents through the complete process of checking for ShipKit template updates, analyzing changes, creating a detailed task plan for user review, and implementing approved updates safely.

---

## Overview

This template helps you systematically update a ShipKit-generated project to the latest template version. The process ensures changes are analyzed, documented, and approved before implementation to prevent breaking existing customizations.

**What you'll accomplish:**
- ✅ Check for available template updates using the ShipKit CLI
- ✅ Analyze the scope and impact of available changes
- ✅ Create a comprehensive task document for user review
- ✅ Get user approval before making any changes
- ✅ Implement approved updates safely with rollback capability
- ✅ Verify the updates work correctly

---

## Phase 1: Check for Updates

### Step 1.1: Run Update Check Command

**Execute the ShipKit update check:**
```bash
npx create-shipkit-app check-updates
```

**Expected Output Analysis:**
- Current project template name and version
- Latest available version
- Number of commits and files changed
- AI-friendly update prompt with diff information

### Step 1.2: Capture and Analyze Output

**Record the following information:**
- [ ] **Current Version:** `[template-name] v[current-version]`
- [ ] **Latest Version:** `v[latest-version]`
- [ ] **Files Changed:** `[number]` files
- [ ] **Commits:** `[number]` commits affecting your template
- [ ] **GitHub Compare URL:** For manual review if needed

**If no updates available:**
- Log: "✅ Project is up to date - no action needed"
- End workflow here

**If updates available:**
- Continue to Phase 2 for analysis

---

## Phase 2: Analyze Update Impact

### Step 2.1: Review the Generated Diff

**Examine the AI update prompt output for:**

1. **Commit Messages** - Understand what changes were made:
   ```
   - feat(auth): add password reset functionality
   - fix(chat): resolve mobile layout issues
   - update(deps): upgrade to Next.js 15.1
   ```

2. **Changed Files List** - Identify scope of changes:
   ```
   app/auth/reset-password/page.tsx
   components/auth/ResetPasswordForm.tsx
   package.json
   components/chat/ChatInterface.tsx
   ```

3. **Diff Content** - Analyze the actual code changes:
   - Look for breaking changes
   - Identify new dependencies
   - Check for configuration changes
   - Note any new environment variables

### Step 2.2: Categorize Changes

**Classify changes by type and risk level:**

**Low Risk Changes:**
- [ ] Documentation updates
- [ ] Comment additions
- [ ] Non-breaking styling improvements
- [ ] New optional features

**Medium Risk Changes:**
- [ ] Dependency updates (minor/patch versions)
- [ ] Component refactoring (same APIs)
- [ ] New configuration options
- [ ] Database schema additions (non-breaking)

**High Risk Changes:**
- [ ] Breaking API changes
- [ ] Major dependency updates
- [ ] Database schema modifications
- [ ] Authentication/security changes
- [ ] Build system changes

### Step 2.3: Identify Potential Conflicts

**Check for customization conflicts:**
- [ ] Files that may have been customized by the user
- [ ] Configuration that might conflict with user settings
- [ ] Database changes that could affect existing data
- [ ] Dependencies that might conflict with user additions

---

## Phase 3: Create Task Document for User Review

### Step 3.1: Generate Comprehensive Task Document

**Using the task_template.md structure, create a detailed task document:**

```markdown
# ShipKit Update Task: [template-name] v[current] → v[latest]

## 1. Task Overview

### Task Title
**Title:** Update [template-name] from v[current-version] to v[latest-version]

### Goal Statement
**Goal:** Safely apply [number] commits and [number] file changes from the latest ShipKit template while preserving existing customizations and ensuring functionality remains intact.

## 2. Project Analysis & Current State

### Current Template Information
- **Template:** [template-name] (e.g., chat-simple, chat-saas)
- **Current Version:** v[current-version]
- **Target Version:** v[latest-version]
- **Generated:** [date from shipkit.json]

### Technology & Architecture
[Analyze current project structure and note key technologies]

### Current State
[Document existing customizations and potential conflicts]

## 3. Update Analysis

### Changes Summary
**Commits affecting your template:**
[List commit messages from the check-updates output]

**Files to be modified:**
[List all files from the diff with change type - added/modified/deleted]

### Impact Assessment
[Categorize changes by risk level and potential conflicts]

## 4. Implementation Plan

### Phase 1: Backup and Preparation
- [ ] Create git branch for update: `git checkout -b update-[template-name]-v[version]`
- [ ] Verify current code is committed and working
- [ ] Document current configuration (env vars, custom modifications)

### Phase 2: Apply Low Risk Changes
[List specific low-risk changes to apply first]

### Phase 3: Apply Medium Risk Changes  
[List medium-risk changes with testing steps]

### Phase 4: Apply High Risk Changes (if any)
[List high-risk changes with detailed migration steps]

### Phase 5: Testing and Verification
- [ ] Run build process: `npm run build`
- [ ] Test key functionality: [specific tests based on changes]
- [ ] Verify database migrations if applicable
- [ ] Test in development environment

## 5. Rollback Plan
- [ ] Git branch allows easy rollback: `git checkout main`
- [ ] Database rollback steps if schema changes made
- [ ] Configuration restoration if needed

## 6. Files to Modify
[Detailed list of every file that will be changed with specific modifications]

## 7. Success Criteria
- [ ] All updates applied successfully
- [ ] Build process completes without errors
- [ ] Key functionality works as expected
- [ ] No breaking changes to user customizations
- [ ] Tests pass (if applicable)
```

### Step 3.2: Present Task for User Review

**Display the complete task document to the user with:**
- Clear summary of what will change
- Risk assessment
- Detailed implementation plan
- Rollback options

**Ask for explicit approval:**
```
🔍 UPDATE ANALYSIS COMPLETE

I've analyzed the available updates and created a detailed implementation plan.

SUMMARY:
- Template: [name] v[current] → v[latest]  
- Files Changed: [number]
- Risk Level: [Low/Medium/High]
- Estimated Time: [time estimate]

Please review the task document above and confirm:
1. ✅ Approve and implement all changes
2. 🔄 Approve but modify the plan first  
3. ❌ Cancel - don't apply updates

Which option would you like to proceed with?
```

---

## Phase 4: Implement Approved Updates

### Step 4.1: Create Update Branch

**Only proceed after user approval:**
```bash
git checkout -b update-[template-name]-v[version]
git add .
git commit -m "checkpoint: before applying ShipKit updates"
```

### Step 4.2: Apply Changes Systematically

**Follow the approved task plan phases:**

1. **Apply file changes** according to the diff
2. **Update package.json** if dependencies changed
3. **Run install** if new dependencies added
4. **Apply database migrations** if schema changed
5. **Update configuration** files as needed

### Step 4.3: Handle Conflicts Intelligently

**When encountering conflicts:**
- [ ] **Preserve user customizations** over template defaults
- [ ] **Log all conflict resolutions** for user review
- [ ] **Ask for guidance** on ambiguous conflicts
- [ ] **Document manual merges** needed

### Step 4.4: Test Implementation

**Verification steps:**
```bash
# Build verification
npm run build

# Development server test
npm run dev

# Database verification (if applicable)
npm run db:status
```

---

## Phase 5: Post-Update Verification

### Step 5.1: Functionality Testing

**Test key features based on what changed:**
- [ ] Authentication flows (if auth changes)
- [ ] Database operations (if schema changes)
- [ ] UI components (if component changes)
- [ ] API endpoints (if backend changes)
- [ ] Build and deployment (if config changes)

### Step 5.2: Performance Check

**Verify no performance regressions:**
- [ ] Page load times remain acceptable
- [ ] Bundle size hasn't increased dramatically
- [ ] Database queries perform well

### Step 5.3: Update Template Metadata

**Update the shipkit.json file:**
```json
{
  "templateName": "[template-name]",
  "version": "[new-version]",
  "generatedAt": "[original-date]",
  "updatedAt": "[current-timestamp]",
  "generatedBy": "create-shipkit-app",
  "updatedBy": "shipkit-update-workflow"
}
```

---

## Phase 6: Finalize and Commit

### Step 6.1: Create Update Commit

**Use the git workflow template pattern:**
```bash
git add .
git commit -m "feat: update [template-name] from v[old] to v[new]

- Apply [number] commits of template updates
- Modified [number] files
- [Key changes summary]

Resolves: ShipKit template update
Breaking: [Yes/No - if breaking changes]
Co-authored-by: ShipKit Update Workflow"
```

### Step 6.2: Merge or Keep Branch

**Options for user:**
1. **Merge immediately:** `git checkout main && git merge update-branch`
2. **Keep branch for testing:** Continue testing on branch
3. **Create PR:** If using team workflow with reviews

---

## Error Handling and Troubleshooting

### Common Issues and Solutions

**Issue: Merge conflicts in customized files**
- **Solution:** Analyze each conflict, preserve user customizations
- **Documentation:** Log all manual conflict resolutions

**Issue: Dependency conflicts**
- **Solution:** Update package-lock.json, test compatibility
- **Alternative:** Pin conflicting dependencies if needed

**Issue: Breaking changes in template**
- **Solution:** Create migration guide for user customizations
- **Documentation:** Document breaking changes and required manual fixes

**Issue: Database migration failures**
- **Solution:** Rollback database, investigate schema conflicts
- **Recovery:** Provide manual migration steps

### Rollback Procedure

**If updates fail or cause issues:**
```bash
# Rollback to previous working state
git checkout main
git branch -D update-[template-name]-v[version]

# Database rollback if needed
npm run db:rollback  # if available

# Restore environment configuration
# [Manual steps based on what was changed]
```

---

## Advanced: Integration with Other Templates

### Git Workflow Integration
- Use `ai_docs/templates/git_workflow_commit.md` for commit formatting
- Follow established branch naming conventions
- Include appropriate commit metadata

### Database Migration Integration  
- Use `ai_docs/templates/drizzle_down_migration.md` if schema changes
- Ensure all database changes have rollback paths
- Test migrations on copy of production data

---

## Success Checklist

- [ ] **Updates checked** - `npx create-shipkit-app check-updates` executed
- [ ] **Changes analyzed** - Diff reviewed and categorized by risk
- [ ] **Task document created** - Comprehensive implementation plan generated
- [ ] **User approval obtained** - Plan reviewed and approved by user
- [ ] **Branch created** - Update work isolated in feature branch
- [ ] **Changes applied** - All approved updates implemented systematically
- [ ] **Conflicts resolved** - User customizations preserved
- [ ] **Testing completed** - Key functionality verified working
- [ ] **Metadata updated** - shipkit.json reflects new version
- [ ] **Changes committed** - Updates documented in git history
- [ ] **Rollback tested** - Confirmed ability to revert if needed

---

## Next Steps After Successful Update

1. **Monitor for issues** in the updated codebase
2. **Update documentation** to reflect any new features
3. **Test thoroughly** in staging before production deployment
4. **Schedule regular updates** to stay current with template improvements
5. **Share feedback** with ShipKit team about the update process

**Happy updating! 🚀** 
