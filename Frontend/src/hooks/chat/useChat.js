import { useEffect } from 'react';
import chatService from '../../services/chat/chatService';
import { useAuthStore } from '../../state/auth/authStore';

export const useChat = ({ prompt, setResponse, setLoading, setError }) => {
    const { token } = useAuthStore(); // ✅ Ensure token is retrieved properly

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Unauthorized: Please log in.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await chatService.sendMessage(prompt);
            setResponse(data.response);
        } catch (error) {
            setError(error.response?.data?.detail || 'Chat request failed.');
        } finally {
            setLoading(false);
        }
    };

    return { handleChatSubmit };
};
