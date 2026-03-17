import { useState } from 'react';
import { toggleSave } from '../config/saved';
import toast from 'react-hot-toast';
import { FiBookmark } from 'react-icons/fi';

const SaveButton = ({ poemId, initialSaved = false, initialCount = 0 }) => {
    const [saved, setSaved] = useState(initialSaved);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    const handleSave = async () => {
        if (!userId) {
            toast.error('Please log in to save poems');
            return;
        }

        setIsLoading(true);
        try {
            const newSavedState = await toggleSave(userId, poemId, saved);
            setSaved(newSavedState);
            setCount(prev => newSavedState ? prev + 1 : prev - 1);
        } catch (error) {
            toast.error(`Failed to save poem: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 text-text-secondary hover:text-yellow-500 transition disabled:opacity-50"
        >
            {saved ? (
                <FiBookmark size={20} className="text-yellow-500" />
            ) : (
                <FiBookmark size={20} />
            )}
            <span className="text-sm font-medium">{count}</span>
        </button>
    );
};

export default SaveButton;
