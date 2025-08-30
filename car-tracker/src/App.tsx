import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './theme';
import Navigation from './components/Navigation';
import { DataMigrationDialog, useMigrationCheck } from './components/DataMigration';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import Maintenance from './pages/Maintenance';
import Projects from './pages/Projects';

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
  const { needsMigration, setNeedsMigration } = useMigrationCheck();

  if (loading) {
    return <LoadingScreen />;
  }

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
      </Routes>
      
      {/* Data Migration Dialog */}
      <DataMigrationDialog 
        open={needsMigration} 
        onClose={() => setNeedsMigration(false)} 
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
