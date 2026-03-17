import { useState } from 'react';
import { toggleFollow } from '../config/follow';
import toast from 'react-hot-toast';

const FollowButton = ({ targetUserId, initialFollowing = false }) => {
    const [following, setFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    const handleFollow = async () => {
        if (!userId) {
            toast.error('Please log in to follow users');
            return;
        }

        if (userId === targetUserId) {
            toast.error("You can't follow yourself");
            return;
        }

        setIsLoading(true);
        try {
            const newFollowingState = await toggleFollow(userId, targetUserId, following);
            setFollowing(newFollowingState);
        } catch (error) {
            toast.error(`Failed to follow user: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading || userId === targetUserId}
            className={`px-6 py-2 rounded-full font-semibold transition ${
                following
                    ? 'bg-card-bg border border-text-muted text-text-primary hover:bg-error/20 hover:text-error'
                    : 'bg-accent text-dark-bg hover:bg-accent/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isLoading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
        </button>
    );
};

export default FollowButton;
