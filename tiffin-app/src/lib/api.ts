import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
