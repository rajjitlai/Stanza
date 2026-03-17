import { Link, Outlet, useNavigate } from "react-router-dom"
import { FcSearch } from "react-icons/fc"
import { useEffect, useState } from "react"
import { getAuthSession, logout, getCurrentUser } from "../config/supabase"
import { RiUserSettingsLine } from "react-icons/ri"
import { RiFileEditLine } from "react-icons/ri"
import { BiLogOut } from "react-icons/bi"
import toast from "react-hot-toast"

const Navbar = () => {
    const navigate = useNavigate()
    const [searchToggle, setSearchToggle] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userName, setUserName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await getAuthSession()
                if (session?.user) {
                    setIsAuthenticated(true)
                    setUserName(session.user.email?.split('@')[0] || 'User')
                } else {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                setIsAuthenticated(false)
            }
        }

        checkAuth()
    }, [])

    // Check if current user is admin
    const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        const checkAdmin = async () => {
            if (isAuthenticated) {
                const user = await getCurrentUser()
                // Check if user has admin role in metadata
                const isAdmin = user?.user_metadata?.role === 'admin'
                setIsAdmin(isAdmin)
            }
        }
        checkAdmin()
    }, [isAuthenticated])

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('userId')
            setIsAuthenticated(false)
            toast.success('Logged out successfully!')
            navigate('/login')
        } catch (error) {
            toast.error(`Logout failed: ${error.message}`)
        }
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            setSearchToggle(false)
            setSearchQuery("")
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none text-[20px] font-bold text-nowrap">
                    Stanza<span className="text-accent text-[20px] font-bold">.</span>
                </Link>
                <div className={"absolute bg-darker-bg w-full left-0 top-full mt-0.5 border-b border-card-bg py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (
                    searchToggle ? "show" : "hide"
                )}>
                    <input
                        type="text"
                        placeholder="Search poems..."
                        className="w-full md:w-auto bg-card-bg p-4 pl-6 pr-[12%] md:pr-6 rounded-full border-none outline-none placeholder:text-text-muted text-text-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <FcSearch className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-text-muted" />
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-card-bg w-12 h-12 rounded-full flex items-center justify-center hover:bg-accent/20 transition"
                        onClick={() => setSearchToggle(currentVal => !currentVal)}
                    >
                        <FcSearch className="text-xl text-text-primary" />
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/editor" className="hidden md:flex gap-2 link items-center justify-center rounded-full hover:bg-accent/20 p-2 transition text-text-primary">
                                <RiFileEditLine size={24} />
                                <p>Write</p>
                            </Link>
                            <span className="hidden md:block text-sm text-text-secondary">
                                Welcome, {userName}
                            </span>
                            <Link className="btn-dark py-2 px-4 flex items-center gap-2" to="/settings">
                                <RiUserSettingsLine size={20} />
                                <span className="hidden md:inline">Settings</span>
                            </Link>
                            {isAdmin && (
                                <Link className="btn-dark py-2 px-4 flex items-center gap-2" to="/admin">
                                    <span className="hidden md:inline">Admin</span>
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="btn-light py-2 px-4 flex items-center gap-2 hover:bg-accent/20 transition"
                                title="Logout"
                            >
                                <BiLogOut size={20} />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="btn-light py-2 px-4" to="/login">
                                Login
                            </Link>
                            <Link className="btn-dark py-2 px-4" to="/signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </>
    )
}

export default Navbar
