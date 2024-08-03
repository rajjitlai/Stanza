import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthForm from "./auth/AuthForm"
import Profile from "./shared/Profile"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />} >
          <Route path="login" element={<AuthForm type="login" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<h1>
            <p>404 Page not found</p>
          </h1>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App