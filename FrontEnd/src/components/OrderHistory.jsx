// src/components/OrderHistory.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/Orders/my-orders');
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl">Please log in to view your orders.</div>;
    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">Loading Orders...</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-10 pt-20">
            <div className="max-w-4xl mx-auto text-white">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-8 tracking-tight">Order History</h2>

                {orders.length === 0 ? (
                    <p className="text-xl text-slate-400">You haven't placed any orders yet.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                                {/* Order Header */}
                                <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-4">
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold">Order #{order.id}</p>
                                        <p className="text-sm text-slate-400">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-emerald-400">₹{order.totalAmount.toFixed(2)}</p>
                                        <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items (Books) */}
                                <div className="space-y-2">
                                    {order.orderItems.map(item => (
                                        <div key={item.id} className="flex justify-between text-slate-300">
                                            <span>{item.quantity}x {item.book?.title || 'Unknown Book'}</span>
                                            <span className="text-emerald-400/80">₹{item.unitPrice.toFixed(2)} each</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
