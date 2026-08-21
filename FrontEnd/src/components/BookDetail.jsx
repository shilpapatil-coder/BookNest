// src/components/BookDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // <-- Needed to check if logged in

const BookDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    // New State for Reviews
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    useEffect(() => {
        const fetchBookAndReviews = async () => {
            try {
                // Fetch the book AND the reviews at the same time!
                const [bookRes, reviewsRes] = await Promise.all([
                    api.get(`/Books/${id}`),
                    api.get(`/Reviews/book/${id}`)
                ]);

                setBook(bookRes.data);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchBookAndReviews();
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            setReviewMessage('Submitting...');
            await api.post('/Reviews', {
                bookId: book.id,
                rating: parseInt(newRating),
                comment: newComment
            });

            setReviewMessage('Review added successfully!');
            setNewComment('');

            // Refresh the reviews list so the new review appears instantly
            const reviewsRes = await api.get(`/Reviews/book/${id}`);
            setReviews(reviewsRes.data);
        } catch (err) {
            setReviewMessage(err.response?.data?.message || 'Failed to add review.');
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">Loading Details...</div>;
    if (!book) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl">Book not found</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-10 pt-20">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* --- BOOK DETAIL CARD --- */}
                <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row">
                    <div className="md:w-1/2 bg-slate-700 p-8 flex items-center justify-center">
                        {book.imageUrl ? (
                            <img src={book.imageUrl} alt={book.title} className="rounded-xl shadow-2xl max-h-[500px] object-cover" />
                        ) : (
                            <div className="text-slate-500 text-2xl">No Cover Available</div>
                        )}
                    </div>
                    <div className="md:w-1/2 p-10 flex flex-col justify-center">
                        <Link to="/" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block font-bold">&larr; Back to Catalog</Link>

                        <h1 className="text-4xl font-black text-white mb-2">{book.title}</h1>
                        <h2 className="text-xl text-purple-400 font-medium mb-6">By {book.author}</h2>

                        <div className="flex items-center space-x-4 mb-8">
                            <span className="text-3xl font-bold text-emerald-400">₹{book.price.toFixed(2)}</span>
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-semibold">{book.category}</span>
                        </div>

                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            {book.description}
                        </p>

                        <div className="mb-8">
                            <p className="text-slate-400 text-sm">ISBN: {book.isbn}</p>
                            <p className={`text-sm font-bold ${book.stockQuantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of Stock'}
                            </p>
                        </div>

                        <button
                            onClick={() => addToCart(book)}
                            disabled={book.stockQuantity === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${book.stockQuantity > 0
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 transform hover:-translate-y-1'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* --- REVIEWS SECTION --- */}
                <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl border border-slate-700">
                    <h3 className="text-3xl font-bold text-white mb-8">Customer Reviews</h3>

                    {/* Write a Review Form */}
                    {user ? (
                        <form onSubmit={submitReview} className="bg-slate-700 p-6 rounded-2xl mb-10">
                            <h4 className="text-xl font-bold text-emerald-400 mb-4">Write a Review</h4>

                            <div className="mb-4">
                                <label className="block text-slate-300 font-semibold mb-2">Rating (1-5)</label>
                                <select
                                    value={newRating}
                                    onChange={(e) => setNewRating(e.target.value)}
                                    className="bg-slate-900 border border-slate-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4)</option>
                                    <option value="3">⭐⭐⭐ (3)</option>
                                    <option value="2">⭐⭐ (2)</option>
                                    <option value="1">⭐ (1)</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-slate-300 font-semibold mb-2">Comment</label>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                    className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 h-24"
                                    placeholder="What did you think about this book?"
                                ></textarea>
                            </div>

                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Submit Review
                            </button>

                            {reviewMessage && <p className="mt-4 text-purple-400 font-semibold">{reviewMessage}</p>}
                        </form>
                    ) : (
                        <div className="bg-slate-700 p-6 rounded-2xl mb-10 text-center">
                            <p className="text-slate-300 text-lg mb-4">You must be logged in to leave a review.</p>
                            <Link to="/login" className="text-emerald-400 font-bold hover:underline">Log in here</Link>
                        </div>
                    )}

                    {/* Display Reviews */}
                    {reviews.length === 0 ? (
                        <p className="text-slate-400 text-lg">No reviews yet. Be the first to review this book!</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-slate-700 pb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white text-lg">{review.userName}</span>
                                        <span className="text-slate-400 text-sm">{new Date(review.createdDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-emerald-400 mb-3 text-lg tracking-widest">
                                        {'⭐'.repeat(review.rating)}
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BookDetail;
