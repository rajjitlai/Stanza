import { useState, useRef, useEffect } from 'react';
import { FiShare2, FiCheck, FiCopy, FiTwitter, FiFacebook, FiLink, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ShareModal = ({ poemId, poemTitle, onClose }) => {
    const [showCopied, setShowCopied] = useState(false);
    const modalRef = useRef(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const copyLink = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            setShowCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setShowCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const shareTwitter = () => {
        const text = encodeURIComponent(`Check out this stanza: "${poemTitle}" on Stanza`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-darker-bg/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                ref={modalRef} 
                className="glass-card max-w-md w-full p-6 md:p-8 relative overflow-hidden"
            >
                {/* Decorative Background */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/20 text-accent rounded-xl">
                                <FiShare2 size={24} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-text-primary">Share Stanza</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-muted hover:text-text-primary hover:bg-glass rounded-xl transition-all"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <p className="text-text-secondary italic font-serif">
                            Spread the rhythm. Share this masterpiece with the world.
                        </p>

                        {/* Copy Link Section */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Universal Link</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-darker-bg/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-text-muted truncate font-mono">
                                    {window.location.href}
                                </div>
                                <button
                                    onClick={copyLink}
                                    className={`p-3 rounded-xl border transition-all duration-300 ${
                                        showCopied 
                                        ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                                        : 'bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-darker-bg shadow-accent-glow'
                                    }`}
                                    title="Copy to clipboard"
                                >
                                    {showCopied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={shareTwitter}
                                className="flex items-center justify-center gap-3 p-4 bg-glass border border-glass-border hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/5 rounded-2xl transition-all group"
                            >
                                <FiTwitter className="text-[#1DA1F2] group-hover:scale-110 transition-transform" size={24} />
                                <span className="font-medium text-[#1DA1F2]">Twitter</span>
                            </button>
                            <button
                                onClick={shareFacebook}
                                className="flex items-center justify-center gap-3 p-4 bg-glass border border-glass-border hover:border-[#1877F2]/50 hover:bg-[#1877F2]/5 rounded-2xl transition-all group"
                            >
                                <FiFacebook className="text-[#1877F2] group-hover:scale-110 transition-transform" size={24} />
                                <span className="font-medium text-[#1877F2]">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-glass-border text-center">
                        <p className="text-xs text-text-muted font-serif italic">
                            "Poetry is the rhythmical creation of beauty in words."
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ShareModal;
