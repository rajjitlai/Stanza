import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const AdminRoute = () => {
    const { user, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (!loading && user && !isAdmin) {
            toast.error('Access denied. Admin privileges required.');
        }
    }, [loading, user, isAdmin]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="spinner mb-4" />
                <p className="text-text-muted italic text-sm">Verifying administrative access...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/feed" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
