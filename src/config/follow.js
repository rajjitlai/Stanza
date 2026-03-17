import { supabase } from './supabase';

// Check if a user is following another user
export const checkFollowing = async (followerId, followingId) => {
    const { data, error } = await supabase
        .from('followers')
        .select()
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Get followers count for a user
export const getFollowersCount = async (userId) => {
    const { data, error } = await supabase
        .from('followers')
        .select('follower_id', { count: 'exact' })
        .eq('following_id', userId);

    if (error) throw error;
    return data?.count || 0;
};

// Get following count for a user
export const getFollowingCount = async (userId) => {
    const { data, error } = await supabase
        .from('followers')
        .select('following_id', { count: 'exact' })
        .eq('follower_id', userId);

    if (error) throw error;
    return data?.count || 0;
};

// Follow a user
export const followUser = async (followerId, followingId) => {
    const { data, error } = await supabase
        .from('followers')
        .insert([{ follower_id: followerId, following_id: followingId }])
        .select('*, profiles!follower_id(username, avatar_url)');

    if (error) throw error;
    return data[0];
};

// Unfollow a user
export const unfollowUser = async (followerId, followingId) => {
    const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

    if (error) throw error;
};

// Toggle follow (follow if not following, unfollow if following)
export const toggleFollow = async (followerId, followingId, isFollowing) => {
    try {
        if (isFollowing) {
            await unfollowUser(followerId, followingId);
            return false;
        } else {
            await followUser(followerId, followingId);
            return true;
        }
    } catch (error) {
        throw error;
    }
};

// Get followers of a user
export const getFollowers = async (userId) => {
    const { data, error } = await supabase
        .from('followers')
        .select('follower_id, profiles(username, avatar_url)')
        .eq('following_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

// Get users that a user is following
export const getFollowing = async (userId) => {
    const { data, error } = await supabase
        .from('followers')
        .select('following_id, profiles(username, avatar_url)')
        .eq('follower_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

// Get feed of poems from users that the current user follows
export const getFollowedUsersPoems = async (userId) => {
    const { data: followers, error: followersError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);

    if (followersError) throw followersError;

    const followingIds = followers.map(f => f.following_id);
    if (followingIds.length === 0) return [];

    const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false });

    if (poemsError) throw poemsError;
    return poems;
};

// Get users that followers of this user are following (for "People you may know")
export const getSuggestedUsers = async (userId) => {
    const { data: followers, error } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId)
        .limit(10);

    if (error) throw error;

    if (followers.length === 0) return [];

    const followerIds = followers.map(f => f.follower_id);

    // Get distinct users that these followers follow, excluding the current user
    const { data: suggestions, error: suggestionsError } = await supabase
        .from('followers')
        .select('following_id, profiles(username, avatar_url)')
        .in('follower_id', followerIds)
        .neq('following_id', userId)
        .limit(5);

    if (suggestionsError) throw suggestionsError;

    return suggestions || [];
};
