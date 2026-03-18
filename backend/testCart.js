// testCart.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

(async () => {
  try {
    console.log("🔎 Step 1: Logging in...");
    const loginPayload = { email: "test@deetech.com", password: "123456" };
    const login = await axios.post(`${baseUrl}/auth/login`, loginPayload);

    const token = login.data.token;
    console.log("✅ Logged in as:", login.data.email);

    console.log("\n🔎 Step 2: Fetching products...");
    const products = await axios.get(`${baseUrl}/products`);
    console.log("✅ Products fetched:", products.data.length);

    // Pick only test products
    const testProducts = products.data.filter((p) =>
      p.name.startsWith("Test Product")
    );

    if (!testProducts.length) {
      throw new Error("No test products found. Run your seeder first.");
    }

    const productId = testProducts[0]._id;
    console.log("📦 Using productId:", productId, "-", testProducts[0].name);

    console.log("\n🔎 Step 3: Adding product to cart...");
    const addToCart = await axios.post(
      `${baseUrl}/cart/${productId}`,
      { qty: 2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Cart after adding:", addToCart.data);

    console.log("\n🔎 Step 4: Updating cart quantity...");
    const updateCart = await axios.post(
      `${baseUrl}/cart/${productId}`,
      { qty: 5 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Cart after update:", updateCart.data);

    console.log("\n🔎 Step 5: Removing product from cart...");
    const removeFromCart = await axios.delete(`${baseUrl}/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Cart after removal:", removeFromCart.data);

    console.log("\n🔎 Step 6: Clearing entire cart...");
    const clearCart = await axios.delete(`${baseUrl}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Cart cleared:", clearCart.data);
  } catch (err) {
    console.error("\n❌ Error while testing cart");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
