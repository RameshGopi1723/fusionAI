import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/auth/authStore';
import authService from '../../services/auth/loginService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import styles from '../../styles/auth/loginStyles';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setToken, setUser } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { access_token, user } = await authService.login(username, password);
            setToken(access_token);
            setUser(user);
            navigate('/home'); // ✅ Redirect after successful login
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Box style={styles.loginContainer}>
            <Card style={styles.loginCard}>
                <CardContent>
                    <Typography variant="h5" gutterBottom style={styles.loginTitle}>
                        Sign in
                    </Typography>
                    <Typography variant="body2" gutterBottom style={styles.loginSubtitle}>
                        to continue to FusionAI
                    </Typography>
                    {error && (
                        <Typography variant="body2" color="error" textAlign="center" style={styles.errorText}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.inputField}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.inputField}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            style={styles.loginButton} 
                            disabled={!username || !password}
                        >
                            Login
                        </Button>
                    </form>
                    <Link href="#" variant="body2" style={styles.link}>
                        Forgot Password?
                    </Link>
                    <Link href="/register" variant="body2" style={styles.link}>
                        Sign Up
                    </Link>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
