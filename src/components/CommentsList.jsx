import { useState, useEffect } from 'react';
import { getPoemComments, addComment, deleteComment } from '../config/comments';
import toast from 'react-hot-toast';
import { RiMessage3Line, RiSendPlane2Line, RiDeleteBinLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const CommentsList = ({ poemId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        loadComments();
    }, [poemId]);

    const loadComments = async () => {
        try {
            const data = await getPoemComments(poemId);
            setComments(data || []);
        } catch (error) {
            toast.error(`Failed to load comments: ${error.message}`);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const data = await addComment(userId, poemId, newComment);
            setComments(prev => [data, ...prev]);
            setNewComment('');
            toast.success('Reflection added');
        } catch (error) {
            toast.error(`Failed to add comment: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('Reflection removed');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 text-text-primary">
                <RiMessage3Line className="text-accent text-2xl" />
                <h3 className="text-xl font-serif font-bold">Reflections ({comments.length})</h3>
            </div>

            {/* Comment Form */}
            {userId ? (
                <form onSubmit={handleAddComment} className="glass-card p-6 focus-within:border-accent/30 transition-colors">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Leave a reflection on this stanza..."
                        rows="3"
                        className="w-full bg-transparent border-none text-text-secondary placeholder:text-text-muted/50 outline-none resize-none font-serif italic"
                    />
                    <div className="flex justify-end mt-4 pt-4 border-t border-glass-border">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isLoading}
                            className="btn-primary !py-2 !px-5 text-sm"
                        >
                            <RiSendPlane2Line size={18} />
                            <span>{isLoading ? 'Sending...' : 'Post Reflection'}</span>
                        </button>
                    </div>
                </form>
            ) : (
                <div className="glass-card p-6 text-center">
                    <p className="text-text-secondary italic mb-4">You must be signed in to leave a reflection.</p>
                    <Link to="/login" className="btn-secondary inline-flex text-sm">Sign In</Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {comments.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 glass-card border-dashed"
                        >
                            <p className="text-text-muted italic">No reflections yet. Be the first to share yours.</p>
                        </motion.div>
                    ) : (
                        comments.map((comment, index) => (
                            <motion.div 
                                key={comment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card p-6 flex gap-4 group"
                            >
                                <div className="flex-none">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-glass to-glass-border flex items-center justify-center text-accent font-serif font-bold border border-glass-border shadow-inner">
                                        {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-text-primary font-bold font-serif">
                                                @{comment.profiles?.username || 'anonymous'}
                                            </span>
                                            <span className="h-1 w-1 bg-text-muted rounded-full" />
                                            <span className="text-xs text-text-muted uppercase tracking-wider">
                                                {formatTime(comment.created_at)}
                                            </span>
                                        </div>
                                        
                                        {userId === comment.user_id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all p-1"
                                                title="Delete reflection"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-text-secondary leading-relaxed italic font-serif">
                                        "{comment.content}"
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommentsList;
