import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="spinner mb-4" />
                <p className="text-text-muted italic text-sm">Checking status...</p>
            </div>
        );
    }

    return user ? <Navigate to="/feed" replace /> : <Outlet />;
};

export default PublicRoute;
