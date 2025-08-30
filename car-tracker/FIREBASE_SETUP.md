# Firebase Setup Guide for Car Tracker

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `car-tracker` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## 3. Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose **Start in production mode** (we'll set up security rules later)
4. Select a location closest to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Enter app nickname: `car-tracker-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the `firebaseConfig` object

## 5. Update Your Application

Replace the configuration in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

## 6. Set up Firestore Security Rules

In the Firebase Console, go to **Firestore Database** → **Rules** and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own cars
    match /cars/{carId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own maintenance records
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm start`
2. Navigate to the registration page
3. Create a new account with a valid email and password
4. Verify that you can log in and out
5. Check the Firebase Console to see the new user in Authentication

## 8. Optional: Set up Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`
4. Select "Hosting" and follow the prompts
5. Build your app: `npm run build`
6. Deploy: `firebase deploy`

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Make sure you've replaced the demo configuration with your actual Firebase config

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Double-check that your API key is correct

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure Email/Password authentication is enabled in Firebase Console

4. **Firestore permission errors**
   - Verify that your security rules are set up correctly
   - Make sure the user is authenticated when making Firestore requests

### Testing Authentication:

- Try creating a new account
- Try logging in with existing credentials
- Try logging out
- Verify that user data persists across browser sessions
- Check that unauthenticated users are redirected to login

## Current Status

✅ **Authentication System**: Fully implemented with real Firebase Auth
✅ **User Registration**: Creates Firebase user and Firestore user document
✅ **Login/Logout**: Proper session management
✅ **Route Protection**: Unauthenticated users redirected to login
✅ **User Persistence**: User data stored in Firestore
✅ **Loading States**: Proper loading indicators during auth state changes

The application is now ready for production use with real authentication!
