// backend/src/middleware/validateMiddleware.js

/**
 * Middleware to validate request body (or other parts) against a Joi schema or custom validator.
 * @param {Object|Function} schema - Joi schema (with .validate) or custom validator function.
 * @param {string} [property="body"] - Which request property to validate (e.g. "body", "params", "query").
 */
export function validateRequest(schema, property = "body") {
  return (req, res, next) => {
    if (!schema) {
      return next(new Error("No validation schema provided"));
    }

    let validationResult;

    try {
      if (typeof schema.validate === "function") {
        // Joi-style schema
        const isMultipart = typeof req.is === "function" && req.is("multipart/form-data");
        validationResult = schema.validate(req[property], {
          abortEarly: false,
          allowUnknown: !!isMultipart,
        });
      } else if (typeof schema === "function") {
        // Custom validator should throw on error or return { error }
        validationResult = schema(req[property]);
      } else {
        return next(new Error("Invalid validation schema type"));
      }
    } catch (err) {
      res.status(400);
      return next(new Error(`Validation exception: ${err.message}`));
    }

    if (validationResult.error) {
      const messages = validationResult.error.details
        ? validationResult.error.details.map(d => d.message)
        : [validationResult.error.message || "Validation failed"];

      res.status(400);
      return next(new Error(`Validation error: ${messages.join(", ")}`));
    }

    next();
  };
}
