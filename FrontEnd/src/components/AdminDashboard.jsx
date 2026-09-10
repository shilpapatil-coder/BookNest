// src/components/AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    
    // Metrics State
    const [metrics, setMetrics] = useState({
        totalSales: 0,
        totalOrders: 0,
        lowStockCount: 0,
        loading: true
    });

    // Add Book State
    const [book, setBook] = useState({
        title: '', author: '', category: '', isbn: '',
        description: '', price: '', stockQuantity: '', imageUrl: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.role === 'Admin') {
            fetchDashboardMetrics();
        }
    }, [user]);

    const fetchDashboardMetrics = async () => {
        try {
            const [ordersRes, booksRes] = await Promise.all([
                api.get('/Orders/all-orders'),
                api.get('/Books')
            ]);

            const orders = ordersRes.data;
            const books = booksRes.data;

            const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            const lowStockCount = books.filter(b => b.stockQuantity < 5).length;

            setMetrics({
                totalSales,
                totalOrders: orders.length,
                lowStockCount,
                loading: false
            });
        } catch (error) {
            console.error("Failed to load dashboard metrics", error);
            setMetrics(prev => ({ ...prev, loading: false }));
        }
    };

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/Books', {
                ...book,
                price: parseFloat(book.price),
                stockQuantity: parseInt(book.stockQuantity)
            });
            setMessage({ type: 'success', text: `Success! "${book.title}" added to inventory.` });
            setBook({ title: '', author: '', category: '', isbn: '', description: '', price: '', stockQuantity: '', imageUrl: '' });
            fetchDashboardMetrics(); // Refresh metrics after adding a book
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add book. Are you logged in?' });
        }
    };

    if (!user || user.role !== 'Admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
                <h1 className="text-3xl font-bold mb-4 text-red-400">Access Denied</h1>
                <p className="text-slate-400">You must be logged in as an Admin to access the Dashboard.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8 pt-24">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-400 mt-2">Welcome back, {user.fullName || 'Admin'}. Here is what's happening today.</p>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:bg-slate-800/80 group">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-400 font-medium tracking-wide">Total Sales</h3>
                            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            {metrics.loading ? (
                                <div className="h-10 bg-slate-700/50 rounded animate-pulse w-3/4"></div>
                            ) : (
                                <h2 className="text-4xl font-bold text-white">₹{metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            )}
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:bg-slate-800/80 group">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-400 font-medium tracking-wide">Total Orders</h3>
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            {metrics.loading ? (
                                <div className="h-10 bg-slate-700/50 rounded animate-pulse w-1/2"></div>
                            ) : (
                                <h2 className="text-4xl font-bold text-white">{metrics.totalOrders}</h2>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:bg-slate-800/80 group">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-400 font-medium tracking-wide">Low Stock Alerts</h3>
                            <div className="p-3 bg-red-500/20 text-red-400 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            {metrics.loading ? (
                                <div className="h-10 bg-slate-700/50 rounded animate-pulse w-1/2"></div>
                            ) : (
                                <h2 className={`text-4xl font-bold ${metrics.lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {metrics.lowStockCount}
                                </h2>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Book Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10 mt-10">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Add New Inventory</h2>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Book Title *</label>
                                <input name="title" value={book.title} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Author *</label>
                                <input name="author" value={book.author} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                                <input name="category" value={book.category} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">ISBN *</label>
                                <input name="isbn" value={book.isbn} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹) *</label>
                                <input type="number" step="0.01" name="price" value={book.price} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Stock Quantity *</label>
                                <input type="number" name="stockQuantity" value={book.stockQuantity} onChange={handleChange} required className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
                                <input name="imageUrl" placeholder="https://example.com/cover.jpg" value={book.imageUrl} onChange={handleChange} className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
                            <textarea name="description" value={book.description} onChange={handleChange} required rows="4" className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"></textarea>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transform transition-all hover:scale-[1.01] active:scale-[0.99]">
                                Add Book to Inventory
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
