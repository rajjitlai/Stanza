# Project Reset Documentation

## Overview
This project has been reset from an Appwrite blog platform to a Supabase-based **Poetry Sharing Platform**.

## Major Changes

### 1. Backend Migration
- **Removed**: Appwrite (`appwrite@15.0.0`)
- **Added**: Supabase (`@supabase/supabase-js@^2.38.0`)

### 2. Configuration
- Created new [`src/config/supabase.js`](src/config/supabase.js) with:
  - Authentication functions (signup, login, logout)
  - Poem CRUD operations
  - Profile operations
  - Database queries for poems and profiles

- Created [`.env.example`](.env.example) with required Supabase variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 3. Authentication System
- **Old**: Magic URL authentication
- **New**: Traditional email/password authentication with Supabase
- Updated components:
  - `src/auth/AuthForm.jsx` - Now supports login and signup
  - `src/auth/PrivateRoute.jsx` - Uses Supabase session
  - `src/auth/PublicRoute.jsx` - Uses Supabase session
  - `src/auth/MagicURLRedirect.jsx` - Renamed to `AuthRedirect` (for future use)

### 4. Feature Replacement
| Old | New |
|-----|-----|
| BlogEditor | PoemEditor |
| Blog posts | Poems |
| Admin only posting | All users can share poems |
| No categories | Categories: general, love, nature, reflection, social, other |

### 5. Updated Components
- **Navbar** (`src/components/Navbar.jsx`)
  - Added logout button
  - Changed branding to "Stanza"
  - Added sign-up option
  - Shows welcome message with username
  - Updated write button to always appear for authenticated users

- **Profile** (`src/shared/Profile.jsx`)
  - Show all poems with filter option (All/Mine)
  - Delete poems functionality
  - Display poem category and creation date
  - Character count for poems

- **Editor** (`src/admin/Editor.jsx`)
  - Checks Supabase authentication
  - Stores user ID in localStorage

- **BlogEditor** renamed to **PoemEditor** (`src/admin/BlogEditor.jsx`)
  - Title and content fields
  - Category selection
  - Poem submission to Supabase

### 6. Routing Structure
```
Public Routes:
├── /login - Login page
├── /signup - Sign up page
└── /auth-redirect - Auth redirect handling

Protected Routes:
├── /profile - Feed and poem management
├── /settings - User settings
├── /editor - Write new poem
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Create these tables:
   - `profiles` (id, username, avatar_url, created_at)
   - `poems` (id, user_id, title, content, category, created_at)

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

## Database Schema (Supabase)

### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### poems table
```sql
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Features Implemented

✅ User authentication (signup/login)
✅ Create poems with title, content, and category
✅ View all poems in a feed
✅ View user's own poems
✅ Delete poems
✅ User profile display
✅ Responsive design with Tailwind CSS
✅ Toast notifications for user feedback
✅ Protected routes

## Features Not Yet Implemented

- [ ] User comments on poems
- [ ] Like/upvote poems
- [ ] Search poems by title or content
- [ ] User profile customization
- [ ] Avatar uploads
- [ ] Follow other users
- [ ] Admin dashboard
