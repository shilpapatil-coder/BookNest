import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-xl">Loading your wishlist...</div>;
    }

    return (
        <div className="bg-slate-900 p-6 sm:p-10 pt-12 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                    Your Wishlist
                </h1>

                {wishlist.length === 0 ? (
                    <div className="text-center text-slate-400 text-lg py-16 bg-slate-800/40 rounded-2xl border border-slate-800 shadow-xl max-w-lg mx-auto">
                        <div className="text-4xl mb-4">💔</div>
                        <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                        <p className="mb-6">Save books here to find them later!</p>
                        <Link to="/" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg">
                            Browse Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                        {wishlist.map((book) => (
                            <div key={book.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-purple-500/50 transform transition-all duration-300 hover:-translate-y-2 group flex flex-col">
                                
                                <div className="h-64 overflow-hidden bg-slate-700 relative">
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">No Cover</div>
                                    )}
                                    <button 
                                        onClick={() => removeFromWishlist(book.id)}
                                        className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                                        title="Remove from wishlist"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
                                    <p className="text-emerald-400/80 text-sm mb-3">{book.author}</p>
                                    
                                    <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
                                        <span className="text-emerald-400 font-bold">₹{book.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => {
                                                addToCart(book);
                                                removeFromWishlist(book.id);
                                            }}
                                            disabled={book.stockQuantity === 0}
                                            className={`font-bold py-1.5 px-4 rounded-lg text-sm transition-colors ${
                                                book.stockQuantity === 0 
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                            }`}
                                        >
                                            {book.stockQuantity === 0 ? 'Out of Stock' : 'Move to Cart'}
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

export default Wishlist;
