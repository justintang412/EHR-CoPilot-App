# Local Authentication Setup Guide (Non-Firebase)

## Overview

This guide explains how to set up and test the local, session-based authentication system for the EHR application. This setup does **not** use Firebase authentication; instead, it relies on Express.js sessions and in-memory user storage (suitable for development only).

---

## 1. Environment Configuration

### Client (`client/.env`)
Create a `.env` file in the `client` directory with the following content:

```env
VITE_APP_API_URL=http://localhost:8080/api
VITE_APP_ENABLE_API_MOCKING=false
VITE_APP_APP_URL=http://localhost:5173
```

### Server (`server/.env`)
Create a `.env` file in the `server` directory with the following content:

```env
PORT=8080
NODE_ENV=development
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

---

## 2. Running the Application

### Start the Backend Server

```bash
cd server
npm install
npm run dev
```

### Start the Frontend Client

```bash
cd client
npm install
npm run dev
```

---

## 3. Authentication Flows

### Register a New User

- Go to: `http://localhost:5173/auth/register`
- Fill out the registration form.
- On success, you will be redirected to the dashboard.

### Login

- Go to: `http://localhost:5173/auth/login`
- Enter your credentials.
- On success, you will be redirected to the dashboard.

### Access Protected Routes

- Try to access `http://localhost:5173/app` without logging in.
- You should be redirected to the login page.

### Logout

- While logged in, use the logout option (UI implementation may be required).

---

## 4. API Endpoints

| Endpoint                | Method | Description                    |
|-------------------------|--------|--------------------------------|
| `/api/auth/register`    | POST   | Register a new user            |
| `/api/auth/login`       | POST   | Login with email/password      |
| `/api/auth/me`          | GET    | Get current user (protected)   |
| `/api/auth/logout`      | POST   | Logout (destroy session)       |

#### Example: Register

Request:
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "id": "user_1234567890",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ADMIN",
  "teamId": "team_1234567890",
  "bio": "",
  "createdAt": 1234567890
}
```

#### Example: Login

Request:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: (same as above)

---

## 5. How It Works

### Frontend

- **Session Check:** On app load, the provider (`client/src/app/provider.tsx`) checks for an existing session.
- **Route Protection:** The `ProtectedRoute` component redirects unauthenticated users to the login page.
- **Forms:** Login and registration forms use React Query Auth hooks for API calls.
- **API Client:** Handles credentials and error responses (`client/src/lib/api-client.ts`).

### Backend

- **Session Middleware:** Manages user sessions using Express.js and `express-session`.
- **Auth Routes:** Handle registration, login, logout, and user info retrieval.
- **Route Protection:** Middleware ensures protected routes are only accessible to authenticated users.
- **User Storage:** Uses in-memory storage (replace with a database for production).

---

## 6. Security Notes

**Current Features:**
- Passwords are hashed with bcrypt.
- Session-based authentication with HTTP-only cookies.
- CORS configured to allow credentials.
- Protected routes.

**Production Recommendations:**
- Replace in-memory storage with a real database.
- Use HTTPS.
- Implement rate limiting.
- Add password reset and email verification.
- Improve session management and add CSRF protection.

---

## 7. Troubleshooting

- **CORS errors:** Ensure backend is on port 8080 and frontend on 5173.
- **Session not persisting:** Make sure `withCredentials: true` is set in the API client.
- **TypeScript errors:** Some may exist on the server, but functionality should work.
- **Environment variables:** Double-check your `.env` files.

**Debugging Steps:**
- Check browser network tab for API calls.
- Check server console for errors.
- Verify environment variables are loaded.
- Test API endpoints with Postman or similar tools.

---

## 8. Next Steps

- Integrate a real database for user storage.
- Add logout button and user profile management in the UI.
- Improve error handling and user feedback.
- Add comprehensive tests for authentication flows.
- Implement additional security measures for production. 