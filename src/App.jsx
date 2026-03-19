import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthForm from "./auth/AuthForm"
import Feed from "./shared/Feed"
import PublicProfile from "./shared/PublicProfile"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./auth/PrivateRoute"
import PublicRoute from "./auth/PublicRoute"
import Settings from "./shared/Settings"
import AuthRedirect from "./auth/MagicURLRedirect"
import Editor from "./admin/Editor"
import PoemDetail from "./components/PoemDetail"
import SearchResults from "./components/SearchResults"
import AdminDashboard from "./admin/Dashboard"
import LandingPage from "./components/LandingPage"
import NotFound from "./components/NotFound"

const App = () => {
  return (
    <div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 28, 0.8)',
            backdropFilter: 'blur(120px)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#f8f8f8',
            borderRadius: '16px',
            padding: '12px 24px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#d4af37',
              secondary: '#050508',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff5f5f',
              secondary: '#050508',
            },
          },
        }}
      />
      <Routes>
        {/* Main Layout with Navbar (Accessible to all) */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<LandingPage />} />
          <Route path="feed" element={<Feed />} />
          <Route path="profile/:username" element={<PublicProfile />} />
          <Route path="poem/:id" element={<PoemDetail />} />
          <Route path="search" element={<SearchResults />} />
          
          {/* Public Routes (Only if not logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="login" element={<AuthForm type="login" />} />
            <Route path="signup" element={<AuthForm type="signup" />} />
            <Route path="auth-redirect" element={<AuthRedirect />} />
          </Route>

          {/* Protected Routes (Requires login) */}
          <Route element={<PrivateRoute />}>
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="editor" element={<Editor />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
