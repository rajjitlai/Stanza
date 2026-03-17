import { supabase } from './supabase';

// Check if a user has liked a poem
export const checkUserLike = async (userId, poemId) => {
    const { data, error } = await supabase
        .from('user_likes')
        .select()
        .eq('user_id', userId)
        .eq('poem_id', poemId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Get total likes for a poem
export const getPoemLikes = async (poemId) => {
    const { data, error } = await supabase
        .from('user_likes')
        .select('id')
        .eq('poem_id', poemId);

    if (error) throw error;
    return data?.length || 0;
};

// Add a like for a poem
export const addLike = async (userId, poemId) => {
    const { data, error } = await supabase
        .from('user_likes')
        .insert([{ user_id: userId, poem_id: poemId }])
        .select();

    if (error) throw error;
    return data[0];
};

// Remove a like for a poem
export const removeLike = async (userId, poemId) => {
    const { error } = await supabase
        .from('user_likes')
        .delete()
        .eq('user_id', userId)
        .eq('poem_id', poemId);

    if (error) throw error;
};

// Toggle like (add if not liked, remove if liked)
export const toggleLike = async (userId, poemId, currentLiked) => {
    try {
        if (currentLiked) {
            await removeLike(userId, poemId);
            return false;
        } else {
            await addLike(userId, poemId);
            return true;
        }
    } catch (error) {
        throw error;
    }
};

// Get all poems liked by a user
export const getUserLikedPoems = async (userId) => {
    const { data, error } = await supabase
        .from('user_likes')
        .select('poem_id')
        .eq('user_id', userId);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    const poemIds = data.map(like => like.poem_id);
    const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .in('id', poemIds)
        .order('created_at', { ascending: false });

    if (poemsError) throw poemsError;
    return poems;
};

// Bulk get like counts for multiple poems
export const getPoemsLikeCounts = async (poemIds) => {
    if (poemIds.length === 0) return {};

    const { data, error } = await supabase
        .from('user_likes')
        .select('poem_id, count')
        .in('poem_id', poemIds)
        .group('poem_id');

    if (error) throw error;

    const counts = {};
    data.forEach(item => {
        counts[item.poem_id] = item.count;
    });

    return counts;
};
