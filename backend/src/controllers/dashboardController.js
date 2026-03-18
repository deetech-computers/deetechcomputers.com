import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get aggregated dashboard stats (admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Total revenue from paid orders
    const orders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
