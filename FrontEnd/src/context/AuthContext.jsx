// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if the user is already logged in when they refresh the page
    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const fullName = localStorage.getItem('fullName');
        
        if (token && email) {
            setUser({ email, fullName });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('fullName', userData.fullName);
        setUser({ email: userData.email, fullName: userData.fullName });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('fullName');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
