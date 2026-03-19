import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageAnimation from "../common/PageAnimation";
import { loginWithEmail, signupWithEmail } from "../config/supabase";
import toast from 'react-hot-toast';
import InputBox from '../components/InputBox';
import { MdEmail, MdLock } from 'react-icons/md';
import { motion } from 'framer-motion';
import { RiQuillPenLine } from 'react-icons/ri';

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
                const { user } = await loginWithEmail(email, password);
                if (user) {
                    localStorage.setItem('userId', user.id);
                }
                toast.success('Login successful!');
                window.location.href = '/feed';
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageAnimation keyValue={type}>
            <div className="min-h-[90vh] pt-10 flex items-center justify-center p-4">
                <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Branding/Marketing */}
                    <div className="hidden md:block space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-darker-bg font-serif text-3xl font-bold shadow-accent-glow">
                                S
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                                Stanza<span className="text-accent">.</span>
                            </h1>
                        </div>
                        
                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-5xl font-serif font-bold leading-tight text-text-primary">
                                Where every word <br /> 
                                <span className="text-accent italic">finds its home.</span>
                            </h2>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-md italic font-serif">
                                "Poetry is the shadow cast by our streetlight imaginations." — Lawrence Ferlinghetti
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-bg bg-glass flex items-center justify-center text-[10px] font-bold text-accent">
                                        P{i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-text-muted">Join 500+ poets sharing their stanzas daily.</p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />
                        
                        <div className="relative z-10">
                            <div className="mb-10">
                                <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">
                                    {type === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
                                </h2>
                                <p className="text-text-secondary">
                                    {type === 'login' ? 'The ink is waiting. Continue your story.' : 'Create your account and start sharing stanzas.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                                            <MdEmail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all text-text-primary placeholder:text-text-muted/50"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                                            <MdLock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all text-text-primary placeholder:text-text-muted/50"
                                        />
                                    </div>

                                    {type === 'signup' && (
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                                                <MdLock size={20} />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm Password"
                                                className="w-full bg-glass border border-glass-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all text-text-primary placeholder:text-text-muted/50"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full justify-center !py-3.5 mt-8 shadow-accent-glow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-darker-bg/30 border-t-darker-bg rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <RiQuillPenLine size={20} />
                                            <span>{type === 'login' ? 'Login' : 'Create Account'}</span>
                                        </>
                                    )}
                                </button>

                                <div className="pt-6 text-center border-t border-glass-border">
                                    <p className="text-text-secondary text-sm">
                                        {type === 'login' ? "New to the community? " : "Already sharing stanzas? "}
                                        <Link to={type === 'login' ? '/signup' : '/login'} className="text-accent font-bold hover:text-accent-light transition-colors underline underline-offset-4 decoration-accent/30">
                                            {type === 'login' ? 'Create an account' : 'Sign in here'}
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageAnimation>
    );
};

export default AuthForm;
