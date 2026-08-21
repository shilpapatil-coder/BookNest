// src/components/Cart.jsx
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Cart = () => {
    const { cart, removeFromCart, getCartTotal, clearCart, updateQuantity } = useContext(CartContext);
    const [statusMessage, setStatusMessage] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleCheckout = async () => {
        try {
            setStatusMessage('Processing your order...');

            const orderData = {
                items: cart.map(item => ({ bookId: item.id, quantity: item.quantity }))
            };
            const response = await api.post('/Orders/checkout', orderData);

            setStatusMessage(response.data.message);
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Checkout failed. Are you logged in?');
        }
    };

    if (cart.length === 0) {
        if (orderPlaced) {
            return (
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-10 pt-20">
                    <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl text-center border border-emerald-500/50 max-w-lg w-full">
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl mb-4 font-black text-white tracking-tight">Order Placed!</h2>
                        <p className="text-emerald-400 font-bold mb-2">{statusMessage}</p>
                        <p className="text-slate-400 mb-8">Thank you for your purchase. Your books will be on their way shortly.</p>
                        <div className="flex flex-col gap-4">
                            <Link to="/orders" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20">
                                View My Orders
                            </Link>
                            <Link to="/" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-10 pt-20">
                <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl text-center border border-slate-700/50 max-w-lg w-full">
                    <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl mb-4 font-black text-white tracking-tight">Your Cart is Empty</h2>
                    <p className="text-slate-400 mb-8">Looks like you haven't added any books to your cart yet.</p>
                    <Link to="/" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6 sm:p-10 pt-20">
            <div className="max-w-5xl mx-auto text-white">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-8 tracking-tight">Your Shopping Cart</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((book) => (
                            <div key={book.id} className="bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col sm:flex-row items-center gap-6 group">
                                {/* Book Cover Placeholder or Image */}
                                <div className="w-full sm:w-24 h-32 bg-slate-700 rounded-xl flex-shrink-0 overflow-hidden relative">
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold text-center px-2">No Cover</div>
                                    )}
                                </div>

                                {/* Book Details */}
                                <div className="flex-grow text-center sm:text-left w-full">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{book.title}</h3>
                                    <p className="text-emerald-400 font-bold mb-4">₹{book.price.toFixed(2)}</p>
                                    
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                                            <button 
                                                onClick={() => updateQuantity(book.id, book.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                            >-</button>
                                            <span className="w-10 text-center font-semibold">{book.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(book.id, book.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                            >+</button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(book.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Item Total */}
                                <div className="hidden sm:block text-right flex-shrink-0">
                                    <p className="text-sm text-slate-400 mb-1">Total</p>
                                    <p className="text-xl font-bold text-white">₹{(book.price * book.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/50 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400 font-medium">Free</span>
                                </div>
                                <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-black text-emerald-400">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            {statusMessage && (
                                <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-center text-emerald-400 font-bold shadow-inner">
                                    {statusMessage}
                                </div>
                            )}

                            <button 
                                onClick={handleCheckout} 
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 mb-4"
                            >
                                Proceed to Checkout
                            </button>
                            
                            <button 
                                onClick={clearCart} 
                                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-6 rounded-xl transition-colors font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
