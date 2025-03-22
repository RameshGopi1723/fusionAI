import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import HomePage from './components/home/homepage';
import ChatPage from './components/chat/chatPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router> 
    );
};

export default App;