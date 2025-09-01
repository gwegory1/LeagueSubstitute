import React, { useState, useMemo } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Switch,
    Avatar,
    Tab,
    Tabs,
    Paper,
    Collapse,
    Autocomplete,
} from '@mui/material';
import {
    Add as AddIcon,
    Event as EventIcon,
    LocationOn,
    Schedule,
    People,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    PersonAdd,
    PersonRemove,
    Star,
    EmojiEvents,
    DirectionsCar,
    Speed,
    Build,
    Favorite,
    Search as SearchIcon,
    FilterList as FilterIcon,
    CalendarToday as CalendarIcon,
    Clear as ClearIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useEvents } from '../hooks/useEvents';
import { Event, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';

const eventCategoryConfig = {
    car_meet: { label: 'Car Meet', icon: <DirectionsCar />, color: '#FF6B6B' },
    race: { label: 'Race', icon: <Speed />, color: '#4ECDC4' },
    track_day: { label: 'Track Day', icon: <EmojiEvents />, color: '#45B7D1' },
    show: { label: 'Car Show', icon: <Star />, color: '#96CEB4' },
    cruise: { label: 'Cruise', icon: <DirectionsCar />, color: '#FFEAA7' },
    charity: { label: 'Charity', icon: <Favorite />, color: '#DDA0DD' },
    workshop: { label: 'Workshop', icon: <Build />, color: '#FFB6C1' },
    competition: { label: 'Competition', icon: <EmojiEvents />, color: '#FFA07A' },
    other: { label: 'Other', icon: <EventIcon />, color: '#B0C4DE' },
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`events-tabpanel-${index}`}
            aria-labelledby={`events-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const Events: React.FC = () => {
    const {
        events,
        userEvents,
        loading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        leaveEvent,
        hasJoinedEvent,
        isOrganizer,
        getUpcomingEvents
    } = useEvents();
    const { user } = useAuth();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formError, setFormError] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Filter and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
    const [selectedLocation, setSelectedLocation] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: new Date(),
        time: '18:00',
        maxParticipants: undefined as number | undefined,
        category: 'car_meet' as EventCategory,
        isPublic: true,
        tags: [] as string[],
        contactInfo: '',
        requirements: '',
    });

    const [tagInput, setTagInput] = useState('');

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            date: new Date(),
            time: '18:00',
            maxParticipants: undefined,
            category: 'car_meet',
            isPublic: true,
            tags: [],
            contactInfo: '',
            requirements: '',
        });
        setTagInput('');
        setFormError('');
        setEditingEvent(null);
    };

    const handleOpenDialog = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                time: event.time,
                maxParticipants: event.maxParticipants,
                category: event.category,
                isPublic: event.isPublic,
                tags: [...event.tags],
                contactInfo: event.contactInfo || '',
                requirements: event.requirements || '',
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
        setFormError('');

        if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
            setFormError('Please fill in all required fields');
            return;
        }

        if (!user) {
            setFormError('User not authenticated');
            return;
        }

        console.log('Form data before submission:', formData);
        console.log('Current user:', user);

        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, formData);
            } else {
                await addEvent(formData);
            }
            handleCloseDialog();
        } catch (error: any) {
            console.error('Error submitting event:', error);
            setFormError(error.message || 'Failed to save event');
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, eventData: Event) => {
        setAnchorEl(event.currentTarget);
        setSelectedEvent(eventData);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    const handleEdit = () => {
        if (selectedEvent) {
            handleOpenDialog(selectedEvent);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedEvent) {
            try {
                await deleteEvent(selectedEvent.id);
            } catch (error: any) {
                setFormError(error.message || 'Failed to delete event');
            }
        }
        handleMenuClose();
    };

    const handleJoinLeave = async (event: Event) => {
        try {
            if (hasJoinedEvent(event)) {
                await leaveEvent(event.id);
            } else {
                await joinEvent(event.id);
            }
        } catch (error: any) {
            setFormError(error.message || 'Failed to update event participation');
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const isEventFull = (event: Event) => {
        return event.maxParticipants && event.currentParticipants >= event.maxParticipants;
    };

    const isEventPast = (event: Event) => {
        return event.date < new Date();
    };

    const getEventStatusColor = (event: Event) => {
        if (isEventPast(event)) return 'grey';
        if (isEventFull(event)) return 'warning';
        return 'success';
    };

    // Get unique locations from all events
    const uniqueLocations = useMemo(() => {
        const locations = events.map(event => event.location);
        return Array.from(new Set(locations)).sort();
    }, [events]);

    // Filter and search events
    const filteredEvents = useMemo(() => {
        let filtered = events;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.tags.some(tag => tag.toLowerCase().includes(query)) ||
                event.organizer.name.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        // Filter by location
        if (selectedLocation !== 'all') {
            filtered = filtered.filter(event => event.location === selectedLocation);
        }

        // Filter by selected date
        if (selectedDate) {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === selectedDate.toDateString();
            });
        }

        return filtered;
    }, [events, searchQuery, selectedCategory, selectedLocation, selectedDate]);

    // Get events for calendar display
    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    // Calendar helper functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentCalendarMonth);
        const firstDay = getFirstDayOfMonth(currentCalendarMonth);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
            const eventsOnDay = getEventsForDate(date);
            days.push({
                date,
                day,
                events: eventsOnDay,
                hasEvents: eventsOnDay.length > 0
            });
        }

        return days;
    };

    const changeCalendarMonth = (direction: 'prev' | 'next') => {
        setCurrentCalendarMonth(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedLocation('all');
        setSelectedDate(null);
    };

    const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'all' || selectedLocation !== 'all' || selectedDate;

    const upcomingEvents = getUpcomingEvents();
    const filteredUpcomingEvents = useMemo(() => {
        let filtered = upcomingEvents;

        // Apply same filters as main events
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.tags.some(tag => tag.toLowerCase().includes(query)) ||
                event.organizer.name.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        if (selectedLocation !== 'all') {
            filtered = filtered.filter(event => event.location === selectedLocation);
        }

        if (selectedDate) {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === selectedDate.toDateString();
            });
        }

        return filtered;
    }, [upcomingEvents, searchQuery, selectedCategory, selectedLocation, selectedDate]);

    const renderEventCard = (event: Event) => {
        const config = eventCategoryConfig[event.category];
        const joined = hasJoinedEvent(event);
        const organizer = isOrganizer(event);
        const past = isEventPast(event);
        const full = isEventFull(event);

        return (
            <Card
                key={event.id}
                sx={{
                    height: '100%',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                        borderColor: config.color,
                    },
                    position: 'relative',
                }}
            >
                {/* Category Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: config.color,
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}
                >
                    {config.icon}
                    {config.label}
                </Box>

                <CardContent sx={{ p: 3, pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ pr: 10 }}>
                            {event.title}
                        </Typography>
                        {(organizer || user?.isAdmin) && (
                            <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, event)}
                                sx={{ mt: -0.5 }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                        {event.description.length > 100
                            ? `${event.description.substring(0, 100)}...`
                            : event.description
                        }
                    </Typography>

                    <Stack spacing={1} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Schedule fontSize="small" color="primary" />
                            <Typography variant="body2">
                                {formatDate(event.date)} at {event.time}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationOn fontSize="small" color="primary" />
                            <Typography variant="body2">{event.location}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <People fontSize="small" color="primary" />
                            <Typography variant="body2">
                                {event.currentParticipants}
                                {event.maxParticipants ? `/${event.maxParticipants}` : ''} participants
                            </Typography>
                            {full && <Chip label="FULL" size="small" color="warning" />}
                        </Box>
                    </Stack>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Avatar
                            sx={{
                                width: 24,
                                height: 24,
                                bgcolor: config.color,
                                fontSize: '0.75rem'
                            }}
                        >
                            {event.organizer.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            Organized by {event.organizer.name}
                        </Typography>
                    </Box>

                    {event.tags.length > 0 && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {event.tags.slice(0, 3).map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        borderColor: config.color,
                                        color: config.color,
                                        '&:hover': { backgroundColor: `${config.color}10` }
                                    }}
                                />
                            ))}
                            {event.tags.length > 3 && (
                                <Chip
                                    label={`+${event.tags.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                    {!organizer && !past && (
                        <Button
                            size="small"
                            variant={joined ? "outlined" : "contained"}
                            color={joined ? "secondary" : "primary"}
                            onClick={() => handleJoinLeave(event)}
                            disabled={!joined && !!full}
                            startIcon={joined ? <PersonRemove /> : <PersonAdd />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            {joined ? 'Leave' : full ? 'Full' : 'Join'}
                        </Button>
                    )}
                    {organizer && (
                        <Chip
                            label="Your Event"
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ fontWeight: 'bold' }}
                        />
                    )}
                    {past && (
                        <Chip
                            label="Past Event"
                            size="small"
                            color="default"
                            variant="outlined"
                        />
                    )}
                </CardActions>

                {/* Status indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getEventStatusColor(event) === 'success' ? '#4CAF50' :
                            getEventStatusColor(event) === 'warning' ? '#FF9800' : '#757575',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                />
            </Card>
        );
    };

    if (loading) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Loading events...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                    p: 4,
                    mb: 4,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                    }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                            🚗 Car Events
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Discover amazing automotive events and create your own!
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                            {upcomingEvents.length} upcoming events • {events.length} total events
                            {hasActiveFilters && ` • ${filteredEvents.length} filtered`}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 3,
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)',
                            }
                        }}
                    >
                        Create Event
                    </Button>
                </Box>
            </Box>

            {error && !error.includes('Missing or insufficient permissions') && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Search and Filter Controls */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <SearchIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Search & Filter Events
                    </Typography>
                    {hasActiveFilters && (
                        <Chip
                            label={`${filteredEvents.length} filtered`}
                            color="primary"
                            size="small"
                        />
                    )}
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search events by title, description, location, tags, or organizer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: searchQuery && (
                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                                <ClearIcon />
                            </IconButton>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Filter Toggle */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ borderRadius: 2 }}
                    >
                        Advanced Filters
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            variant="text"
                            startIcon={<ClearIcon />}
                            onClick={clearFilters}
                            color="secondary"
                        >
                            Clear All Filters
                        </Button>
                    )}
                </Box>

                {/* Advanced Filters */}
                <Collapse in={showFilters}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Category"
                                onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                {Object.entries(eventCategoryConfig).map(([key, config]) => (
                                    <MenuItem key={key} value={key}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {config.icon}
                                            {config.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            options={['all', ...uniqueLocations]}
                            value={selectedLocation}
                            onChange={(_, value) => setSelectedLocation(value || 'all')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Location"
                                    fullWidth
                                />
                            )}
                            getOptionLabel={(option) => option === 'all' ? 'All Locations' : option}
                        />
                        <TextField
                            type="date"
                            label="Filter by Date"
                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedDate(new Date(e.target.value));
                                } else {
                                    setSelectedDate(null);
                                }
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: selectedDate && (
                                    <IconButton size="small" onClick={() => setSelectedDate(null)}>
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                            fullWidth
                        />
                    </Box>
                </Collapse>
            </Paper>

            {/* Main Content Area with Calendar on Right */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: 3, mb: 3 }}>
                <Box>
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                            <Tab label={`All Events (${filteredEvents.length})`} />
                            <Tab label={`My Events (${userEvents.length})`} />
                            <Tab label={`Upcoming (${filteredUpcomingEvents.length})`} />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={tabValue} index={0}>
                        {filteredEvents.length === 0 ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                py={8}
                                textAlign="center"
                            >
                                <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h5" gutterBottom>
                                    {hasActiveFilters ? 'No events match your filters' : 'No events yet'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    {hasActiveFilters
                                        ? 'Try adjusting your search criteria or filters'
                                        : 'Be the first to create an amazing automotive event!'
                                    }
                                </Typography>
                                {hasActiveFilters ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog()}
                                    >
                                        Create First Event
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                                    gap: 3
                                }}
                            >
                                {filteredEvents.map((event) => (
                                    <Box key={event.id}>
                                        {renderEventCard(event)}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        {userEvents.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" gutterBottom>
                                    You haven't organized any events yet
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog()}
                                >
                                    Create Your First Event
                                </Button>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                                    gap: 3
                                }}
                            >
                                {userEvents.map((event) => (
                                    <Box key={event.id}>
                                        {renderEventCard(event)}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        {filteredUpcomingEvents.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" gutterBottom>
                                    {hasActiveFilters
                                        ? 'No upcoming events match your filters'
                                        : 'No upcoming events in the next 30 days'
                                    }
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {hasActiveFilters
                                        ? 'Try adjusting your search criteria or filters'
                                        : 'Check back later or create your own event!'
                                    }
                                </Typography>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                                    gap: 3
                                }}
                            >
                                {filteredUpcomingEvents.map((event) => (
                                    <Box key={event.id}>
                                        {renderEventCard(event)}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </TabPanel>
                </Box>

                {/* Calendar Sidebar */}
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: 'fit-content', position: 'sticky', top: 20 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <CalendarIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Event Calendar
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton onClick={() => changeCalendarMonth('prev')}>
                                <ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />
                            </IconButton>
                            <Typography variant="subtitle1" sx={{ minWidth: 150, textAlign: 'center', fontWeight: 500 }}>
                                {currentCalendarMonth.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Typography>
                            <IconButton onClick={() => changeCalendarMonth('next')}>
                                <ExpandLessIcon sx={{ transform: 'rotate(90deg)' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Calendar Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                        {/* Day Headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <Box key={day}>
                                <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    textAlign="center"
                                    display="block"
                                    py={1}
                                    color="text.secondary"
                                >
                                    {day}
                                </Typography>
                            </Box>
                        ))}

                        {/* Calendar Days */}
                        {generateCalendarDays().map((dayData, index) => (
                            <Box key={index}>
                                <Box
                                    sx={{
                                        minHeight: 32,
                                        p: 0.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        cursor: dayData ? 'pointer' : 'default',
                                        backgroundColor: dayData?.hasEvents ? 'primary.light' : 'transparent',
                                        color: dayData?.hasEvents ? 'primary.contrastText' : 'text.primary',
                                        '&:hover': dayData ? {
                                            backgroundColor: dayData.hasEvents ? 'primary.main' : 'action.hover',
                                        } : {},
                                        transition: 'all 0.2s ease',
                                    }}
                                    onClick={() => {
                                        if (dayData) {
                                            setSelectedDate(dayData.date);
                                            setTabValue(0); // Switch to All Events tab
                                        }
                                    }}
                                >
                                    {dayData && (
                                        <>
                                            <Typography
                                                variant="body2"
                                                fontWeight={dayData.hasEvents ? 'bold' : 'normal'}
                                                textAlign="center"
                                                fontSize="0.75rem"
                                            >
                                                {dayData.day}
                                            </Typography>
                                            {dayData.hasEvents && (
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'primary.contrastText',
                                                        mx: 'auto',
                                                        mt: 0.5,
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {selectedDate && (
                        <Box mt={2} p={2} bgcolor="action.hover" borderRadius={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                Events on {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}:
                            </Typography>
                            <Stack direction="column" spacing={0.5}>
                                {getEventsForDate(selectedDate).map((event) => {
                                    const config = eventCategoryConfig[event.category];
                                    return (
                                        <Chip
                                            key={event.id}
                                            label={event.title}
                                            size="small"
                                            sx={{
                                                backgroundColor: config.color,
                                                color: 'white',
                                                '&:hover': { opacity: 0.8 }
                                            }}
                                            onClick={() => setSelectedDate(null)}
                                        />
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add event"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                }}
                onClick={() => handleOpenDialog()}
            >
                <AddIcon />
            </Fab>

            {/* Create/Edit Event Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {formError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {formError}
                            </Alert>
                        )}

                        <Stack spacing={3}>
                            <TextField
                                required
                                fullWidth
                                label="Event Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        label="Category"
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                                    >
                                        {Object.entries(eventCategoryConfig).map(([key, config]) => (
                                            <MenuItem key={key} value={key}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {config.icon}
                                                    {config.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                                <TextField
                                    type="date"
                                    label="Date"
                                    value={formData.date.toISOString().split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    type="time"
                                    label="Time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    type="number"
                                    label="Max Participants (Optional)"
                                    value={formData.maxParticipants || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        maxParticipants: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Tags
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                    {formData.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => removeTag(tag)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Add tag"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={addTag}
                                        disabled={!tagInput.trim()}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                label="Contact Information (Optional)"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                placeholder="Email, phone, or other contact details"
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Requirements (Optional)"
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="What participants need to bring or requirements to join"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    />
                                }
                                label="Make this event public"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingEvent ? 'Update' : 'Create'} Event
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Event Actions Menu */}
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

export default Events;
