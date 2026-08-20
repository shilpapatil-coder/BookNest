// src/components/AdminDashboard.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [book, setBook] = useState({
        title: '', author: '', category: '', isbn: '',
        description: '', price: '', stockQuantity: '', imageUrl: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the new book data to the ASP.NET Core API
            await api.post('/Books', {
                ...book,
                price: parseFloat(book.price),
                stockQuantity: parseInt(book.stockQuantity)
            });
            setMessage({ type: 'success', text: `Success! "${book.title}" added to inventory.` });

            // Clear the form
            setBook({ title: '', author: '', category: '', isbn: '', description: '', price: '', stockQuantity: '', imageUrl: '' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add book. Are you logged in?' });
        }
    };

    // Protect this route from users who are not logged in
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-slate-400">You must be logged in to access the Admin Dashboard.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 p-8 pt-20">
            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/20 pb-4">Admin Dashboard - Add Inventory</h2>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Book Title *</label>
                            <input name="title" value={book.title} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Author *</label>
                            <input name="author" value={book.author} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                            <input name="category" value={book.category} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">ISBN *</label>
                            <input name="isbn" value={book.isbn} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹) *</label>
                            <input type="number" step="0.01" name="price" value={book.price} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Stock Quantity *</label>
                            <input type="number" name="stockQuantity" value={book.stockQuantity} onChange={handleChange} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
                            <input name="imageUrl" placeholder="https://example.com/cover.jpg" value={book.imageUrl} onChange={handleChange} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
                        <textarea name="description" value={book.description} onChange={handleChange} required rows="4" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30 transform transition-all hover:-translate-y-0.5 active:translate-y-0">
                            Add Book to Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
