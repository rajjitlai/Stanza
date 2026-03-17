# Supabase Setup Guide for Stanza

This guide will walk you through setting up Supabase for the Stanza application.

## Table of Contents

1. [Create Supabase Account](#create-supabase-account)
2. [Create a New Project](#create-a-new-project)
3. [Get API Keys](#get-api-keys)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Create Database Tables](#create-database-tables)
6. [Set Up Row Level Security](#set-up-row-level-security)
7. [Enable Authentication](#enable-authentication)
8. [Test the Setup](#test-the-setup)
9. [Troubleshooting](#troubleshooting)

---

## Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Choose your preferred sign-up method:
   - GitHub
   - Google
   - Email/Password
4. Verify your email if you chose email/password
5. You'll be redirected to the dashboard

---

## Create a New Project

1. In the Supabase dashboard, click **"New Project"**
2. Fill in the project details:
   - **Name**: `stanza` (or your preferred name)
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Start with the free plan

3. Click **"Create New Project"**
4. Wait for the project to be created (takes 1-2 minutes)

---

## Get API Keys

1. Once your project is created, click on it to enter the project dashboard
2. Click **"Settings"** (gear icon) in the left sidebar
3. Click **"API"** under the Settings menu
4. You'll see two important keys:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

5. Copy these values - you'll need them for your environment variables

**Note:** Keep your API keys secure. The Anon Key is safe to expose (it's used in frontend code), but never share your Service Role Key.

---

## Configure Environment Variables

1. In your Stanza project root directory, create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual project ID
- `your-anon-key-here` with the Anon Key from the API settings

2. Save the file and restart your development server:
```bash
npm run dev
```

---

## Create Database Tables

### Step 1: Open SQL Editor

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 2: Enable UUID Extension

Paste this query to enable UUID functions:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Click **"Run"** and wait for confirmation.

### Step 3: Create Profiles Table

Paste this query:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Click **"Run"** and confirm the table is created.

### Step 4: Create Poems Table

Paste this query:

```sql
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Click **"Run"** and confirm the table is created.

### Step 5: Create Indexes for Performance

Paste these queries (run each one):

```sql
-- Index for user poems
CREATE INDEX idx_poems_user_id ON poems(user_id);

-- Index for sorting by creation date
CREATE INDEX idx_poems_created_at ON poems(created_at DESC);

-- Index for searching by category
CREATE INDEX idx_poems_category ON poems(category);
```

---

## Set Up Row Level Security

Row Level Security (RLS) restricts data access based on user identity. This ensures users can only access/modify their own data.

### Step 1: Enable RLS on Tables

1. Click **"Table Editor"** in the left sidebar
2. Click on the `profiles` table
3. Click the **"RLS"** button (top right)
4. Click **"Enable RLS"** button that appears
5. Repeat steps 2-4 for the `poems` table

### Step 2: Create RLS Policies

#### For Profiles Table:

Click **"New Policy"** and select the following for each policy:

**Policy 1: Users can view their own profile**
```sql
-- TEMPLATE: Enable read access for users based on user_id
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

**Policy 2: Users can update their own profile**
```sql
-- TEMPLATE: Enable update for users based on user_id
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

**Policy 3: Users can insert their own profile**
```sql
-- TEMPLATE: Enable insert for authenticated users
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

#### For Poems Table:

**Policy 1: Anyone can view poems (SELECT)**
```sql
-- TEMPLATE: Allow select access
CREATE POLICY "Anyone can view poems"
  ON poems
  FOR SELECT
  USING (true);
```

**Policy 2: Users can insert their own poems**
```sql
-- TEMPLATE: Enable insert for authenticated users
CREATE POLICY "Users can insert their own poems"
  ON poems
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Policy 3: Users can update their own poems**
```sql
-- TEMPLATE: Enable update for users based on user_id
CREATE POLICY "Users can update their own poems"
  ON poems
  FOR UPDATE
  USING (auth.uid() = user_id);
```

**Policy 4: Users can delete their own poems**
```sql
-- TEMPLATE: Enable delete for users based on user_id
CREATE POLICY "Users can delete their own poems"
  ON poems
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Enable Authentication

### Step 1: Configure Auth Providers

1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"**
3. Make sure **"Email"** is enabled (it should be by default)

### Step 2: Email Configuration

1. Still in **Authentication**, click **"Email Templates"**
2. Review the default email templates for:
   - Confirmation email
   - Recovery email
   - Magic Link email
3. You can customize these if desired

### Step 3: URL Configuration

1. Go to **"Settings"** → **"Auth"** → **"Settings"**
2. Scroll to **"Redirect URLs"**
3. Add your redirect URLs:
   - Development: `http://localhost:5173/auth-redirect`
   - Production: `https://youromain.com/auth-redirect`

4. Click **"Save"**

---

## Test the Setup

### Method 1: Using Supabase Dashboard

1. Go to **"Authentication"** → **"Users"**
2. Click **"Create New User"**
3. Enter an email and password
4. Click **"Create User"**
5. Go back to the users list - your new user should appear

### Method 2: Using Your Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. Click **"Sign Up"** and create a new account

4. After signup, you should be redirected to the login page

5. Try logging in with your new credentials

6. Once logged in, navigate to the editor and create a poem

### Method 3: Verify Database Data

1. Go to **"Table Editor"** in Supabase
2. Click on the `profiles` table
3. You should see your user profile
4. Click on the `poems` table
5. You should see your test poem if you created one

---

## Troubleshooting

### "Invalid API credentials" Error

**Problem:** Getting authentication errors when trying to sign up/login

**Solutions:**
1. Check that your `.env.local` file has the correct keys
2. Verify you're using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Make sure Auth is enabled in your Supabase project
4. Restart your development server after adding/changing env variables

### "Permission denied" Error

**Problem:** Can't insert or update data in the database

**Solutions:**
1. Make sure RLS policies are set up correctly
2. Verify the user is authenticated before attempting database operations
3. Check that the `user_id` matches the authenticated user's ID
4. Review RLS policies in the Supabase dashboard

### Tables Not Showing in Table Editor

**Problem:** Created tables don't appear in the UI

**Solutions:**
1. Refresh the page
2. Check the SQL Editor to confirm tables were created
3. Use this query to verify:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### Sign Up Not Working

**Problem:** Sign up fails or doesn't create a user

**Solutions:**
1. Check that Email authentication is enabled
2. Verify the password meets requirements (usually 6+ characters)
3. Check the email format is valid
4. Look at the error message in the browser console
5. Check Supabase logs: **"Database"** → **"Logs"**

### Can't Connect from Development Server

**Problem:** Can't connect to Supabase from localhost

**Solutions:**
1. Verify your API URL is correct (should start with https://)
2. Check that CORS is not blocking requests (usually not an issue with Supabase)
3. Make sure your development server is running on localhost:5173
4. Check browser console for specific error messages

### Poems Not Visible After Creating

**Problem:** Created a poem but it doesn't show on the feed

**Solutions:**
1. Refresh the page
2. Check the Table Editor to see if the poem exists in the database
3. Verify the `user_id` in the poem matches your user ID
4. Check RLS policies - make sure SELECT is allowed
5. Look for JavaScript errors in the browser console

### Database Connection Issues

**Problem:** Can't access database tables

**Solutions:**
1. Verify internet connection
2. Check that Supabase project is active (not paused)
3. Verify API keys are correct
4. Try accessing Supabase dashboard directly
5. Check project status page: [supabase.com/status](https://supabase.com/status)

---

## Next Steps

After setting up Supabase:

1. **Test the application thoroughly** - Create accounts, write poems, delete poems
2. **Set up backup** - Enable database backups in project settings
3. **Monitor usage** - Check your free tier limits regularly
4. **Configure production** - Set up a separate Supabase project for production
5. **Enable additional features** - Consider adding:
   - Comments system
   - Like/vote system
   - Search functionality
   - User profiles with avatars

---

## Useful Supabase Links

- [Supabase Official Docs](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Fundamentals](https://supabase.com/docs/guides/database)
- [Supabase Status](https://supabase.com/status)

---

## Free Tier Limits

Be aware of Supabase free tier limitations:

- **Database**: 500 MB storage
- **Auth**: Up to 50 MB for auth users per month
- **Bandwidth**: 2 GB/month
- **File Storage**: 1 GB
- **Realtime**: Limited concurrent connections

For more information, see [Supabase Pricing](https://supabase.com/pricing)

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Visit [Supabase Docs](https://supabase.com/docs)
3. Ask on [Supabase Discord](https://discord.supabase.com)
4. Check [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Last Updated:** March 8, 2026

Happy coding! 🎉
