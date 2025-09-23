# Supabase User Trigger Setup Template

> **Database Setup Template:** Guide for creating a Supabase trigger that automatically creates user records in your public.users table when new users sign up through Supabase Auth.

---

## Overview

This template helps you set up a database trigger that automatically creates a user record in your `public.users` table whenever a new user is created in Supabase's `auth.users` table. This ensures your application has access to user data without requiring additional API calls.

**What you'll accomplish:**
- ✅ Generate a custom Drizzle migration file
- ✅ Add the trigger function for handling new user creation
- ✅ Add the trigger that fires on auth.users INSERT
- ✅ Create a corresponding down migration for rollback safety
- ✅ Run the migration to apply changes to your database
- ✅ Test the trigger functionality

---

## Phase 1: Generate Custom Migration

### Step 1.1: Create Custom Migration File

1. **Run the custom migration generator**
   ```bash
   npm run db:generate:custom
   ```

2. **When prompted, provide a descriptive name:**
   ```
   Migration name: add_user_creation_trigger
   ```

3. **Locate the generated migration file**
   - Navigate to `drizzle/migrations/`
   - Find the newest file: `[timestamp]_add_user_creation_trigger.sql`
   - This file should be mostly empty with just comments

---

## Phase 2: Add Trigger Function and Trigger

### Step 2.1: Add the Trigger Function

**Open your generated migration file** and add the following SQL:

```sql
-- Migration: Add user creation trigger
-- Created: [timestamp]
-- Description: Automatically create user records when auth users are created

-- Create the trigger function that handles new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires when a new user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Phase 3: Create Down Migration for Rollback Safety

> **📖 Follow the Down Migration Template**
> 
> Use the **`ai_docs/templates/drizzle_down_migration.md`** template to create the rollback migration for this trigger setup.
> 
> **Quick Summary for this specific case:**
> 1. Create subdirectory: `mkdir -p drizzle/migrations/[timestamp_name]/`
> 2. Create `down.sql` file that reverses the trigger operations in reverse order:
>    - `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`
>    - `DROP FUNCTION IF EXISTS public.handle_new_user();`

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
✅ Trigger function created: handle_new_user()
✅ Trigger created: on_auth_user_created
```

---

## Phase 5: Understanding the Trigger

### How It Works

**Trigger Function (`handle_new_user()`):**
- Executes automatically when a new row is inserted into `auth.users`
- Extracts user data from the `auth.users` record
- Creates a corresponding record in `public.users`
- Uses `COALESCE` to handle missing name data gracefully

**Database Trigger (`on_auth_user_created`):**
- Listens for `INSERT` operations on `auth.users` table
- Fires `AFTER` the insert completes successfully
- Executes `FOR EACH ROW` (each new user signup)

### Data Mapping

The trigger maps data from `auth.users` to `public.users`:

```sql
auth.users.id                    → public.users.id
auth.users.email                 → public.users.email  
auth.users.raw_user_meta_data    → public.users.full_name
now()                            → public.users.created_at
now()                            → public.users.updated_at
```

**Name Extraction Logic:**
- First tries `raw_user_meta_data->>'full_name'`
- Falls back to `raw_user_meta_data->>'name'`
- Uses empty string `''` if neither exists

---

## Phase 6: Testing the Trigger

### Step 6.1: Test User Creation

1. **Create a test user** through your application's signup flow
2. **Check your database** to verify the trigger worked:
   ```sql
   SELECT id, email, full_name, created_at 
   FROM public.users 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

3. **Verify the user data** matches what was provided during signup

### Step 6.2: Common Issues and Solutions

**Issue: Migration fails with "function already exists"**
- **Solution:** The `CREATE OR REPLACE FUNCTION` should handle this
- **Alternative:** Drop the function first: `DROP FUNCTION IF EXISTS public.handle_new_user();`

**Issue: Trigger not firing**
- **Check:** Verify the trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
- **Solution:** Ensure you're testing with actual Supabase Auth signup, not direct database inserts

**Issue: User data not mapping correctly**
- **Check:** Inspect `auth.users.raw_user_meta_data` for your test users
- **Solution:** Adjust the `COALESCE` logic based on your signup form fields

---

## Phase 7: Rollback Plan

### Using the Down Migration

If you need to remove the trigger and function:

1. **Use the built-in rollback command:**
   ```bash
   npm run db:rollback
   ```

2. **Verify the rollback was successful:**
   ```bash
   npm run db:status
   ```

The down migration will automatically:
- Remove the `on_auth_user_created` trigger
- Remove the `handle_new_user()` function
- Leave your data intact

---

## Verification Checklist

- [ ] **Migration generated** - `npm run db:generate:custom` completed successfully
- [ ] **Trigger function added** - `handle_new_user()` function code added to migration
- [ ] **Database trigger added** - `on_auth_user_created` trigger code added to migration
- [ ] **Down migration created** - Following `drizzle_down_migration.md` template
- [ ] **Migration applied** - `npm run db:migrate` completed without errors
- [ ] **Rollback tested** - `npm run db:rollback` and re-migration tested successfully
- [ ] **Functionality tested** - New user signup creates record in `public.users`
- [ ] **Data mapping verified** - User data correctly extracted from `auth.users`

---

## Security Notes

**`SECURITY DEFINER`:**
- The function runs with the privileges of the user who created it
- This is necessary because the trigger needs to write to `public.users`
- Ensure your database user has appropriate permissions

**Data Privacy:**
- The trigger only extracts basic user information (id, email, name)
- Sensitive auth data remains in the `auth.users` table
- Consider what metadata you extract based on your privacy requirements

**Error Handling:**
- If the trigger function fails, the user signup will also fail
- Monitor your database logs for trigger-related errors
- Consider adding error handling if you customize the function

---

## Advanced: Integration with AI Templates

This template works seamlessly with other AI templates in your project:

### Drizzle Down Migration Generator
- Use `ai_docs/templates/drizzle_down_migration.md` for complex migrations
- The down migration format used here follows that template's standards
- Future migrations can be automatically analyzed for rollback safety

### Git Workflow Integration
- Use `ai_docs/templates/git_workflow_commit.md` to commit your changes
- Include both up and down migrations in your commits
- Document the trigger setup in your commit messages

---

## Next Steps

After setting up the trigger:

1. **Update your application code** to rely on `public.users` for user data
2. **Remove any manual user creation logic** from your signup flow
3. **Consider adding user profile update triggers** if needed
4. **Monitor database performance** with the new trigger in place
5. **Test thoroughly** in your staging environment before production deployment
6. **Document the trigger** in your project's database documentation

**Happy coding! 🚀** 
