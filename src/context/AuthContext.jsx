import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, getUserProfile, loginWithEmail, signupWithEmail, logout as supabaseLogout } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserProfile = useCallback(async (userId) => {
        try {
            const data = await getUserProfile(userId);
            setProfile(data || null);
        } catch (error) {
            console.error('Error loading profile in AuthContext:', error);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        // Initial session check
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user || null);

                if (currentSession?.user) {
                    localStorage.setItem('userId', currentSession.user.id);
                    await loadUserProfile(currentSession.user.id);
                } else {
                    localStorage.removeItem('userId');
                    setProfile(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);

            if (newSession?.user) {
                localStorage.setItem('userId', newSession.user.id);
                await loadUserProfile(newSession.user.id);
            } else {
                localStorage.removeItem('userId');
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadUserProfile]);

    const login = async (email, password) => {
        const data = await loginWithEmail(email, password);
        if (data?.user) {
            setUser(data.user);
            setSession(data.session);
            localStorage.setItem('userId', data.user.id);
            await loadUserProfile(data.user.id);
        }
        return data;
    };

    const signup = async (email, password) => {
        return await signupWithEmail(email, password);
    };

    const logoutUser = async () => {
        await supabaseLogout();
        setUser(null);
        setSession(null);
        setProfile(null);
        localStorage.removeItem('userId');
    };

    const refreshProfile = async () => {
        if (user?.id) {
            await loadUserProfile(user.id);
        }
    };

    const value = {
        user,
        session,
        profile,
        role: profile?.role || user?.app_metadata?.role || (user?.email?.endsWith('@admin.stanza') ? 'admin' : 'user'),
        isAdmin: (profile?.role === 'admin') || user?.app_metadata?.role === 'admin' || (user?.email?.endsWith('@admin.stanza')),
        loading,
        login,
        signup,
        logout: logoutUser,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
