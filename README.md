# Stanza

A modern web platform for poets and poetry enthusiasts to share their creative work, connect with other writers, and discover inspiring poetry.

## 🎯 Overview

Stanza is a full-stack poetry sharing platform built with React, Vite, and Supabase. Users can create accounts, write and publish poems, browse community poems, and manage their poetry collection.

## ✨ Features

- **User Authentication** - Secure email/password signup and login
- **Poetry Creation** - Write and publish poems with categories
- **Categories** - Organize poems by category (general, love, nature, reflection, social, other)
- **Poetry Feed** - Discover all shared poems from the community
- **My Poems** - View and manage your personal poetry collection
- **Delete Poems** - Remove poems from your collection
- **User Profile** - User authentication and profile management
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Feedback** - Toast notifications for user actions
- **Protected Routes** - Secure authentication with private routes

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18.3.1 |
| **Build Tool** | Vite 5.3.4 |
| **Styling** | Tailwind CSS 3.4.6 |
| **Routing** | React Router v6.25.1 |
| **Backend/Database** | Supabase 2.38.0 |
| **Animations** | Framer Motion 11.3.19 |
| **Notifications** | React Hot Toast 2.4.1 |
| **Icons** | React Icons 5.2.1 |
| **Code Quality** | ESLint with React plugins |

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stanza
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   Follow the detailed [Supabase Setup Guide](./SUPABASE_SETUP.md) to:
   - Create a Supabase account and project
   - Set up database tables
   - Configure authentication
   - Get your API keys
   
   Then create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 📦 Supabase Setup

For detailed step-by-step instructions on setting up Supabase, including:
- Creating a Supabase account and project
- Creating database tables
- Setting up authentication
- Configuring Row Level Security (RLS)
- Getting your API keys

**Please refer to the [Supabase Setup Guide](./SUPABASE_SETUP.md)** for complete instructions.

## 📁 Project Structure

```
src/
├── admin/
│   ├── PoemEditor.jsx          # Poem editor component
│   ├── Editor.jsx              # Editor page wrapper
│   └── PublishForm.jsx         # Publishing options
├── auth/
│   ├── AuthForm.jsx            # Login/signup form
│   ├── PrivateRoute.jsx        # Protected route wrapper
│   ├── PublicRoute.jsx         # Public route wrapper
│   └── MagicURLRedirect.jsx    # Auth redirect handler
├── common/
│   └── PageAnimation.jsx       # Page transition animation
├── components/
│   ├── InputBox.jsx            # Input field component
│   └── Navbar.jsx              # Navigation bar
├── config/
│   └── supabase.js             # Supabase client & utilities
├── shared/
│   ├── Comments.jsx            # Comments component (future)
│   ├── Profile.jsx             # User profile page
│   └── Settings.jsx            # User settings page
├── App.jsx                     # Main app component
├── index.css                   # Global styles
└── main.jsx                    # Entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📋 Available Poem Categories

Users can organize their poems into these categories:

- **general** - General poetry
- **love** - Love and romance themed
- **nature** - Nature and environmental themes
- **reflection** - Reflective and introspective pieces
- **social** - Social commentary and activism
- **other** - Other categories

## 🔐 Authentication Flow

```
Public Routes:
├── /login         - User login page
├── /signup        - User registration page
└── /auth-redirect - Authentication redirect handling

Protected Routes (requires login):
├── /profile       - Poetry feed and user collection
├── /settings      - User settings and account management
└── /editor        - Create and publish new poems

Main Layout:
└── /              - Home (redirects to /profile if authenticated)
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling with custom configuration. Key style files:

- `src/index.css` - Global styles and Tailwind directives
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

## 🚦 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes**

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Test locally**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🐛 Debugging

- Check browser console for JavaScript errors
- Use React DevTools browser extension for state debugging
- Check Supabase console for database errors
- View network requests in browser DevTools

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

## 🎯 Future Features

- [ ] User comments on poems
- [ ] Like/upvote poems
- [ ] Advanced search and filtering
- [ ] User profiles with bio and avatar
- [ ] Follow other poets
- [ ] Private poems (only visible to user)
- [ ] Poem collections/anthologies
- [ ] Share poems on social media
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Content moderation
- [ ] Poetry contests/challenges

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request with:

- Clear description of changes
- Tests if applicable
- Updated documentation

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or suggestions:

1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Include steps to reproduce for bugs
4. Provide screenshots when helpful

## 🔗 Documentation & Resources

**Project Documentation:**
- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Step-by-step guide to set up Supabase for this project
- [Reset Notes](./RESET_NOTES.md) - Migration notes from Appwrite to Supabase

**External Documentation:**
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## 📊 Database Schema

### profiles table
```
id (UUID) - Primary key, references auth.users
username (TEXT) - Unique username
avatar_url (TEXT) - Profile picture URL
bio (TEXT) - User bio
created_at (TIMESTAMP) - Account creation time
```

### poems table
```
id (UUID) - Primary key
user_id (UUID) - Foreign key to profiles.id
title (TEXT) - Poem title
content (TEXT) - Poem content
category (TEXT) - Category of poem
created_at (TIMESTAMP) - Creation time
updated_at (TIMESTAMP) - Last update time
```

---

**Last Updated:** March 8, 2026

Made with ❤️ for poetry lovers everywhere.
