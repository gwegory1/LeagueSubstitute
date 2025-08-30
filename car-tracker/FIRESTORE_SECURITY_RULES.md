# 🔒 Firestore Security Rules

Apply these rules to your Firestore Database to ensure proper security:

## 📋 **How to Apply:**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: "leaguesubstitute-d1bbf"
3. **Click "Firestore Database"** in the left menu
4. **Click the "Rules" tab** (next to "Data")
5. **Replace all existing rules** with the rules below
6. **Click "Publish"**

## 🛡️ **Security Rules (Copy & Paste):**

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
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own maintenance records
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Admin has full access to everything
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == "admin@admin.com";
    }
  }
}
```

## 🔐 **What These Rules Do:**

1. **User Isolation**: Each user can only see their own data
2. **Authentication Required**: Must be logged in to access any data
3. **Admin Access**: Admin account has full access to manage all data
4. **Data Ownership**: Users can only modify data they created
5. **Prevent Data Leaks**: No cross-user data contamination

## ✅ **Security Features:**

- 🛡️ **Authenticated access only**
- 🔒 **User-specific data isolation**
- 👑 **Admin override capabilities**
- 🚫 **Prevents unauthorized access**
- 📊 **Allows admin dashboard functionality**

## 🧪 **Test After Applying:**

1. **Create a new user account**
2. **Add some cars/maintenance/projects**
3. **Logout and create another account**
4. **Verify you can't see the first user's data**
5. **Login as admin@admin.com with password "admin"**
6. **Verify admin can see all users in dashboard**

---

**Once you've applied these rules, your data will be properly secured!** 🎉
