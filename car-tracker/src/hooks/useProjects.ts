import { useState, useEffect } from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { firestoreProjects, firestoreListeners } from '../services/firestore';
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

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setProjects([]);
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
        console.log('🔥 Using Firebase Firestore for projects data');

        // Set up real-time listener for user's projects
        const unsubscribe = firestoreListeners.subscribeToUserProjects(
            user.id,
            (firestoreProjects) => {
                setProjects(firestoreProjects);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user]);

    const addProject = async (projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            const projectId = await firestoreProjects.addProject(user.id, projectData);
            console.log('✅ Project added to Firestore:', projectId);
        } catch (error) {
            console.error('❌ Error adding project to Firestore:', error);
            throw error;
        }
    };

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreProjects.updateProject(projectId, updates);
            console.log('✅ Project updated in Firestore:', projectId);
        } catch (error) {
            console.error('❌ Error updating project in Firestore:', error);
            throw error;
        }
    };

    const deleteProject = async (projectId: string) => {
        if (!user) throw new Error('User not authenticated');

        if (!isFirebaseConfigured()) {
            throw new Error('Firebase not configured properly');
        }

        // Use Firestore for all data
        try {
            await firestoreProjects.deleteProject(projectId);
            console.log('✅ Project deleted from Firestore:', projectId);
        } catch (error) {
            console.error('❌ Error deleting project from Firestore:', error);
            throw error;
        }
    };

    return {
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
    };
};
