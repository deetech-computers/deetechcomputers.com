// backend/src/validators/supportSchemas.js
import Joi from "joi";

// ✅ Create Support Ticket
export const createSupportSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(5).max(2000).required(),
  imageUrl: Joi.string().allow("").optional(),
});

// ✅ Admin Update Response
export const updateSupportSchema = Joi.object({
  status: Joi.string().valid("new", "in-progress", "resolved"),
  response: Joi.string().max(2000),
}).min(1);

// ✅ User Reply
export const replySupportSchema = Joi.object({
  message: Joi.string().min(1).max(2000).allow(""),
  imageUrl: Joi.string().allow("").optional(),
}).custom((value, helpers) => {
  if (!value.message && !value.imageUrl) {
    return helpers.error("any.custom", { message: "Message or image required" });
  }
  return value;
});
