// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    // Make sure this matches the port from your Swagger UI! (e.g., 7151)
    baseURL: 'https://localhost:7151/api',
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
