import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';

export const MainErrorFallback = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f0f6ff"
    >
      <Typography variant="h5" color="primary" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Please re-login to continue.
      </Typography>
      <MuiButton
        variant="contained"
        color="info"
        sx={{ mt: 3 }}
        onClick={() => window.location.assign('/login')}
      >
        Go to Login
      </MuiButton>
    </Box>
  );
};
