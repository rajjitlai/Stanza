import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthSession } from '../config/supabase';

const PublicRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await getAuthSession();
                setIsAuthenticated(!!session?.user);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/profile" /> : <Outlet />;
};

export default PublicRoute;
