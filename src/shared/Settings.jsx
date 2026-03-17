import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserProfile, updateUserProfile } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';

const Settings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            <div className="max-w-[900px] mx-auto p-6 bg-dark-bg h-cover">
                <h1 className="text-3xl font-bold mb-6 text-text-primary">Settings</h1>

                {/* Profile Settings */}
                <div className="bg-card-bg border border-text-muted rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">Profile Settings</h2>
                    <p className="text-text-secondary mb-4">
                        Manage your profile information and appearance
                    </p>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg px-4 py-2 focus:border-accent outline-none transition"
                                placeholder="Your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="3"
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg px-4 py-2 focus:border-accent outline-none transition"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg px-4 py-2 focus:border-accent outline-none transition"
                                placeholder="Where are you from?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg px-4 py-2 focus:border-accent outline-none transition"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Banner URL
                            </label>
                            <input
                                type="url"
                                value={bannerUrl}
                                onChange={(e) => setBannerUrl(e.target.value)}
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg px-4 py-2 focus:border-accent outline-none transition"
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-accent text-dark-bg px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Settings */}
                <div className="bg-card-bg border border-text-muted rounded-lg p-6 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Account</h2>
                        <p className="text-text-secondary mb-4">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="border-t border-text-muted pt-4">
                        <h3 className="font-semibold mb-3 text-text-primary">Danger Zone</h3>
                        <button
                            className="btn-dark py-2 px-4 rounded hover:bg-error hover:text-white transition"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-card-bg border border-text-muted rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">Preferences</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Email Notifications</span>
                            <div className="w-12 h-6 bg-accent/30 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-accent rounded-full absolute top-1 left-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Public Profile</span>
                            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageAnimation>
    );
};

export default Settings;
