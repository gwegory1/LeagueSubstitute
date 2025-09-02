# 🔒 UPDATED Firestore Security Rules - Admin Support

## The Problem
The current rules are preventing admin users from accessing all users' data because Firestore security rules can't easily check if a user is admin from their user document.

## The Solution
Updated security rules that properly handle admin access for admin@admin.com email.

## 📋 **Instructions:**

1. **Go to Firebase Console**
2. **Navigate to Firestore Database**
3. **Click the "Rules" tab**
4. **Replace ALL existing rules** with the rules below
5. **Click "Publish"**

### 🛡️ **Updated Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for better security
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'admin@admin.com';
    }
    
    function isOwner(resource) {
      return request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    function isEventOrganizer(resource) {
      return request.auth != null && request.auth.uid == resource.data.organizer.id;
    }

    // Users collection - ADMIN CAN READ ALL USERS
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      allow read, write, delete: if isAdmin();
      // SPECIAL: Allow admin to read ALL users
      allow list: if isAdmin();
    }
    
    // Cars collection - ADMIN CAN READ ALL CARS
    match /cars/{carId} {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
      // SPECIAL: Allow admin to read ALL cars
      allow list: if isAdmin();
    }
    
    // Maintenance collection - ADMIN CAN READ ALL MAINTENANCE
    match /maintenance/{maintenanceId} {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
      // SPECIAL: Allow admin to read ALL maintenance
      allow list: if isAdmin();
    }
    
    // Projects collection - ADMIN CAN READ ALL PROJECTS
    match /projects/{projectId} {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
      // SPECIAL: Allow admin to read ALL projects
      allow list: if isAdmin();
    }
    
    // Events collection
    match /events/{eventId} {
      // Anyone authenticated can read PUBLIC events
      allow read: if isAuthenticated() && resource.data.isPublic == true;
      
      // Event organizers can read/write/delete their events (public or private)
      allow read, write, delete: if isAuthenticated() && isEventOrganizer(resource);
      
      // Anyone authenticated can create events (must set themselves as organizer)
      allow create: if isAuthenticated() && 
                      request.resource.data.organizer.id == request.auth.uid &&
                      request.resource.data.keys().hasAll([
                        'title', 'description', 'location', 'date', 'time',
                        'organizer', 'participants', 'currentParticipants',
                        'category', 'isPublic', 'tags', 'createdAt', 'updatedAt'
                      ]);
      
      // Users can join/leave PUBLIC events (update participants only)
      allow update: if isAuthenticated() && 
                      resource.data.isPublic == true &&
                      request.resource.data.diff(resource.data).affectedKeys()
                        .hasOnly(['participants', 'currentParticipants', 'updatedAt']);
      
      // Admins can do anything with events
      allow read, write, delete: if isAdmin();
      // SPECIAL: Allow admin to read ALL events
      allow list: if isAdmin();
    }
  }
}
```

## 🔑 **Key Changes for Admin Support:**

1. **Added `allow list` permissions** - This allows admin to fetch ALL documents from collections
2. **Kept existing admin permissions** - Admin can still read/write/delete individual documents
3. **Maintained security** - Regular users still can only access their own data

## ✅ **What This Fixes:**

- ❌ **Before**: `useUsers` hook failed with "Missing or insufficient permissions"
- ✅ **After**: Admin can fetch all users for the dashboard
- ✅ **Admin Dashboard**: Will show correct user counts and user list
- ✅ **Security**: Regular users still isolated to their own data

## 🧪 **After Applying These Rules:**

1. **Log in as admin@admin.com**
2. **Go to Admin Dashboard**
3. **Should see**: 
   - Correct total user count
   - List of all users
   - All data working properly

**Apply these rules to fix the admin dashboard immediately!** 🚀
