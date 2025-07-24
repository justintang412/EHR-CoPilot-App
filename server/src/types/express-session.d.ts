// src/types/express-session.d.ts

import 'express-session';

declare module 'express-session' {
  // This is where you can define the shape of your session data
  interface SessionData {
    userId?: string;
  }
}