import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthForm from "./auth/AuthForm"
import Profile from "./shared/Profile"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./auth/PrivateRoute"
import PublicRoute from "./auth/PublicRoute"
import Settings from "./shared/Settings"
import AuthRedirect from "./auth/MagicURLRedirect"
import Editor from "./admin/Editor"
import PoemDetail from "./components/PoemDetail"
import SearchResults from "./components/SearchResults"
import AdminDashboard from "./admin/Dashboard"

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/signup" element={<AuthForm type="signup" />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
        </Route>

        {/* Main Layout with Navbar */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<Navigate to="/profile" />} />
          <Route path="*" element={<h1 className="text-center p-10">404 Page not found</h1>} />
        </Route>

        {/* Poem Routes */}
        <Route path="/poem/:id" element={<PoemDetail />} />

        {/* Search Routes */}
        <Route path="/search" element={<SearchResults />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navbar />}>
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
