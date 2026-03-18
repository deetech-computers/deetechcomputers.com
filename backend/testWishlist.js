// testWishlist.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

(async () => {
  try {
    console.log("🔑 Step 1: Logging in as test user...");
    const loginPayload = { email: "test@deetech.com", password: "123456" };
    const login = await axios.post(`${baseUrl}/auth/login`, loginPayload);

    const token = login.data.token;
    console.log("✅ Logged in as:", login.data.email);

    console.log("\n📦 Step 2: Fetching products...");
    const products = await axios.get(`${baseUrl}/products`);
    console.log("✅ Products fetched:", products.data.length);

    const testProducts = products.data.filter((p) =>
      p.name.startsWith("Test Product")
    );

    if (!testProducts.length) {
      throw new Error("⚠️ No test products available. Run testSeedProducts.js first.");
    }

    const productId = testProducts[0]._id;
    console.log("👉 Using productId:", productId, "-", testProducts[0].name);

    console.log("\n💖 Step 3: Adding product to wishlist...");
    await axios.post(
      `${baseUrl}/wishlist/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Product added to wishlist!");

    console.log("\n📋 Step 4: Fetching wishlist...");
    const wishlist = await axios.get(`${baseUrl}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Wishlist items:", wishlist.data.length);
    console.log("📝 Wishlist data:", JSON.stringify(wishlist.data, null, 2));

    console.log("\n🗑️ Step 5: Removing product from wishlist...");
    await axios.delete(`${baseUrl}/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Product removed from wishlist!");

    console.log("\n📋 Step 6: Fetching wishlist again...");
    const wishlistAfter = await axios.get(`${baseUrl}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Wishlist items after removal:", wishlistAfter.data.length);

    console.log("\n🎉 Wishlist test completed successfully!");
  } catch (err) {
    console.error("\n❌ Error while testing wishlist");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
