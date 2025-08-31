// Firebase Firestore Security Rules - Complete Setup
// Copy this to Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {

        // Helper function to check if user is admin
        function isAdmin() {
            return request.auth != null && request.auth.token.email == 'admin@admin.com';
        }

        // Helper function to check if user is authenticated
        function isAuthenticated() {
            return request.auth != null;
        }

        // Helper function to check if user owns the resource
        function isOwner(resource) {
            return request.auth != null && request.auth.uid == resource.data.userId;
        }

        // Helper function to check if user is event organizer
        function isEventOrganizer(resource) {
            return request.auth != null && request.auth.uid == resource.data.organizer.id;
        }

        // Users collection
        match / users / { userId } {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      allow read, write, delete: if isAdmin();
        }

        // Cars collection - user-specific
        match / cars / { carId } {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
        }

        // Maintenance collection - user-specific  
        match / maintenance / { maintenanceId } {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
        }

        // Projects collection - user-specific
        match / projects / { projectId } {
      allow read, write, delete: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if isAdmin();
        }

        // Events collection - shared between users
        match / events / { eventId } {
      // Anyone authenticated can read public events
      allow read: if isAuthenticated() && resource.data.isPublic == true;

      // Event organizers can read/write/delete their events (public or private)
      allow read, write, delete: if isAuthenticated() && isEventOrganizer(resource);

      // Anyone authenticated can create events if they set themselves as organizer
      allow create: if isAuthenticated() &&
                request.resource.data.organizer.id == request.auth.uid &&
                request.resource.data.keys().hasAll([
                    'title', 'description', 'location', 'date', 'time',
                    'organizer', 'participants', 'currentParticipants',
                    'category', 'isPublic', 'tags', 'createdAt', 'updatedAt'
                ]);

      // Users can join/leave events (update participants only)
      allow update: if isAuthenticated() &&
                resource.data.isPublic == true &&
                request.resource.data.diff(resource.data).affectedKeys()
                    .hasOnly(['participants', 'currentParticipants', 'updatedAt']);

      // Admins can do anything with events
      allow read, write, delete: if isAdmin();
        }
    }
}
