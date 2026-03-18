// backend/testSeedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import connectDB from "./src/config/db.js";

dotenv.config();

async function seedProducts() {
  try {
    await connectDB();

    console.log("🧹 Clearing old test/demo products...");
    // Delete any Demo or Test products
    await Product.deleteMany({ name: /Demo|Test Product/i });

    const products = [
      {
        name: "Test Product 1",
        images: ["/images/test1.jpg"],
        description: "Sample product 1 for testing orders",
        brand: "Deetech",
        category: "Electronics",
        price: 100,
        countInStock: 50,
      },
      {
        name: "Test Product 2",
        images: ["/images/test2.jpg"],
        description: "Sample product 2 for testing orders",
        brand: "Deetech",
        category: "Accessories",
        price: 25,
        countInStock: 100,
      },
      {
        name: "Test Product 3",
        images: ["/images/test3.jpg"],
        description: "Sample product 3 for testing orders",
        brand: "Deetech",
        category: "Misc",
        price: 10,
        countInStock: 200,
      },
    ];

    const created = await Product.insertMany(products);
    console.log(`✅ Inserted ${created.length} test products`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
    process.exit(1);
  }
}

seedProducts();
