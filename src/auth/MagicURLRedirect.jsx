import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyMagicURL } from '../config/appwrite';
import toast from 'react-hot-toast';

const MagicURLRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                toast.dismiss();
                const user = await verifyMagicURL();
                if (user) {
                    toast.success('Login successful!');
                    navigate('/profile');
                }
            } catch (error) {
                toast.dismiss();
                toast.error(`Verification failed: ${error.message}`);
                navigate('/login');
            }
        };

        verifyUser();
    }, [navigate]);

    return <p>Verifying...</p>;
};

export default MagicURLRedirect;
