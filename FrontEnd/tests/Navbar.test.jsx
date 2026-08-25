import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import { AuthContext } from '../src/context/AuthContext';
import { CartContext } from '../src/context/CartContext';
import { describe, it, expect, vi } from 'vitest';

describe('Navbar Component', () => {

    it('does not show the Cart tab when the user is logged out', () => {
        // Arrange
        const mockAuthContext = { user: null, logout: vi.fn() };
        const mockCartContext = { getCartCount: () => 0, clearCart: vi.fn() };

        // Act
        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <CartContext.Provider value={mockCartContext}>
                        <Navbar />
                    </CartContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Assert
        // We expect the Cart tab to be completely missing from the screen.
        const cartTab = screen.queryByText(/Cart/i);
        expect(cartTab).not.toBeInTheDocument();
    });

    it('shows the Cart tab when the user is logged in', () => {
        // Arrange
        const mockAuthContext = { 
            user: { fullName: 'Test User', role: 'User' }, 
            logout: vi.fn() 
        };
        const mockCartContext = { getCartCount: () => 3, clearCart: vi.fn() };

        // Act
        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <CartContext.Provider value={mockCartContext}>
                        <Navbar />
                    </CartContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Assert
        // We expect the Cart tab to be visible and display the correct item count.
        const cartTab = screen.getByText(/Cart \(3\)/i);
        expect(cartTab).toBeInTheDocument();
    });

});
