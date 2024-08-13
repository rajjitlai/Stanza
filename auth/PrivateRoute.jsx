import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { account } from '../config/appwrite';

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await account.get();
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
};

export default PrivateRoute;
