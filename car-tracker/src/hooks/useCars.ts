import { useState, useEffect } from 'react';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';
import { firestoreCars, firestoreListeners } from '../services/firestore';
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

export const useCars = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setCars([]);
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
        console.log('🔥 Using Firebase Firestore for car data');

        // Set up real-time listener based on user role
        const unsubscribe = user.isAdmin
            ? firestoreListeners.subscribeToAllCars((firestoreCars) => {
                console.log('🔧 Admin: Loading ALL cars from all users:', firestoreCars.length);
                setCars(firestoreCars);
                setLoading(false);
            })
            : firestoreListeners.subscribeToUserCars(user.id, (firestoreCars) => {
                console.log('👤 User: Loading cars for user:', user.id, firestoreCars.length);
                setCars(firestoreCars);
                setLoading(false);
            });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user]);

    const addCar = async (carData: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            const carId = await firestoreCars.addCar(user.id, carData);
            console.log('✅ Car added to Firestore:', carId);
        } catch (error) {
            console.error('❌ Error adding car to Firestore:', error);
            throw error;
        }
    };

    const updateCar = async (carId: string, updates: Partial<Car>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreCars.updateCar(carId, updates);
            console.log('✅ Car updated in Firestore:', carId);
        } catch (error) {
            console.error('❌ Error updating car in Firestore:', error);
            throw error;
        }
    };

    const deleteCar = async (carId: string) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreCars.deleteCar(carId);
            console.log('✅ Car deleted from Firestore:', carId);
        } catch (error) {
            console.error('❌ Error deleting car from Firestore:', error);
            throw error;
        }
    };

    return {
        cars,
        loading,
        addCar,
        updateCar,
        deleteCar,
    };
};