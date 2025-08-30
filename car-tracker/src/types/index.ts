export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    mileage: number;
    color: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MaintenanceRecord {
    id: string;
    carId: string;
    type: MaintenanceType;
    description: string;
    date: Date;
    mileage: number;
    cost: number;
    serviceProvider?: string;
    notes?: string;
    nextDueDate?: Date;
    nextDueMileage?: number;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    carId: string;
    title: string;
    description: string;
    priority: Priority;
    status: ProjectStatus;
    estimatedCost: number;
    actualCost?: number;
    startDate?: Date;
    targetDate?: Date;
    completedDate?: Date;
    notes?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: Date;
    isAdmin?: boolean;
}

export type MaintenanceType =
    | 'oil_change'
    | 'tire_rotation'
    | 'brake_service'
    | 'battery_replacement'
    | 'air_filter'
    | 'fuel_filter'
    | 'transmission_service'
    | 'coolant_flush'
    | 'spark_plugs'
    | 'inspection'
    | 'other';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
}
