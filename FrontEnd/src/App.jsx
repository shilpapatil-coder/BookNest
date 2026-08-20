// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Catalog from './components/Catalog';

function App() {
    return (
        <div className="min-h-screen bg-slate-900">
            {/* The Navbar will now sit at the top of every page */}
            <Navbar />

            <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

export default App;
