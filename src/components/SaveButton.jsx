import { useState } from 'react';
import { toggleSave } from '../config/saved';
import toast from 'react-hot-toast';
import { RiBookmarkFill, RiBookmarkLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                saved 
                ? 'bg-accent/10 border-accent/20 text-accent' 
                : 'bg-glass border-glass-border text-text-secondary hover:border-accent/30 hover:text-accent'
            }`}
        >
            <div className="relative">
                <AnimatePresence mode="wait">
                    {saved ? (
                        <motion.div
                            key="filled"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                        >
                            <RiBookmarkFill size={22} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="outline"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                        >
                            <RiBookmarkLine size={22} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span className="font-medium text-sm">{count}</span>
        </motion.button>
    );
};

export default SaveButton;
