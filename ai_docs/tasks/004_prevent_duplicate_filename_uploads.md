# Task: Prevent Duplicate Filename Uploads with Frontend Validation

## Context
Currently, users can upload multiple files with identical `original_filename` values, which creates confusion when they see multiple files with the same name in their document list. While the backend handles this with timestamp-based GCS paths to ensure storage uniqueness, the frontend should prevent this upfront to improve user experience.

## Problem Statement
Users can upload files with duplicate filenames, leading to:
- Confusion in the document list with multiple identically-named files
- Poor user experience when trying to identify specific documents  
- Wasted processing resources for duplicate content
- Unclear document management workflow

## Solution Overview
Implement frontend validation that checks for existing filenames before upload starts, using a server action to query the `original_filename` field in the documents table.

## Technical Requirements

### 1. Create Server Action for Filename Validation
**File**: `app/actions/documents.ts`

**Function**: `checkFilenameExists(filename: string)`
- Query documents table for matching `original_filename`
- Return validation result with conflict details
- Handle authentication and user scoping
- Follow existing server action patterns

### 2. Integrate Frontend Validation
**Files**: Upload components (need to identify specific files)

**Integration Points**:
- File selection handler
- Drag & drop validation  
- Bulk upload validation
- Show user-friendly conflict messages

### 3. User Experience Enhancements
**Conflict Resolution Options**:
- Show existing file details (upload date, size)
- Allow user to rename new file
- Option to replace existing file (if desired)
- Clear conflict resolution UI

## Implementation Steps

### Step 1: Create Document Server Action
```typescript
// app/actions/documents.ts
"use server";

export async function checkFilenameExists(filename: string) {
  // Auth validation
  // Query documents table for original_filename match
  // Return conflict details if found
}
```

### Step 2: Identify Upload Components
- Research current upload flow components
- Find file selection and validation logic
- Determine integration points for validation

### Step 3: Implement Frontend Validation
- Add filename checking before upload starts
- Show conflict detection UI
- Provide resolution options

### Step 4: Add Conflict Resolution UI
- Design user-friendly conflict messages
- Add rename/replace options
- Handle bulk upload conflicts

### Step 5: Testing & Edge Cases
- Test with various file types
- Validate bulk upload scenarios
- Ensure proper error handling

## Database Schema Reference
```sql
-- documents table relevant fields:
filename VARCHAR(255) NOT NULL,           -- Processed filename (GCS path last part)
original_filename VARCHAR(255) NOT NULL, -- User's original filename (CHECK THIS FIELD)
gcs_path VARCHAR(500) NOT NULL,          -- Full GCS path
user_id UUID NOT NULL,                   -- User scoping
```

## Validation Logic
```sql
-- Query to check for duplicates:
SELECT id, original_filename, created_at, file_size 
FROM documents 
WHERE user_id = $1 AND original_filename = $2
LIMIT 1;
```

## Success Criteria
- [ ] Users cannot upload files with duplicate filenames without explicit confirmation
- [ ] Clear conflict detection before upload processing begins
- [ ] User-friendly resolution options (rename/replace)
- [ ] Maintains existing upload performance
- [ ] Proper error handling and user feedback
- [ ] Works for both single and bulk uploads

## Technical Considerations
- **Performance**: Filename queries should be fast (indexed on user_id)
- **UX**: Validation should happen immediately on file selection
- **Scope**: Validation scoped to user's documents only
- **Case Sensitivity**: Consider filename case sensitivity requirements
- **File Extensions**: Handle files with/without extensions consistently

## Files to Modify
1. `app/actions/documents.ts` (NEW) - Server action for validation
2. Upload components (TBD) - Integration points  
3. UI components (TBD) - Conflict resolution interface

## Dependencies
- Existing documents schema and database setup
- Current upload flow components
- Authentication system (user scoping)
- UI component library for conflict dialogs

## Testing Strategy
- Unit tests for server action validation logic
- Integration tests for upload flow validation
- E2E tests for conflict resolution scenarios
- Performance testing for filename queries

---
**Priority**: High
**Estimated Effort**: Medium
**User Impact**: High (prevents confusion, improves UX) 
