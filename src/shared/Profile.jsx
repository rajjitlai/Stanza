import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { getUserPoems, getAllPoems, deletePoem } from "../config/supabase"
import toast from "react-hot-toast"
import PageAnimation from "../common/PageAnimation"
import { RiDeleteBin6Line, RiPencilLine, RiSearchLine, RiQuillPenLine } from "react-icons/ri"
import { motion, AnimatePresence } from "framer-motion"
import { CardSkeleton } from "../components/Skeleton"

const Profile = () => {
    const [poems, setPoems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("all") // "all" or "mine"
    const [searchTerm, setSearchTerm] = useState("")
    const userId = localStorage.getItem("userId")

    const loadPoems = useCallback(async () => {
        setIsLoading(true)
        try {
            let data
            if (filter === "mine") {
                data = await getUserPoems(userId)
            } else {
                data = await getAllPoems()
            }
            setPoems(data || [])
        } catch (error) {
            toast.error(`Error loading poems: ${error.message}`)
            setPoems([])
        } finally {
            setIsLoading(false)
        }
    }, [filter, userId])

    useEffect(() => {
        loadPoems()
    }, [loadPoems])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this poem?")) {
            try {
                await deletePoem(id)
                toast.success("Poem deleted successfully!")
                loadPoems()
            } catch (error) {
                toast.error(`Error deleting poem: ${error.message}`)
            }
        }
    }

    const filteredPoems = poems.filter(poem =>
        poem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <PageAnimation>
            <section className="px-4 md:px-[7vw] lg:px-[10vw] pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-2">
                                Poetry Feed
                            </h1>
                            <p className="text-text-secondary italic">
                                "Poetry is the rhythmical creation of beauty in words." — Edgar Allan Poe
                            </p>
                        </div>
                        <Link to="/editor" className="btn-primary group">
                            <RiQuillPenLine className="text-xl group-hover:rotate-12 transition-transform" />
                            Write a Stanza
                        </Link>
                    </div>

                    {/* Toolbar */}
                    <div className="glass-card p-2 mb-12 flex flex-col md:flex-row gap-2 items-center">
                        <div className="flex p-1 bg-darker-bg/50 rounded-xl w-full md:w-auto">
                            <button
                                onClick={() => setFilter("all")}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all ${filter === "all"
                                    ? "bg-accent text-darker-bg shadow-lg"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                All Work
                            </button>
                            <button
                                onClick={() => setFilter("mine")}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all ${filter === "mine"
                                    ? "bg-accent text-darker-bg shadow-lg"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                My Stanzas
                            </button>
                        </div>
                        
                        <div className="relative flex-1 w-full">
                            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or theme..."
                                className="w-full bg-transparent border-none py-3 pl-12 pr-4 outline-none text-text-primary placeholder:text-text-muted/60"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid gap-8"
                            >
                                {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                            </motion.div>
                        ) : filteredPoems.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 glass-card"
                            >
                                <RiQuillPenLine className="text-6xl text-text-muted/20 mx-auto mb-4" />
                                <p className="text-xl text-text-secondary font-serif mb-6">
                                    The ink has yet to touch the page here.
                                </p>
                                <Link to="/editor" className="btn-secondary inline-flex">
                                    Start Writing
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-8"
                            >
                                {filteredPoems.map((poem, index) => (
                                    <motion.div
                                        key={poem.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card group hover-lift overflow-hidden"
                                    >
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="category-badge">{poem.category || "general"}</span>
                                                        <span className="text-xs text-text-muted uppercase tracking-widest">
                                                            {new Date(poem.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <Link to={`/poem/${poem.id}`}>
                                                        <h3 className="poem-title group-hover:text-accent transition-colors">
                                                            {poem.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-text-secondary">
                                                        by <span className="font-serif italic text-text-primary">@{poem.profiles?.username || 'anonymous'}</span>
                                                    </p>
                                                </div>
                                                
                                                {userId === poem.user_id && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleDelete(poem.id)}
                                                            className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-all"
                                                            title="Delete"
                                                        >
                                                            <RiDeleteBin6Line size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <p className="poem-text line-clamp-4 italic text-text-secondary/80">
                                                    {poem.content}
                                                </p>
                                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card-bg to-transparent" />
                                            </div>

                                            <div className="mt-8 flex items-center justify-between">
                                                <Link to={`/poem/${poem.id}`} className="text-accent font-medium flex items-center gap-2 hover:gap-3 transition-all">
                                                    Read full stanza <span className="text-lg">→</span>
                                                </Link>
                                                <div className="flex items-center gap-4 text-text-muted text-sm">
                                                    <span>{Math.ceil(poem.content.split(' ').length / 200)} min read</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </PageAnimation>
    )
}

export default Profile
