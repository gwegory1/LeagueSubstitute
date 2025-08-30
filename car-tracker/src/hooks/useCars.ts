import { useState, useEffect } from 'react';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';

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

        // Load user-specific car data
        const userCarsKey = `mockCars_${user.id}`;
        const savedCars = localStorage.getItem(userCarsKey);
        
        if (savedCars) {
            try {
                const parsedCars = JSON.parse(savedCars).map((car: any) => ({
                    ...car,
                    createdAt: new Date(car.createdAt),
                    updatedAt: new Date(car.updatedAt),
                }));
                
                // Filter to ensure we only show cars belonging to this user
                const userCars = parsedCars.filter((car: Car) => car.userId === user.id);
                setCars(userCars);
            } catch (error) {
                console.error('Error loading user cars:', error);
                setCars([]);
            }
        } else {
            // No saved cars for this user
            setCars([]);
        }
        setLoading(false);
    }, [user]);

    const saveCarsToStorage = (updatedCars: Car[]) => {
        if (!user) return;
        
        // Save cars with user-specific key
        const userCarsKey = `mockCars_${user.id}`;
        
        // Ensure all cars belong to the current user
        const userCars = updatedCars.filter(car => car.userId === user.id);
        
        localStorage.setItem(userCarsKey, JSON.stringify(userCars));
        setCars(userCars);
    };

    const addCar = async (carData: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        const newCar: Car = {
            ...carData,
            id: `car-${user.id}-${Date.now()}`, // Include user ID in car ID for uniqueness
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedCars = [newCar, ...cars];
        saveCarsToStorage(updatedCars);
    };

    const updateCar = async (carId: string, updates: Partial<Car>) => {
        if (!user) throw new Error('User not authenticated');
        
        const updatedCars = cars.map(car =>
            car.id === carId && car.userId === user.id // Ensure user owns the car
                ? { ...car, ...updates, updatedAt: new Date() }
                : car
        );
        saveCarsToStorage(updatedCars);
    };

    const deleteCar = async (carId: string) => {
        if (!user) throw new Error('User not authenticated');
        
        // Only delete cars that belong to the current user
        const updatedCars = cars.filter(car => 
            !(car.id === carId && car.userId === user.id)
        );
        saveCarsToStorage(updatedCars);
    };

    return {
        cars,
        loading,
        addCar,
        updateCar,
        deleteCar,
    };
};
