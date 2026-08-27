// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://app-booknest-exemdtd9dzaeb2hk.centralindia-01.azurewebsites.net/api',
});

// This automatically attaches the JWT token to every request if you are logged in
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
