-- Rollback migration for RPC functions

-- Drop the multimodal vector search function
DROP FUNCTION IF EXISTS match_multimodal_chunks(vector, uuid, float, int);

-- Drop the text vector search function
DROP FUNCTION IF EXISTS match_text_chunks(vector, uuid, float, int);
