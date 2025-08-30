import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - You'll need to replace these with your actual Firebase project values
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey-Replace-With-Your-Actual-Key",
    authDomain: "car-tracker-demo.firebaseapp.com",
    projectId: "car-tracker-demo",
    storageBucket: "car-tracker-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
