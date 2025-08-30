import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Car, MaintenanceRecord, Project, User } from '../types';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
    if (timestamp && timestamp.toDate) {
        return timestamp.toDate();
    }
    return new Date(timestamp);
};

// User operations
export const firestoreUsers = {
    // Get all users (admin only)
    async getAll(): Promise<User[]> {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestamp(doc.data().createdAt)
        })) as User[];
    },

    // Delete user and all their data
    async deleteUser(userId: string): Promise<void> {
        const batch = writeBatch(db);

        // Delete user document
        const userRef = doc(db, 'users', userId);
        batch.delete(userRef);

        // Delete user's cars
        const carsRef = collection(db, 'cars');
        const carsQuery = query(carsRef, where('userId', '==', userId));
        const carsSnapshot = await getDocs(carsQuery);
        carsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete user's maintenance records
        const maintenanceRef = collection(db, 'maintenance');
        const maintenanceQuery = query(maintenanceRef, where('userId', '==', userId));
        const maintenanceSnapshot = await getDocs(maintenanceQuery);
        maintenanceSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete user's projects
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(projectsRef, where('userId', '==', userId));
        const projectsSnapshot = await getDocs(projectsQuery);
        projectsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
    }
};

// Car operations
export const firestoreCars = {
    // Get user's cars
    async getUserCars(userId: string): Promise<Car[]> {
        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt)
        })) as Car[];
    },

    // Add new car
    async addCar(userId: string, carData: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const carsRef = collection(db, 'cars');
        const now = Timestamp.now();

        const newCar = {
            ...carData,
            userId,
            createdAt: now,
            updatedAt: now
        };

        const docRef = await addDoc(carsRef, newCar);
        return docRef.id;
    },

    // Update car
    async updateCar(carId: string, updates: Partial<Car>): Promise<void> {
        const carRef = doc(db, 'cars', carId);
        await updateDoc(carRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });
    },

    // Delete car
    async deleteCar(carId: string): Promise<void> {
        const carRef = doc(db, 'cars', carId);
        await deleteDoc(carRef);
    },

    // Get total cars count
    async getTotalCars(): Promise<number> {
        const carsRef = collection(db, 'cars');
        const snapshot = await getDocs(carsRef);
        return snapshot.size;
    },

    // Get car count for specific user
    async getUserCarCount(userId: string): Promise<number> {
        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }
};

// Maintenance operations
export const firestoreMaintenance = {
    // Get user's maintenance records
    async getUserMaintenance(userId: string): Promise<MaintenanceRecord[]> {
        const maintenanceRef = collection(db, 'maintenance');
        const q = query(maintenanceRef, where('userId', '==', userId), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: convertTimestamp(doc.data().date),
            nextDueDate: doc.data().nextDueDate ? convertTimestamp(doc.data().nextDueDate) : undefined,
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt)
        })) as MaintenanceRecord[];
    },

    // Add maintenance record
    async addMaintenance(userId: string, maintenanceData: Omit<MaintenanceRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const maintenanceRef = collection(db, 'maintenance');
        const now = Timestamp.now();

        const newMaintenance: any = {
            ...maintenanceData,
            userId,
            date: Timestamp.fromDate(maintenanceData.date),
            nextDueDate: maintenanceData.nextDueDate ? Timestamp.fromDate(maintenanceData.nextDueDate) : null,
            createdAt: now,
            updatedAt: now
        };

        // Remove undefined values to prevent Firestore errors
        if (newMaintenance.nextDueMileage === undefined) {
            delete newMaintenance.nextDueMileage;
        }

        const docRef = await addDoc(maintenanceRef, newMaintenance);
        return docRef.id;
    },

    // Update maintenance record
    async updateMaintenance(maintenanceId: string, updates: Partial<MaintenanceRecord>): Promise<void> {
        const maintenanceRef = doc(db, 'maintenance', maintenanceId);
        const updateData: any = {
            ...updates,
            updatedAt: Timestamp.now()
        };

        // Convert dates to Firestore timestamps
        if (updates.date) {
            updateData.date = Timestamp.fromDate(updates.date);
        }
        if (updates.nextDueDate) {
            updateData.nextDueDate = Timestamp.fromDate(updates.nextDueDate);
        }

        // Remove undefined values to prevent Firestore errors
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await updateDoc(maintenanceRef, updateData);
    },

    // Delete maintenance record
    async deleteMaintenance(maintenanceId: string): Promise<void> {
        const maintenanceRef = doc(db, 'maintenance', maintenanceId);
        await deleteDoc(maintenanceRef);
    },

    // Get total maintenance records count
    async getTotalMaintenance(): Promise<number> {
        const maintenanceRef = collection(db, 'maintenance');
        const snapshot = await getDocs(maintenanceRef);
        return snapshot.size;
    },

    // Get maintenance count for specific user
    async getUserMaintenanceCount(userId: string): Promise<number> {
        const maintenanceRef = collection(db, 'maintenance');
        const q = query(maintenanceRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }
};

// Project operations
export const firestoreProjects = {
    // Get user's projects
    async getUserProjects(userId: string): Promise<Project[]> {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startDate: doc.data().startDate ? convertTimestamp(doc.data().startDate) : undefined,
            targetDate: doc.data().targetDate ? convertTimestamp(doc.data().targetDate) : undefined,
            completedDate: doc.data().completedDate ? convertTimestamp(doc.data().completedDate) : undefined,
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt)
        })) as Project[];
    },

    // Add project
    async addProject(userId: string, projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const projectsRef = collection(db, 'projects');
        const now = Timestamp.now();

        const newProject: any = {
            ...projectData,
            userId,
            startDate: projectData.startDate ? Timestamp.fromDate(projectData.startDate) : null,
            targetDate: projectData.targetDate ? Timestamp.fromDate(projectData.targetDate) : null,
            completedDate: projectData.completedDate ? Timestamp.fromDate(projectData.completedDate) : null,
            createdAt: now,
            updatedAt: now
        };

        // Remove undefined values to prevent Firestore errors
        Object.keys(newProject).forEach(key => {
            if (newProject[key] === undefined) {
                delete newProject[key];
            }
        });

        const docRef = await addDoc(projectsRef, newProject);
        return docRef.id;
    },

    // Update project
    async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
        const projectRef = doc(db, 'projects', projectId);
        const updateData: any = {
            ...updates,
            updatedAt: Timestamp.now()
        };

        // Convert dates to Firestore timestamps
        if (updates.startDate) {
            updateData.startDate = Timestamp.fromDate(updates.startDate);
        }
        if (updates.targetDate) {
            updateData.targetDate = Timestamp.fromDate(updates.targetDate);
        }
        if (updates.completedDate) {
            updateData.completedDate = Timestamp.fromDate(updates.completedDate);
        }

        // Remove undefined values to prevent Firestore errors
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await updateDoc(projectRef, updateData);
    },

    // Delete project
    async deleteProject(projectId: string): Promise<void> {
        const projectRef = doc(db, 'projects', projectId);
        await deleteDoc(projectRef);
    },

    // Get total projects count
    async getTotalProjects(): Promise<number> {
        const projectsRef = collection(db, 'projects');
        const snapshot = await getDocs(projectsRef);
        return snapshot.size;
    },

    // Get project count for specific user
    async getUserProjectCount(userId: string): Promise<number> {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.size;
    }
};

// Real-time listeners
export const firestoreListeners = {
    // Listen to user's cars in real-time
    subscribeToUserCars(userId: string, callback: (cars: Car[]) => void) {
        const carsRef = collection(db, 'cars');
        // Simplified query without orderBy to avoid index requirement
        const q = query(carsRef, where('userId', '==', userId));

        return onSnapshot(q, (snapshot) => {
            const cars = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertTimestamp(doc.data().createdAt),
                updatedAt: convertTimestamp(doc.data().updatedAt)
            })) as Car[];

            // Sort in memory instead of in query
            cars.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            callback(cars);
        });
    },

    // Listen to user's maintenance records in real-time
    subscribeToUserMaintenance(userId: string, callback: (maintenance: MaintenanceRecord[]) => void) {
        const maintenanceRef = collection(db, 'maintenance');
        // Simplified query without orderBy to avoid index requirement
        const q = query(maintenanceRef, where('userId', '==', userId));

        return onSnapshot(q, (snapshot) => {
            const maintenance = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: convertTimestamp(doc.data().date),
                nextDueDate: doc.data().nextDueDate ? convertTimestamp(doc.data().nextDueDate) : undefined,
                createdAt: convertTimestamp(doc.data().createdAt),
                updatedAt: convertTimestamp(doc.data().updatedAt)
            })) as MaintenanceRecord[];

            // Sort in memory instead of in query
            maintenance.sort((a, b) => b.date.getTime() - a.date.getTime());
            callback(maintenance);
        });
    },

    // Listen to user's projects in real-time
    subscribeToUserProjects(userId: string, callback: (projects: Project[]) => void) {
        const projectsRef = collection(db, 'projects');
        // Simplified query without orderBy to avoid index requirement
        const q = query(projectsRef, where('userId', '==', userId));

        return onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate ? convertTimestamp(doc.data().startDate) : undefined,
                targetDate: doc.data().targetDate ? convertTimestamp(doc.data().targetDate) : undefined,
                completedDate: doc.data().completedDate ? convertTimestamp(doc.data().completedDate) : undefined,
                createdAt: convertTimestamp(doc.data().createdAt),
                updatedAt: convertTimestamp(doc.data().updatedAt)
            })) as Project[];

            // Sort in memory instead of in query
            projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            callback(projects);
        });
    }
};
