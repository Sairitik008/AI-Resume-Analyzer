import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import type { User } from '../types/auth.types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadFromStorage(): { user: User | null; token: string | null } {
    try {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('user');
        const user = userRaw ? (JSON.parse(userRaw) as User) : null;
        return { token, user };
    } catch {
        return { token: null, user: null };
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const { user: storedUser, token: storedToken } = loadFromStorage();
        if (storedToken && storedUser) {
            setUser(storedUser);
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await loginUser({ email, password });
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        navigate('/dashboard');
    }, [navigate]);

    const register = useCallback(async (name: string, email: string, password: string) => {
        // Register then immediately login for smooth UX
        await registerUser({ name, email, password });
        await login(email, password);
    }, [login]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
