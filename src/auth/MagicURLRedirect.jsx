import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // This component handles auth redirects if needed
        // With Supabase, most redirects are handled automatically
        // This can be used for password reset, email verification, etc.

        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type'); // e.g., 'recovery', 'invite', 'signup'

        if (!type) {
            window.location.href = '/feed';
            return;
        }

        toast.success('Authentication processed!');
        window.location.href = '/feed';
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Processing authentication...</p>
        </div>
    );
};

export default AuthRedirect;
