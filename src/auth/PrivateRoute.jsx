import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthSession } from '../config/supabase';

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await getAuthSession();
                if (session?.user) {
                    localStorage.setItem('userId', session.user.id);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
};

export default PrivateRoute;
