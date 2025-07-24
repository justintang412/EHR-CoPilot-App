// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET as string,
  databaseUrl: process.env.DATABASE_URL as string,
};

// Validate that all required environment variables are set
if (!config.jwtSecret || !config.databaseUrl) {
  console.error("FATAL ERROR: Required environment variables are not set.");
  process.exit(1);
}

export default config;