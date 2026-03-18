import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserProfile, updateUserProfile } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';
import { RiUser3Line, RiShieldLine, RiNotification3Line, RiLogoutCircleLine, RiSaveLine, RiImageLine, RiMapPinLine, RiProfileLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Settings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form state
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            const profile = await getUserProfile(userId);
            setUsername(profile.username || '');
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setAvatarUrl(profile.avatar_url || '');
            setBannerUrl(profile.banner_url || '');
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('userId');
            toast.success('Logged out successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(`Logout failed: ${error.message}`);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error('Please log in to update your profile');
            return;
        }

        setIsLoading(true);
        try {
            const updates = {
                username: username.trim() || undefined,
                bio: bio.trim() || undefined,
                location: location.trim() || undefined,
                avatar_url: avatarUrl.trim() || undefined,
                banner_url: bannerUrl.trim() || undefined,
            };

            await updateUserProfile(userId, updates);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageAnimation>
            <div className="max-w-5xl mx-auto p-4 pt-10 pb-20">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-text-primary mb-2">Settings</h1>
                    <p className="text-text-secondary italic font-serif">Tailor your stanza experience</p>
                </header>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="md:col-span-1 space-y-2">
                        {[
                            { id: 'profile', label: 'Profile', icon: <RiUser3Line /> },
                            { id: 'account', label: 'Account', icon: <RiShieldLine /> },
                            { id: 'notifications', label: 'Preferences', icon: <RiNotification3Line /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                                    activeTab === tab.id
                                        ? "bg-accent text-darker-bg shadow-lg shadow-accent/20"
                                        : "text-text-secondary hover:bg-glass hover:text-text-primary"
                                }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                        
                        <div className="pt-8 mt-8 border-t border-glass-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-error hover:bg-error/5 transition-all duration-300"
                            >
                                <RiLogoutCircleLine className="text-xl" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="md:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8"
                        >
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSaveProfile} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-text-primary mb-2">
                                            <RiProfileLine className="text-accent text-xl" />
                                            <h2 className="text-2xl font-serif font-bold">Public Profile</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Username</label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Poetic moniker..."
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Location</label>
                                                <div className="relative">
                                                    <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                                    <input
                                                        type="text"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        placeholder="Where do your verses roam?"
                                                        className="input-field !pl-12"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Short Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="A few lines about your soul..."
                                                rows="4"
                                                className="input-field resize-none italic font-serif"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-glass-border">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Avatar URL</label>
                                                <div className="relative">
                                                    <RiImageLine className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                                    <input
                                                        type="url"
                                                        value={avatarUrl}
                                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                                        placeholder="https://..."
                                                        className="input-field !pl-12"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Banner URL</label>
                                                <div className="relative">
                                                    <RiImageLine className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                                    <input
                                                        type="url"
                                                        value={bannerUrl}
                                                        onChange={(e) => setBannerUrl(e.target.value)}
                                                        placeholder="https://..."
                                                        className="input-field !pl-12"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-glass-border">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn-primary !py-3 shadow-accent-glow"
                                        >
                                            <RiSaveLine size={20} />
                                            <span>{isLoading ? 'Updating Scroll...' : 'Save Stanza Profile'}</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'account' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-text-primary mb-6">
                                        <RiShieldLine className="text-accent text-xl" />
                                        <h2 className="text-2xl font-serif font-bold">Security</h2>
                                    </div>
                                    
                                    <div className="p-6 bg-glass border border-glass-border rounded-2xl border-dashed">
                                        <h3 className="text-lg font-serif font-bold text-text-primary mb-2">Change Password</h3>
                                        <p className="text-sm text-text-secondary mb-6 italic">Password resets are currently handled via email verification.</p>
                                        <button className="btn-secondary !text-sm">Request Reset Email</button>
                                    </div>

                                    <div className="pt-8 border-t border-glass-border">
                                        <h3 className="text-xl font-serif font-bold text-error mb-4">Danger Zone</h3>
                                        <div className="p-6 bg-error/5 border border-error/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <p className="text-text-primary font-bold">Delete Account</p>
                                                <p className="text-sm text-text-secondary italic">This will erase all your stanzas and reflections forever.</p>
                                            </div>
                                            <button className="px-6 py-2 rounded-xl bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white transition-all font-bold">
                                                Delete Forever
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-text-primary mb-6">
                                        <RiNotification3Line className="text-accent text-xl" />
                                        <h2 className="text-2xl font-serif font-bold">Preferences</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: "Email reflections", desc: "Get notified when someone reflects on your stanzas." },
                                            { label: "Poetic digests", desc: "Weekly selection of curated poetry from the community." },
                                            { label: "Public profile", desc: "Allow others to discover your collection of verses." }
                                        ].map((pref, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-glass rounded-xl border border-glass-border hover:border-accent/20 transition-colors">
                                                <div>
                                                    <p className="text-text-primary font-medium">{pref.label}</p>
                                                    <p className="text-xs text-text-muted italic">{pref.desc}</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${i === 2 ? 'bg-accent' : 'bg-glass-border'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${i === 2 ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
        </PageAnimation>
    );
};

export default Settings;
