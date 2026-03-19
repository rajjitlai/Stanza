import { useState, useEffect } from 'react';
import { toggleLike } from '../config/likes';
import toast from 'react-hot-toast';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const LikeButton = ({ poemId, initialLiked = false, initialCount = 0 }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    // Sync state with props if they change
    useEffect(() => {
        setLiked(initialLiked);
        setCount(initialCount);
    }, [initialLiked, initialCount]);

    const handleLike = async () => {
        if (!userId) {
            toast.error('Please log in to like poems');
            return;
        }

        setIsLoading(true);
        // Optimistic update
        const prevLiked = liked;
        const prevCount = count;
        setLiked(!prevLiked);
        setCount(prev => !prevLiked ? prev + 1 : prev - 1);

        try {
            const newLikedState = await toggleLike(userId, poemId, prevLiked);
            // Confirm state from server
            setLiked(newLikedState);
        } catch (error) {
            // Revert on error
            setLiked(prevLiked);
            setCount(prevCount);
            toast.error(`Failed to like poem: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                liked 
                ? 'bg-error/10 border-error/20 text-error' 
                : 'bg-glass border-glass-border text-text-secondary hover:border-error/30 hover:text-error'
            }`}
        >
            <div className="relative">
                <AnimatePresence mode="wait">
                    {liked ? (
                        <motion.div
                            key="filled"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <RiHeartFill size={22} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="outline"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <RiHeartLine size={22} />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {liked && (
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 bg-error rounded-full -z-10"
                    />
                )}
            </div>
            <span className="font-medium text-sm">{count}</span>
        </motion.button>
    );
};

export default LikeButton;
