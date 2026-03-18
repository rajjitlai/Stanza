import { supabase } from './supabase';

// Get all comments for a poem
export const getPoemComments = async (poemId) => {
    if (!poemId || poemId === 'null') return [];
    
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url), replies:comments(*)')
        .eq('poem_id', poemId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

// Get replies to a specific comment
export const getCommentReplies = async (commentId) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('parent_comment_id', commentId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

// Add a comment to a poem
export const addComment = async (userId, poemId, content, parentCommentId = null) => {
    const { data, error } = await supabase
        .from('comments')
        .insert([{
            user_id: userId,
            poem_id: poemId,
            content,
            parent_comment_id: parentCommentId,
            created_at: new Date(),
        }])
        .select('*, profiles(username, avatar_url)')
        .single();

    if (error) throw error;
    return data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
    const { data, error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date() })
        .eq('id', commentId)
        .select('*, profiles(username, avatar_url)')
        .single();

    if (error) throw error;
    return data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) throw error;
};

// Check if a comment belongs to a user
export const isCommentOwner = (comment, userId) => {
    return comment.user_id === userId;
};
