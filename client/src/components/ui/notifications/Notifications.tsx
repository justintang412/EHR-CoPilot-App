import { NotificationDialog } from './NotificationDialog';
import { useNotifications } from './notifications-store';

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <>
      {notifications.map((notification) => (
        <NotificationDialog
          key={notification.id}
          open={true}
          onClose={() => dismissNotification(notification.id)}
          title={notification.title}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </>
  );
};
