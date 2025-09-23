# Supabase Storage Setup Template

> **Storage Setup Template:** Guide for creating a Supabase Storage bucket with automated setup and Row Level Security policies for secure file uploads in chat applications.

---

## Overview

This template helps you set up a complete Supabase Storage solution for chat image uploads with automated bucket creation and Row Level Security (RLS) policies. The setup ensures users can only access their own uploaded files while maintaining organized folder structures.

**What you'll accomplish:**
- ✅ Create automated storage bucket setup script
- ✅ Generate custom Drizzle migration for RLS policies
- ✅ Apply folder-based access control policies
- ✅ Create corresponding down migration for rollback safety
- ✅ Test the complete storage functionality
- ✅ Verify security and access controls

---

## Phase 1: Create Automated Storage Setup

### Step 1.1: Create Storage Setup Script

1. **Create the automated setup script**
   ```bash
   # File: scripts/setup-storage.ts
   ```

2. **Add the script content:**
   ```typescript
   import { createSupabaseServerAdminClient } from "@/lib/supabase/admin";

   async function setupChatImageStorage() {
     console.log("🚀 Setting up chat image storage...");
     
     const supabase = createSupabaseServerAdminClient();

     try {
       // Check if bucket already exists
       const { data: existingBuckets } = await supabase.storage.listBuckets();
       const bucketExists = existingBuckets?.some(
         (bucket) => bucket.id === "chat-images"
       );

       if (bucketExists) {
         console.log("✅ Storage bucket 'chat-images' already exists");
       } else {
         // Create the storage bucket
         const { error: bucketError } = await supabase.storage.createBucket(
           "chat-images",
           {
             public: true, // Public read access for images
             allowedMimeTypes: ["image/jpeg", "image/png"],
             fileSizeLimit: 10485760, // 10MB in bytes
           }
         );

         if (bucketError) {
           console.error("❌ Error creating storage bucket:", bucketError);
           throw bucketError;
         }

         console.log("✅ Storage bucket 'chat-images' created successfully");
       }

       // RLS policies will be handled via database migration
       console.log("🔒 Note: RLS policies need to be created via database migration");
       console.log("📋 Run the following command to create storage policies:");
       console.log("   npm run db:migrate");
       console.log("");
       console.log("💡 The storage policies will be created in the next migration file.");

       console.log("🎉 Chat image storage setup complete!");
       console.log("📁 Bucket: chat-images");
       console.log("🔒 RLS policies: Upload, View, Delete (user-scoped)");
       console.log("📏 File limits: 10MB max, JPEG/PNG only");
     } catch (error) {
       console.error("💥 Setup failed:", error);
       process.exit(1);
     }
   }

   // Run the setup
   setupChatImageStorage().then(() => {
     console.log("✨ Setup completed successfully!");
     process.exit(0);
   });
   ```

### Step 1.2: Add Script to Package.json

3. **Add the npm script:**
   ```json
   {
     "scripts": {
       "storage:setup": "npx dotenv-cli -e .env.local -- tsx scripts/setup-storage.ts"
     }
   }
   ```

4. **Run the setup script:**
   ```bash
   npm run storage:setup
   ```

---

## Phase 2: Generate Custom Migration for RLS Policies

### Step 2.1: Create Custom Migration File

1. **Run the custom migration generator**
   ```bash
   npm run db:generate:custom
   ```

2. **When prompted, provide a descriptive name:**
   ```
   Migration name: add_storage_rls_policies
   ```

3. **Locate the generated migration file**
   - Navigate to `drizzle/migrations/`
   - Find the newest file: `[timestamp]_add_storage_rls_policies.sql`
   - This file should be mostly empty with just comments

### Step 2.2: Add Storage RLS Policies

**Open your generated migration file** and add the following SQL:

```sql
-- Custom migration: Create RLS policies for chat-images storage bucket
-- This migration sets up Row Level Security policies for the chat-images bucket
-- to ensure users can only access their own uploaded images

-- Policy 1: Users can upload to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload own images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view their own images
CREATE POLICY IF NOT EXISTS "Users can view own images" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can delete their own images (for cleanup)
CREATE POLICY IF NOT EXISTS "Users can delete own images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'chat-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Phase 3: Create Down Migration for Rollback Safety

> **📖 Follow the Down Migration Template**
> 
> Use the **`ai_docs/templates/drizzle_down_migration.md`** template to create the rollback migration for this storage setup.
> 
> **Quick Summary for this specific case:**
> 1. Create subdirectory: `mkdir -p drizzle/migrations/[timestamp_name]/`
> 2. Create `down.sql` file that reverses the policy operations in reverse order:
>    ```sql
>    -- Drop policies in reverse order
>    DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
>    DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
>    DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
>    ```

### Step 3.1: Create Down Migration Directory

```bash
mkdir -p drizzle/migrations/[timestamp_name]/
```

### Step 3.2: Create Down Migration File

Create `drizzle/migrations/[timestamp_name]/down.sql`:

```sql
-- Down migration for: [timestamp_name]
-- Generated: [current_date]
-- 
-- This file reverses the changes made in [timestamp_name].sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Dropping these policies will remove access control for chat-images bucket
-- - Only run this rollback if you're certain you want to remove image security policies
-- - Consider the security implications before running this in production

-- ==========================================
-- REVERSE RLS POLICY OPERATIONS
-- ==========================================

-- Reverse: CREATE POLICY "Users can delete own images"
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Reverse: CREATE POLICY "Users can view own images"  
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;

-- Reverse: CREATE POLICY "Users can upload own images"
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
```

---

## Phase 4: Apply the Migration

### Step 4.1: Run the Migration

1. **Apply the migration to your database:**
   ```bash
   npm run db:migrate
   ```

2. **Verify the migration was successful:**
   ```bash
   npm run db:status
   ```

**Expected output:**
```
✅ Migration applied successfully
✅ All migrations have rollback files
✅ Storage policies created: Users can upload own images
✅ Storage policies created: Users can view own images
✅ Storage policies created: Users can delete own images
```

---

## Phase 5: Understanding the Storage Setup

### Bucket Configuration

**Storage Bucket (`chat-images`):**
- **Public**: `true` - Allows direct URL access to images
- **File Size Limit**: 10MB maximum per file
- **Allowed MIME Types**: `image/jpeg`, `image/png` only
- **Folder Structure**: `/images/{userId}/{conversationId}/{messageId}_{index}.{ext}`

### RLS Policy Structure

**Policy 1: Upload Permission (`INSERT`)**
- Allows authenticated users to upload files
- Restricts uploads to their own user folder
- Uses `storage.foldername(name)[1]` to extract user ID from path

**Policy 2: Read Permission (`SELECT`)**
- Allows authenticated users to read/download files
- Users can only access files in their own folder
- Enables direct URL access for owned images

**Policy 3: Delete Permission (`DELETE`)**
- Allows authenticated users to delete files
- Users can only delete files in their own folder
- Enables cleanup of conversation attachments

### Folder Structure Security

The policies enforce this folder structure:
```
/images/
  ├── {user-id-1}/
  │   ├── {conversation-id-1}/
  │   │   ├── {message-id}_1.jpg
  │   │   └── {message-id}_2.png
  │   └── {conversation-id-2}/
  └── {user-id-2}/
      └── {conversation-id-3}/
```

**Security Benefits:**
- Users cannot access other users' folders
- Organized by conversation for easy cleanup
- File names include message ID for traceability

---

## Phase 6: Testing the Storage Setup

### Step 6.1: Test Bucket Creation

1. **Verify bucket exists** in Supabase Dashboard:
   - Go to Storage → Buckets
   - Confirm `chat-images` bucket is listed
   - Check configuration: Public, 10MB limit, JPEG/PNG only

### Step 6.2: Test RLS Policies

1. **Test upload permissions** with authenticated user:
   ```javascript
   // Should succeed - uploading to own folder
   const { data, error } = await supabase.storage
     .from('chat-images')
     .upload(`images/${userId}/conversation-123/message-456_1.jpg`, file);
   ```

2. **Test access restrictions**:
   ```javascript
   // Should fail - uploading to another user's folder
   const { data, error } = await supabase.storage
     .from('chat-images')
     .upload(`images/${otherUserId}/conversation-123/message-456_1.jpg`, file);
   ```

### Step 6.3: Common Issues and Solutions

**Issue: Bucket creation fails with "already exists"**
- **Solution:** The script checks for existing buckets and skips creation
- **Verification:** Check console output for "bucket already exists" message

**Issue: Upload fails with "RLS policy violation"**
- **Check:** Verify user is authenticated: `const { data: { user } } = await supabase.auth.getUser()`
- **Check:** Verify folder structure: `/images/{userId}/...`
- **Solution:** Ensure file path starts with user's ID

**Issue: File access returns "permission denied"**
- **Check:** Verify RLS policies are applied: Check Supabase Dashboard → Authentication → Policies
- **Solution:** Confirm policies target `storage.objects` table correctly

---

## Phase 7: Rollback Plan

### Using the Down Migration

If you need to remove the RLS policies:

1. **Use the built-in rollback command:**
   ```bash
   npm run db:rollback
   ```

2. **Verify the rollback was successful:**
   ```bash
   npm run db:status
   ```

**Note:** The rollback will remove RLS policies but keep the storage bucket and uploaded files intact.

### Manual Bucket Cleanup

If you need to remove the bucket entirely:

1. **Empty the bucket** (via Supabase Dashboard or script)
2. **Delete the bucket** (via Supabase Dashboard)
3. **Remove the setup script** if no longer needed

---

## Verification Checklist

- [ ] **Setup script created** - `scripts/setup-storage.ts` with bucket creation logic
- [ ] **NPM script added** - `storage:setup` command available in package.json
- [ ] **Bucket created** - `chat-images` bucket exists with correct configuration
- [ ] **Migration generated** - Custom migration for RLS policies created
- [ ] **RLS policies added** - Upload, view, and delete policies added to migration
- [ ] **Down migration created** - Following `drizzle_down_migration.md` template
- [ ] **Migration applied** - `npm run db:migrate` completed without errors
- [ ] **Policies verified** - RLS policies visible in Supabase Dashboard
- [ ] **Upload tested** - File upload to user folder succeeds
- [ ] **Access tested** - File access restricted to owner only
- [ ] **Rollback tested** - Down migration successfully removes policies

---

## Security Notes

**Folder-Based Access Control:**
- Policies use `storage.foldername(name)[1]` to extract user ID
- First folder in path must match authenticated user's ID
- Prevents cross-user file access at the database level

**File Type Restrictions:**
- Bucket configured to only accept `image/jpeg` and `image/png`
- Client-side validation should match these restrictions
- Additional validation recommended in upload handlers

**File Size Limits:**
- 10MB maximum per file enforced at bucket level
- Consider client-side validation for better UX
- Monitor storage usage to prevent quota issues

**Public vs Private Access:**
- Bucket is public for direct URL access to images
- RLS policies control which files users can access
- URLs are predictable but require authentication to access

---

## Advanced: Integration with AI Templates

This template works seamlessly with other AI templates in your project:

### Drizzle Down Migration Generator
- Use `ai_docs/templates/drizzle_down_migration.md` for complex migrations
- The down migration format used here follows that template's standards
- Future storage migrations can be automatically analyzed for rollback safety

### Task Template Workflow
- Use `ai_docs/templates/task_template.md` for implementing storage features
- Storage setup is typically Phase 1 of multimodal chat implementations
- Document storage architecture in task planning phase

---

## Next Steps

After setting up storage:

1. **Implement client-side upload logic** using the configured bucket
2. **Add image upload components** to your chat interface
3. **Integrate with AI models** that support image inputs
4. **Add image display components** for chat message rendering
5. **Monitor storage usage** and implement cleanup strategies
6. **Test thoroughly** in staging environment before production
7. **Document storage patterns** for your development team

**Storage is ready! Time to build your multimodal chat features! 🚀** 
