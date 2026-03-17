import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageAnimation from "../common/PageAnimation";
import { loginWithEmail, signupWithEmail } from "../config/supabase";
import toast from 'react-hot-toast';
import InputBox from '../components/InputBox';
import { MdEmail, MdLock } from 'react-icons/md';

// eslint-disable-next-line react/prop-types
const AuthForm = ({ type = "login" }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password) {
                toast.error('Please fill in all fields');
                setIsLoading(false);
                return;
            }

            if (!validateEmail(email)) {
                toast.error('Invalid email format');
                setIsLoading(false);
                return;
            }

            if (!validatePassword(password)) {
                toast.error('Password must be at least 6 characters');
                setIsLoading(false);
                return;
            }

            if (type === 'signup') {
                if (password !== confirmPassword) {
                    toast.error('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                await signupWithEmail(email, password);
                toast.success('Signup successful! Please log in.');
                navigate('/login');
            } else {
                await loginWithEmail(email, password);
                toast.success('Login successful!');
                navigate('/profile');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageAnimation keyValue={type}>
            <section className="h-cover flex items-center justify-center flex-col-reverse md:flex-row gap-10 bg-dark-bg">
                <div className="w-full md:w-1/2 p-3 flex flex-col gap-3">
                    <h2 className="text-3xl font-bold text-text-primary">Poetry Sharing Platform</h2>
                    <h3 className="text-lg mt-4 text-text-secondary">Share Your Poetry & Ideas</h3>
                    <p className="mt-2 text-xl text-text-secondary">
                        Join our community of poets and storytellers. Share your creative ideas and connect with others who appreciate poetry and writing.
                    </p>
                    <p className="mt-2 text-xl text-text-secondary">
                        For any issues, please contact our <Link to="mailto:support@poetryshare.com" className='text-accent underline text-xl'>support team.</Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='flex items-center flex-col gap-4 w-full md:w-1/2 p-3 bg-darker-bg rounded-2xl border border-text-muted/30 backdrop-blur-sm'>
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">{type === 'login' ? 'Login' : 'Sign Up'}</h2>

                    <InputBox
                        icon={<MdEmail />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <InputBox
                        icon={<MdLock />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />

                    {type === 'signup' && (
                        <InputBox
                            icon={<MdLock />}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                        />
                    )}

                    <button
                        type="submit"
                        className='btn-dark w-full'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : (type === 'login' ? 'Login' : 'Sign Up')}
                    </button>

                    <p className="text-center">
                        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <Link to={type === 'login' ? '/signup' : '/login'} className='text-accent underline'>
                            {type === 'login' ? 'Sign Up' : 'Login'}
                        </Link>
                    </p>
                </form>
            </section>
        </PageAnimation>
    );
};

export default AuthForm;
