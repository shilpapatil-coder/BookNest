// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx' // <-- You missed this import!
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>  {/* <-- And you missed this wrapper! */}
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
