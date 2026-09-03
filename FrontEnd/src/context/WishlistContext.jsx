import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch wishlist items on mount if user is logged in
    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/Wishlist');
                setWishlist(response.data);
            } catch (error) {
                console.error("Failed to load wishlist", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const addToWishlist = async (book) => {
        if (!localStorage.getItem('token')) {
            alert('Please login to add to wishlist.');
            return;
        }

        try {
            await api.post(`/Wishlist/${book.id}`);
            setWishlist(prev => [...prev, book]);
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            alert(error.response?.data || "Could not add to wishlist.");
        }
    };

    const removeFromWishlist = async (bookId) => {
        try {
            await api.delete(`/Wishlist/${bookId}`);
            setWishlist(prev => prev.filter(b => b.id !== bookId));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isInWishlist = (bookId) => {
        return wishlist.some(b => b.id === bookId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};
