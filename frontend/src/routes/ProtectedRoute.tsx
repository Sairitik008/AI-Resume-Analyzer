import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards all MainLayout routes.
 * - Unauthenticated → redirect to /login
 * - While auth state is loading from localStorage → render nothing (avoids flash)
 */
export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
};

/**
 * Reverse guard for /login and /register.
 * - Already authenticated → redirect to /dashboard
 */
export const PublicOnlyRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};
