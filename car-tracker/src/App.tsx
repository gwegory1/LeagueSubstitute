import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './theme';
import Navigation from './components/Navigation';
import AdminNavigation from './components/AdminNavigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import Maintenance from './pages/Maintenance';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 2,
    }}
  >
    <CircularProgress size={60} />
    <Typography variant="h6" color="text.secondary">
      Loading Car Tracker...
    </Typography>
  </Box>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Admin routing
  if (user?.isAdmin) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Navigate to="/admin" />}
        />
        <Route
          path="/register"
          element={<Navigate to="/admin" />}
        />
        <Route
          path="/admin"
          element={
            <>
              <AdminNavigation />
              <AdminDashboard />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <AdminNavigation />
              <Profile />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <AdminNavigation />
              <Events />
            </>
          }
        />
        <Route
          path="/*"
          element={<Navigate to="/admin" />}
        />
        <Route
          path="/overview"
          element={
            <>
              <AdminNavigation />
              <ClientDashboard />
            </>
          }
        />
      </Routes>
    );
  }

  // Regular user routing
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigation />
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <Navigation />
              <Cars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Navigation />
              <Maintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Navigation />
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigation />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Navigation />
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={<Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
