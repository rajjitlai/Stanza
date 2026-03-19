import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPoemById, getUserProfile } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import CommentsList from '../components/CommentsList';
import { FiShare2, FiArrowLeft } from 'react-icons/fi';
import ShareModal from '../components/ShareModal';
import { motion } from 'framer-motion';
import { DetailSkeleton } from './Skeleton';

const PoemDetail = () => {
    const { id } = useParams();
    const [poem, setPoem] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        loadPoem();
    }, [id]);

    const loadPoem = async () => {
        try {
            const data = await getPoemById(id);
            setPoem(data);

            if (data?.user_id) {
                const authorData = await getUserProfile(data.user_id);
                setAuthor(authorData);
            }
        } catch (error) {
            toast.error(`Failed to load poem: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto pt-20 px-4">
                <DetailSkeleton />
            </div>
        );
    }

    if (!poem) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center glass-card p-12">
                    <h2 className="text-2xl font-serif text-text-primary mb-4">Poem not found</h2>
                    <Link to="/feed" className="btn-secondary">
                        Back to Feed
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageAnimation>
            <div className="pt-10 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Top Navigation */}
                    <div className="mb-12 flex items-center justify-between">
                        <Link
                            to="/feed"
                            className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                        >
                            <div className="p-2 bg-glass border border-glass-border rounded-lg group-hover:border-accent/30 transition-all">
                                <FiArrowLeft size={20} />
                            </div>
                            <span className="font-medium">Back to Feed</span>
                        </Link>
                        
                        <button
                            onClick={() => setShareModalOpen(true)}
                            className="btn-secondary !p-3 rounded-full"
                            title="Share this stanza"
                        >
                            <FiShare2 size={20} />
                        </button>
                    </div>

                    {/* Poem Content */}
                    <motion.article 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 md:p-16 mb-12 relative overflow-hidden"
                    >
                        {/* Decorative Quote Mark */}
                        <div className="absolute top-8 left-8 text-8xl font-serif text-accent/5 select-none leading-none">
                            "
                        </div>

                        <header className="mb-12 text-center relative z-10">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <span className="category-badge">{poem.category || 'general'}</span>
                                <span className="h-px w-8 bg-glass-border" />
                                <span className="text-xs text-text-muted uppercase tracking-[0.2em]">
                                    {formatTime(poem.created_at)}
                                </span>
                            </div>
                            
                            <h1 className="poem-title !text-4xl md:!text-6xl mb-4 leading-tight">
                                {poem.title}
                            </h1>
                            
                            <p className="text-text-secondary font-serif italic text-lg">
                                by <Link to={`/profile/${poem.profiles?.username || poem.user_id}`} className="text-accent underline underline-offset-8 decoration-accent/30 hover:text-accent-light transition-colors">
                                    {poem.profiles?.username || 'Anonymous'}
                                </Link>
                            </p>
                        </header>

                        <div className="relative z-10">
                            <pre className="poem-text text-center mx-auto max-w-prose">
                                {poem.content}
                            </pre>
                        </div>

                        <div className="mt-16 flex items-center justify-center gap-8 pt-8 border-t border-glass-border">
                            <LikeButton
                                poemId={poem.id}
                                initialLiked={false}
                                initialCount={0}
                            />
                            <div className="h-4 w-px bg-glass-border" />
                            <SaveButton
                                poemId={poem.id}
                                initialSaved={false}
                                initialCount={0}
                            />
                        </div>
                    </motion.article>

                    {/* Author Section */}
                    {author && (
                        <Link to={`/profile/${author.username || poem.user_id}`} className="block transition-transform hover:-translate-y-1">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mb-16 p-8 glass-card flex flex-col md:flex-row items-center gap-8 group"
                            >
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-darker-bg font-serif text-4xl font-bold shadow-xl group-hover:shadow-accent-glow transition-all">
                                    {author.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-2xl font-serif font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                                        About {author.username || 'the Author'}
                                    </h2>
                                    <p className="text-text-secondary leading-relaxed italic">
                                        {author.bio || 'This poet prefers to let their work speak for itself.'}
                                    </p>
                                    <div className="mt-4 text-accent text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                                        View full profile <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    )}

                    {/* Comments Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-serif font-bold text-text-primary">Reflections</h2>
                            <div className="h-px flex-1 bg-glass-border" />
                        </div>
                        <CommentsList poemId={poem.id} />
                    </div>
                </div>

                {/* Share Modal */}
                {shareModalOpen && (
                    <ShareModal
                        poemId={poem.id}
                        poemTitle={poem.title}
                        onClose={() => setShareModalOpen(false)}
                    />
                )}
            </div>
        </PageAnimation>
    );
};

export default PoemDetail;
