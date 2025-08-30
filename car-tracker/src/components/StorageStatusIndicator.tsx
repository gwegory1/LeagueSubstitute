import React from 'react';
import { Chip, Box } from '@mui/material';
import { Cloud as CloudIcon, Error as ErrorIcon } from '@mui/icons-material';
import { auth } from '../services/firebase';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    try {
        const config = auth.app.options;
        return config.apiKey !== "AIzaSyDemoKey-Replace-With-Your-Actual-Key" &&
            config.projectId !== "car-tracker-demo" &&
            config.apiKey &&
            config.projectId;
    } catch {
        return false;
    }
};

const StorageStatusIndicator: React.FC = () => {
    const isCloudStorage = isFirebaseConfigured();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip
                icon={isCloudStorage ? <CloudIcon /> : <ErrorIcon />}
                label={isCloudStorage ? "🔥 Firebase Cloud Storage" : "❌ Firebase Not Configured"}
                color={isCloudStorage ? "success" : "error"}
                variant="outlined"
                sx={{
                    backgroundColor: isCloudStorage
                        ? 'rgba(0, 255, 136, 0.1)'
                        : 'rgba(255, 82, 82, 0.1)',
                    borderColor: isCloudStorage ? '#00ff88' : '#ff5252',
                    color: isCloudStorage ? '#00ff88' : '#ff5252',
                    fontWeight: 'bold',
                }}
            />
        </Box>
    );
};

export default StorageStatusIndicator;
