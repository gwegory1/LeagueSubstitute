# Firebase Storage Security Rules Setup

## Current Issue
You're getting a CORS error when trying to upload profile pictures to Firebase Storage. This is because Firebase Storage security rules need to be configured to allow authenticated users to upload profile pictures.

## Firebase Storage Rules Configuration

1. **Go to the Firebase Console**:
   - Visit https://console.firebase.google.com/
   - Select your project: `leaguesubstitute-d1bbf`

2. **Navigate to Storage**:
   - Click on "Storage" in the left sidebar
   - Click on the "Rules" tab

3. **Update Storage Rules**:
   Replace the current rules with the following:

```javascript
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Profile pictures: Users can upload/update their own profile pictures
    match /profile-pictures/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can manage all profile pictures
    match /profile-pictures/{userId}/{fileName} {
      allow read, write, delete: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## What these rules do:

1. **Public Read Access**: Anyone can read/view uploaded images (for profile pictures to be visible)

2. **User Profile Pictures**: 
   - Users can only upload/update/delete their own profile pictures
   - Path: `profile-pictures/{userId}/{fileName}`
   - Users must be authenticated
   - UserId in path must match the authenticated user's ID

3. **Admin Access**: 
   - Admins can manage all profile pictures
   - Checks if the user has `isAdmin: true` in their Firestore user document

## Steps to Apply:

1. Copy the rules above
2. Go to Firebase Console → Storage → Rules
3. Paste the rules and click "Publish"
4. Wait a few minutes for the rules to propagate

## Alternative Simplified Rules (if the above doesn't work):

If you're still having issues, you can temporarily use these more permissive rules for testing:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning**: The simplified rules allow any authenticated user to upload anywhere. Use only for testing, then switch back to the secure rules above.

## Testing After Rule Update:

1. Wait 2-3 minutes after publishing the rules
2. Try uploading a profile picture again
3. Check the browser console for any remaining errors

## CORS Configuration:

If you're still getting CORS errors after updating the rules, you may need to configure CORS for your storage bucket. This is usually not necessary for standard Firebase projects, but if needed:

1. Install Google Cloud SDK
2. Run: `gsutil cors set cors.json gs://leaguesubstitute-d1bbf.firebasestorage.app`

Where `cors.json` contains:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Troubleshooting:

1. **Make sure you're authenticated**: The user must be logged in
2. **Check user ID**: Verify the userId in the storage path matches the authenticated user
3. **Clear browser cache**: Sometimes cached CORS responses cause issues
4. **Check Firebase Console**: Look for any error messages in the Firebase console

After updating the Storage rules, your profile picture upload should work correctly!
