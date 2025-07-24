// Firebase Functions configuration
export const FIREBASE_FUNCTIONS_CONFIG = {
  BASE_URL: 'https://us-central1-ehr-copilot-db.cloudfunctions.net',
  ENDPOINTS: {
    GET_PAGINATED_PATIENTS: '/getPaginatedPatients',
    GET_FULL_PATIENT_DATA: '/getFullPatientData',
    COPILOT_CHAT: '/copilotChat',
  },
} as const;

// Helper function to build Firebase Functions URLs
export const buildFirebaseFunctionUrl = (endpoint: string): string => {
  return `${FIREBASE_FUNCTIONS_CONFIG.BASE_URL}${endpoint}`;
}; 