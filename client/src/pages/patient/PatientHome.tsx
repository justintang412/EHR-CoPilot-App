import { Paper, Typography } from '@mui/material';

export const PatientHome = () => {
  return (
    <Paper elevation={0} sx={{ p: 4 }} square>
      <Typography variant="h4" gutterBottom>
        Welcome to the Patient Home
      </Typography>
      
    </Paper>
  );
};
