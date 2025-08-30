import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCGr2UWg6mopAvvOZ4inYCb0pdWNL8c90A",
    authDomain: "leaguesubstitute-d1bbf.firebaseapp.com",
    projectId: "leaguesubstitute-d1bbf",
    storageBucket: "leaguesubstitute-d1bbf.firebasestorage.app",
    messagingSenderId: "1003391527558",
    appId: "1:1003391527558:web:a2497e4fe420fe0703bf07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
