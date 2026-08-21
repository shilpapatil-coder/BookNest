// src/components/AdminOrders.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AdminOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            const response = await api.get('/Orders/all-orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'Admin') fetchAllOrders();
    }, [user]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Optimistically update the UI
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            
            // Send to backend
            await api.put(`/Orders/${orderId}/status`, `"${newStatus}"`, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            alert('Failed to update status');
            fetchAllOrders(); // Revert on failure
        }
    };

    // Extra security check on the frontend!
    if (user?.role !== 'Admin') {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-2xl">Access Denied</div>;
    }

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">Loading All Orders...</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-10 pt-20">
            <div className="max-w-6xl mx-auto text-white">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-8 tracking-tight">Manage All Orders</h2>

                {orders.length === 0 ? (
                    <p className="text-xl text-slate-400">No orders have been placed yet.</p>
                ) : (
                    <div className="overflow-x-auto bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
                        <table className="w-full text-left">
                            <thead className="bg-slate-700">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-300">Order ID</th>
                                    <th className="p-4 font-semibold text-slate-300">Customer Email</th>
                                    <th className="p-4 font-semibold text-slate-300">Date</th>
                                    <th className="p-4 font-semibold text-slate-300">Total</th>
                                    <th className="p-4 font-semibold text-slate-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-emerald-400 font-bold">#{order.id}</td>
                                        <td className="p-4 text-slate-400 text-sm">{order.user?.email || order.userId}</td>
                                        <td className="p-4 text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold">₹{order.totalAmount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 cursor-pointer font-semibold w-full max-w-[140px] shadow-sm"
                                            >
                                                <option value="Processing" className="bg-slate-800 text-white">Processing</option>
                                                <option value="Shipped" className="bg-slate-800 text-white">Shipped</option>
                                                <option value="Delivered" className="bg-slate-800 text-white">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
