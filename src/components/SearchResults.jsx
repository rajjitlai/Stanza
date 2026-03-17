import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchPoems } from '../config/supabase';
import toast from 'react-hot-toast';

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const categories = ['all', 'general', 'love', 'nature', 'reflection', 'social', 'other'];

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || '';
        const cat = params.get('category') || '';
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

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        if (query) {
            performSearch(query, e.target.value);
        }
    };

    return (
        <div className="bg-dark-bg min-h-screen">
            <section className="py-8">
                <div className="mx-auto max-w-[900px] px-4">
                    <h1 className="text-3xl font-bold text-text-primary mb-6">Search Results</h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8 p-4 bg-card-bg rounded-xl border border-text-muted flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search poems..."
                                className="w-full bg-darker-bg text-text-primary border border-text-muted rounded-lg py-3 pl-4 pr-4 outline-none focus:border-accent transition"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={handleCategoryChange}
                            className="bg-darker-bg text-text-primary border border-text-muted rounded-lg py-3 px-4 outline-none focus:border-accent transition"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="bg-accent text-dark-bg px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>

                    {/* Results Count */}
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-text-secondary">
                            Found {results.length} poem{results.length !== 1 ? 's' : ''}
                            {category !== 'all' && ` in ${category}`}
                        </span>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-10">
                            <div className="inline-block spinner mb-4"></div>
                            <p className="text-text-secondary">Searching...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {!isLoading && noResults && (
                        <div className="text-center py-16 bg-card-bg rounded-xl border border-text-muted">
                            <div className="text-6xl mb-4 opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-2">No poems found</h3>
                            <p className="text-text-secondary">
                                Try adjusting your search terms or filter
                            </p>
                            <Link to="/profile" className="mt-4 inline-block btn-light py-2 px-6">
                                Back to Feed
                            </Link>
                        </div>
                    )}

                    {/* Results List */}
                    {!isLoading && !noResults && (
                        <div className="grid gap-4">
                            {results.map((poem) => (
                                <div key={poem.id} className="card hover:bg-card-bg/80">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <Link to={`/poem/${poem.id}`}>
                                                <h3 className="text-xl font-bold text-text-primary hover:text-accent transition">
                                                    {poem.title}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-sm text-text-secondary">
                                                    By <span className="text-accent">{poem.profiles?.username || 'Unknown'}</span>
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    <span className="bg-darker-bg px-2 py-1 rounded text-xs border border-text-muted">
                                                        {poem.category || "general"}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-base text-text-secondary line-clamp-3 my-3 leading-relaxed">
                                        {poem.content}
                                    </p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-text-muted/30">
                                        <p className="text-xs text-text-muted">
                                            {new Date(poem.created_at).toLocaleDateString()}
                                        </p>
                                        <Link to={`/poem/${poem.id}`} className="text-accent text-sm hover:underline">
                                            Read Poem &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SearchResults;
