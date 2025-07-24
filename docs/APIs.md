# API Overview: Patient Data Endpoints

This document explains how the main patient data APIs work in the EHR CoPilot App, including their purpose, usage, and authentication flow.

---

## 1. **Patient List API**

### **Purpose**
Fetches a paginated list of patients from the backend.

### **How It Works**
- **Endpoint:**  
  `https://us-central1-ehr-copilot-db.cloudfunctions.net/getPaginatedPatients`
- **Method:**  
  `GET`
- **Parameters:**  
  - `limit`: Number of patients to return per page  
  - `offset`: Number of patients to skip (for pagination)

**Example Usage:**
```javascript
api.get('https://us-central1-ehr-copilot-db.cloudfunctions.net/getPaginatedPatients', {
  params: { limit, offset }
})
```

**Flow:**
1. The frontend sends a GET request with `limit` and `offset` as query parameters.
2. The backend Firebase Function authenticates the request using the Firebase Auth token.
3. If authenticated, the function queries the database and returns a list of patients.
4. If not authenticated, the function returns a 401 Unauthorized error.

---

## 2. **Patient Details API**

### **Purpose**
Fetches detailed information for a specific patient.

### **How It Works**
- **Endpoint:**  
  `https://us-central1-ehr-copilot-db.cloudfunctions.net/getFullPatientData`
- **Method:**  
  `GET`
- **Parameters:**  
  - `subject_id`: The unique ID of the patient

**Example Usage:**
```javascript
api.get('https://us-central1-ehr-copilot-db.cloudfunctions.net/getFullPatientData', {
  params: { subject_id: patientId }
})
```

**Flow:**
1. The frontend sends a GET request with the `subject_id` parameter.
2. The backend Firebase Function checks the Firebase Auth token for authentication.
3. If authenticated, the function retrieves and returns the full patient data.
4. If not authenticated, the function returns a 401 Unauthorized error.

---

## 3. **Authentication**

- All API requests automatically include the Firebase Auth token.
- The API client handles token injection, so you don’t need to add it manually.
- Only authenticated users can access patient data.

---

## 4. **Configuration**

- All Firebase Function URLs are managed centrally in `client/src/config/firebase-functions.ts`.
- This makes it easy to update endpoints and ensures consistency across the app.

---

## 5. **Testing the APIs**

1. Start the frontend: `npm run dev`
2. Sign in using Firebase Auth.
3. Navigate to patient-related pages.
4. Use the browser’s Network tab to verify requests are sent to the Firebase Functions URLs.
5. Data should load if authenticated; otherwise, you’ll see a 401 error.

---

## 6. **Troubleshooting**

- **Localhost errors:** Clear cache, restart the dev server, check imports, and ensure Firebase Functions are deployed.
- **CORS errors:** Make sure you’re calling from an allowed origin and that CORS is configured on the Firebase Functions.

---

## 7. **Summary Table**

| API                | Endpoint                                                        | Parameters                | Auth Required |
|--------------------|-----------------------------------------------------------------|---------------------------|--------------|
| Get Patients       | `/getPaginatedPatients`                                         | `limit`, `offset`         | Yes          |
| Get Patient Detail | `/getFullPatientData?subject_id={id}`                           | `subject_id`              | Yes          |

---

These APIs provide secure, scalable, and reliable access to patient data using Firebase Functions and authentication. All requests must be authenticated, and endpoints are managed centrally for maintainability. 