-- Rollback migration for conversations updated_at column

-- Remove the updated_at column from conversations table
ALTER TABLE conversations
DROP COLUMN IF EXISTS updated_at;
