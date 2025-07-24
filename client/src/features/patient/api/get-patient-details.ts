import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { buildFirebaseFunctionUrl, FIREBASE_FUNCTIONS_CONFIG } from '@/config/firebase-functions';
import type { QueryConfig } from '@/lib/react-query';
import type { PatientDetails } from '../types';

export const getPatientDetails = ({
  patientId,
}: {
  patientId: number;
}): Promise<PatientDetails> => {
  return api.get(buildFirebaseFunctionUrl(FIREBASE_FUNCTIONS_CONFIG.ENDPOINTS.GET_FULL_PATIENT_DATA), {
    params: {
      subject_id: patientId,
    },
  }).then(response => response.data);
};

export const getPatientDetailsQueryOptions = (patientId: number) => {
  return {
    queryKey: ['patient-details', patientId],
    queryFn: () => getPatientDetails({ patientId }),
    enabled: !!patientId,
  };
};

type UsePatientDetailsOptions = {
  patientId: number | null;
  queryConfig?: QueryConfig<typeof getPatientDetails>;
};

export const usePatientDetails = ({ patientId, queryConfig }: UsePatientDetailsOptions) => {
  return useQuery({
    ...getPatientDetailsQueryOptions(patientId!),
    ...queryConfig,
    enabled: !!patientId,
  });
}; 