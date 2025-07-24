import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { buildFirebaseFunctionUrl, FIREBASE_FUNCTIONS_CONFIG } from '@/config/firebase-functions';
import type { QueryConfig } from '@/lib/react-query';
import type { PatientsResponse } from '../types';

export const getPatients = ({
  limit = 25,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<PatientsResponse> => {
  return api.get(buildFirebaseFunctionUrl(FIREBASE_FUNCTIONS_CONFIG.ENDPOINTS.GET_PAGINATED_PATIENTS), {
    params: {
      limit,
      offset,
    },
  }).then(response => response.data);
};

export const getPatientsQueryOptions = (limit: number, offset: number) => {
  return {
    queryKey: ['patients', limit, offset],
    queryFn: () => getPatients({ limit, offset }),
  };
};

type UsePatientsOptions = {
  limit?: number;
  offset?: number;
  queryConfig?: QueryConfig<typeof getPatients>;
};

export const usePatients = ({ limit = 25, offset = 0, queryConfig }: UsePatientsOptions) => {
  return useQuery({
    ...getPatientsQueryOptions(limit, offset),
    ...queryConfig,
  });
}; 