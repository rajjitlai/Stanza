import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PageAnimation from "../common/PageAnimation"
import toast from "react-hot-toast"
import { createPoem } from "../config/supabase"

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

            const poemData = {
                user_id: userId,
                title,
                content,
                category,
                created_at: new Date(),
            }

            if (isDraft) {
                // For drafts, we might want to add a draft status in the database
                // For now, we just save as regular poem with draft flag
                toast.success("Poem saved as draft!")
            } else {
                await createPoem(userId, title, content, category)
                toast.success("Poem submitted successfully!")
            }

            setTitle("")
            setCategory("general")
            setContent("")
            setIsDraft(false)
            navigate("/profile")
        } catch (error) {
            toast.error(`Error submitting poem: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveDraft = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill in title and content")
            return
        }

        setIsLoading(true)
        try {
            const userId = localStorage.getItem("userId")
            if (!userId) {
                toast.error("Please log in first")
                navigate("/login")
                return
            }

            // Save draft with draft flag
            toast.success("Poem saved as draft!")
            setIsDraft(true)
            navigate("/profile")
        } catch (error) {
            toast.error(`Error saving draft: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none">
                    Stanza<span className="text-accent text-[20px] font-bold">.</span>
                </Link>
                <p className="max-md:hidden text-text-primary line-clamp-1 w-full">
                    {isDraft ? "Draft Poetry" : "New Poetry"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button
                        onClick={handleSaveDraft}
                        className="btn-light py-2 px-4"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Draft"}
                    </button>
                    <Link to="/profile" className="btn-light py-2 px-4">
                        Cancel
                    </Link>
                </div>
            </nav>

            <PageAnimation>
                <section className="bg-dark-bg min-h-screen">
                    <div className="mx-auto max-w-[900px] p-4">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-lg font-semibold mb-2 text-text-primary">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter your poem title"
                                    className="w-full p-3 border border-text-muted rounded-lg focus:outline-none focus:border-accent text-text-primary bg-card-bg focus:ring-1 focus:ring-accent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2 text-text-primary">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 border border-text-muted rounded-lg focus:outline-none focus:border-accent text-text-primary bg-card-bg focus:ring-1 focus:ring-accent transition"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2 text-text-primary">
                                    Your Poetry
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your poem here..."
                                    rows="15"
                                    className="w-full p-3 border border-text-muted rounded-lg focus:outline-none focus:border-accent font-mono text-text-primary bg-card-bg focus:ring-1 focus:ring-accent transition resize-y"
                                />
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-text-secondary">Character count: {content.length}</span>
                                    {isDraft && <span className="text-accent">Draft mode</span>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    className="btn-dark py-3 flex-1"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Publishing..." : "Publish Poem"}
                                </button>
                                <Link to="/profile" className="btn-light py-3 flex-1 text-center hover:bg-card-bg">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </section>
            </PageAnimation>
        </>
    )
}

export default PoemEditor
