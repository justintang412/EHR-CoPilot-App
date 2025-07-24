// src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// --- Core Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    // This dynamically sets the origin based on the request.
    // It's flexible for development but MUST be changed for production.
    origin: (origin, callback) => {
      // In development, we can allow the origin of the request
      // The `origin` parameter will be the URL of your client, e.g. http://localhost:3000
      callback(null, origin);
    },
    credentials: true,
  })
);
// Secure your app by setting various HTTP headers
app.use(helmet());
// Parse incoming JSON requests
app.use(express.json());
// Logger for HTTP requests (use 'dev' for development)
app.use(morgan('dev'));

// --- API Routes ---
// TODO: We will add our main router here later
// Example: app.use('/api/v1', mainRouter);

// --- Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('EHR Backend API is running...');
});
app.get('/auth', (req: Request, res: Response) => {
  res.send('EHR Backend API is running...');
});
// --- Error Handling Middleware ---
// This should be the last middleware in the chain
app.use(errorHandler);

export default app;