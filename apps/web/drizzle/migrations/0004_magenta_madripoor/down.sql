-- Rollback migration for storage RLS policies

-- Drop the delete policy
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Drop the view policy
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;

-- Drop the upload policy
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
