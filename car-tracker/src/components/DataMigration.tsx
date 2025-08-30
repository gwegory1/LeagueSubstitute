import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface DataMigrationProps {
    open: boolean;
    onClose: () => void;
}

export const DataMigrationDialog: React.FC<DataMigrationProps> = ({ open, onClose }) => {
    const { user } = useAuth();
    const [migrated, setMigrated] = useState(false);
    const [error, setError] = useState('');

    const migrateData = () => {
        if (!user) return;

        try {
            // Migrate Cars data
            const oldCars = localStorage.getItem('mockCars');
            if (oldCars) {
                const parsedCars = JSON.parse(oldCars);
                const userCars = parsedCars.filter((car: any) => car.userId === user.id);
                localStorage.setItem(`mockCars_${user.id}`, JSON.stringify(userCars));
                localStorage.removeItem('mockCars');
            }

            // Migrate Maintenance data
            const oldMaintenance = localStorage.getItem('mockMaintenance');
            if (oldMaintenance) {
                const parsedMaintenance = JSON.parse(oldMaintenance);
                const userMaintenance = parsedMaintenance.filter((record: any) => record.userId === user.id);
                localStorage.setItem(`mockMaintenance_${user.id}`, JSON.stringify(userMaintenance));
                localStorage.removeItem('mockMaintenance');
            }

            // Migrate Projects data
            const oldProjects = localStorage.getItem('projects');
            if (oldProjects) {
                const parsedProjects = JSON.parse(oldProjects);
                const userProjects = parsedProjects.filter((project: any) => project.userId === user.id);
                localStorage.setItem(`mockProjects_${user.id}`, JSON.stringify(userProjects));
                localStorage.removeItem('projects');
            }

            setMigrated(true);
            
            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to migrate data');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Data Migration Required</DialogTitle>
            <DialogContent>
                {!migrated ? (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            We've detected that you have data from the old storage system where all users shared the same data.
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            To ensure proper user isolation, we need to migrate your data to user-specific storage.
                        </Typography>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            This will move only your data (associated with your user ID) to your personal storage and remove the shared data.
                        </Alert>
                    </Box>
                ) : (
                    <Box>
                        <Alert severity="success">
                            Data migration completed successfully! The page will reload automatically to apply the changes.
                        </Alert>
                    </Box>
                )}
                
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                {!migrated ? (
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button variant="contained" onClick={migrateData}>
                            Migrate My Data
                        </Button>
                    </>
                ) : (
                    <Button onClick={onClose} variant="contained">
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

// Hook to check if migration is needed
export const useMigrationCheck = () => {
    const { user } = useAuth();
    const [needsMigration, setNeedsMigration] = useState(false);

    React.useEffect(() => {
        if (!user) return;

        // Check if old shared data exists
        const hasOldCars = localStorage.getItem('mockCars');
        const hasOldMaintenance = localStorage.getItem('mockMaintenance');
        const hasOldProjects = localStorage.getItem('projects');

        if (hasOldCars || hasOldMaintenance || hasOldProjects) {
            setNeedsMigration(true);
        }
    }, [user]);

    return { needsMigration, setNeedsMigration };
};
