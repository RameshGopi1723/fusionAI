import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/loginComponent';
import RegisterPage from './components/auth/registerComponent';
import HomePage from './components/home/homepage';
import ChatPage from './components/chat/chatComponent';
import ProtectedRoute from './utils/protectedRoute';
import { useAuthStore } from './state/auth/authStore';

const App = () => {
    const { token } = useAuthStore();

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ✅ Wrap Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
