// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  console.error(err.stack); // Log the error stack for debugging

  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Something went wrong on the server.',
  });
};