import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Avatar,
    Alert,
    Stack,
    Divider,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/firestore';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
    }); const handleEditToggle = () => {
        if (editing) {
            // Cancel editing - reset form
            setFormData({
                displayName: user?.displayName || '',
                email: user?.email || '',
            });
        }
        setEditing(!editing);
        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await updateUserProfile(user.id, {
                displayName: formData.displayName,
                email: formData.email,
            });

            setSuccess('Profile updated successfully!');
            setEditing(false);
        } catch (error: any) {
            setError(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }; if (!user) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Please log in to view your profile.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profile Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: '3rem',
                                mb: 2
                            }}
                        >
                            {user.displayName?.charAt(0) || user.email.charAt(0)}
                        </Avatar>

                        <Typography variant="body2" color="text.secondary" align="center">
                            Profile Avatar
                            <br />
                            (Based on your display name or email)
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Personal Information</Typography>
                            <Button
                                startIcon={editing ? <CancelIcon /> : <EditIcon />}
                                onClick={handleEditToggle}
                                disabled={loading}
                            >
                                {editing ? 'Cancel' : 'Edit'}
                            </Button>
                        </Box>

                        <TextField
                            fullWidth
                            label="Display Name"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            disabled={!editing || loading}
                            variant={editing ? 'outlined' : 'filled'}
                            InputProps={{
                                readOnly: !editing,
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!editing || loading}
                            variant={editing ? 'outlined' : 'filled'}
                            InputProps={{
                                readOnly: !editing,
                            }}
                            type="email"
                        />

                        {editing && (
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleEditToggle}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Account Information
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Account Type
                            </Typography>
                            <Typography variant="body1">
                                {user.isAdmin ? 'Administrator' : 'Regular User'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Member Since
                            </Typography>
                            <Typography variant="body1">
                                {user.createdAt.toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                User ID
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                {user.id}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;
