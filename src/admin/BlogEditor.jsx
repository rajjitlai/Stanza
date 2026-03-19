import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PageAnimation from "../common/PageAnimation"
import toast from "react-hot-toast"
import { createPoem } from "../config/supabase"
import { RiQuillPenLine, RiDraftLine, RiCloseLine } from "react-icons/ri"
import { motion } from "framer-motion"

const PoemEditor = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("general")
    const [content, setContent] = useState("")
    const [isDraft, setIsDraft] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const categories = ["general", "love", "nature", "reflection", "social", "other"]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!title.trim() || !content.trim()) {
                toast.error("Please fill in title and content")
                setIsLoading(false)
                return
            }

            const userId = localStorage.getItem("userId")
            if (!userId) {
                toast.error("Please log in first")
                navigate("/login")
                return
            }

            if (isDraft) {
                toast.success("Poem saved as draft!")
            } else {
                await createPoem(userId, title, content, category)
                toast.success("Poem submitted successfully!")
            }

            setTitle("")
            setCategory("general")
            setContent("")
            setIsDraft(false)
            navigate("/feed")
        } catch (error) {
            toast.error(`Error submitting poem: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageAnimation>
            <div className="min-h-screen pt-10 pb-20 px-4">
                <div className="max-w-4xl mx-auto pt-8">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 glass-card p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-darker-bg font-serif text-2xl font-bold">
                                S
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-text-primary">
                                    {isDraft ? "Refining Draft" : "New Stanza"}
                                </h1>
                                <p className="text-xs text-text-muted uppercase tracking-widest">Creative Workshop</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link to="/feed" className="btn-secondary !py-2 flex-1 md:flex-none justify-center">
                                <RiCloseLine size={20} />
                                <span>Cancel</span>
                            </Link>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="btn-primary !py-2 flex-1 md:flex-none justify-center shadow-accent-glow"
                            >
                                <RiQuillPenLine size={20} />
                                <span>{isLoading ? "Publishing..." : "Publish"}</span>
                            </button>
                        </div>
                    </header>

                    {/* Editor Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="glass-card p-8">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Poem Title"
                                        className="w-full bg-transparent border-none text-4xl font-serif font-bold text-text-primary placeholder:text-text-muted/30 outline-none mb-8"
                                    />
                                    
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your stanza here..."
                                        rows="15"
                                        className="w-full bg-transparent border-none text-xl font-serif leading-[1.8] text-text-secondary placeholder:text-text-muted/30 outline-none resize-none"
                                    />
                                    
                                    <div className="mt-8 pt-6 border-t border-glass-border flex justify-between text-xs text-text-muted uppercase tracking-widest">
                                        <span>Character count: {content.length}</span>
                                        <span>Poetry is silence in search of a sound</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Controls */}
                            <aside className="space-y-6">
                                <div className="glass-card p-6">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                                        Theme / Category
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                                                    category === cat
                                                        ? "bg-accent text-darker-bg border-accent"
                                                        : "bg-glass border-glass-border text-text-secondary hover:border-accent/40"
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-bold text-text-primary mb-4">Writing Tips</h3>
                                    <ul className="text-xs text-text-secondary space-y-3 italic">
                                        <li>• Use line breaks for emotional rhythm.</li>
                                        <li>• Show, don't just tell.</li>
                                        <li>• Let the imagery breathe.</li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>
        </PageAnimation>
    )
}

export default PoemEditor
