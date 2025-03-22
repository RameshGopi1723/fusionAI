import React from 'react';
import { useAuthStore } from '../../state/auth/authStore';
import { useChatStore } from '../../state/chat/chatStore';
import { useChat } from '../../hooks/chat/useChat';
import chatStyles from '../../styles/chat/chatStyles';

const ChatPage = () => {
    const { user } = useAuthStore();
    const { prompt, setPrompt, response, setResponse, loading, setLoading, error, setError } = useChatStore();
    const { handleChatSubmit } = useChat({ prompt, setResponse, setLoading, setError });

    return (
        <div style={chatStyles.container}>
            <div style={chatStyles.chatBox}>
                <h1 style={chatStyles.title}>💬 Chat with AI</h1>
                <h3>Welcome, {user?.username || "Guest"} 👋</h3>
                <form onSubmit={handleChatSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt..."
                        style={chatStyles.textArea}
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            ...chatStyles.button, 
                            ...(loading ? chatStyles.buttonDisabled : {}) 
                        }}
                    >
                        {loading ? 'Loading...' : 'Send'}
                    </button>
                </form>
                {error && <p style={chatStyles.errorMessage}>{error}</p>}
                {response && (
                    <div style={chatStyles.responseBox}>
                        <h2>AI Response:</h2>
                        <p>{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
