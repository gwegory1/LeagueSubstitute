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
    LinearProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Assignment,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';
import { Project, Priority, ProjectStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../hooks/useCars';

const priorities: { value: Priority; label: string; color: any }[] = [
    { value: 'low', label: 'Low', color: 'default' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'urgent', label: 'Urgent', color: 'error' },
];

const statuses: { value: ProjectStatus; label: string; color: any }[] = [
    { value: 'planned', label: 'Planned', color: 'info' },
    { value: 'in_progress', label: 'In Progress', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const Projects: React.FC = () => {
    const { user } = useAuth();
    const { cars } = useCars();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        carId: '',
        title: '',
        description: '',
        priority: 'medium' as Priority,
        status: 'planned' as ProjectStatus,
        estimatedCost: 0,
        actualCost: '',
        startDate: '',
        targetDate: '',
        completedDate: '',
        notes: '',
    });

    useEffect(() => {
        if (!user) {
            setProjects([]);
            setLoading(false);
            return;
        }

        loadProjects();
    }, [user]);

    const loadProjects = () => {
        try {
            const storedProjects = localStorage.getItem('projects');
            if (storedProjects) {
                const allProjects = JSON.parse(storedProjects);
                const userProjects = allProjects.filter((project: any) => project.userId === user?.id)
                    .map((project: any) => ({
                        ...project,
                        startDate: project.startDate ? new Date(project.startDate) : undefined,
                        targetDate: project.targetDate ? new Date(project.targetDate) : undefined,
                        completedDate: project.completedDate ? new Date(project.completedDate) : undefined,
                        createdAt: new Date(project.createdAt),
                        updatedAt: new Date(project.updatedAt),
                    }));
                setProjects(userProjects.sort((a: Project, b: Project) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ));
            } else {
                setProjects([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjects([]);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            carId: '',
            title: '',
            description: '',
            priority: 'medium',
            status: 'planned',
            estimatedCost: 0,
            actualCost: '',
            startDate: '',
            targetDate: '',
            completedDate: '',
            notes: '',
        });
        setError('');
        setEditingProject(null);
    };

    const handleOpenDialog = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                carId: project.carId,
                title: project.title,
                description: project.description,
                priority: project.priority,
                status: project.status,
                estimatedCost: project.estimatedCost,
                actualCost: project.actualCost?.toString() || '',
                startDate: project.startDate ? project.startDate.toISOString().split('T')[0] : '',
                targetDate: project.targetDate ? project.targetDate.toISOString().split('T')[0] : '',
                completedDate: project.completedDate ? project.completedDate.toISOString().split('T')[0] : '',
                notes: project.notes || '',
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
            const projectData = {
                ...formData,
                actualCost: formData.actualCost ? parseFloat(formData.actualCost) : undefined,
                startDate: formData.startDate ? new Date(formData.startDate) : undefined,
                targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
                completedDate: formData.completedDate ? new Date(formData.completedDate) : undefined,
                userId: user.id,
                updatedAt: new Date(),
            };

            // Get existing projects from localStorage
            const storedProjects = localStorage.getItem('projects');
            let allProjects = storedProjects ? JSON.parse(storedProjects) : [];

            if (editingProject) {
                // Update existing project
                const projectIndex = allProjects.findIndex((p: any) => p.id === editingProject.id);
                if (projectIndex !== -1) {
                    allProjects[projectIndex] = { ...editingProject, ...projectData };
                }
            } else {
                // Add new project
                const newProject = {
                    ...projectData,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                };
                allProjects.push(newProject);
            }

            // Save back to localStorage
            localStorage.setItem('projects', JSON.stringify(allProjects));
            loadProjects(); // Reload projects
            handleCloseDialog();
        } catch (error: any) {
            setError(error.message || 'Failed to save project');
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProject(null);
    };

    const handleEdit = () => {
        if (selectedProject) {
            handleOpenDialog(selectedProject);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedProject) {
            try {
                // Get existing projects from localStorage
                const storedProjects = localStorage.getItem('projects');
                let allProjects = storedProjects ? JSON.parse(storedProjects) : [];

                // Remove the project
                allProjects = allProjects.filter((p: any) => p.id !== selectedProject.id);

                // Save back to localStorage
                localStorage.setItem('projects', JSON.stringify(allProjects));
                loadProjects(); // Reload projects
            } catch (error: any) {
                setError(error.message || 'Failed to delete project');
            }
        }
        handleMenuClose();
    };

    const updateProjectStatus = async (project: Project, newStatus: ProjectStatus) => {
        try {
            // Get existing projects from localStorage
            const storedProjects = localStorage.getItem('projects');
            let allProjects = storedProjects ? JSON.parse(storedProjects) : [];

            const updateData: any = {
                status: newStatus,
                updatedAt: new Date(),
            };

            if (newStatus === 'completed' && !project.completedDate) {
                updateData.completedDate = new Date();
            } else if (newStatus !== 'completed') {
                updateData.completedDate = null;
            }

            // Update the project
            const projectIndex = allProjects.findIndex((p: any) => p.id === project.id);
            if (projectIndex !== -1) {
                allProjects[projectIndex] = { ...allProjects[projectIndex], ...updateData };

                // Save back to localStorage
                localStorage.setItem('projects', JSON.stringify(allProjects));
                loadProjects(); // Reload projects
            }
        } catch (error: any) {
            setError(error.message || 'Failed to update project status');
        }
    };

    const getCarInfo = (carId: string) => {
        const car = cars.find(c => c.id === carId);
        return car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Car';
    };

    const getPriorityInfo = (priority: Priority) => {
        return priorities.find(p => p.value === priority) || priorities[1];
    };

    const getStatusInfo = (status: ProjectStatus) => {
        return statuses.find(s => s.value === status) || statuses[0];
    };

    const getProgressValue = (status: ProjectStatus) => {
        switch (status) {
            case 'planned': return 0;
            case 'in_progress': return 50;
            case 'completed': return 100;
            case 'cancelled': return 0;
            default: return 0;
        }
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
                    Projects
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    disabled={cars.length === 0}
                >
                    Add Project
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {cars.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                    You need to add a car first before you can create projects.
                </Alert>
            ) : null}

            {projects.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                    textAlign="center"
                >
                    <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        No projects yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        Create projects to plan and track upcoming repairs and modifications
                    </Typography>
                    {cars.length > 0 && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Create First Project
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
                    {projects.map((project) => {
                        const priorityInfo = getPriorityInfo(project.priority);
                        const statusInfo = getStatusInfo(project.status);
                        const progress = getProgressValue(project.status);

                        return (
                            <Card key={project.id}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box flex={1}>
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {project.title}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                {getCarInfo(project.carId)}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, project)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>

                                    <Box display="flex" gap={1} mb={2}>
                                        <Chip
                                            label={statusInfo.label}
                                            size="small"
                                            color={statusInfo.color}
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={priorityInfo.label}
                                            size="small"
                                            color={priorityInfo.color}
                                            variant="filled"
                                        />
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="body2" gutterBottom>
                                            Progress
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{ height: 8, borderRadius: 4 }}
                                            color={statusInfo.color}
                                        />
                                    </Box>

                                    <Typography variant="body2" gutterBottom>
                                        <strong>Description:</strong> {project.description}
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        <strong>Estimated Cost:</strong> ${project.estimatedCost.toFixed(2)}
                                    </Typography>

                                    {project.actualCost && (
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Actual Cost:</strong> ${project.actualCost.toFixed(2)}
                                        </Typography>
                                    )}

                                    {project.targetDate && (
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Target Date:</strong> {project.targetDate.toLocaleDateString()}
                                        </Typography>
                                    )}

                                    {project.completedDate && (
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Completed:</strong> {project.completedDate.toLocaleDateString()}
                                        </Typography>
                                    )}

                                    {project.notes && (
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Notes:</strong> {project.notes}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleOpenDialog(project)}>
                                        Edit
                                    </Button>
                                    {project.status === 'planned' && (
                                        <Button
                                            size="small"
                                            onClick={() => updateProjectStatus(project, 'in_progress')}
                                            color="primary"
                                            startIcon={<PlayArrow />}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    {project.status === 'in_progress' && (
                                        <Button
                                            size="small"
                                            onClick={() => updateProjectStatus(project, 'completed')}
                                            color="success"
                                            startIcon={<CheckCircle />}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                    {(project.status === 'planned' || project.status === 'in_progress') && (
                                        <Button
                                            size="small"
                                            onClick={() => updateProjectStatus(project, 'cancelled')}
                                            color="error"
                                            startIcon={<Cancel />}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    })}
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

            {/* Add/Edit Project Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingProject ? 'Edit Project' : 'Add New Project'}
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

                            <TextField
                                required
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={3}
                            />

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                        label="Priority"
                                    >
                                        {priorities.map((priority) => (
                                            <MenuItem key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                                        label="Status"
                                    >
                                        {statuses.map((status) => (
                                            <MenuItem key={status.value} value={status.value}>
                                                {status.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Estimated Cost"
                                    type="number"
                                    inputProps={{ step: 0.01 }}
                                    value={formData.estimatedCost}
                                    onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) })}
                                />
                                <TextField
                                    fullWidth
                                    label="Actual Cost"
                                    type="number"
                                    inputProps={{ step: 0.01 }}
                                    value={formData.actualCost}
                                    onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                                />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Target Date"
                                    type="date"
                                    value={formData.targetDate}
                                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Completed Date"
                                    type="date"
                                    value={formData.completedDate}
                                    onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                multiline
                                rows={3}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingProject ? 'Update' : 'Create'} Project
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Project Actions Menu */}
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

export default Projects;
