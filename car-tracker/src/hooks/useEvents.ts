import { useState, useEffect } from 'react';
import { Event, EventCategory } from '../types';
import { firestoreEvents } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [userEvents, setUserEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Load all public events
    const loadEvents = async () => {
        try {
            setLoading(true);
            const allEvents = await firestoreEvents.getAllEvents();
            // Sort by date (upcoming first)
            const sortedEvents = allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
            setEvents(sortedEvents);
        } catch (err: any) {
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    // Load user's organized events
    const loadUserEvents = async () => {
        if (!user) return;

        try {
            const organizerEvents = await firestoreEvents.getUserEvents(user.id);
            setUserEvents(organizerEvents);
        } catch (err: any) {
            setError(err.message || 'Failed to load user events');
        }
    };

    // Add new event
    const addEvent = async (eventData: {
        title: string;
        description: string;
        location: string;
        date: Date;
        time: string;
        maxParticipants?: number;
        category: EventCategory;
        isPublic: boolean;
        tags: string[];
        contactInfo?: string;
        requirements?: string;
    }) => {
        if (!user) throw new Error('User not authenticated');

        try {
            const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
                ...eventData,
                organizer: {
                    id: user.id,
                    name: user.displayName || user.email,
                    email: user.email
                },
                participants: [],
                currentParticipants: 0
            };

            await firestoreEvents.addEvent(newEvent);
            await loadEvents();
            await loadUserEvents();
        } catch (err: any) {
            setError(err.message || 'Failed to add event');
            throw err;
        }
    };

    // Update event
    const updateEvent = async (eventId: string, updates: Partial<Event>) => {
        try {
            await firestoreEvents.updateEvent(eventId, updates);
            await loadEvents();
            await loadUserEvents();
        } catch (err: any) {
            setError(err.message || 'Failed to update event');
            throw err;
        }
    };

    // Delete event
    const deleteEvent = async (eventId: string) => {
        try {
            await firestoreEvents.deleteEvent(eventId);
            await loadEvents();
            await loadUserEvents();
        } catch (err: any) {
            setError(err.message || 'Failed to delete event');
            throw err;
        }
    };

    // Join event
    const joinEvent = async (eventId: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await firestoreEvents.joinEvent(eventId, user.id);
            await loadEvents();
        } catch (err: any) {
            setError(err.message || 'Failed to join event');
            throw err;
        }
    };

    // Leave event
    const leaveEvent = async (eventId: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await firestoreEvents.leaveEvent(eventId, user.id);
            await loadEvents();
        } catch (err: any) {
            setError(err.message || 'Failed to leave event');
            throw err;
        }
    };

    // Check if user has joined an event
    const hasJoinedEvent = (event: Event): boolean => {
        if (!user) return false;
        return event.participants.includes(user.id);
    };

    // Check if user is organizer of an event
    const isOrganizer = (event: Event): boolean => {
        if (!user) return false;
        return event.organizer.id === user.id;
    };

    // Get events by category
    const getEventsByCategory = (category: EventCategory) => {
        return events.filter(event => event.category === category);
    };

    // Get upcoming events (next 30 days)
    const getUpcomingEvents = () => {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return events.filter(event => event.date >= now && event.date <= thirtyDaysFromNow);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        if (user) {
            loadUserEvents();
        }
    }, [user]);

    return {
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
        getEventsByCategory,
        getUpcomingEvents,
        refreshEvents: loadEvents
    };
};
