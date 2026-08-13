import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthForm from "./auth/AuthForm"
import Feed from "./shared/Feed"
import PublicProfile from "./shared/PublicProfile"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./auth/PrivateRoute"
import PublicRoute from "./auth/PublicRoute"
import AdminRoute from "./auth/AdminRoute"
import AuthRedirect from "./auth/MagicURLRedirect"
import PoemDetail from "./components/PoemDetail"
import LandingPage from "./components/LandingPage"
import NotFound from "./components/NotFound"

// Lazy loaded routes for chunk optimization
const Settings = lazy(() => import("./shared/Settings"))
const Editor = lazy(() => import("./admin/Editor"))
const AdminDashboard = lazy(() => import("./admin/Dashboard"))
const SearchResults = lazy(() => import("./components/SearchResults"))

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <div className="spinner mb-4" />
    <p className="text-text-muted italic text-sm">Loading stanza...</p>
  </div>
)

const App = () => {
  return (
    <div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 28, 0.8)',
            backdropFilter: 'blur(20px)',
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main Layout with Navbar */}
          <Route path="/" element={<Navbar />}>
            <Route path="feed" element={<Feed />} />
            <Route path="profile/:username" element={<PublicProfile />} />
            <Route path="poem/:id" element={<PoemDetail />} />
            <Route path="search" element={<SearchResults />} />
            
            {/* Public Routes (Only if not logged in) */}
            <Route element={<PublicRoute />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<AuthForm type="login" />} />
              <Route path="signup" element={<AuthForm type="signup" />} />
              <Route path="auth-redirect" element={<AuthRedirect />} />
            </Route>

            {/* Protected Routes (Requires login) */}
            <Route element={<PrivateRoute />}>
              <Route path="settings" element={<Settings />} />
              <Route path="editor" element={<Editor />} />
              <Route path="editor/:id" element={<Editor />} />
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
