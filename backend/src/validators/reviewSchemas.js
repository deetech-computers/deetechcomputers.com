// backend/src/validators/reviewSchemas.js
import Joi from "joi";

export const addReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(3).max(1000).required(),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().min(3).max(1000),
}).min(1); // must include at least one field

export const moderateReviewSchema = Joi.object({
  approved: Joi.boolean().required(),
});
