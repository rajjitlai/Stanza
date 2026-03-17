import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { getUserPoems, getAllPoems, deletePoem } from "../config/supabase"
import toast from "react-hot-toast"
import PageAnimation from "../common/PageAnimation"
import { RiDeleteBin6Line } from "react-icons/ri"

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
            <section className="h-cover bg-dark-bg">
                <div className="mx-auto max-w-[900px] p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h1 className="text-3xl font-bold text-text-primary">Poetry Feed</h1>
                        <Link to="/editor" className="btn-dark py-2 px-6 text-base">
                            Write New Poem
                        </Link>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-card-bg rounded-xl border border-text-muted">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search poems, categories, or authors..."
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg py-3 pl-10 pr-4 outline-none focus:border-accent transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`pb-2 px-4 font-semibold rounded-lg transition whitespace-nowrap ${filter === "all"
                                    ? "bg-accent/20 text-accent border-b-2 border-accent"
                                    : "text-text-secondary hover:bg-card-bg"
                                    }`}
                            >
                                All Poems
                            </button>
                            <button
                                onClick={() => setFilter("mine")}
                                className={`pb-2 px-4 font-semibold rounded-lg transition whitespace-nowrap ${filter === "mine"
                                    ? "bg-accent/20 text-accent border-b-2 border-accent"
                                    : "text-text-secondary hover:bg-card-bg"
                                    }`}
                            >
                                My Poems
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block spinner mb-4"></div>
                            <p className="text-lg text-text-secondary">Loading poems...</p>
                        </div>
                    ) : filteredPoems.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="text-6xl mb-4 opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                            </div>
                            <p className="text-lg text-text-secondary">
                                {filter === "mine" && !searchTerm
                                    ? "You haven't written any poems yet. Start writing!"
                                    : filter === "mine" && searchTerm
                                    ? "No poems match your search."
                                    : !searchTerm
                                    ? "No poems available yet. Be the first to share!"
                                    : "No poems match your search."}
                            </p>
                            {filter !== "mine" && !searchTerm && (
                                <Link to="/editor" className="btn-dark py-2 px-6 mt-4 inline-block">
                                    Write First Poem
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredPoems.map((poem) => (
                                <div
                                    key={poem.id}
                                    className="card hover:bg-card-bg/80"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <Link to={`/poem/${poem.id}`}>
                                                <h3 className="text-xl font-bold text-text-primary hover:text-accent transition">
                                                    {poem.title}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-sm text-text-secondary">
                                                    By <span className="text-accent">{poem.profiles?.username || 'Unknown'}</span>
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    <span className="bg-darker-bg px-2 py-1 rounded text-xs border border-text-muted">
                                                        {poem.category || "general"}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        {userId === poem.user_id && (
                                            <button
                                                onClick={() => handleDelete(poem.id)}
                                                className="text-error hover:text-error/80 transition p-2"
                                                title="Delete poem"
                                            >
                                                <RiDeleteBin6Line size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-base text-text-secondary line-clamp-3 my-3 leading-relaxed">
                                        {poem.content}
                                    </p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-text-muted/30">
                                        <p className="text-xs text-text-muted">
                                            {new Date(poem.created_at).toLocaleDateString()}
                                        </p>
                                        <Link to={`/poem/${poem.id}`} className="text-accent text-sm hover:underline">
                                            Read Poem &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PageAnimation>
    )
}

export default Profile
