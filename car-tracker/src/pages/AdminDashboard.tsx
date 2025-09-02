 import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    People as PeopleIcon,
    DirectionsCar as CarIcon,
    Build as MaintenanceIcon,
    Assignment as ProjectIcon,
    Visibility as ViewIcon,
    Person as PersonIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { User } from '../types';
import { firestoreUsers } from '../services/firestore';
import { useCars } from '../hooks/useCars';
import { useProjects } from '../hooks/useProjects';
import { useMaintenance } from '../hooks/useMaintenance';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import StorageStatusIndicator from '../components/StorageStatusIndicator';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    try {
        // This check is handled by hooks now
        return true;
    } catch {
        return false;
    }
};

interface AdminStats {
    totalUsers: number;
    totalCars: number;
    totalMaintenanceRecords: number;
    totalProjects: number;
    recentUsers: UserWithStats[];
}

interface UserWithStats extends User {
    carCount?: number;
    maintenanceCount?: number;
    projectCount?: number;
}

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { cars, loading: carsLoading } = useCars();
    const { projects, loading: projectsLoading } = useProjects();
    const { maintenance, loading: maintenanceLoading } = useMaintenance();
    const { users, loading: usersLoading, deleteUser } = useUsers();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteError, setDeleteError] = useState('');

    // Calculate stats from hook data
    const stats: AdminStats = React.useMemo(() => {
        console.log('🔧 AdminDashboard: Calculating stats with data:', {
            usersCount: users.length,
            carsCount: cars.length,
            projectsCount: projects.length,
            maintenanceCount: maintenance.length,
            currentUser: user?.email,
            isAdmin: user?.isAdmin
        });

        // Filter out admin users
        const regularUsers = users.filter((u: User) => !u.isAdmin);
        console.log('🔧 AdminDashboard: Regular users (non-admin):', regularUsers.length);

        // Get user stats for recent users
        const recentUsersWithStats: UserWithStats[] = regularUsers
            .sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((userItem: User) => {
                // Count cars, projects, and maintenance for this user
                const userCars = cars.filter(car => car.userId === userItem.id);
                const userProjects = projects.filter(project => project.userId === userItem.id);
                const userMaintenance = maintenance.filter(m => m.userId === userItem.id);

                return {
                    ...userItem,
                    carCount: userCars.length,
                    maintenanceCount: userMaintenance.length,
                    projectCount: userProjects.length
                };
            });

        const calculatedStats = {
            totalUsers: regularUsers.length,
            totalCars: cars.length,
            totalMaintenanceRecords: maintenance.length,
            totalProjects: projects.length,
            recentUsers: recentUsersWithStats,
        };

        console.log('🔧 AdminDashboard: Calculated stats:', calculatedStats);
        return calculatedStats;
    }, [users, cars, projects, maintenance]);

    // Loading state
    const isLoading = carsLoading || projectsLoading || maintenanceLoading || usersLoading;

    console.log('🔧 AdminDashboard: Loading states:', {
        carsLoading,
        projectsLoading,
        maintenanceLoading,
        usersLoading,
        isLoading,
        userIsAdmin: user?.isAdmin,
        userEmail: user?.email
    });

    // Check if user is admin
    if (!user?.isAdmin) {
        return (
            <Box sx={{ pt: 10, pb: 4 }}>
                <Container maxWidth="lg">
                    <Alert severity="error">
                        Access denied. Admin privileges required.
                    </Alert>
                </Container>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ pt: 10, pb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#ff4500' }} />
            </Box>
        );
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getUserCarsCount = (userId: string) => {
        // Find the user in recentUsers and return their car count
        const userItem = stats.recentUsers.find(u => u.id === userId);
        return userItem?.carCount || 0;
    };

    const handleDeleteUser = (userItem: User) => {
        setUserToDelete(userItem);
        setDeleteDialogOpen(true);
        setDeleteError('');
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            console.log('🗑️ Deleting user:', userToDelete.email);
            await deleteUser(userToDelete.id);

            // Close dialog
            setDeleteDialogOpen(false);
            setUserToDelete(null);

        } catch (error) {
            console.error('Error deleting user:', error);
            setDeleteError('Failed to delete user. Please try again.');
        }
    }; const cancelDeleteUser = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        setDeleteError('');
    };

    const getUserDataSummary = (userId: string) => {
        // Find the user in recentUsers and return their counts
        const user = stats.recentUsers.find(u => u.id === userId);
        return {
            cars: user?.carCount || 0,
            maintenance: user?.maintenanceCount || 0,
            projects: user?.projectCount || 0
        };
    };

    const StatCard: React.FC<{
        title: string;
        value: number;
        icon: React.ReactNode;
        color: string;
    }> = ({ title, value, icon, color }) => (
        <Card
            sx={{
                background: 'rgba(26, 26, 46, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 69, 0, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(255, 69, 0, 0.2)',
                    border: '1px solid rgba(255, 69, 0, 0.4)',
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            backgroundColor: `${color}20`,
                            borderRadius: 2,
                            p: 1.5,
                            border: `1px solid ${color}40`,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ pt: 10, pb: 4 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    sx={{
                        mb: 4,
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #ff4500, #ff6347)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textAlign: 'center',
                    }}
                >
                    📊 Admin Dashboard
                </Typography>

                {/* Storage Status Indicator */}
                <StorageStatusIndicator />

                {/* Stats Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 3,
                        mb: 4,
                    }}
                >
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<PeopleIcon sx={{ color: '#ff4500', fontSize: 32 }} />}
                        color="#ff4500"
                    />
                    <StatCard
                        title="Total Cars"
                        value={stats.totalCars}
                        icon={<CarIcon sx={{ color: '#00ff88', fontSize: 32 }} />}
                        color="#00ff88"
                    />
                    <StatCard
                        title="Maintenance Records"
                        value={stats.totalMaintenanceRecords}
                        icon={<MaintenanceIcon sx={{ color: '#ffd700', fontSize: 32 }} />}
                        color="#ffd700"
                    />
                    <StatCard
                        title="Active Projects"
                        value={stats.totalProjects}
                        icon={<ProjectIcon sx={{ color: '#ff69b4', fontSize: 32 }} />}
                        color="#ff69b4"
                    />
                </Box>

                {/* Recent Users Table */}
                <Card
                    sx={{
                        background: 'rgba(26, 26, 46, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 69, 0, 0.2)',
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                fontWeight: 'bold',
                                color: '#ff4500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <PeopleIcon /> Recent Users
                        </Typography>

                        <TableContainer
                            component={Paper}
                            sx={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ borderBottom: '1px solid rgba(255, 69, 0, 0.3)' }}>
                                        <TableCell sx={{ color: '#ff4500', fontWeight: 'bold' }}>
                                            User
                                        </TableCell>
                                        <TableCell sx={{ color: '#ff4500', fontWeight: 'bold' }}>
                                            Email
                                        </TableCell>
                                        <TableCell sx={{ color: '#ff4500', fontWeight: 'bold' }}>
                                            Cars
                                        </TableCell>
                                        <TableCell sx={{ color: '#ff4500', fontWeight: 'bold' }}>
                                            Joined
                                        </TableCell>
                                        <TableCell sx={{ color: '#ff4500', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.recentUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 69, 0, 0.05)'
                                                },
                                                borderBottom: '1px solid rgba(255, 69, 0, 0.1)',
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: '#ff4500',
                                                            width: 32,
                                                            height: 32,
                                                        }}
                                                    >
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {user.displayName || 'Unknown User'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${getUserCarsCount(user.id)} cars`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                                                        color: '#00ff88',
                                                        border: '1px solid rgba(0, 255, 136, 0.3)',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(new Date(user.createdAt))}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View User Details">
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: '#ff4500',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                                                                },
                                                            }}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteUser(user)}
                                                            sx={{
                                                                color: '#ff4444',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 68, 68, 0.1)'
                                                                },
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {stats.recentUsers.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    No users found
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Delete User Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={cancelDeleteUser}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#ff4444'
                    }}>
                        <WarningIcon />
                        Delete User Account
                    </DialogTitle>
                    <DialogContent>
                        {deleteError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {deleteError}
                            </Alert>
                        )}

                        {userToDelete && (
                            <>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Are you sure you want to delete the following user account?
                                </Typography>

                                <Card sx={{
                                    mb: 3,
                                    background: 'rgba(255, 68, 68, 0.1)',
                                    border: '1px solid rgba(255, 68, 68, 0.3)'
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ backgroundColor: '#ff4444' }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">
                                                    {userToDelete.displayName || 'Unknown User'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {userToDelete.email}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>User Data to be deleted:</strong>
                                        </Typography>

                                        {(() => {
                                            const dataSummary = getUserDataSummary(userToDelete.id);
                                            return (
                                                <Box sx={{ pl: 2 }}>
                                                    <Typography variant="body2">• {dataSummary.cars} cars</Typography>
                                                    <Typography variant="body2">• {dataSummary.maintenance} maintenance records</Typography>
                                                    <Typography variant="body2">• {dataSummary.projects} projects</Typography>
                                                </Box>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>

                                <Alert severity="warning">
                                    <strong>This action cannot be undone!</strong> All user data including cars, maintenance records, and projects will be permanently deleted.
                                </Alert>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelDeleteUser}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteUser}
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                        >
                            Delete User
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
