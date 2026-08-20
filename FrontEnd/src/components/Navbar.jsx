
// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left side: Logo & Main Links */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mr-8 tracking-tight">
                            BookNest
                        </Link>

                        <div className="hidden md:flex space-x-2">
                            <Link to="/" className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all">Catalog</Link>

                            {/* Only show Admin Dashboard if the user is logged in */}
                            {user && (
                                <Link to="/admin" className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all">Admin Dashboard</Link>
                            )}
                        </div>
                    </div>

                    {/* Right side: Auth Buttons */}
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-emerald-400 text-sm font-medium hidden sm:block">Hello, {user.fullName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
