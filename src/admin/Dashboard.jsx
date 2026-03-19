import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPoems, getAllUsers, deleteUser, deletePoem } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';
import { RiDashboardLine, RiQuillPenLine, RiUserLine, RiDeleteBin6Line, RiBarChartLine, RiDiscussLine, RiHeartFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('poems');
    const [poems, setPoems] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'poems') {
                const poemsData = await getAllPoems();
                setPoems(poemsData || []);
            } else {
                const usersData = await getAllUsers();
                setUsers(usersData || []);
            }
        } catch (error) {
            toast.error(`Failed to load data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePoem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poem?')) return;

        try {
            await deletePoem(id);
            toast.success('Poem deleted successfully');
            setPoems(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            toast.error(`Failed to delete poem: ${error.message}`);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(id);
            toast.success('User deleted successfully');
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            toast.error(`Failed to delete user: ${error.message}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const stats = {
        totalPoems: poems.length,
        totalUsers: users.length,
        totalComments: 0,
        totalLikes: 0
    };

    return (
        <PageAnimation>
            <div className="max-w-6xl mx-auto pt-10 pb-20 px-4">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12 glass-card p-6 md:p-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-text-primary">
                        <div className="p-3 bg-accent/20 text-accent rounded-2xl border border-accent/20">
                            <RiDashboardLine size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold">Admin Sanctum</h1>
                            <p className="text-xs text-text-secondary italic uppercase tracking-widest">Platform Oversight & Care</p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {[
                        { label: 'Total Stanzas', value: stats.totalPoems, icon: <RiQuillPenLine />, color: 'text-accent' },
                        { label: 'Total Poets', value: stats.totalUsers, icon: <RiUserLine />, color: 'text-blue-400' },
                        { label: 'Reflections', value: 0, icon: <RiDiscussLine />, color: 'text-purple-400' },
                        { label: 'Adorations', value: 0, icon: <RiHeartFill />, color: 'text-error' }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-5 md:p-6 border-l-4 border-l-accent/20"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Metrics</span>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
                            <div className="text-[10px] md:text-xs text-text-secondary uppercase tracking-widest font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-1 bg-glass border border-glass-border rounded-2xl w-full sm:w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('poems')}
                        className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${
                            activeTab === 'poems'
                                ? 'bg-accent text-darker-bg shadow-lg shadow-accent/20'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Poetry Collection
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${
                            activeTab === 'users'
                                ? 'bg-accent text-darker-bg shadow-lg shadow-accent/20'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Registry of Poets
                    </button>
                </div>

                {/* Content Table */}
                <div className="glass-card overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 md:p-20 flex flex-col items-center justify-center"
                            >
                                <div className="spinner mb-4" />
                                <p className="text-text-muted italic text-sm">Gathering records...</p>
                            </motion.div>
                        ) : (
                            <div className="overflow-x-auto">
                                <motion.div 
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="min-w-[600px] md:min-w-full"
                                >
                                {activeTab === 'poems' ? (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-glass border-b border-glass-border">
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Stanza / Author</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Theme</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Published</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-glass-border">
                                            {poems.map(poem => (
                                                <tr key={poem.id} className="hover:bg-glass/50 transition-colors group">
                                                    <td className="px-6 py-6">
                                                        <div className="text-text-primary font-bold font-serif mb-1">{poem.title || 'Untitled'}</div>
                                                        <div className="text-xs text-text-muted italic">by {poem.profiles?.username || 'anonymous'}</div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="category-badge">{poem.category || 'general'}</span>
                                                    </td>
                                                    <td className="px-6 py-6 text-sm text-text-secondary">{formatDate(poem.created_at)}</td>
                                                    <td className="px-6 py-6 text-right">
                                                        <button 
                                                            onClick={() => handleDeletePoem(poem.id)}
                                                            className="p-3 text-text-muted hover:text-error hover:bg-error/5 rounded-xl transition-all"
                                                        >
                                                            <RiDeleteBin6Line size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-glass border-b border-glass-border">
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Poet</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Works</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Joined</th>
                                                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-glass-border">
                                            {users.map(user => (
                                                <tr key={user.id} className="hover:bg-glass/50 transition-colors group">
                                                    <td className="px-6 py-6 flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold">
                                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="text-text-primary font-bold font-serif">{user.username || 'Anonymous'}</div>
                                                            <div className="text-[10px] text-text-muted font-mono">{user.id}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-sm text-text-secondary font-medium">{user.poems?.length || 0} stanzas</td>
                                                    <td className="px-6 py-6 text-sm text-text-secondary">{formatDate(user.created_at)}</td>
                                                    <td className="px-6 py-6 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-3 text-text-muted hover:text-error hover:bg-error/5 rounded-xl transition-all"
                                                        >
                                                            <RiDeleteBin6Line size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </motion.div>
                        </div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </PageAnimation>
    );
};

export default AdminDashboard;
