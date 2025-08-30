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

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    try {
        return auth.app.options.apiKey !== "AIzaSyDemoKey-Replace-With-Your-Actual-Key";
    } catch {
        return false;
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            console.warn('Firebase not configured, using localStorage fallback');
            // Use localStorage fallback for development
            const savedUser = localStorage.getItem('mockUser');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    setUser({
                        ...userData,
                        createdAt: new Date(userData.createdAt)
                    });
                } catch (error) {
                    console.error('Error parsing saved user:', error);
                }
            }
            setLoading(false);
            return;
        }

        // Use real Firebase authentication
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

                    if (userDoc.exists()) {
                        // User document exists in Firestore
                        const userData = userDoc.data();
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            displayName: userData.displayName || firebaseUser.displayName || '',
                            createdAt: userData.createdAt?.toDate() || new Date(),
                        });
                    } else {
                        // Create user document if it doesn't exist
                        const newUser: User = {
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            displayName: firebaseUser.displayName || '',
                            createdAt: new Date(),
                        };

                        await setDoc(doc(db, 'users', firebaseUser.uid), {
                            displayName: newUser.displayName,
                            email: newUser.email,
                            createdAt: newUser.createdAt,
                        });

                        setUser(newUser);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Fallback to Firebase user data
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email!,
                        displayName: firebaseUser.displayName || '',
                        createdAt: new Date(),
                    });
                }
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            if (!isFirebaseConfigured()) {
                // localStorage fallback
                const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);

                if (foundUser) {
                    const userData = {
                        id: foundUser.id,
                        email: foundUser.email,
                        displayName: foundUser.displayName,
                        createdAt: new Date(foundUser.createdAt)
                    };
                    setUser(userData);
                    localStorage.setItem('mockUser', JSON.stringify(userData));
                } else {
                    throw new Error('Invalid email or password');
                }
                setLoading(false);
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle setting the user
        } catch (error: any) {
            setLoading(false);
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, displayName: string): Promise<void> => {
        setLoading(true);
        try {
            if (!isFirebaseConfigured()) {
                // localStorage fallback
                const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');

                // Check if user already exists
                if (savedUsers.find((u: any) => u.email === email)) {
                    throw new Error('User already exists with this email');
                }

                const newUser = {
                    id: `user-${Date.now()}`,
                    email,
                    password,
                    displayName,
                    createdAt: new Date().toISOString()
                };

                savedUsers.push(newUser);
                localStorage.setItem('mockUsers', JSON.stringify(savedUsers));

                const userData = {
                    id: newUser.id,
                    email: newUser.email,
                    displayName: newUser.displayName,
                    createdAt: new Date(newUser.createdAt)
                };
                setUser(userData);
                localStorage.setItem('mockUser', JSON.stringify(userData));
                setLoading(false);
                return;
            }

            // Create user account
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update the user's display name in Firebase Auth
            if (displayName) {
                await updateProfile(result.user, {
                    displayName: displayName
                });
            }

            // Create user document in Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                displayName: displayName,
                email: email,
                createdAt: new Date(),
            });

            // The onAuthStateChanged listener will handle setting the user
        } catch (error: any) {
            setLoading(false);
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        if (!isFirebaseConfigured()) {
            // localStorage fallback
            setUser(null);
            localStorage.removeItem('mockUser');
            return;
        }
        return await signOut(auth);
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
