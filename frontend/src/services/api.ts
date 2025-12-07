import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
export const authAPI = {
    login: (email: string, password: string) => {
        return api.post('/auth/graduates/login', { email, password });
    },
    register: (data: any) => {
        return api.post('/auth/graduates/register', data);
    },
};

export const graduateAPI = {
    getProfile: () => {
        return api.get('/graduates/me');
    },
    getDashboard: () => {
        return api.get('/graduates/me/dashboard');
    },
};

export default api;
