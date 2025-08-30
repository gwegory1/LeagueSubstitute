import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useTheme,
    IconButton,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AdminNavigation: React.FC = () => {
    const { logout, user } = useAuth();
    const theme = useTheme();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 69, 0, 0.3)',
                boxShadow: '0 8px 32px rgba(255, 69, 0, 0.1)',
            }}
        >
            <Toolbar>
                <AdminIcon sx={{ mr: 2, color: '#ff4500' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    🔧 JDM Car Tracker - Admin Panel
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ff4500' }}>
                        Welcome, {user?.displayName || 'Admin'}
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 69, 0, 0.1)',
                            },
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AdminNavigation;
