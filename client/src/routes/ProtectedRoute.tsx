import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/lib/auth';
import { paths } from '@/config/paths';

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={paths.auth.login.path} replace />;
  }

  return <Outlet />;
};