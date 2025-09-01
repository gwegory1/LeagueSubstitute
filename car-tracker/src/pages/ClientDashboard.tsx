import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import EventIcon from "@mui/icons-material/Event";
import SpeedIcon from "@mui/icons-material/Speed";
import TimelapseIcon from "@mui/icons-material/Timelapse";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

// Import hooks for real data
import { useCars } from '../hooks/useCars';
import { useEvents } from '../hooks/useEvents';
import { useProjects } from '../hooks/useProjects';
import { useMaintenance } from '../hooks/useMaintenance';
import { useAuth } from '../context/AuthContext';

// Simplified Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4
        }
    }
};

const cardHoverVariants = {
    hover: {
        y: 0,
        transition: { duration: 0.2 }
    }
};

const ClientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cars, loading: carsLoading } = useCars();
    const { events, getUpcomingEvents, loading: eventsLoading } = useEvents();
    const { projects, loading: projectsLoading } = useProjects();
    const { maintenance, loading: maintenanceLoading } = useMaintenance();

    const [loading, setLoading] = useState(true);

    // Calculate real metrics from data
    const metrics = useMemo(() => {
        const totalCars = cars.length;
        const activeProjects = projects.filter(p => p.status === 'in_progress').length;
        const totalMileage = cars.reduce((sum, car) => sum + car.mileage, 0);

        // Calculate upcoming maintenance (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const upcomingMaintenances = maintenance.filter(m =>
            !m.completed &&
            m.nextDueDate &&
            m.nextDueDate >= now &&
            m.nextDueDate <= thirtyDaysFromNow
        ).length;

        return {
            totalCars,
            activeProjects,
            upcomingMaintenances,
            totalMileage
        };
    }, [cars, projects, maintenance]);

    // Get the most recently updated car
    const recentCar = useMemo(() => {
        if (cars.length === 0) return null;
        return cars.reduce((latest, car) =>
            car.updatedAt > latest.updatedAt ? car : latest
        );
    }, [cars]);

    // Get upcoming maintenance items
    const upcomingMaintenance = useMemo(() => {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        return maintenance
            .filter(m => !m.completed && m.nextDueDate && m.nextDueDate >= now && m.nextDueDate <= thirtyDaysFromNow)
            .sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime())
            .slice(0, 5)
            .map(m => {
                const car = cars.find(c => c.id === m.carId);
                return {
                    id: m.id,
                    car: car ? `${car.make} ${car.model}` : 'Unknown Car',
                    type: m.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    dueDate: m.nextDueDate!.toISOString().split('T')[0]
                };
            });
    }, [maintenance, cars]);

    // Get active projects with progress
    const activeProjects = useMemo(() => {
        return projects
            .filter(p => p.status !== 'cancelled')
            .slice(0, 3)
            .map(p => {
                let progress = 0;
                if (p.status === 'completed') {
                    progress = 100;
                } else if (p.status === 'in_progress') {
                    if (p.startDate && p.targetDate) {
                        const total = p.targetDate.getTime() - p.startDate.getTime();
                        const elapsed = new Date().getTime() - p.startDate.getTime();
                        progress = Math.min(Math.max((elapsed / total) * 100, 10), 90);
                    } else {
                        progress = 25; // Default for in-progress without dates
                    }
                } else if (p.status === 'planned') {
                    progress = 5;
                }

                return {
                    id: p.id,
                    name: p.title,
                    status: p.status === 'in_progress' ? 'In Progress' :
                        p.status === 'completed' ? 'Completed' :
                            p.status === 'planned' ? 'Planned' : 'Cancelled',
                    progress: Math.round(progress)
                };
            });
    }, [projects]);

    // Get upcoming events
    const upcomingEvents = useMemo(() => {
        const upcoming = getUpcomingEvents();
        return upcoming
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 4)
            .map(e => ({
                id: e.id,
                name: e.title,
                date: e.date.toISOString().split('T')[0],
                type: e.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            }));
    }, [getUpcomingEvents]);

    useEffect(() => {
        // Set loading to false when all data is loaded
        if (!carsLoading && !eventsLoading && !projectsLoading && !maintenanceLoading) {
            setLoading(false);
        }
    }, [carsLoading, eventsLoading, projectsLoading, maintenanceLoading]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, pt: 11, minHeight: '100vh' }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants}>


                    {/* Quirky Welcome Text */}
                    <Typography
                        variant="h2"
                        sx={{
                            mb: 4,
                            fontStyle: 'italic',
                            color: 'primary.main',
                            textAlign: 'left',
                            '& span': { color: 'secondary.main' }
                        }}
                    >
                        🏁 Welcome back, Speed Demon! <span>Time to make some  magic happen!</span> ✨🔧
                    </Typography>

                    <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                        Dashboard Overview
                    </Typography>
                </motion.div>

                {/* Main Grid Layout */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                    {/* Left Column - Main Stats & Car */}
                    <Box sx={{ flex: { xs: 1, lg: 2 } }}>
                        {/* Stats Cards Row */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                            {[
                                { icon: DirectionsCarIcon, title: 'Total Cars', value: metrics.totalCars, color: 'primary.main' },
                                { icon: BuildIcon, title: 'Active Projects', value: metrics.activeProjects, color: 'secondary.main' },
                                { icon: EventIcon, title: 'Upcoming Maintenance', value: metrics.upcomingMaintenances, color: 'warning.main' },
                                { icon: SpeedIcon, title: 'Total Mileage', value: `${metrics.totalMileage.toLocaleString()} km`, color: 'success.main' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={cardHoverVariants.hover}
                                >
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            border: 1,
                                            borderColor: stat.color,
                                            background: 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                    {stat.title}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: stat.color }}>
                                                    {stat.value}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Box>

                        {/* Featured Car Card */}
                        <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                            <Card sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(255,77,166,0.1) 100%)',
                                border: 1,
                                borderColor: 'primary.main',
                                mb: 3,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                }
                            }}
                                onClick={() => navigate('/cars')}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {recentCar ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box
                                                component="img"
                                                src={`/images/cars/${recentCar.image || 'default.webp'}`}
                                                alt={`${recentCar.year} ${recentCar.make} ${recentCar.model}`}
                                                sx={{
                                                    width: 280,
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: 2,
                                                }}
                                                onError={(e) => {
                                                    // Fallback to default image if the specified image doesn't exist
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/cars/default.webp';
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {recentCar.make} {recentCar.model} ({recentCar.year})
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Last edited: {new Date(recentCar.updatedAt).toLocaleDateString()}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip
                                                        label="Active"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={`${recentCar.mileage.toLocaleString()} km`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                            <TimelapseIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box
                                                component="img"
                                                src="/images/cars/default.webp"
                                                alt="No car available"
                                                sx={{
                                                    width: 280,
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: 2,
                                                    opacity: 0.6,
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    No Cars Yet
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Add your first car to get started!
                                                </Typography>
                                                <Chip
                                                    label="Getting Started"
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                            <TimelapseIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Projects Section */}
                        <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                            <Card sx={{
                                borderRadius: 2,
                                mb: 3,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                }
                            }}
                                onClick={() => navigate('/projects')}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BuildIcon color="primary" />
                                        Active Projects
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {activeProjects.length > 0 ? activeProjects.map((proj, index) => (
                                            <Box key={proj.id} sx={{ mb: index === activeProjects.length - 1 ? 0 : 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {proj.name}
                                                    </Typography>
                                                    <Chip
                                                        label={proj.status}
                                                        size="small"
                                                        color={proj.status === "Completed" ? "success" : proj.status === "In Progress" ? "warning" : "default"}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={proj.progress}
                                                        sx={{
                                                            flex: 1,
                                                            height: 8,
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                                                        {proj.progress}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )) : (
                                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                                <BuildIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    No active projects
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Start your first project!
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>

                    {/* Right Column - Maintenance & Events */}
                    <Box sx={{ flex: { xs: 1, lg: 1 } }}>
                        {/* Upcoming Maintenance */}
                        <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                            <Card sx={{
                                borderRadius: 2,
                                mb: 3,
                                height: 'fit-content',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                }
                            }}
                                onClick={() => navigate('/maintenance')}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, paddingTop: 1, paddingLeft: 1 }}>
                                        <BuildIcon color="secondary" />
                                        Upcoming Maintenance
                                    </Typography>
                                    <List dense sx={{ mt: 1 }}>
                                        {upcomingMaintenance.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <ListItem sx={{ px: 0, py: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        <BuildIcon color="action" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                                {item.car}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <span>
                                                                <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                                                                    {item.type}
                                                                </Typography>
                                                                <Typography variant="caption" color="primary" component="span" sx={{ display: 'block' }}>
                                                                    Due: {new Date(item.dueDate).toLocaleDateString()}
                                                                </Typography>
                                                            </span>
                                                        }
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => {
                                                            // Handle start maintenance action
                                                            console.log(`Starting maintenance for ${item.car}: ${item.type}`);
                                                        }}
                                                        sx={{
                                                            ml: 1,
                                                            minWidth: 'auto',
                                                            px: 2,
                                                            py: 0.5,
                                                            fontSize: '0.7rem',
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Start now
                                                    </Button>
                                                </ListItem>
                                                {index < upcomingMaintenance.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                        {upcomingMaintenance.length === 0 && (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                                No upcoming maintenance
                                            </Typography>
                                        )}
                                    </List>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                            <Card sx={{
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                }
                            }}
                                onClick={() => navigate('/events')}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <EventIcon color="info" />
                                        Upcoming Events
                                        <Chip
                                            label={`${upcomingEvents.length} events`}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                            sx={{ ml: 'auto' }}
                                        />
                                    </Typography>

                                    {/* Quick Stats */}
                                    <Box sx={{
                                        mb: 3,
                                        p: 3,
                                        backgroundColor: 'rgba(0,229,255,0.08)',
                                        borderRadius: 2,
                                        border: 2,
                                        borderColor: 'primary.main',
                                        borderStyle: 'dashed',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)',
                                            animation: 'shimmer 2s ease-in-out infinite',
                                        }
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            ⚡ Next Event In
                                        </Typography>
                                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {upcomingEvents.length > 0 ?
                                                Math.ceil((new Date(upcomingEvents[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                                : 0} days
                                        </Typography>
                                        {upcomingEvents.length > 0 && (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                {upcomingEvents[0].name}
                                            </Typography>
                                        )}
                                    </Box>

                                    <List dense sx={{ mt: 0 }}>
                                        {upcomingEvents.slice(0, 4).map((event, index) => {
                                            const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                            const isUpcoming = daysUntil <= 7;

                                            return (
                                                <React.Fragment key={event.id}>
                                                    <ListItem sx={{
                                                        px: 2,
                                                        py: 2,
                                                        backgroundColor: isUpcoming ? 'rgba(255,77,166,0.08)' : 'transparent',
                                                        borderRadius: 2,
                                                        mb: 1,
                                                        border: isUpcoming ? 1 : 0,
                                                        borderColor: isUpcoming ? 'secondary.main' : 'transparent',
                                                        borderStyle: 'solid'
                                                    }}>
                                                        <ListItemIcon sx={{ minWidth: 45 }}>
                                                            <EventIcon
                                                                color={isUpcoming ? "secondary" : "action"}
                                                                fontSize="medium"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }} component="span">
                                                                        {event.name}
                                                                    </Typography>
                                                                    {isUpcoming && (
                                                                        <Chip
                                                                            label="SOON"
                                                                            size="small"
                                                                            color="secondary"
                                                                            sx={{ fontSize: '0.65rem', height: 22, fontWeight: 'bold' }}
                                                                        />
                                                                    )}
                                                                </span>
                                                            }
                                                            secondary={
                                                                <div style={{ marginTop: '4px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                                        <Chip
                                                                            label={event.type}
                                                                            size="small"
                                                                            color="info"
                                                                            variant="outlined"
                                                                            sx={{ fontSize: '0.7rem', height: 24 }}
                                                                        />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {new Date(event.date).toLocaleDateString()}
                                                                        </Typography>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                        <Typography variant="body2" color={isUpcoming ? "secondary.main" : "text.secondary"} sx={{ fontWeight: isUpcoming ? 'bold' : 'normal' }}>
                                                                            {daysUntil > 0 ? `${daysUntil} days away` : daysUntil === 0 ? 'Today!' : 'Past event'}
                                                                        </Typography>
                                                                        {event.type === 'Track Day' && (
                                                                            <Chip label="🏁" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                                                                        )}
                                                                        {event.type === 'Car Show' && (
                                                                            <Chip label="🏆" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                                                                        )}
                                                                        {event.type === 'Racing' && (
                                                                            <Chip label="⚡" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            }
                                                        />
                                                    </ListItem>
                                                    {index < Math.min(upcomingEvents.length - 1, 3) && (
                                                        <Box sx={{ height: 8 }} />
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                        {upcomingEvents.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: 3, opacity: 0.7 }}>
                                                <EventIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    No upcoming events
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Time to plan your next adventure!
                                                </Typography>
                                            </Box>
                                        )}
                                    </List>

                                    {upcomingEvents.length > 4 && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Chip
                                                label={`+${upcomingEvents.length - 4} more events`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
};

export default ClientDashboard;