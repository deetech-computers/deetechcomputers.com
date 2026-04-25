// backend/src/utils/errorHandler.js

/**
 * Centralized error creation helper
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // can distinguish operational vs programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error middleware
 * Usage: app.use(globalErrorHandler)
 */
export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Log stack trace only in dev
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

/**
 * Wrap async functions (alternative to asyncHandler if needed)
 */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
