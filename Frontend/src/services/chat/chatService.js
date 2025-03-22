import axios from 'axios';
import { useAuthStore } from '../../state/auth/authStore';

const API_URL = 'http://localhost:8000/api/v1/chat';

const chatService = {
    async sendMessage(prompt) {
        const token = useAuthStore.getState().token; // Get token from authStore

        if (!token) {
            throw new Error('Unauthorized: No token found.');
        }

        const response = await axios.post(`${API_URL}/lumina`, { prompt }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    }
};

export default chatService;
