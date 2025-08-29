import React, { useState, useEffect } from 'react';
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
    Select,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import {
    Add as AddIcon,
    Build,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle,
    Schedule,
} from '@mui/icons-material';
import { MaintenanceRecord, MaintenanceType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../hooks/useCars';

const maintenanceTypes: { value: MaintenanceType; label: string }[] = [
    { value: 'oil_change', label: 'Oil Change' },
    { value: 'tire_rotation', label: 'Tire Rotation' },
    { value: 'brake_service', label: 'Brake Service' },
    { value: 'battery_replacement', label: 'Battery Replacement' },
    { value: 'air_filter', label: 'Air Filter' },
    { value: 'fuel_filter', label: 'Fuel Filter' },
    { value: 'transmission_service', label: 'Transmission Service' },
    { value: 'coolant_flush', label: 'Coolant Flush' },
    { value: 'spark_plugs', label: 'Spark Plugs' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'other', label: 'Other' },
];

const Maintenance: React.FC = () => {
    const { user } = useAuth();
    const { cars } = useCars();
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        carId: '',
        type: 'oil_change' as MaintenanceType,
        description: '',
        date: new Date().toISOString().split('T')[0],
        mileage: 0,
        cost: 0,
        serviceProvider: '',
        notes: '',
        nextDueDate: '',
        nextDueMileage: '',
        completed: false,
    });

    useEffect(() => {
        if (!user) {
            setMaintenance([]);
            setLoading(false);
            return;
        }

        // Load from localStorage
        const savedMaintenance = localStorage.getItem('mockMaintenance');
        if (savedMaintenance) {
            try {
                const parsedMaintenance = JSON.parse(savedMaintenance).map((record: any) => ({
                    ...record,
                    date: new Date(record.date),
                    nextDueDate: record.nextDueDate ? new Date(record.nextDueDate) : undefined,
                    createdAt: new Date(record.createdAt),
                    updatedAt: new Date(record.updatedAt),
                }));
                setMaintenance(parsedMaintenance);
            } catch (error) {
                setMaintenance([]);
            }
        }
        setLoading(false);
    }, [user]);

    const saveMaintenanceToStorage = (updatedMaintenance: MaintenanceRecord[]) => {
        localStorage.setItem('mockMaintenance', JSON.stringify(updatedMaintenance));
        setMaintenance(updatedMaintenance);
    };

    const resetForm = () => {
        setFormData({
            carId: '',
            type: 'oil_change',
            description: '',
            date: new Date().toISOString().split('T')[0],
            mileage: 0,
            cost: 0,
            serviceProvider: '',
            notes: '',
            nextDueDate: '',
            nextDueMileage: '',
            completed: false,
        });
        setError('');
        setEditingRecord(null);
    };

    const handleOpenDialog = (record?: MaintenanceRecord) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                carId: record.carId,
                type: record.type,
                description: record.description,
                date: record.date.toISOString().split('T')[0],
                mileage: record.mileage,
                cost: record.cost,
                serviceProvider: record.serviceProvider || '',
                notes: record.notes || '',
                nextDueDate: record.nextDueDate ? record.nextDueDate.toISOString().split('T')[0] : '',
                nextDueMileage: record.nextDueMileage?.toString() || '',
                completed: record.completed,
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

        if (!user) return;

        try {
            if (editingRecord) {
                // Update existing record
                const updatedMaintenance = maintenance.map(record =>
                    record.id === editingRecord.id
                        ? {
                            ...record,
                            ...formData,
                            date: new Date(formData.date),
                            nextDueDate: formData.nextDueDate ? new Date(formData.nextDueDate) : undefined,
                            nextDueMileage: formData.nextDueMileage ? parseInt(formData.nextDueMileage) : undefined,
                            updatedAt: new Date(),
                        }
                        : record
                );
                saveMaintenanceToStorage(updatedMaintenance);
            } else {
                // Add new record
                const newRecord: MaintenanceRecord = {
                    ...formData,
                    id: `maintenance-${Date.now()}`,
                    date: new Date(formData.date),
                    nextDueDate: formData.nextDueDate ? new Date(formData.nextDueDate) : undefined,
                    nextDueMileage: formData.nextDueMileage ? parseInt(formData.nextDueMileage) : undefined,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const updatedMaintenance = [newRecord, ...maintenance];
                saveMaintenanceToStorage(updatedMaintenance);
            }
            handleCloseDialog();
        } catch (error: any) {
            setError(error.message || 'Failed to save maintenance record');
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: MaintenanceRecord) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecord(record);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRecord(null);
    };

    const handleEdit = () => {
        if (selectedRecord) {
            handleOpenDialog(selectedRecord);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedRecord) {
            try {
                const updatedMaintenance = maintenance.filter(record => record.id !== selectedRecord.id);
                saveMaintenanceToStorage(updatedMaintenance);
            } catch (error: any) {
                setError(error.message || 'Failed to delete maintenance record');
            }
        }
        handleMenuClose();
    };

    const toggleCompleted = async (record: MaintenanceRecord) => {
        try {
            const updatedMaintenance = maintenance.map(maintenanceRecord =>
                maintenanceRecord.id === record.id
                    ? {
                        ...maintenanceRecord,
                        completed: !maintenanceRecord.completed,
                        updatedAt: new Date(),
                    }
                    : maintenanceRecord
            );
            saveMaintenanceToStorage(updatedMaintenance);
        } catch (error: any) {
            setError(error.message || 'Failed to update maintenance record');
        }
    };

    const getCarInfo = (carId: string) => {
        const car = cars.find(c => c.id === carId);
        return car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Car';
    };

    const getMaintenanceTypeLabel = (type: MaintenanceType) => {
        const maintenanceType = maintenanceTypes.find(t => t.value === type);
        return maintenanceType ? maintenanceType.label : type;
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
                    Maintenance Records
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    disabled={cars.length === 0}
                >
                    Add Record
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {cars.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                    You need to add a car first before you can track maintenance.
                </Alert>
            ) : null}

            {maintenance.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                    textAlign="center"
                >
                    <Build sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        No maintenance records yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        Start tracking your vehicle maintenance and service history
                    </Typography>
                    {cars.length > 0 && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add First Record
                        </Button>
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}
                >
                    {maintenance.map((record) => (
                        <Card key={record.id}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box flex={1}>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {getMaintenanceTypeLabel(record.type)}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            {getCarInfo(record.carId)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <IconButton
                                            size="small"
                                            onClick={() => toggleCompleted(record)}
                                            color={record.completed ? 'success' : 'default'}
                                        >
                                            {record.completed ? <CheckCircle /> : <Schedule />}
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, record)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Box mb={2}>
                                    <Chip
                                        label={record.completed ? 'Completed' : 'Pending'}
                                        size="small"
                                        color={record.completed ? 'success' : 'warning'}
                                        variant="outlined"
                                    />
                                </Box>

                                <Typography variant="body2" gutterBottom>
                                    <strong>Date:</strong> {record.date.toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Mileage:</strong> {record.mileage.toLocaleString()} miles
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Cost:</strong> ${record.cost.toFixed(2)}
                                </Typography>
                                {record.serviceProvider && (
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Service Provider:</strong> {record.serviceProvider}
                                    </Typography>
                                )}
                                {record.description && (
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Description:</strong> {record.description}
                                    </Typography>
                                )}
                                {record.nextDueDate && (
                                    <Typography variant="body2" color="warning.main" gutterBottom>
                                        <strong>Next Due:</strong> {record.nextDueDate.toLocaleDateString()}
                                        {record.nextDueMileage && ` at ${record.nextDueMileage.toLocaleString()} miles`}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenDialog(record)}>
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => toggleCompleted(record)}
                                    color={record.completed ? 'warning' : 'success'}
                                >
                                    {record.completed ? 'Mark Pending' : 'Mark Complete'}
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
                disabled={cars.length === 0}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Maintenance Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingRecord ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            <FormControl fullWidth required>
                                <InputLabel>Car</InputLabel>
                                <Select
                                    value={formData.carId}
                                    onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                                    label="Car"
                                >
                                    {cars.map((car) => (
                                        <MenuItem key={car.id} value={car.id}>
                                            {car.year} {car.make} {car.model} ({car.licensePlate})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth required>
                                <InputLabel>Maintenance Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
                                    label="Maintenance Type"
                                >
                                    {maintenanceTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                required
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={2}
                            />

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
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

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Cost"
                                    type="number"
                                    inputProps={{ step: 0.01 }}
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                />
                                <TextField
                                    fullWidth
                                    label="Service Provider"
                                    value={formData.serviceProvider}
                                    onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                multiline
                                rows={2}
                            />

                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Next Service Due (Optional)
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Next Due Date"
                                    type="date"
                                    value={formData.nextDueDate}
                                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Next Due Mileage"
                                    type="number"
                                    value={formData.nextDueMileage}
                                    onChange={(e) => setFormData({ ...formData, nextDueMileage: e.target.value })}
                                />
                            </Box>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.completed}
                                        onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                                    />
                                }
                                label="Mark as completed"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingRecord ? 'Update' : 'Add'} Record
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Maintenance Actions Menu */}
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

export default Maintenance;
