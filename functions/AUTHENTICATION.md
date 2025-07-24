# Firebase Functions Authentication

## Option 1: Firebase Auth (Recommended)

The main `index.ts` file uses Firebase Authentication with JWT tokens.

### How it works:
1. Client gets Firebase ID token from Firebase Auth
2. Sends token in `Authorization: Bearer <token>` header
3. Function verifies token with Firebase Admin SDK

### Usage:
```javascript
// Client-side (React/Frontend)
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();

// Make API call
fetch('https://us-central1-ehr-copilot-db.cloudfunctions.net/getPaginatedPatients', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Benefits:
- ✅ User management with Firebase Auth
- ✅ Role-based access control
- ✅ Automatic token refresh
- ✅ Integration with Firebase Auth UI

## Option 2: API Key Authentication

The `index-alternative.ts` file uses simple API key authentication.

### How it works:
1. Set API key as environment variable
2. Client sends key in `X-API-Key` header or `apiKey` query parameter
3. Function validates the key

### Usage:
```javascript
// Client-side
fetch('https://us-central1-ehr-copilot-db.cloudfunctions.net/getPaginatedPatients?apiKey=your-secret-key', {
  headers: {
    'X-API-Key': 'your-secret-key'
  }
});
```

### Benefits:
- ✅ Simple to implement
- ✅ No user management needed
- ✅ Good for service-to-service communication

## Setting Environment Variables

For API key authentication, set the environment variable:

```bash
firebase functions:config:set api.key="your-secret-api-key"
```

## Security Recommendations

1. **Use Firebase Auth** for user-facing applications
2. **Use API Keys** for service-to-service communication
3. **Never expose secrets** in client-side code
4. **Rotate keys regularly**
5. **Use HTTPS only** in production

## Testing Authentication

### Firebase Auth (Local):
```bash
cd functions
npm run serve
# Test with Firebase Auth token
```

### API Key (Local):
```bash
cd functions
npm run serve
# Test with X-API-Key header
```

## Deployment

Deploy with authentication enabled:
```bash
cd functions
firebase deploy --only functions
``` 