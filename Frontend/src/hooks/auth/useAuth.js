import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token')); // ✅ Avoids null flicker

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange); // ✅ Sync across tabs

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login, logout };
};

export default useAuth;
