-- Custom SQL migration file, put your code below! --

-- Add missing updated_at column to conversations table
-- This column was in the original schema but wasn't created during initial migration
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now() NOT NULL;
