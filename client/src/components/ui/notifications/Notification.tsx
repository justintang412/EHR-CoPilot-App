import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export type NotificationProps = {
  notification: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
  };
  onDismiss: (id: string) => void;
};

export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
}: NotificationProps) => {
  return (
    <Alert
      severity={type}
      action={
        <Button
          size="small"
          onClick={() => onDismiss(id)}
          sx={{ p: 0.5, minWidth: 'auto' }}
        >
          Close
        </Button>
      }
      sx={{ minWidth: 320, maxWidth: '90vw' }}
    >
      <strong>{title}</strong>
      {message && <div>{message}</div>}
    </Alert>
  );
};
