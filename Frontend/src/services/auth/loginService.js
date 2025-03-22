import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth';

const authService = {
    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post(`${API_URL}/login`, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (!response.data.access_token || !response.data.user) {
                throw new Error("Invalid response: Missing token or user data.");
            }

            return response.data; // { access_token, user }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default authService;
