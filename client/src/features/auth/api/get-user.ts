import { useQuery } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import type { QueryConfig } from '@/lib/react-query';
import type { User as FirebaseUser } from 'firebase/auth';

export const getUser = async (): Promise<FirebaseUser | null> => {
  const auth = getAuth();
  return auth.currentUser;
};

export const getUserQueryOptions = () => {
  return {
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  };
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUser>;
};

export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  });
}; 