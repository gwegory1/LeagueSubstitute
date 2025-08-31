# Events Feature - Firestore Security Rules

## Security Rules for Events Collection

Add these rules to your Firestore security rules to protect the events data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     resource.data.email == 'admin@admin.com';
      allow write, delete: if request.auth != null && 
                           request.auth.token.email == 'admin@admin.com';
    }

    // Cars collection - user-specific
    match /cars/{carId} {
      allow read, write, delete: if request.auth != null && 
                                    request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if request.auth != null && 
                                    request.auth.token.email == 'admin@admin.com';
    }

    // Maintenance collection - user-specific
    match /maintenance/{maintenanceId} {
      allow read, write, delete: if request.auth != null && 
                                    request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if request.auth != null && 
                                    request.auth.token.email == 'admin@admin.com';
    }

    // Projects collection - user-specific
    match /projects/{projectId} {
      allow read, write, delete: if request.auth != null && 
                                    request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow read, write, delete: if request.auth != null && 
                                    request.auth.token.email == 'admin@admin.com';
    }

    // Events collection - shared between users
    match /events/{eventId} {
      // Anyone authenticated can read public events
      allow read: if request.auth != null && 
                     resource.data.isPublic == true;
      
      // Event organizers can read/write/delete their events
      allow read, write, delete: if request.auth != null && 
                                    request.auth.uid == resource.data.organizer.id;
      
      // Anyone authenticated can create public events
      allow create: if request.auth != null && 
                       request.resource.data.isPublic == true &&
                       request.auth.uid == request.resource.data.organizer.id;
      
      // Users can update events to join/leave (participants field only)
      allow update: if request.auth != null && 
                       resource.data.isPublic == true &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['participants', 'currentParticipants', 'updatedAt']);
      
      // Admins can do anything with events
      allow read, write, delete: if request.auth != null && 
                                    request.auth.token.email == 'admin@admin.com';
    }
  }
}
```

## Database Indexes

You may need to create these indexes in Firestore:

### Events Collection
- Collection ID: `events`
- Fields indexed: `isPublic` (Ascending), `date` (Ascending)
- Query scope: Collection

- Collection ID: `events`  
- Fields indexed: `organizer.id` (Ascending), `createdAt` (Descending)
- Query scope: Collection

### Security Features

1. **Public Events**: Only public events are visible to all users
2. **Event Management**: Only event organizers can edit/delete their events
3. **Participation**: Users can join/leave public events by updating participants array
4. **Admin Access**: Admin users can manage all events
5. **Authentication Required**: All operations require user authentication

### Event Privacy

- `isPublic: true` - Event is visible to all authenticated users
- `isPublic: false` - Event is only visible to the organizer (private event)

### Joining Events

Users can join events by updating:
- `participants` array (add/remove their user ID)
- `currentParticipants` count
- `updatedAt` timestamp

Only these fields can be updated by non-organizers.
