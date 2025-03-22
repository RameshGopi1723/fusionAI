import { useState } from 'react';

export const useChatStore = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return { prompt, setPrompt, response, setResponse, loading, setLoading, error, setError };
};
