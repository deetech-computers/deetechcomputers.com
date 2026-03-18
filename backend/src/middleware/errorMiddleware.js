// backend/src/middleware/errorMiddleware.js

import { AppError } from "../utils/errorHandler.js"; // import custom error class if needed

// 404 Not Found handler
export function notFound(req, res, next) {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
}

// Global error handler
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || res.statusCode || 500;
  if (statusCode < 400) statusCode = 500;
  let message = err.message || "Internal server error";

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID format";
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Ensure operational AppError gets proper code
  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
