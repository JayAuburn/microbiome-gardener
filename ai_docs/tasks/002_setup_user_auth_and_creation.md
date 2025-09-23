# AI Task: Setup Automatic User Profile Creation

> **Instructions:** This task guides you through setting up an automatic user profile creation system. First, you will run local database migrations to create the necessary table structure. Then, you will apply a database trigger directly in the Supabase dashboard to link new user sign-ups to your profile table.

---

## 1. Task Overview

### Task Title
**Title:** Implement Automatic User Profile Creation with a Supabase Trigger

### Goal Statement
**Goal:** To ensure that every time a user signs up via Supabase Auth, a corresponding record is automatically created in our `public.users` table. This process establishes a reliable link between Supabase's authentication system and our application's user data, without requiring manual client-side code for every sign-up.

---

## 2. Problem & Solution

### The Problem
When a user signs up, Supabase creates a record in the protected `auth.users` table. Our application needs its own `public.users` table to store extra profile information, but there's no built-in link between the two. We need an automated way to create a `public.users` record for every new sign-up.

### The Solution
We will use a two-step approach:
1.  **Drizzle ORM Migration:** We will run a local migration command that uses our Drizzle schema (`/lib/drizzle/schema/users.ts`) to create the `public.users` table in our database.
2.  **PostgreSQL Trigger:** We will manually run a SQL script in the Supabase dashboard. This script creates a trigger that "listens" for new rows in `auth.users` and automatically runs a function to copy the user's `id` and `email` into our `public.users` table.

---

## 3. Implementation Plan

### Phase 1: Create the `users` Table via Local Migration
**Goal:** To create the `public.users` table structure in your Supabase database.

- [ ] **Task 1.1: Run the Drizzle Migration**
  - **Action:** Open your terminal and run the following command. This command reads your schema files in `lib/drizzle/schema/` and executes any pending migrations to create the necessary tables.
  - **Command:**
    ```bash
    npm run db:migrate
    ```
  - **Expected Outcome:** The command completes successfully, and a `users` table now exists in the `public` schema of your Supabase database. You can verify this in the Supabase Table Editor.

### Phase 2: Create the Auth Trigger in the Supabase Dashboard
**Goal:** To create the PostgreSQL function and trigger that will automatically populate the `users` table on new sign-ups.

> **Why is this step manual?**
> Creating a trigger on the `auth.users` table requires special ownership permissions. The migration command you ran locally connects as the `postgres` user, which, for security reasons, is not allowed to modify the `auth` schema. When you use the SQL Editor in the Supabase dashboard, you are acting as a privileged `supabase_admin`, which *does* have the required permissions.

- [ ] **Task 2.1: Apply the SQL Script**
  - **Action:** Follow these steps precisely.
    1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
    2.  Click **"+ New query"**.
    3.  Copy the entire SQL code block below and paste it into the query window.
    4.  Click the **"RUN"** button.

  - **SQL Script to Run:**
    ```sql
    create or replace function public.handle_new_user() 
    returns trigger 
    language plpgsql 
    security definer
    as $$
    begin
      insert into public.users (id, email)
      values (new.id, new.email);
      return new;
    end;
    $$;

    create trigger on_auth_user_created
      after insert on auth.users for each row
      execute function public.handle_new_user();
    ```
  - **Expected Outcome:** You will see a "Success. No rows returned" message. The trigger is now active.

---

## 4. Success Criteria & Verification

- [ ] The `npm run db:migrate` command completes without errors.
- [ ] The SQL script runs successfully in the Supabase SQL Editor.
- [ ] **Verification:**
    1. Go to your application and sign up as a brand new user.
    2. Navigate to the **Table Editor** in your Supabase dashboard and view the `public.users` table.
    3. **Confirm** that a new row exists for the user you just created, with their correct `id` and `email`. 
