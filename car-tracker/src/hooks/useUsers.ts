import { useState, useEffect } from 'react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { firestoreUsers } from '../services/firestore';
import { auth } from '../services/firebase';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    try {
        const config = auth.app.options;
        return config.apiKey !== "AIzaSyDemoKey-Replace-With-Your-Actual-Key" &&
            config.projectId !== "car-tracker-demo" &&
            config.apiKey &&
            config.projectId;
    } catch {
        return false;
    }
};

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Only load users if current user is admin
        if (!user || !user.isAdmin) {
            setUsers([]);
            setLoading(false);
            return;
        }

        if (!isFirebaseConfigured()) {
            console.error('❌ Firebase not configured properly');
            setLoading(false);
            return;
        }

        setLoading(true);

        // Load all users for admin
        const loadUsers = async () => {
            try {
                console.log('🔧 Admin: Loading ALL users');
                const allUsers = await firestoreUsers.getAll();
                console.log('🔧 Admin: Loaded users:', allUsers.length);
                setUsers(allUsers);
            } catch (error) {
                console.error('❌ Error loading users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [user]);

    const deleteUser = async (userId: string) => {
        if (!user || !user.isAdmin) throw new Error('Unauthorized');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        try {
            await firestoreUsers.deleteUser(userId);
            console.log('✅ User deleted from Firestore:', userId);
            // Reload users after deletion
            const allUsers = await firestoreUsers.getAll();
            setUsers(allUsers);
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            throw error;
        }
    };

    return {
        users,
        loading,
        deleteUser,
    };
};
