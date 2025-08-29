import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Stack,
} from '@mui/material';
import {
    Add as AddIcon,
    DirectionsCar,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCars } from '../hooks/useCars';
import { Car } from '../types';

const Cars: React.FC = () => {
    const { cars, loading, addCar, updateCar, deleteCar } = useCars();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        vin: '',
        mileage: 0,
        color: '',
    });

    const resetForm = () => {
        setFormData({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            licensePlate: '',
            vin: '',
            mileage: 0,
            color: '',
        });
        setError('');
        setEditingCar(null);
    };

    const handleOpenDialog = (car?: Car) => {
        if (car) {
            setEditingCar(car);
            setFormData({
                make: car.make,
                model: car.model,
                year: car.year,
                licensePlate: car.licensePlate,
                vin: car.vin || '',
                mileage: car.mileage,
                color: car.color,
            });
        } else {
            resetForm();
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingCar) {
                await updateCar(editingCar.id, formData);
            } else {
                await addCar(formData);
            }
            handleCloseDialog();
        } catch (error: any) {
            setError(error.message || 'Failed to save car');
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, car: Car) => {
        setAnchorEl(event.currentTarget);
        setSelectedCar(car);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCar(null);
    };

    const handleEdit = () => {
        if (selectedCar) {
            handleOpenDialog(selectedCar);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedCar) {
            try {
                await deleteCar(selectedCar.id);
            } catch (error: any) {
                setError(error.message || 'Failed to delete car');
            }
        }
        handleMenuClose();
    };

    if (loading) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    My Cars
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Car
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {cars.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                    textAlign="center"
                >
                    <DirectionsCar sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        No cars registered yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        Start tracking your vehicles by adding your first car
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Your First Car
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: 3
                    }}
                >
                    {cars.map((car) => (
                        <Card key={car.id}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {car.year} {car.make} {car.model}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, car)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>

                                <Box mb={2}>
                                    <Chip
                                        label={car.licensePlate}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>

                                <Typography color="text.secondary" gutterBottom>
                                    <strong>Color:</strong> {car.color}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    <strong>Mileage:</strong> {car.mileage.toLocaleString()} miles
                                </Typography>
                                {car.vin && (
                                    <Typography color="text.secondary" gutterBottom>
                                        <strong>VIN:</strong> {car.vin}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenDialog(car)}>
                                    Edit
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => handleOpenDialog()}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Car Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Make"
                                    value={formData.make}
                                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Model"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="License Plate"
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Mileage"
                                    type="number"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="VIN (Optional)"
                                value={formData.vin}
                                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingCar ? 'Update' : 'Add'} Car
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Car Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default Cars;
