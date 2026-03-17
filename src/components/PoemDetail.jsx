import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPoemById, getUserProfile } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import CommentsList from '../components/CommentsList';
import { FiShare2 } from 'react-icons/fi';
import ShareModal from '../components/ShareModal';

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

    const handleShare = () => {
        setShareModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!poem) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-bg">
                <div className="text-center">
                    <h2 className="text-2xl text-text-primary mb-4">Poem not found</h2>
                    <Link to="/profile" className="text-accent hover:underline">
                        Back to Feed
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageAnimation>
            <div className="bg-dark-bg min-h-screen">
                <section className="py-8">
                    <div className="mx-auto max-w-[900px] px-4">
                        {/* Poem Card */}
                        <div className="bg-card-bg rounded-xl border border-text-muted p-6 md:p-8 mb-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <Link
                                        to={`/profile`}
                                        className="text-accent text-sm font-medium hover:underline mb-2 block"
                                    >
                                        {poem.profiles?.username || 'Unknown Author'}
                                    </Link>
                                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                                        {poem.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <span>Published {formatTime(poem.created_at)}</span>
                                        <span className="text-text-muted">|</span>
                                        <span className="bg-darker-bg px-2 py-1 rounded text-xs border border-text-muted">
                                            {poem.category || 'general'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="p-3 bg-darker-bg rounded-lg border border-text-muted text-text-primary hover:text-accent hover:border-accent transition"
                                        title="Share"
                                    >
                                        <FiShare2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Poem Content */}
                            <div className="prose prose-invert max-w-none">
                                <pre className="text-base md:text-lg leading-relaxed text-text-secondary whitespace-pre-wrap font-gelasio">
                                    {poem.content}
                                </pre>
                            </div>

                            {/* Interaction Buttons */}
                            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-text-muted/30">
                                <LikeButton
                                    poemId={poem.id}
                                    initialLiked={false}
                                    initialCount={0}
                                />
                                <SaveButton
                                    poemId={poem.id}
                                    initialSaved={false}
                                    initialCount={0}
                                />
                                <span className="text-text-secondary text-sm">
                                    {poem.profiles?.username || 'Anonymous'}
                                </span>
                            </div>
                        </div>

                        {/* Author Info */}
                        {author && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-text-primary mb-4">About the Author</h2>
                                <div className="flex items-center gap-4 p-4 bg-card-bg rounded-xl border border-text-muted">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                                        {author.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-text-primary font-semibold">
                                            {author.username || 'Anonymous'}
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            {author.bio || 'No bio available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        <CommentsList poemId={poem.id} />

                        {/* Back Button */}
                        <div className="mt-8">
                            <Link
                                to="/profile"
                                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                Back to Feed
                            </Link>
                        </div>
                    </div>
                </section>

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
