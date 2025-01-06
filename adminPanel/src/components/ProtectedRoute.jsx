import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from './CheckAuth';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">
            Checking your credentials...
        </p>
    </div>
    ) // Wait for auth check
    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;

