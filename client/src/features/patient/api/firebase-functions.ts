import { api } from '@/lib/api-client';
import { buildFirebaseFunctionUrl, FIREBASE_FUNCTIONS_CONFIG } from '@/config/firebase-functions';

// Patient API service for Firebase Functions
export class PatientFirebaseService {
  // Get paginated patients
  static async getPaginatedPatients(limit: number = 10, offset: number = 0) {
    try {
      // Use the existing API client which automatically includes Firebase Auth token
      const response = await api.get(buildFirebaseFunctionUrl(FIREBASE_FUNCTIONS_CONFIG.ENDPOINTS.GET_PAGINATED_PATIENTS), {
        params: { limit, offset }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching paginated patients:', error);
      throw error;
    }
  }

  // Get full patient data
  static async getFullPatientData(subjectId: string) {
    try {
      const response = await api.get(buildFirebaseFunctionUrl(FIREBASE_FUNCTIONS_CONFIG.ENDPOINTS.GET_FULL_PATIENT_DATA), {
        params: { subject_id: subjectId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching full patient data:', error);
      throw error;
    }
  }
}

// React Query hooks for Firebase Functions
import { useQuery } from '@tanstack/react-query';

export const usePaginatedPatients = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: ['patients', 'paginated', limit, offset],
    queryFn: () => PatientFirebaseService.getPaginatedPatients(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFullPatientData = (subjectId: string) => {
  return useQuery({
    queryKey: ['patient', 'full', subjectId],
    queryFn: () => PatientFirebaseService.getFullPatientData(subjectId),
    enabled: !!subjectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 