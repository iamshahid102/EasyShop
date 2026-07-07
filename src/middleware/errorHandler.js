export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error) => {
  // Log error to console for debugging
  console.error('[ERROR] API Error:', {
    message: error.message,
    name: error.name,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate entry';
    statusCode = 400;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors || {}).map((err) => err.message);
    message = errors.length > 0 ? errors.join(', ') : 'Validation failed';
    statusCode = 400;
  }

  // Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    message = `Invalid ${error.path}: ${error.value}`;
    statusCode = 400;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (error.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    const zodErrors = error.errors?.map(e => e.message) || [];
    message = zodErrors.length > 0 ? zodErrors.join(', ') : 'Validation failed';
    statusCode = 400;
  }

  return {
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && {
      error: error.message,
      stack: error.stack
    }),
  };
};
