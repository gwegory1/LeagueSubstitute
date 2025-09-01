import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
    AccountCircle,
    Event,
    Dashboard,
    Visibility as OverviewIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNavigation: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleUserMenuClose();
        setMobileMenuOpen(false);
    };

    const handleDashboardClick = () => {
        navigate('/admin');
        handleUserMenuClose();
        setMobileMenuOpen(false);
    };

    const handleOverviewClick = () => {
        navigate('/overview');
        handleUserMenuClose();
        setMobileMenuOpen(false);
    };

    const handleLogoutClick = () => {
        handleLogout();
        handleUserMenuClose();
        setMobileMenuOpen(false);
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

                {/* Mobile Menu Button */}
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setMobileMenuOpen(true)}
                    sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Navigation Links */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 3 }}>
                    <Box
                        component={Link}
                        to="/admin"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            backgroundColor: location.pathname === '/admin' ? 'rgba(255,69,0,0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255,69,0,0.1)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Dashboard fontSize="small" />
                        Dashboard
                    </Box>
                    <Box
                        component={Link}
                        to="/events"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            backgroundColor: location.pathname === '/events' ? 'rgba(255,69,0,0.2)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255,69,0,0.1)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Event fontSize="small" />
                        Events
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ff4500' }}>
                        Welcome, {user?.displayName || 'Admin'}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                        color="inherit"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 69, 0, 0.1)',
                            },
                        }}
                    >
                        <AccountCircle />
                    </IconButton>
                </Box>
            </Toolbar>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
            >
                <MenuItem onClick={handleDashboardClick}>
                    <ListItemIcon>
                        <AdminIcon fontSize="small" />
                    </ListItemIcon>
                    Dashboard/
                </MenuItem>
                <MenuItem onClick={handleOverviewClick}>
                    <ListItemIcon>
                        <OverviewIcon fontSize="small" />
                    </ListItemIcon>
                    Client Overview
                </MenuItem>
                <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#ff4500', fontWeight: 'bold' }}>
                        🔧 JDM Car Tracker
                    </Typography>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                selected={location.pathname === '/admin'}
                            >
                                <ListItemIcon>
                                    <Dashboard sx={{ color: '#ff4500' }} />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/events"
                                onClick={() => setMobileMenuOpen(false)}
                                selected={location.pathname === '/events'}
                            >
                                <ListItemIcon>
                                    <Event sx={{ color: '#ff4500' }} />
                                </ListItemIcon>
                                <ListItemText primary="Events" />
                            </ListItemButton>
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOverviewClick}>
                                <ListItemIcon>
                                    <OverviewIcon sx={{ color: '#ff4500' }} />
                                </ListItemIcon>
                                <ListItemText primary="Client Overview" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleProfileClick}>
                                <ListItemIcon>
                                    <AccountCircle sx={{ color: '#ff4500' }} />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogoutClick}>
                                <ListItemIcon>
                                    <LogoutIcon sx={{ color: '#ff4500' }} />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default AdminNavigation;
