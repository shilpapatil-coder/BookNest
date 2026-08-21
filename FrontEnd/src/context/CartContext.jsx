// src/context/CartContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load the cart from local storage if it exists, otherwise start empty
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Every time the cart changes, save it to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === book.id);
            if (existingItem) {
                // If it's already in the cart, just increase the quantity
                return prevCart.map(item =>
                    item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Otherwise, add it as a new item with quantity 1
            return [...prevCart, { ...book, quantity: 1 }];
        });
    };

    const removeFromCart = (bookId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== bookId));
    };

    const updateQuantity = (bookId, quantity) => {
        if (quantity < 1) return; // Don't allow 0 or negative
        setCart(prevCart => prevCart.map(item =>
            item.id === bookId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
