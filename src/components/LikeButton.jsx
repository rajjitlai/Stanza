import { useState } from 'react';
import { toggleLike } from '../config/likes';
import toast from 'react-hot-toast';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

const LikeButton = ({ poemId, initialLiked = false, initialCount = 0 }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    const handleLike = async () => {
        if (!userId) {
            toast.error('Please log in to like poems');
            return;
        }

        setIsLoading(true);
        try {
            const newLikedState = await toggleLike(userId, poemId, liked);
            setLiked(newLikedState);
            setCount(prev => newLikedState ? prev + 1 : prev - 1);
        } catch (error) {
            toast.error(`Failed to like poem: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center gap-2 text-text-secondary hover:text-red-500 transition disabled:opacity-50"
        >
            {liked ? (
                <AiFillLike size={20} className="text-red-500" />
            ) : (
                <AiOutlineLike size={20} />
            )}
            <span className="text-sm font-medium">{count}</span>
        </button>
    );
};

export default LikeButton;
