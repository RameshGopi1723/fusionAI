import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/auth/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.data) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:8000/api/v1/chat/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await res.json();
            setResponse(data.response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Chat with AI</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    rows="4"
                    cols="50"
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Send'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && (
                <div>
                    <h2>Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ChatPage;