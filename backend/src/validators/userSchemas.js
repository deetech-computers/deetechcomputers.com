import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
  phone: Joi.string().max(30),
  address: Joi.string().max(200),
  region: Joi.string().max(100),
  city: Joi.string().max(100),
  password: Joi.string().min(6),
}).min(1); // must include at least one field

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
});

// ✅ Admin full update (name, email, role)
export const adminUpdateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid("user", "admin"),
}).min(1); // at least one field must be provided

export const trackUserBehaviorSchema = Joi.object({
  searchTerm: Joi.string().trim().min(1).max(80),
  category: Joi.string()
    .trim()
    .lowercase()
    .valid("laptops", "phones", "monitors", "accessories", "printers", "storage", "others"),
})
  .or("searchTerm", "category")
  .required();
