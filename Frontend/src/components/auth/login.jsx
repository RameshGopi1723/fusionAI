import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', response.data.access_token);
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card sx={{ width: 360, padding: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{ color: '#1976d2', textAlign: 'center', fontWeight: 'bold' }}>
                        Sign in
                    </Typography>
                    <Typography variant="body2" component="div" gutterBottom sx={{ color: '#1976d2', textAlign: 'center', marginBottom: 2 }}>
                        to continue to YourApp
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ marginBottom: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ marginBottom: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' }, marginBottom: 2 }}>
                            Login
                        </Button>
                    </form>
                    <Link href="#" variant="body2" sx={{ color: '#1976d2', display: 'block', textAlign: 'center', marginBottom: 2 }}>
                        Forgot Password?
                    </Link>
                    <Link href="/register" variant="body2" sx={{ color: '#1976d2', display: 'block', textAlign: 'center' }}>
                        Sign Up
                    </Link>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;