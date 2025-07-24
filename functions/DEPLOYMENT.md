# Firebase Functions Deployment Guide

## Setup

1. **Update Firebase Project ID**
   - Edit `.firebaserc` and replace `"your-firebase-project-id"` with your actual Firebase project ID

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Functions**
   ```bash
   npm run build
   ```

## Deployment

### Option 1: Deploy from functions directory
```bash
cd functions
firebase deploy --only functions
```

### Option 2: Deploy using npm script
```bash
cd functions
npm run deploy
```

## Available Functions

- `getPaginatedPatients`: GET /patients?limit=10&offset=0
- `getFullPatientData`: GET /patient?subject_id=123

## Local Development

```bash
cd functions
npm run serve
```

This will start the Firebase emulator for local testing. 