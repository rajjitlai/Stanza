# Stanza 🖋️

Stanza is a modern, minimalist poetry-sharing platform designed for writers to express themselves and connect through the art of verse. Built with React, Vite, and Supabase, it offers a seamless experience for publishing, discovering, and interacting with poetry.

## ✨ Features

- **User Authentication**: Secure signup and login powered by Supabase Auth.
- **Poetry Feed**: Browse a global feed of poems from the community.
- **Personal Collection**: Manage your own poems with "My Poems" filtering.
- **Creative Editor**: Simple, focused editor for writing poems with category selection.
- **Categorization**: Organize and filter poems by themes (Love, Nature, Reflection, Social, etc.).
- **Social Interaction**: Like and save your favorite poems for later.
- **Engagement**: Comment on poems to share your thoughts with authors.
- **Advanced Search**: Quickly find poems, categories, or authors using the integrated search.
- **Admin Dashboard**: Dedicated management interface for platform oversight.
- **Responsive Design**: A beautiful, dark-themed UI that works perfectly on all devices.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State/Routing**: React Router v6
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- A Supabase project

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

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── admin/          # Admin Dashboard and Editor components
├── auth/           # Authentication forms and Route guards
├── common/         # Shared animations and utilities
├── components/     # UI components (Navbar, Buttons, Comments, etc.)
├── config/         # Supabase client and feature-specific API logic
├── shared/         # Main page views (Profile, Settings)
└── App.jsx         # Main routing and application entry
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ❤️ by [Rajjit Laishram](https://github.com/rajjitlai)
