import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/firebase';
import { Alert, CircularProgress } from '@mui/material';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    const auth = getAuth(app);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        setEmail('');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    setIsLoading(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          {success ? (
            <Alert severity="success">
              Password reset email sent! Please check your inbox and follow the link to reset your password.
            </Alert>
          ) : (
            <>
              <DialogContentText>
                Enter your account&apos;s email address, and we&apos;ll send you a link to
                reset your password.
              </DialogContentText>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
              <OutlinedInput
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email address"
                placeholder="Email address"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
                  <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCloseDialog();
          }} 
          disabled={isLoading}
        >
          Cancel
        </Button>
          {!success && (
            <Button 
              variant="contained" 
              type="submit"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
