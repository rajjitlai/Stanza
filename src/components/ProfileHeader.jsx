import { useEffect, useState } from 'react';
import { getUserProfile, getUserStats } from '../config/supabase';
import FollowButton from './FollowButton';

const ProfileHeader = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ poems: 0, likes: 0, followers: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        try {
            const [profileData, statsData] = await Promise.all([
                getUserProfile(userId),
                getUserStats(userId)
            ]);
            setProfile(profileData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentUserId = localStorage.getItem('userId');
    const isOwnProfile = currentUserId === userId;

    if (isLoading) {
        return (
            <div className="bg-card-bg rounded-xl p-6 border border-text-muted">
                <div className="h-48 bg-accent/20 rounded-xl animate-pulse mb-4"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-24 h-24 rounded-full bg-accent/20 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-6 w-48 bg-accent/20 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-accent/20 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-bg rounded-xl border border-text-muted overflow-hidden">
            {/* Banner */}
            <div className="profile-banner relative">
                {profile?.banner_url ? (
                    <img src={profile.banner_url} alt="Banner" className="w-full h-full" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-darker-bg via-card-bg to-darker-bg"></div>
                )}
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={profile?.avatar_url || `/api/placeholder/96/96`}
                            alt={profile?.username || 'User'}
                            className="w-24 h-24 rounded-full border-4 border-darker-bg object-cover bg-card-bg"
                        />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-darker-bg rounded-full"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold text-text-primary">
                                {profile?.username || 'Anonymous'}
                            </h1>
                            {isOwnProfile && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                    You
                                </span>
                            )}
                        </div>
                        <p className="text-text-secondary text-sm mb-3">
                            Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm">
                            <div>
                                <span className="block font-bold text-text-primary">{stats.poems}</span>
                                <span className="text-text-muted">Poems</span>
                            </div>
                            <div>
                                <span className="block font-bold text-text-primary">{stats.likes}</span>
                                <span className="text-text-muted">Likes Received</span>
                            </div>
                            <div>
                                <span className="block font-bold text-text-primary">{stats.followers}</span>
                                <span className="text-text-muted">Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Follow Button */}
                    {!isOwnProfile && (
                        <div className="mt-2 md:mt-0 md:ml-4">
                            <FollowButton targetUserId={userId} />
                        </div>
                    )}
                </div>

                {/* Bio */}
                {profile?.bio && (
                    <div className="mt-4 p-4 bg-darker-bg rounded-lg">
                        <h3 className="text-sm font-semibold text-text-primary mb-2">About</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* Location (if available) */}
                {profile?.location && (
                    <div className="mt-3 flex items-center gap-2 text-text-secondary text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>{profile.location}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
