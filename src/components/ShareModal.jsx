import { useState, useRef, useEffect } from 'react';
import { FiShare2, FiCheck, FiCopy, FiTwitter, FiFacebook, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
        const text = encodeURIComponent(`Check out this poem: ${poemTitle}`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-card-bg border border-text-muted rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-text-primary">Share Poem</h3>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-text-secondary mb-4">Share this poem with your friends:</p>

                    {/* Copy Link */}
                    <button
                        onClick={copyLink}
                        className="w-full flex items-center justify-between p-4 bg-darker-bg rounded-lg border border-text-muted hover:border-accent/50 transition group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${showCopied ? 'bg-green-500/20 text-green-500' : 'bg-accent/20 text-accent'}`}>
                                {showCopied ? <FiCheck size={20} /> : <FiLink size={20} />}
                            </div>
                            <span className="text-text-primary font-medium">Copy Link</span>
                        </div>
                        {showCopied && <span className="text-green-500 text-sm">Copied!</span>}
                    </button>

                    {/* Social Sharing */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={shareTwitter}
                            className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 rounded-lg transition group"
                        >
                            <FiTwitter className="text-[#1DA1F2] group-hover:scale-110 transition" size={20} />
                            <span className="text-[#1DA1F2] font-medium">Twitter</span>
                        </button>
                        <button
                            onClick={shareFacebook}
                            className="flex items-center justify-center gap-2 p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 rounded-lg transition group"
                        >
                            <FiFacebook className="text-[#1877F2] group-hover:scale-110 transition" size={20} />
                            <span className="text-[#1877F2] font-medium">Facebook</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-text-muted text-center">
                    <p className="text-xs text-text-muted">
                        Share the poetry! 🖋️
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
