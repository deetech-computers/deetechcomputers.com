// backend/src/seeder.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

dotenv.config();

// Connect to MongoDB
await connectDB();

// 🔑 Admin credentials (fixed for seeding)
const ADMIN_EMAIL = "admin@deetech.com";
const ADMIN_PASSWORD = "38454Daniel";

const importData = async () => {
  try {
    // Clear collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

   // Create admin user (leave password plain if model handles hashing)
const adminUser = await User.create({
  name: "Admin",
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD, // plain text (hook will hash it once)
  role: "admin",
});


    // Create sample products
    const sampleProducts = [
      {
        name: "Demo Phone",
        description: "Seeded demo product",
        brand: "DeeTech",
        category: "Electronics",
        price: 199.99,
        countInStock: 5,
        user: adminUser._id,
      },
      {
        name: "Demo Laptop",
        description: "Seeded demo product",
        brand: "DeeTech",
        category: "Electronics",
        price: 899.99,
        countInStock: 3,
        user: adminUser._id,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products inserted");

    console.log("\n🔑 Login details:");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

    process.exit();
  } catch (error) {
    console.error("❌ Import error:", error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🔥 Database cleared");
    process.exit();
  } catch (error) {
    console.error("❌ Destroy error:", error.message);
    process.exit(1);
  }
};

// CLI commands
if (process.argv[2] === "-d") {
  await destroyData();
} else {
  await importData();
}
