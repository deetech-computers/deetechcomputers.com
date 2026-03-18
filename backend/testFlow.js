// testFlow.js
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

    const testProducts = products.data.filter((p) =>
      p.name.startsWith("Test Product")
    );

    if (!testProducts.length) {
      throw new Error("No test products available. Run your seed script first.");
    }

    const productId = testProducts[0]._id;
    console.log("📦 Using productId:", productId, "-", testProducts[0].name);

    console.log("\n🔎 Step 3: Adding product to cart...");
    let cart = await axios.post(
      `${baseUrl}/cart/${productId}`,
      { qty: 2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Cart after adding:", JSON.stringify(cart.data, null, 2));

    console.log("\n🔎 Step 4: Updating cart quantity...");
    cart = await axios.post(
      `${baseUrl}/cart/${productId}`,
      { qty: 3 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Cart after update:", JSON.stringify(cart.data, null, 2));

    console.log("\n🔎 Step 5: Creating order from cart...");
    const orderPayload = {
      orderItems: cart.data.items.map((item) => ({
        product: item.product._id,
        qty: item.qty,
      })),
      deliveryRegion: "Accra",
      paymentMethod: "mtn",
      mobileNumber: "0241234567",
    };

    const order = await axios.post(`${baseUrl}/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Order created successfully!");
    console.log("⬅️ Order response:", JSON.stringify(order.data, null, 2));

    console.log("\n🔎 Step 6: Clearing the cart...");
    const cleared = await axios.delete(`${baseUrl}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Cart cleared:", JSON.stringify(cleared.data, null, 2));
  } catch (err) {
    console.error("\n❌ Error during flow test");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
