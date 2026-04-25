// backend/src/controllers/adminController.js
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Dashboard stats
export async function getDashboardStats(req, res) {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const products = await Product.countDocuments();

  const totalSalesAgg = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalSales = totalSalesAgg.length > 0 ? totalSalesAgg[0].total : 0;

  res.json({ users, orders, products, totalSales });
}

// Get all users
export async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.json(users);
}

// Get user by ID
export async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}

// Update user role
export async function updateUserRole(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Admins cannot change their own role");
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

// Update user details (admin-level)
export async function updateUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString() && req.body.role && req.body.role !== user.role) {
    res.status(400);
    throw new Error("Admins cannot change their own role");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.role) {
    user.role = req.body.role;
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

// Delete user
export async function deleteUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Admins cannot delete themselves");
  }

  await user.deleteOne();
  res.json({ message: "User removed" });
}
