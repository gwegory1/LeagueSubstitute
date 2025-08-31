import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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

// Mocked API functions (replace with real API calls)
const fetchRecentCar = async () => ({
id: 1,
name: "Toyota Supra",
lastEdited: "2024-06-10T14:30:00Z",
image: "/images/supra.jpg",
status: "Active",
});
const fetchUpcomingMaintenance = async () => [
{
    id: 1,
    car: "Toyota Supra",
    type: "Oil Change",
    dueDate: "2024-06-20",
},
{
    id: 2,
    car: "Mazda RX-7",
    type: "Brake Inspection",
    dueDate: "2024-06-22",
},
];
const fetchProjectsOverview = async () => [
{
    id: 1,
    name: "Supra Turbo Upgrade",
    status: "In Progress",
    progress: 70,
},
{
    id: 2,
    name: "RX-7 Paint Restoration",
    status: "Completed",
    progress: 100,
},
];
const fetchUpcomingEvents = async () => [
{
    id: 1,
    name: "Track Day at Silverstone",
    date: "2024-06-25",
    type: "Track Day",
},
{
    id: 2,
    name: "Car Show Downtown",
    date: "2024-06-28",
    type: "Car Show",
},
{
    id: 3,
    name: "Drag Racing Competition",
    date: "2024-07-02",
    type: "Racing",
},
];
const fetchMetrics = async () => ({
totalCars: 5,
activeProjects: 2,
upcomingMaintenances: 3,
totalMileage: 124000,
});

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
const [recentCar, setRecentCar] = useState<any>(null);
const [upcomingMaintenance, setUpcomingMaintenance] = useState<any[]>([]);
const [projects, setProjects] = useState<any[]>([]);
const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
const [metrics, setMetrics] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchAll = async () => {
        setLoading(true);
        const [car, maintenance, proj, events, metr] = await Promise.all([
            fetchRecentCar(),
            fetchUpcomingMaintenance(),
            fetchProjectsOverview(),
            fetchUpcomingEvents(),
            fetchMetrics(),
        ]);
        setRecentCar(car);
        setUpcomingMaintenance(maintenance);
        setProjects(proj);
        setUpcomingEvents(events);
        setMetrics(metr);
        setLoading(false);
    };
    fetchAll();
}, []);

if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <CircularProgress />
        </Box>
    );
}

return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
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
                            mb: 3
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar
                                        variant="rounded"
                                        src={recentCar.image}
                                        alt={recentCar.name}
                                        sx={{ 
                                            width: 80, 
                                            height: 80,
                                            border: 2,
                                            borderColor: 'primary.main'
                                        }}
                                    >
                                        <DirectionsCarIcon fontSize="large" />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {recentCar.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Last edited: {new Date(recentCar.lastEdited).toLocaleDateString()}
                                        </Typography>
                                        <Chip
                                            label={recentCar.status}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <TimelapseIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Projects Section */}
                    <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                        <Card sx={{ borderRadius: 2, mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BuildIcon color="primary" />
                                    Active Projects
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {projects.map((proj, index) => (
                                        <Box key={proj.id} sx={{ mb: index === projects.length - 1 ? 0 : 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {proj.name}
                                                </Typography>
                                                <Chip
                                                    label={proj.status}
                                                    size="small"
                                                    color={proj.status === "Completed" ? "success" : "warning"}
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
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Box>

                {/* Right Column - Maintenance & Events */}
                <Box sx={{ flex: { xs: 1, lg: 1 } }}>
                    {/* Upcoming Maintenance */}
                    <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
                        <Card sx={{ borderRadius: 2, mb: 3, height: 'fit-content' }}>
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
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.type}
                                                            </Typography>
                                                            <Typography variant="caption" color="primary">
                                                                Due: {new Date(item.dueDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
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
                        <Card sx={{ borderRadius: 2 }}>
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
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>
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
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{ mt: 0.5 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                                                                </Box>
                                                            </Box>
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