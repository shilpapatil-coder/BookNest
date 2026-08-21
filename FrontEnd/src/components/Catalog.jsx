// src/components/Catalog.jsx
import { useState, useEffect, useContext } from 'react'; // <-- Added useContext here!
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useContext(CartContext); 


    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Anyone can view books, no login required!
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

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">Loading BookNest Catalog...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl">{error}</div>;
    }

    return (
        <div className="bg-slate-900 p-10 pt-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-12 text-center tracking-tight">
                    Discover Your Next Great Read
                </h1>

                {books.length === 0 ? (
                    <div className="text-center text-slate-400 text-xl mt-20">
                        No books available yet. Head over to the <Link to="/admin" className="text-purple-400 hover:text-purple-300 underline">Admin Dashboard</Link> to add some!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <div key={book.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-emerald-500/50 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 group flex flex-col">

                                {/* Image Container */}
                                <div className="h-72 overflow-hidden bg-slate-700 relative">
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">No Cover Image</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-emerald-400 font-bold px-3 py-1 rounded-full text-sm shadow-lg border border-emerald-500/30">
                                        ₹{book.price.toFixed(2)}
                                    </div>
                                    {book.stockQuantity < 5 && (
                                        <div className="absolute top-3 left-3 bg-red-600/90 text-white font-bold px-2 py-1 rounded-md text-xs shadow-lg">
                                            Only {book.stockQuantity} left!
                                        </div>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
                                    <p className="text-emerald-400/80 text-sm mb-4 font-medium">{book.author}</p>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
                                        {book.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-700 flex gap-2">
                                        <Link
                                            to={`/book/${book.id}`}
                                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg text-center"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => addToCart(book)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                                        >
                                            Add to Cart
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
