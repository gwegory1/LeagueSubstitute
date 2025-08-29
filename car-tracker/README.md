# Car Tracker

A comprehensive React TypeScript application for tracking and managing your vehicles, maintenance records, and upcoming projects.

## Features

### 🚗 Car Management
- Add, edit, and delete vehicle records
- Track vehicle details (make, model, year, VIN, mileage, etc.)
- View all your vehicles in a responsive grid layout

### 🔧 Maintenance Tracking
- Record maintenance activities with detailed information
- Track service costs, dates, and mileage
- Set up future maintenance reminders
- Mark maintenance tasks as completed or pending
- Filter by maintenance type (oil change, brake service, etc.)

### 📋 Project Management
- Plan upcoming repairs and modifications
- Track project progress with visual indicators
- Manage project priorities and status
- Monitor estimated vs actual costs
- Set target dates and completion tracking

### 🔐 Authentication
- Secure user registration and login
- Firebase Authentication integration
- User-specific data isolation
- Persistent login sessions

### 🎨 Modern UI/UX
- Material-UI design system
- Responsive design for mobile and desktop
- Dark/light theme support
- Intuitive navigation and user interface
- Real-time data synchronization

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Backend**: Firebase (Firestore Database, Authentication)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Create React App

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore Database in production mode
   - Get your Firebase configuration object

4. **Configure Firebase**
   - Open `src/services/firebase.ts`
   - Replace the placeholder configuration with your Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Set up Firestore Rules**
   Configure your Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Cars collection - users can only access their own cars
       match /cars/{carId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
       
       // Maintenance collection - users can only access their own records
       match /maintenance/{maintenanceId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
       
       // Projects collection - users can only access their own projects
       match /projects/{projectId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
⚠️ **Warning**: This is a one-way operation. Once you eject, you can't go back!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx   # Main navigation component
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   └── useCars.ts      # Car data management hook
├── pages/              # Main application pages
│   ├── Cars.tsx        # Car management page
│   ├── Login.tsx       # User login page
│   ├── Maintenance.tsx # Maintenance tracking page
│   ├── Projects.tsx    # Project management page
│   └── Register.tsx    # User registration page
├── services/           # External service integrations
│   └── firebase.ts     # Firebase configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # Application type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── theme.ts            # Material-UI theme configuration
```

## Usage

### Getting Started
1. **Register an Account**: Create a new account or log in with existing credentials
2. **Add Your First Car**: Navigate to the Cars page and add your vehicle information
3. **Track Maintenance**: Record completed maintenance and set up future reminders
4. **Plan Projects**: Create projects for upcoming repairs or modifications

### Car Management
- Click "Add Car" to register a new vehicle
- Fill in the vehicle details (make, model, year, license plate, etc.)
- Edit or delete cars using the menu in each car card

### Maintenance Tracking
- Add maintenance records with service details, costs, and dates
- Set next due dates and mileage for recurring maintenance
- Mark tasks as completed or pending
- View maintenance history for each vehicle

### Project Planning
- Create projects for future work on your vehicles
- Set priorities, target dates, and cost estimates
- Track project progress from planned to completion
- Update actual costs and completion dates

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Security Considerations

- All user data is isolated using Firebase security rules
- Authentication is required for all protected routes
- Sensitive operations require user verification
- Data is encrypted in transit and at rest

## Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The build folder can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Car Tracking!** 🚗✨
