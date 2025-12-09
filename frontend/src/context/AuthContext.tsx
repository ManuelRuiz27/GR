import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../lib/storage';

interface User {
    id: string;
    full_name: string;
    email: string;
    status: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const savedToken = safeGetItem('token');
        const savedUser = safeGetItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password);
            const { token: newToken, graduate } = response.data;

            setToken(newToken);
            setUser(graduate);

            safeSetItem('token', newToken);
            safeSetItem('user', JSON.stringify(graduate));
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    const register = async (data: any) => {
        try {
            const response = await authAPI.register(data);
            const { token: newToken, graduate } = response.data;

            setToken(newToken);
            setUser(graduate);

            safeSetItem('token', newToken);
            safeSetItem('user', JSON.stringify(graduate));
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al registrarse');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        safeRemoveItem('token');
        safeRemoveItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
