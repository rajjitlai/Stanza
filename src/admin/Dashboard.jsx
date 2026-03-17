import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPoems, getAllUsers, deleteUser, deletePoem, getUserProfile } from '../config/supabase';
import toast from 'react-hot-toast';
import PageAnimation from '../common/PageAnimation';

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

    const getStats = () => {
        return {
            totalPoems: poems.length,
            totalUsers: users.length,
            totalComments: 0,
            totalLikes: 0
        };
    };

    const stats = getStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <PageAnimation>
            <div className="bg-dark-bg min-h-screen">
                <section className="py-8">
                    <div className="mx-auto max-w-[900px] px-4">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
                            <p className="text-text-secondary">Manage your poetry platform</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-card-bg p-4 rounded-xl border border-text-muted">
                                <div className="text-2xl font-bold text-accent">{stats.totalPoems}</div>
                                <div className="text-xs text-text-muted">Total Poems</div>
                            </div>
                            <div className="bg-card-bg p-4 rounded-xl border border-text-muted">
                                <div className="text-2xl font-bold text-accent">{stats.totalUsers}</div>
                                <div className="text-xs text-text-muted">Total Users</div>
                            </div>
                            <div className="bg-card-bg p-4 rounded-xl border border-text-muted">
                                <div className="text-2xl font-bold text-accent">0</div>
                                <div className="text-xs text-text-muted">Comments</div>
                            </div>
                            <div className="bg-card-bg p-4 rounded-xl border border-text-muted">
                                <div className="text-2xl font-bold text-accent">0</div>
                                <div className="text-xs text-text-muted">Likes</div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-text-muted">
                            <button
                                onClick={() => setActiveTab('poems')}
                                className={`pb-3 px-4 font-semibold transition relative ${
                                    activeTab === 'poems'
                                        ? 'text-accent'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Poems
                                {activeTab === 'poems' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`pb-3 px-4 font-semibold transition relative ${
                                    activeTab === 'users'
                                        ? 'text-accent'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                Users
                                {activeTab === 'users' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="bg-card-bg rounded-xl border border-text-muted overflow-hidden">
                            {activeTab === 'poems' ? (
                                <>
                                    {/* Poems Table Header */}
                                    <div className="p-4 border-b border-text-muted grid grid-cols-12 gap-4 text-xs font-semibold text-text-muted uppercase">
                                        <div className="col-span-6">Title</div>
                                        <div className="col-span-2">Author</div>
                                        <div className="col-span-2">Category</div>
                                        <div className="col-span-1">Date</div>
                                        <div className="col-span-1 text-right">Actions</div>
                                    </div>

                                    {/* Poems List */}
                                    <div className="divide-y divide-text-muted">
                                        {poems.length === 0 ? (
                                            <div className="p-8 text-center text-text-secondary">
                                                No poems found
                                            </div>
                                        ) : (
                                            poems.map((poem) => (
                                                <div key={poem.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-6">
                                                        <div className="text-text-primary font-medium">
                                                            {poem.title || 'Untitled'}
                                                        </div>
                                                        <div className="text-xs text-text-muted truncate">
                                                            {poem.content}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-text-secondary">
                                                        {poem.profiles?.username || 'Unknown'}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="bg-darker-bg px-2 py-1 rounded text-xs border border-text-muted">
                                                            {poem.category || 'general'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-1 text-text-secondary text-sm">
                                                        {formatDate(poem.created_at)}
                                                    </div>
                                                    <div className="col-span-1 flex justify-end">
                                                        <button
                                                            onClick={() => handleDeletePoem(poem.id)}
                                                            className="p-2 text-error hover:bg-error/20 rounded transition"
                                                            title="Delete poem"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Users Table Header */}
                                    <div className="p-4 border-b border-text-muted grid grid-cols-12 gap-4 text-xs font-semibold text-text-muted uppercase">
                                        <div className="col-span-5">User</div>
                                        <div className="col-span-3">Joined</div>
                                        <div className="col-span-2">Poems</div>
                                        <div className="col-span-2 text-right">Actions</div>
                                    </div>

                                    {/* Users List */}
                                    <div className="divide-y divide-text-muted">
                                        {users.length === 0 ? (
                                            <div className="p-8 text-center text-text-secondary">
                                                No users found
                                            </div>
                                        ) : (
                                            users.map((user) => (
                                                <div key={user.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-5 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="text-text-primary font-medium">
                                                                {user.username || 'Anonymous'}
                                                            </div>
                                                            <div className="text-xs text-text-muted">
                                                                {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 text-text-secondary text-sm">
                                                        {formatDate(user.created_at)}
                                                    </div>
                                                    <div className="col-span-2 text-text-secondary">
                                                        {user.poems_count || 0} poems
                                                    </div>
                                                    <div className="col-span-2 flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-error hover:bg-error/20 rounded transition"
                                                            title="Delete user"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PageAnimation>
    );
};

export default AdminDashboard;
