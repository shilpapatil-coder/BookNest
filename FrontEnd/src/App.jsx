// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import BookDetail from './components/BookDetail'; // <-- Added this
import OrderHistory from './components/OrderHistory';
import AdminOrders from './components/AdminOrders';

function App() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/book/:id" element={<BookDetail />} /> {/* <-- Added this */}
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </div>
    );
}

export default App;
