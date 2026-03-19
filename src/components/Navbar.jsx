import { Link, Outlet, useNavigate } from "react-router-dom"
import { FiMenu, FiX, FiUser } from "react-icons/fi"
import { RiUserSettingsLine, RiFileEditLine } from "react-icons/ri"
import { BiLogOut, BiSearch } from "react-icons/bi"
import { useEffect, useState } from "react"
import { getAuthSession, logout, getCurrentUser, getUserProfile } from "../config/supabase"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
    const navigate = useNavigate()
    const [searchToggle, setSearchToggle] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await getAuthSession()
                if (session?.user) {
                    setIsAuthenticated(true)
                    const profile = await getUserProfile(session.user.id)
                    setUserProfile(profile)
                } else {
                    setIsAuthenticated(false)
                    setUserProfile(null)
                }
            } catch (error) {
                setIsAuthenticated(false)
            }
        }
        checkAuth()
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('userId')
            setIsAuthenticated(false)
            setUserProfile(null)
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
        <div className="min-h-screen relative flex flex-col">
            <nav className="nav-glass mt-6 sticky top-6 mb-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img 
                        src="/assets/images/logo.svg" 
                        alt="Stanza Logo" 
                        className="w-10 h-10 rounded-xl shadow-accent-glow group-hover:rotate-6 transition-transform"
                    />
                    <span className="text-xl font-bold tracking-tight text-text-primary hidden sm:block">
                        Stanza<span className="text-accent">.</span>
                    </span>
                </Link>

                {/* Desktop Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                    <input
                        type="text"
                        placeholder="Discover poetry..."
                        className="w-full bg-glass border border-glass-border rounded-xl py-2 pl-10 pr-4 text-sm focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/feed" className="text-text-secondary hover:text-accent font-medium px-2 transition-colors">
                                Feed
                            </Link>
                            <Link to="/editor" className="btn-secondary !py-2 !px-4">
                                <RiFileEditLine className="text-lg" />
                                <span>Write</span>
                            </Link>
                            <div className="h-6 w-px bg-glass-border mx-2" />
                            <Link to={`/profile/${userProfile?.username || localStorage.getItem('userId')}`} className="p-2 text-text-secondary hover:text-accent transition-colors" title="My Profile">
                                <FiUser size={24} />
                            </Link>
                            <Link to="/settings" className="p-2 text-text-secondary hover:text-accent transition-colors" title="Settings">
                                <RiUserSettingsLine size={24} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-text-secondary hover:text-error transition-colors"
                                title="Logout"
                            >
                                <BiLogOut size={24} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-text-secondary hover:text-text-primary px-4 py-2 font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary !py-2 !px-5">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-2">
                    <button 
                        onClick={() => setSearchToggle(!searchToggle)}
                        className="p-2 text-text-secondary hover:text-accent"
                    >
                        <BiSearch size={24} />
                    </button>
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-text-secondary hover:text-accent"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Mobile Search Overlay */}
                <AnimatePresence>
                    {searchToggle && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-0 md:hidden p-4 glass-card"
                        >
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search poems..."
                                className="input-field"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default Navbar
