// src/components/Catalog.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const { addToCart } = useContext(CartContext); 
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext); 

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/Books');
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load books. Is the backend running?');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Dynamically extract unique categories from the loaded books
    const uniqueCategories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

    // Calculate count of books in each category
    const categoryCounts = books.reduce((acc, book) => {
        if (book.category) {
            acc[book.category] = (acc[book.category] || 0) + 1;
        }
        return acc;
    }, {});

    // Filter books based on search query, selected category, and stock availability
    const filteredBooks = books.filter(book => {
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (book.category && book.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStock = !inStockOnly || book.stockQuantity > 0;
        return matchesCategory && matchesSearch && matchesStock;
    });

    const resetFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
        setInStockOnly(false);
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">Loading BookNest Catalog...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl">{error}</div>;
    }

    const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '' || inStockOnly;

    return (
        <div className="bg-slate-900 p-6 sm:p-10 pt-12 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 mb-3 tracking-tight">
                        Discover Your Next Great Read
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                        Explore our curated selection of bestselling books, programming guides, and timeless literature.
                    </p>
                </div>

                {/* Filter & Search Toolbar */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-700 shadow-xl space-y-6">
                    {/* Top Row: Search Bar + In Stock Toggle */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Search Bar */}
                        <div className="md:col-span-8 relative">
                            <input
                                type="text"
                                placeholder="Search by title, author, category, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner text-sm"
                            />
                            {/* Search Icon */}
                            <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-sm"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* In Stock Toggle Checkbox */}
                        <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-700/60">
                            <label htmlFor="inStockCheckbox" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                                In Stock Only
                            </label>
                            <input
                                id="inStockCheckbox"
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="w-4 h-4 text-emerald-600 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {uniqueCategories.length > 1 && (
                        <div className="pt-2 border-t border-slate-700/60">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Categories:</span>
                                {uniqueCategories.map((cat) => {
                                    const count = cat === 'All' ? books.length : (categoryCounts[cat] || 0);
                                    const isSelected = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-emerald-500/20 scale-105'
                                                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                                            }`}
                                        >
                                            <span>{cat}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count Bar */}
                <div className="flex items-center justify-between gap-4 mb-6 px-1">
                    <div className="text-slate-400 text-sm">
                        Showing <span className="text-emerald-400 font-bold">{filteredBooks.length}</span> of <span className="text-white font-semibold">{books.length}</span> total books
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium underline flex items-center gap-1"
                        >
                            ✕ Reset Filters
                        </button>
                    )}
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center text-slate-400 text-lg py-16 px-6 bg-slate-800/40 rounded-2xl border border-slate-800 max-w-lg mx-auto shadow-xl">
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            We couldn't find any books matching your current search or filter criteria.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-emerald-500/50 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 group flex flex-col">

                                {/* Image Container */}
                                <div className="h-72 overflow-hidden bg-slate-700 relative">
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">No Cover Image</div>
                                    )}

                                    {/* Wishlist Heart Button */}
                                    <button 
                                        onClick={() => isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book)}
                                        className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-lg backdrop-blur-md border ${
                                            isInWishlist(book.id) 
                                                ? 'bg-purple-600/90 text-white border-purple-500 hover:bg-purple-700' 
                                                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-purple-400'
                                        }`}
                                        title={isInWishlist(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <svg className="w-4 h-4" fill={isInWishlist(book.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                    </button>
                                    
                                    {/* Category Badge */}
                                    {book.category && (
                                        <div className="absolute top-3 left-3 bg-purple-900/90 backdrop-blur-sm text-purple-200 font-medium px-2.5 py-1 rounded-md text-xs border border-purple-500/30">
                                            {book.category}
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-emerald-400 font-bold px-3 py-1 rounded-full text-sm shadow-lg border border-emerald-500/30">
                                        ₹{book.price.toFixed(2)}
                                    </div>
                                    {book.stockQuantity < 5 && (
                                        <div className="absolute bottom-3 left-3 bg-red-600/90 text-white font-bold px-2 py-1 rounded-md text-xs shadow-lg">
                                            Only {book.stockQuantity} left!
                                        </div>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
                                    <p className="text-emerald-400/80 text-sm mb-3 font-medium">{book.author}</p>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">
                                        {book.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-700 flex gap-2">
                                        <Link
                                            to={`/book/${book.id}`}
                                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg text-center text-sm"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => addToCart(book)}
                                            disabled={book.stockQuantity === 0}
                                            className={`flex-1 font-bold py-2.5 rounded-xl transition-colors shadow-lg text-sm ${
                                                book.stockQuantity === 0
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                                            }`}
                                        >
                                            {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
