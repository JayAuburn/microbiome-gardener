-- Rollback migration for document timeout cleanup

-- Down migration: Remove document timeout cleanup job
SELECT cron.unschedule('cleanup-stuck-documents');
