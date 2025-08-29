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

        // Load mock data or from localStorage if available
        const savedCars = localStorage.getItem('mockCars');
        if (savedCars) {
            try {
                const parsedCars = JSON.parse(savedCars).map((car: any) => ({
                    ...car,
                    createdAt: new Date(car.createdAt),
                    updatedAt: new Date(car.updatedAt),
                }));
                setCars(parsedCars);
            } catch (error) {
                setCars([]);
            }
        }
        setLoading(false);
    }, [user]);

    const saveCarsToStorage = (updatedCars: Car[]) => {
        localStorage.setItem('mockCars', JSON.stringify(updatedCars));
        setCars(updatedCars);
    };

    const addCar = async (carData: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        const newCar: Car = {
            ...carData,
            id: `car-${Date.now()}`,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedCars = [newCar, ...cars];
        saveCarsToStorage(updatedCars);
    };

    const updateCar = async (carId: string, updates: Partial<Car>) => {
        const updatedCars = cars.map(car =>
            car.id === carId
                ? { ...car, ...updates, updatedAt: new Date() }
                : car
        );
        saveCarsToStorage(updatedCars);
    };

    const deleteCar = async (carId: string) => {
        const updatedCars = cars.filter(car => car.id !== carId);
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
