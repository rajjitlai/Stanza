import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchPoems } from '../config/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiFilter } from 'react-icons/fi';
import PageAnimation from '../common/PageAnimation';
import { CardSkeleton } from './Skeleton';

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const categories = ['all', 'general', 'love', 'nature', 'reflection', 'social', 'other'];

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || '';
        const cat = params.get('category') || 'all';
        setQuery(q);
        setCategory(cat);
        if (q) performSearch(q, cat);
    }, []);

    const performSearch = async (searchQuery, searchCategory) => {
        setIsLoading(true);
        try {
            const data = await searchPoems(searchQuery, searchCategory === 'all' ? null : searchCategory);
            setResults(data);
            setNoResults(data.length === 0);
        } catch (error) {
            toast.error(`Search failed: ${error.message}`);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(query, category);
    };

    return (
        <PageAnimation>
            <div className="pt-10 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header & Back Button */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/profile"
                                className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                            >
                                <div className="p-2 bg-glass border border-glass-border rounded-lg group-hover:border-accent/30 transition-all">
                                    <FiArrowLeft size={20} />
                                </div>
                                <span className="font-medium">Back to Feed</span>
                            </Link>
                            <div className="h-8 w-px bg-glass-border hidden md:block" />
                            <h1 className="text-3xl font-serif font-bold text-text-primary">
                                Search Results
                            </h1>
                        </div>
                        
                        <div className="text-sm text-text-muted uppercase tracking-widest font-medium bg-glass border border-glass-border px-4 py-2 rounded-full">
                            Found {results.length} stanza{results.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Search Controls */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-2 mb-12 flex flex-col md:flex-row gap-2"
                    >
                        <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row gap-2">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by title, author, or content..."
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 outline-none text-text-primary placeholder:text-text-muted/50"
                                />
                            </div>
                            
                            <div className="h-px md:h-8 w-full md:w-px bg-glass-border self-center" />
                            
                            <div className="relative group">
                                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors" />
                                <select
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        performSearch(query, e.target.value);
                                    }}
                                    className="w-full md:w-48 bg-transparent border-none py-3.5 pl-12 pr-8 outline-none text-text-primary appearance-none capitalize cursor-pointer font-medium"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-darker-bg text-text-primary">
                                            {cat === 'all' ? 'All Themes' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary !py-3.5 justify-center px-8"
                            >
                                Update Search
                            </button>
                        </form>
                    </motion.div>

                    {/* Content Section */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid gap-8"
                            >
                                {[1, 2].map(i => <CardSkeleton key={i} />)}
                            </motion.div>
                        ) : noResults ? (
                            <motion.div 
                                key="no-results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 glass-card"
                            >
                                <div className="w-20 h-20 bg-glass border border-glass-border rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted/30">
                                    <FiSearch size={40} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-text-primary mb-3">No stanzas found</h3>
                                <p className="text-text-secondary max-w-sm mx-auto mb-8 italic">
                                    "Sometimes the most beautiful poems are the ones yet to be found."
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => {
                                            setQuery('');
                                            setCategory('all');
                                            performSearch('', 'all');
                                        }}
                                        className="btn-secondary"
                                    >
                                        Clear Search
                                    </button>
                                    <Link to="/profile" className="btn-primary">
                                        Back to Feed
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-8"
                            >
                                {results.map((poem, index) => (
                                    <motion.div
                                        key={poem.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card group hover-lift overflow-hidden"
                                    >
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="category-badge">{poem.category || "general"}</span>
                                                        <span className="text-xs text-text-muted uppercase tracking-widest">
                                                            {new Date(poem.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <Link to={`/poem/${poem.id}`}>
                                                        <h3 className="poem-title group-hover:text-accent transition-colors !text-2xl">
                                                            {poem.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-text-secondary">
                                                        by <span className="font-serif italic text-text-primary">@{poem.profiles?.username || 'anonymous'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <p className="poem-text line-clamp-3 italic text-text-secondary/80 !text-base leading-relaxed">
                                                    {poem.content}
                                                </p>
                                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card-bg to-transparent" />
                                            </div>

                                            <div className="mt-8 flex items-center justify-between">
                                                <Link to={`/poem/${poem.id}`} className="text-accent font-medium flex items-center gap-2 hover:gap-3 transition-all">
                                                    Read full stanza <span className="text-lg">→</span>
                                                </Link>
                                                <div className="flex items-center gap-4 text-text-muted text-sm">
                                                    <span>{Math.ceil(poem.content.split(' ').length / 200)} min read</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageAnimation>
    );
};

export default SearchResults;
