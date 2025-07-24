/* eslint-disable react-refresh/only-export-components */
import { Navigate, useLocation } from 'react-router';
import { useFirebaseUser } from '@/features/auth/api/useFirebaseUser';
import { paths } from '@/config/paths';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useFirebaseUser();
  const location = useLocation();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
