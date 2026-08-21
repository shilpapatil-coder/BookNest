// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role'); // <-- Get Role

        if (token && email) {
            setUser({ email, fullName, role });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('fullName', userData.fullName);
        localStorage.setItem('role', userData.role); // <-- Save Role

        setUser({ email: userData.email, fullName: userData.fullName, role: userData.role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role'); // <-- Remove Role

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
