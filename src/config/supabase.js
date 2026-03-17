import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export const signupWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

export const getAuthSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session;
};

// Poem operations
export const createPoem = async (userId, title, content, category = 'general') => {
    const { data, error } = await supabase
        .from('poems')
        .insert([{
            user_id: userId,
            title,
            content,
            category,
            created_at: new Date(),
        }])
        .select();
    if (error) throw error;
    return data[0];
};

export const updatePoem = async (id, updates) => {
    const { data, error } = await supabase
        .from('poems')
        .update(updates)
        .eq('id', id)
        .select();
    if (error) throw error;
    return data[0];
};

export const deletePoem = async (id) => {
    const { error } = await supabase
        .from('poems')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

export const getUserPoems = async (userId) => {
    const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllPoems = async () => {
    const { data, error } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getPoemById = async (id) => {
    const { data, error } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

// Advanced Search
export const searchPoems = async (query, category = null) => {
    let queryBuilder = supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (category) {
        queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
};

// Search by username
export const searchByAuthor = async (username) => {
    const { data, error } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .ilike('profiles.username', `%${username}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

// Profile operations
export const getCommentsForPoem = async (poemId) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('poem_id', poemId)
        .eq('parent_comment_id', null)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const addCommentToPoem = async (userId, poemId, content) => {
    const { data, error } = await supabase
        .from('comments')
        .insert([{
            user_id: userId,
            poem_id: poemId,
            content,
            created_at: new Date(),
        }])
        .select('*, profiles(username, avatar_url)')
        .single();

    if (error) throw error;
    return data;
};

export const deleteCommentById = async (commentId) => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) throw error;
};

// Profile operations
export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();
    if (error) throw error;
    return data[0];
};

// Get user statistics
export const getUserStats = async (userId) => {
    try {
        // Get poem count
        const { count: poemCount } = await supabase
            .from('poems')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Get like count (across all user's poems)
        const { count: likeCount } = await supabase
            .from('user_likes')
            .select('id', { count: 'exact', head: true })
            .in('poem_id', supabase
                .from('poems')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId)
            );

        // Get follower count
        const { count: followerCount } = await supabase
            .from('followers')
            .select('follower_id', { count: 'exact', head: true })
            .eq('following_id', userId);

        return {
            poems: poemCount || 0,
            likes: likeCount || 0,
            followers: followerCount || 0,
        };
    } catch (error) {
        console.error('Error getting user stats:', error);
        return { poems: 0, likes: 0, followers: 0 };
    }
};

// Admin functions
export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, poems(count)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const deleteUser = async (userId) => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) throw error;
};

// Get user poems with count
export const getUserPoemsWithCount = async (userId) => {
    const { data, error } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export default supabase;
