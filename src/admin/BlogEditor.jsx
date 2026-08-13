import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import PageAnimation from "../common/PageAnimation"
import toast from "react-hot-toast"
import { createPoem, updatePoem, getPoemById } from "../config/supabase"
import { useAuth } from "../context/AuthContext"
import { RiQuillPenLine, RiCloseLine, RiSave3Line } from "react-icons/ri"

const PoemEditor = ({ poemId }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("general")
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingPoem, setIsFetchingPoem] = useState(false)

    const categories = ["general", "love", "nature", "reflection", "social", "other"]
    const isEditMode = !!poemId

    useEffect(() => {
        if (isEditMode) {
            fetchPoemToEdit()
        } else {
            // Load saved draft from local storage if available
            const savedDraft = localStorage.getItem("stanza_draft")
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft)
                    if (parsed.title) setTitle(parsed.title)
                    if (parsed.content) setContent(parsed.content)
                    if (parsed.category) setCategory(parsed.category)
                } catch (e) {
                    console.error("Failed to parse local draft", e)
                }
            }
        }
    }, [poemId])

    const fetchPoemToEdit = async () => {
        setIsFetchingPoem(true)
        try {
            const poem = await getPoemById(poemId)
            if (poem) {
                if (user?.id && poem.user_id !== user.id) {
                    toast.error("You are not authorized to edit this stanza.")
                    navigate("/feed")
                    return
                }
                setTitle(poem.title || "")
                setContent(poem.content || "")
                setCategory(poem.category || "general")
            }
        } catch (error) {
            toast.error(`Failed to load stanza: ${error.message}`)
            navigate("/feed")
        } finally {
            setIsFetchingPoem(false)
        }
    }

    const handleSaveDraft = () => {
        if (!title.trim() && !content.trim()) {
            toast.error("Nothing to save in draft yet.")
            return
        }
        const draft = { title, content, category, updatedAt: new Date().toISOString() }
        localStorage.setItem("stanza_draft", JSON.stringify(draft))
        toast.success("Draft saved locally! Resume writing anytime.")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!title.trim() || !content.trim()) {
                toast.error("Please fill in title and content")
                setIsLoading(false)
                return
            }

            if (!user?.id) {
                toast.error("Please log in first")
                navigate("/login")
                return
            }

            if (isEditMode) {
                await updatePoem(poemId, {
                    title: title.trim(),
                    content: content.trim(),
                    category,
                })
                toast.success("Poem updated successfully!")
            } else {
                await createPoem(user.id, title.trim(), content.trim(), category)
                localStorage.removeItem("stanza_draft")
                toast.success("Poem published successfully!")
            }

            navigate("/feed")
        } catch (error) {
            toast.error(`Error submitting poem: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetchingPoem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="spinner mb-4" />
                <p className="text-text-muted italic text-sm">Retrieving your verse...</p>
            </div>
        )
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
                                    {isEditMode ? "Editing Stanza" : "New Stanza"}
                                </h1>
                                <p className="text-xs text-text-muted uppercase tracking-widest">Creative Workshop</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link to="/feed" className="btn-secondary !py-2 flex-1 md:flex-none justify-center">
                                <RiCloseLine size={20} />
                                <span>Cancel</span>
                            </Link>
                            {!isEditMode && (
                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    className="btn-secondary !py-2 flex-1 md:flex-none justify-center text-accent hover:border-accent/40"
                                >
                                    <RiSave3Line size={20} />
                                    <span>Save Draft</span>
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="btn-primary !py-2 flex-1 md:flex-none justify-center shadow-accent-glow"
                            >
                                <RiQuillPenLine size={20} />
                                <span>{isLoading ? (isEditMode ? "Updating..." : "Publishing...") : (isEditMode ? "Update Stanza" : "Publish")}</span>
                            </button>
                        </div>
                    </header>

                    {/* Editor Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="glass-card p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Title</label>
                                        <span className={`text-[10px] font-medium ${title.length > 100 ? 'text-error' : 'text-text-muted'}`}>
                                            {title.length}/100
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                                        placeholder="Poem Title"
                                        className="w-full bg-transparent border-none text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary placeholder:text-text-muted/30 outline-none mb-6 md:mb-8"
                                    />
                                    
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Stanza</label>
                                        <span className={`text-[10px] font-medium ${content.length > 5000 ? 'text-error' : 'text-text-muted'}`}>
                                            {content.length}/5000
                                        </span>
                                    </div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value.slice(0, 5000))}
                                        placeholder="Write your stanza here..."
                                        rows="12"
                                        className="w-full bg-transparent border-none text-lg md:text-xl font-serif leading-[1.8] text-text-secondary placeholder:text-text-muted/30 outline-none resize-none"
                                    />
                                    
                                    <div className="mt-6 md:mt-8 pt-6 border-t border-glass-border flex flex-col sm:flex-row justify-between text-[10px] md:text-xs text-text-muted uppercase tracking-widest gap-2">
                                        <span>Focus on the rhythm of your words</span>
                                        <span className="italic">Poetry is silence in search of a sound</span>
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
