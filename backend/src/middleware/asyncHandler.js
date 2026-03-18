// backend/src/middleware/asyncHandler.js
// Utility to handle async route errors without try/catch
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
