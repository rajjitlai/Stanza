import { useState, useEffect } from 'react';
import { getPoemComments, addComment, deleteComment } from '../config/comments';
import toast from 'react-hot-toast';
import { FiMessageCircle, FiSend } from 'react-icons/fi';

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
            setComments(data);
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
            setComments(prev => [...prev, data]);
            setNewComment('');
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
            toast.success('Comment deleted');
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
        <div className="mt-6 bg-card-bg rounded-xl p-4 border border-text-muted">
            <div className="flex items-center gap-2 mb-4 text-text-primary">
                <FiMessageCircle className="text-accent" />
                <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Comment Form */}
            {userId && (
                <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        className="w-full p-3 bg-darker-bg border border-text-muted rounded-lg text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-dark-bg rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiSend size={16} />
                            <span>Post Comment</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="flex-none">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                                    {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-text-primary font-semibold">
                                        {comment.profiles?.username || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {formatTime(comment.created_at)}
                                    </span>
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed mb-2">
                                    {comment.content}
                                </p>
                                <div className="flex items-center gap-3">
                                    {userId === comment.user_id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-xs text-error hover:text-error/80 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsList;
