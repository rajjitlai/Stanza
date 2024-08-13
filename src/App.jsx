import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthForm from "./auth/AuthForm"
import Profile from "./shared/Profile"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./auth/PrivateRoute"
import PublicRoute from "./auth/PublicRoute"
import Settings from "./shared/Settings"
import MagicURLRedirect from "./auth/MagicURLRedirect"
import Editor from "./admin/Editor"

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route element={<PublicRoute />}>
            <Route path="login" element={<AuthForm type="login" />} />
            <Route path="magic-url-redirect" element={<MagicURLRedirect />} />
          </Route>
          <Route path="/" element={<Navigate to="/profile" />} />
          <Route path="*" element={<h1>404 Page not found</h1>} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navbar />}>
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/editor" element={<Editor />}></Route>
      </Routes>
    </div>
  )
}

export default App