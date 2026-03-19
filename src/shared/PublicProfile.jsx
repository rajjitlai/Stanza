import { useEffect, useState, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { getUserPoems, getUserProfileByUsername } from "../config/supabase"
import toast from "react-hot-toast"
import PageAnimation from "../common/PageAnimation"
import { RiQuillPenLine, RiArrowLeftLine } from "react-icons/ri"
import { motion, AnimatePresence } from "framer-motion"
import { CardSkeleton } from "../components/Skeleton"

const PublicProfile = () => {
    const { username } = useParams()
    const [poems, setPoems] = useState([])
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const profileData = await getUserProfileByUsername(username)
            setProfile(profileData)
            
            if (profileData) {
                const poemsData = await getUserPoems(profileData.id)
                setPoems(poemsData || [])
            }
        } catch (error) {
            toast.error(`Error loading profile: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }, [username])

    useEffect(() => {
        loadData()
    }, [loadData])

    return (
        <PageAnimation>
            <section className="px-4 md:px-[7vw] lg:px-[10vw] pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors group"
                    >
                        <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Feed</span>
                    </Link>

                    {/* Profile Header */}
                    <div className="glass-card p-6 md:p-12 mb-8 md:mb-12 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-darker-bg font-serif text-3xl md:text-5xl font-bold shadow-accent-glow">
                                {profile?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-2 md:mb-3">
                                    {profile?.username || 'Poet'}
                                </h1>
                                <p className="text-text-secondary text-base md:text-lg italic max-w-2xl">
                                    {profile?.bio || "This poet's story is still being written between the lines."}
                                </p>
                                <div className="mt-4 md:mt-6 flex items-center justify-center md:justify-start gap-6 text-sm">
                                    <div className="text-text-muted">
                                        <span className="text-accent font-bold text-base md:text-lg mr-2">{poems.length}</span>
                                        Stanzas written
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-text-primary">Published Works</h2>
                        <div className="h-px flex-1 bg-glass-border" />
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
                                {[1, 2].map(i => <CardSkeleton key={i} />)}
                            </motion.div>
                        ) : poems.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 glass-card"
                            >
                                <RiQuillPenLine className="text-6xl text-text-muted/20 mx-auto mb-4" />
                                <p className="text-xl text-text-secondary font-serif">
                                    No stanzas have been shared by this poet yet.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-6 md:gap-8"
                            >
                                {poems.map((poem, index) => (
                                    <motion.div
                                        key={poem.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card group hover-lift overflow-hidden"
                                    >
                                        <div className="p-6 md:p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center flex-wrap gap-3">
                                                        <span className="category-badge">{poem.category || "general"}</span>
                                                        <span className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest">
                                                            {new Date(poem.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <Link to={`/poem/${poem.id}`}>
                                                        <h3 className="text-2xl md:text-3xl font-serif font-bold group-hover:text-accent transition-colors">
                                                            {poem.title}
                                                        </h3>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <p className="poem-text line-clamp-4 italic text-text-secondary/80 !text-base md:!text-xl">
                                                    {poem.content}
                                                </p>
                                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card-bg to-transparent" />
                                            </div>

                                            <div className="mt-6 md:mt-8 flex items-center justify-between">
                                                <Link to={`/poem/${poem.id}`} className="text-accent font-medium flex items-center gap-2 hover:gap-3 transition-all text-sm md:text-base">
                                                    Read full stanza <span className="text-lg">→</span>
                                                </Link>
                                                <div className="flex items-center gap-4 text-text-muted text-[10px] md:text-sm">
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

export default PublicProfile
