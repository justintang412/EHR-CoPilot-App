# EHR Application: Production-Grade Project Setup

This document outlines the steps to set up the EHR application monorepo for local development. The project uses a React/Vite frontend and an Express/TypeScript backend.

## 1\. Initial Project & Monorepo Setup

These steps initialize the main project directory and Git repository.

```bash
# Create the root project folder
mkdir ehr-app
cd ehr-app

# Initialize Git
git init

# Create directories for the client and server
mkdir client
mkdir server
```

## 2\. Frontend Setup (`client`)

The frontend is a React application built with Vite for a fast development experience.

### Step 2.1: Scaffold the React + TypeScript Project

This command creates a new React project with TypeScript support inside the `client` folder.

```bash
npm create vite@latest client -- --template react-ts
```

### Step 2.2: Install Frontend Dependencies

Navigate into the client directory and install Material-UI for the component library and `axios` for API calls.

```bash
cd client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install axios react-router-dom
```

## 3\. Backend Setup (`server`)

The backend is a Node.js application using the Express framework and written in TypeScript.

### Step 3.1: Initialize the Node.js Project

Navigate into the server directory and initialize a `package.json` file.

```bash
cd server
npm init -y
```

### Step 3.2: Install Backend Dependencies

Install runtime and development dependencies.

```bash
# Install runtime dependencies
npm install express cors dotenv jsonwebtoken bcryptjs helmet morgan

# Install development dependencies
npm install -D typescript ts-node-dev @types/express @types/cors @types/node @types/morgan @types/bcryptjs
```

### Step 3.3: Configure TypeScript (`tsconfig.json`)

Create a `tsconfig.json` file in the `server` directory with the following production-ready configuration. This includes the crucial `esModuleInterop` flag.

```json
// server/tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": ".",
    "outDir": "dist",
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 3.4: Create Environment File (`.env`)

Create a `.env` file in the `server` directory. **This file should never be committed to Git.**

```
# .env example
PORT=5001
JWT_SECRET="YOUR_SUPER_SECRET_AND_LONG_JWT_KEY"
DATABASE_URL="mongodb://localhost:27017/ehr_db"
```

**IMPORTANT**: Add the `.env` file and other artifacts to a root `.gitignore` file.

```
# .gitignore in the project root
# Node
node_modules/
dist/
.env*
npm-debug.log

# Client
client/node_modules
client/dist
```

### Step 3.5: Add Development Script

Add a `dev` script to `server/package.json` to run the server with `ts-node-dev` for automatic restarts on file changes.

```json
// server/package.json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
}
```

## 4\. Running the Application for Development

You will need two separate terminal windows to run the frontend and backend servers simultaneously.

### To Run the Backend Server:

```bash
cd server
npm run dev
```

The server will be available at `http://localhost:5001`.

### To Run the Frontend Dev Server:

```bash
cd client
npm run dev
```

The React application will be available at `http://localhost:5173` (or another port if 5173 is in use).