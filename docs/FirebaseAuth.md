# Firebase Auth Setup Guide

## ✅ What's Already Configured

### Backend (Firebase Functions)
- ✅ Authentication middleware in `functions/src/index.ts`
- ✅ JWT token verification with Firebase Admin SDK
- ✅ CORS support for cross-origin requests
- ✅ Error handling and logging

### Frontend (React App)
- ✅ Firebase configuration in `client/src/firebase.ts`
- ✅ API client with automatic token injection in `client/src/lib/api-client.ts`
- ✅ Firebase Auth service in `client/src/lib/firebase-auth.ts`
- ✅ Patient API service for Firebase Functions in `client/src/features/patient/api/firebase-functions.ts`
- ✅ Example component in `client/src/features/patient/components/FirebasePatientGrid.tsx`

## 🚀 Deployment Steps

### 1. Deploy Firebase Functions
```bash
cd functions
firebase deploy --only functions
```

### 2. Set Environment Variables
Make sure your frontend has the correct Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=ehr-copilot-db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ehr-copilot-db
VITE_FIREBASE_STORAGE_BUCKET=ehr-copilot-db.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Enable Firebase Auth in Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ehr-copilot-db`
3. Go to Authentication → Sign-in method
4. Enable Email/Password authentication
5. Add test users if needed

## 🔐 How Authentication Works

### Flow:
1. **User Login**: User signs in with email/password via Firebase Auth
2. **Token Generation**: Firebase generates a JWT token
3. **API Call**: Frontend automatically includes token in `Authorization` header
4. **Token Verification**: Firebase Functions verify the token
5. **Data Access**: If valid, function returns data; if invalid, returns 401

### Code Example:
```javascript
// 1. User signs in
import { FirebaseAuthService } from '@/lib/firebase-auth';
await FirebaseAuthService.signIn(email, password);

// 2. API call automatically includes token
import { usePaginatedPatients } from '@/features/patient/api/firebase-functions';
const { data } = usePaginatedPatients(10, 0);
```

## 🧪 Testing

### Test Authentication Locally:
```bash
cd functions
npm run serve
```

### Test with Firebase Auth:
1. Sign in to your app
2. Check browser dev tools → Network tab
3. Verify `Authorization: Bearer <token>` header is sent
4. Verify functions return data (not 401)

### Test without Authentication:
- Should return 401 Unauthorized
- Check browser console for error messages

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if user is signed in
   - Verify token is being sent in header
   - Check Firebase Auth is enabled

2. **CORS Errors**
   - Functions already have CORS configured
   - Check if calling from correct origin

3. **Token Expired**
   - Firebase automatically refreshes tokens
   - Check if user session is valid

### Debug Steps:
1. Check browser console for errors
2. Check Firebase Functions logs: `firebase functions:log`
3. Verify Firebase project ID matches
4. Test with Firebase Auth UI component

## 📱 Usage in Components

```javascript
import { usePaginatedPatients, useFullPatientData } from '@/features/patient/api/firebase-functions';

function MyComponent() {
  const { data, isLoading, error } = usePaginatedPatients(10, 0);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data?.map(patient => (
        <div key={patient.subject_id}>{patient.subject_id}</div>
      ))}
    </div>
  );
}
```

## 🎯 Next Steps

1. **Deploy functions**: `cd functions && firebase deploy --only functions`
2. **Test authentication**: Sign in and verify API calls work
3. **Add more functions**: Create additional protected endpoints
4. **Add role-based access**: Implement user roles and permissions
5. **Monitor usage**: Check Firebase Console for function metrics

Your Firebase Auth integration is ready! 🚀 