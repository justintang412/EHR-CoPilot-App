# CORS Fix for Firebase Functions

## 🔍 **Problem**
```
Access to XMLHttpRequest at 'https://us-central1-ehr-copilot-db.cloudfunctions.net/getPaginatedPatients' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' 
when the request's credentials mode is 'include'.
```

## 🛠️ **Root Cause**
1. **API Client**: Had `withCredentials: true` (line 10 in `api-client.ts`)
2. **Firebase Functions**: Used `Access-Control-Allow-Origin: '*'`
3. **Browser Security**: When `withCredentials: true`, server cannot use wildcard `*`

## ✅ **Solution Applied**

### 1. **Fixed API Client** (`client/src/lib/api-client.ts`)
```javascript
// Before
function authRequestInterceptor(config) {
  config.headers.set('Accept', 'application/json');
  config.withCredentials = true;  // ❌ This caused the issue
  return config;
}

// After
function authRequestInterceptor(config) {
  config.headers.set('Accept', 'application/json');
  // Don't set withCredentials for Firebase Functions
  // We use Firebase Auth tokens instead of cookies
  return config;
}
```

### 2. **Updated Firebase Functions CORS** (`functions/src/index.ts`)
```javascript
// CORS middleware
const cors = (req, res, next) => {
  // Allow all origins since we're not using credentials
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
};
```

## 🔐 **Why This Works**

### **Firebase Auth vs Cookies**
- **Firebase Auth**: Uses JWT tokens in `Authorization` header
- **Cookies**: Require `withCredentials: true` and specific CORS origin
- **Our Solution**: Use Firebase Auth tokens (no credentials needed)

### **Authentication Flow**
1. User signs in → Firebase generates JWT token
2. API client includes token in `Authorization: Bearer <token>` header
3. Firebase Functions verify token → Grant access
4. No cookies needed → No CORS credentials issues

## 🚀 **Deployment Steps**

### 1. **Deploy Updated Functions**
```bash
cd functions
firebase deploy --only functions
```

### 2. **Test the Fix**
1. Start your frontend: `npm run dev`
2. Sign in with Firebase Auth
3. Navigate to patient pages
4. Check Network tab - should see successful requests
5. No more CORS errors!

## 🧪 **Testing**

### **Expected Behavior**
- ✅ **With Auth**: Data loads successfully
- ❌ **Without Auth**: 401 Unauthorized (correct)
- ✅ **No CORS errors**: Clean requests

### **Check Network Tab**
- **Request Headers**: Should see `Authorization: Bearer <token>`
- **Response Headers**: Should see `Access-Control-Allow-Origin: *`
- **Status**: 200 OK (with auth) or 401 (without auth)

## 🔧 **Troubleshooting**

### If you still see CORS errors:
1. **Clear browser cache**
2. **Restart development server**
3. **Verify functions are deployed**
4. **Check if user is signed in**

### If you see 401 errors:
- This is expected without authentication
- Sign in with Firebase Auth to test

## 🎯 **Benefits**

- ✅ **No CORS issues**: Clean cross-origin requests
- ✅ **Secure**: Firebase Auth token verification
- ✅ **Scalable**: Serverless functions
- ✅ **Simple**: No cookie management needed

Your CORS issue should now be resolved! 🚀 