import { useState, useEffect } from 'react';
import { MaintenanceRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { firestoreMaintenance, firestoreListeners } from '../services/firestore';
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

export const useMaintenance = () => {
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setMaintenance([]);
            setLoading(false);
            return;
        }

        if (!isFirebaseConfigured()) {
            console.error('❌ Firebase not configured properly');
            setLoading(false);
            return;
        }

        setLoading(true);

        // Use Firestore for all data
        console.log('🔥 Using Firebase Firestore for maintenance data');

        // Set up real-time listener based on user role
        const unsubscribe = user.isAdmin
            ? firestoreListeners.subscribeToAllMaintenance((firestoreMaintenance) => {
                console.log('🔧 Admin: Loading ALL maintenance from all users:', firestoreMaintenance.length);
                setMaintenance(firestoreMaintenance);
                setLoading(false);
            })
            : firestoreListeners.subscribeToUserMaintenance(user.id, (firestoreMaintenance) => {
                console.log('👤 User: Loading maintenance for user:', user.id, firestoreMaintenance.length);
                setMaintenance(firestoreMaintenance);
                setLoading(false);
            });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user]);

    const addMaintenance = async (maintenanceData: Omit<MaintenanceRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            const maintenanceId = await firestoreMaintenance.addMaintenance(user.id, maintenanceData);
            console.log('✅ Maintenance record added to Firestore:', maintenanceId);
        } catch (error) {
            console.error('❌ Error adding maintenance record to Firestore:', error);
            throw error;
        }
    };

    const updateMaintenance = async (maintenanceId: string, updates: Partial<MaintenanceRecord>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreMaintenance.updateMaintenance(maintenanceId, updates);
            console.log('✅ Maintenance record updated in Firestore:', maintenanceId);
        } catch (error) {
            console.error('❌ Error updating maintenance record in Firestore:', error);
            throw error;
        }
    };

    const deleteMaintenance = async (maintenanceId: string) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreMaintenance.deleteMaintenance(maintenanceId);
            console.log('✅ Maintenance record deleted from Firestore:', maintenanceId);
        } catch (error) {
            console.error('❌ Error deleting maintenance record from Firestore:', error);
            throw error;
        }
    };

    return {
        maintenance,
        loading,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
    };
};
