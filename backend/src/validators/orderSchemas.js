// backend/src/validators/orderSchemas.js
import Joi from "joi";

// Create Order Schema (authenticated)
export const createOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().hex().length(24).required(),
        qty: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  paymentMethod: Joi.string()
    .valid("mtn", "vodafone", "bank", "hubtel")
    .required(),

  deliveryRegion: Joi.string().required(),

  mobileNumber: Joi.string()
    .pattern(/^(\+233|0)[0-9]{9}$/)
    .required(),

  shippingName: Joi.string().min(2).max(100).required(),
  shippingEmail: Joi.string().email().required(),
  shippingAddress: Joi.string().min(3).max(200).required(),
  shippingCity: Joi.string().min(2).max(100).required(),
  clientOrderRef: Joi.string().min(8).max(64).optional(),
  paymentScreenshotUrl: Joi.string().allow("").optional(),

  discountCode: Joi.string().alphanum().min(4).max(16).optional(),
  affiliateCode: Joi.string().alphanum().min(4).max(20).optional(),
});

// Guest Order Schema (multipart)
export const createGuestOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().hex().length(24).required(),
        qty: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  paymentMethod: Joi.string()
    .valid("mtn", "vodafone", "bank", "hubtel")
    .required(),

  deliveryRegion: Joi.string().required(),

  mobileNumber: Joi.string()
    .pattern(/^(\+233|0)[0-9]{9}$/)
    .required(),

  guestName: Joi.string().min(2).max(100).required(),
  guestEmail: Joi.string().email().required(),
  guestAddress: Joi.string().min(3).max(200).required(),
  guestCity: Joi.string().min(2).max(100).required(),
  guestNotes: Joi.string().allow("").max(2000),
  clientOrderRef: Joi.string().min(8).max(64).optional(),
  paymentScreenshotUrl: Joi.string().allow("").optional(),

  discountCode: Joi.string().alphanum().min(4).max(16).optional(),
  affiliateCode: Joi.string().alphanum().min(4).max(20).optional(),
});

// Update Order Status Schema
export const updateOrderStatusSchema = Joi.object({
  paymentStatus: Joi.string().valid("pending", "paid", "failed"),
  isDelivered: Joi.boolean(),
  deliveredAt: Joi.date(),
}).min(1);
