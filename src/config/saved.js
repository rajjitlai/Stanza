import { supabase } from './supabase';

// Check if a poem is saved by a user
export const checkSaved = async (userId, poemId) => {
    const { data, error } = await supabase
        .from('saved_poems')
        .select()
        .eq('user_id', userId)
        .eq('poem_id', poemId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Get total saves for a poem
export const getPoemSaves = async (poemId) => {
    const { data, error } = await supabase
        .from('saved_poems')
        .select('id')
        .eq('poem_id', poemId);

    if (error) throw error;
    return data?.length || 0;
};

// Save a poem
export const savePoem = async (userId, poemId) => {
    const { data, error } = await supabase
        .from('saved_poems')
        .insert([{ user_id: userId, poem_id: poemId }])
        .select();

    if (error) throw error;
    return data[0];
};

// Remove a saved poem
export const unsavePoem = async (userId, poemId) => {
    const { error } = await supabase
        .from('saved_poems')
        .delete()
        .eq('user_id', userId)
        .eq('poem_id', poemId);

    if (error) throw error;
};

// Toggle save (save if not saved, unsave if saved)
export const toggleSave = async (userId, poemId, isSaved) => {
    try {
        if (isSaved) {
            await unsavePoem(userId, poemId);
            return false;
        } else {
            await savePoem(userId, poemId);
            return true;
        }
    } catch (error) {
        throw error;
    }
};

// Get all saved poems for a user
export const getSavedPoems = async (userId) => {
    const { data, error } = await supabase
        .from('saved_poems')
        .select('poem_id')
        .eq('user_id', userId);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    const poemIds = data.map(saved => saved.poem_id);
    const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('*, profiles(username, avatar_url)')
        .in('id', poemIds)
        .order('created_at', { ascending: false });

    if (poemsError) throw poemsError;
    return poems;
};

// Bulk get save counts for multiple poems
export const getPoemsSaveCounts = async (poemIds) => {
    if (poemIds.length === 0) return {};

    const { data, error } = await supabase
        .from('saved_poems')
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
