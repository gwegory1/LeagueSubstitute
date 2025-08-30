import React, { createContext, useContext, useEffect, useState } from 'react';
import {
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
        const config = auth.app.options;
        return config.apiKey !== "AIzaSyDemoKey-Replace-With-Your-Actual-Key" &&
            config.projectId !== "car-tracker-demo" &&
            config.apiKey &&
            config.projectId;
    } catch {
        return false;
    }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Debug: Check Firebase configuration on component mount
    useEffect(() => {
        const firebaseConfigured = isFirebaseConfigured();
        console.log('🔧 Firebase Configuration Status:', firebaseConfigured);
        if (firebaseConfigured) {
            console.log('🔥 Firebase Project ID:', auth.app.options.projectId);
            console.log('🔥 Firebase Auth Domain:', auth.app.options.authDomain);
        } else {
            console.error('❌ Firebase not configured! Please check your configuration.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only use Firebase - no localStorage fallback
        if (!isFirebaseConfigured()) {
            console.error('❌ Firebase not configured properly');
            setLoading(false);
            return;
        }

        // Use Firebase authentication for all users (including admin)
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('🔥 Firebase auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');

            if (firebaseUser) {
                console.log('🔥 Processing Firebase user:', firebaseUser.uid);
                // User is signed in
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

                    if (userDoc.exists()) {
                        // User document exists in Firestore
                        const userData = userDoc.data();
                        console.log('✅ User document found in Firestore');
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            displayName: userData.displayName || firebaseUser.displayName || '',
                            createdAt: userData.createdAt?.toDate() || new Date(),
                            isAdmin: userData.isAdmin || false
                        });
                    } else {
                        console.log('📝 Creating new user document in Firestore');
                        // Create user document if it doesn't exist
                        const newUser: User = {
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            displayName: firebaseUser.displayName || '',
                            createdAt: new Date(),
                            isAdmin: firebaseUser.email === 'admin@admin.com'
                        };

                        await setDoc(doc(db, 'users', firebaseUser.uid), {
                            displayName: newUser.displayName,
                            email: newUser.email,
                            createdAt: newUser.createdAt,
                            isAdmin: newUser.isAdmin
                        });

                        setUser(newUser);
                    }
                } catch (error) {
                    console.error('❌ Error fetching user data:', error);
                    // Fallback to Firebase user data
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email!,
                        displayName: firebaseUser.displayName || '',
                        createdAt: new Date(),
                        isAdmin: firebaseUser.email === 'admin@admin.com'
                    });
                }
            } else {
                console.log('👋 User signed out');
                setUser(null);
            }
            console.log('🔥 Setting loading to false');
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            if (!isFirebaseConfigured()) {
                throw new Error('Firebase not configured. Please check your configuration.');
            }

            // Use Firebase authentication for all users (including admin)
            console.log('🔥 Attempting Firebase login for:', email);
            await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Firebase login successful, waiting for auth state change');
            // Note: setLoading(false) will be called by onAuthStateChanged listener
        } catch (error: any) {
            setLoading(false);
            console.error('❌ Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, displayName: string): Promise<void> => {
        setLoading(true);
        try {
            console.log('🔧 Starting registration process for:', email);

            if (!isFirebaseConfigured()) {
                throw new Error('Firebase not configured. Please check your configuration.');
            }

            console.log('🔥 Using Firebase for registration');
            // Firebase registration for all users
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log('✅ Firebase user created:', result.user.uid);

            // Update the user's display name in Firebase Auth
            if (displayName) {
                await updateProfile(result.user, {
                    displayName: displayName
                });
                console.log('✅ Display name updated');
            }

            // Create user document in Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                displayName: displayName,
                email: email,
                createdAt: new Date(),
                isAdmin: email === 'admin@admin.com'
            });
            console.log('✅ User document created in Firestore');

            // Set user immediately and stop loading
            const newUser: User = {
                id: result.user.uid,
                email: result.user.email!,
                displayName: displayName,
                createdAt: new Date(),
                isAdmin: email === 'admin@admin.com'
            };
            setUser(newUser);
            setLoading(false);
            console.log('✅ User set and loading stopped');

            // The onAuthStateChanged listener will also trigger, but user is already set
        } catch (error: any) {
            setLoading(false);
            console.error('❌ Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (!isFirebaseConfigured()) {
                throw new Error('Firebase not configured. Please check your configuration.');
            }

            // Use Firebase signOut for all users
            console.log('🔥 Signing out from Firebase');
            await signOut(auth);
        } catch (error) {
            console.error('❌ Logout error:', error);
            // Fallback: clear user state
            setUser(null);
        }
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
