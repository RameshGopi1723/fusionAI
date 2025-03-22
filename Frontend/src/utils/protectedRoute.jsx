import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/auth/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // ✅ Prevent unnecessary redirects while checking auth
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
