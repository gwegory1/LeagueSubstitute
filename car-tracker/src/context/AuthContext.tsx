import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false); // Set to false for immediate load

    useEffect(() => {
        // Create a mock user automatically (bypassing Firebase authentication)
        const mockUser: User = {
            id: 'mock-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            createdAt: new Date(),
        };

        setUser(mockUser);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        // Mock login - just set the user
        const mockUser: User = {
            id: 'mock-user-123',
            email: email,
            displayName: 'Test User',
            createdAt: new Date(),
        };
        setUser(mockUser);
        setLoading(false);
    };

    const register = async (email: string, password: string, displayName: string) => {
        setLoading(true);
        // Mock register - just set the user
        const mockUser: User = {
            id: 'mock-user-123',
            email: email,
            displayName: displayName,
            createdAt: new Date(),
        };
        setUser(mockUser);
        setLoading(false);
    };

    const logout = async () => {
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
