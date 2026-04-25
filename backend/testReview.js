// testReview.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

(async () => {
  try {
    // 1️⃣ Login as test user
    console.log("🔑 Logging in as test user...");
    const loginRes = await axios.post(`${baseUrl}/auth/login`, {
      email: "test@deetech.com",   // make sure this user exists
      password: "123456"
    });
    const token = loginRes.data.token;
    console.log("✅ Logged in as:", loginRes.data.email);

    // 2️⃣ Get products
    console.log("\n📦 Fetching products...");
    const productsRes = await axios.get(`${baseUrl}/products`);
    const testProducts = productsRes.data.filter((p) =>
      p.name.startsWith("Test Product") || p.name.startsWith("Test Gadget")
    );

    if (!testProducts.length) {
      throw new Error("⚠️ No test products found. Seed a product first.");
    }

    const productId = testProducts[0]._id;
    console.log("✅ Using product:", testProducts[0].name, "(", productId, ")");

    // 3️⃣ Add review
    console.log("\n✍️ Adding review...");
    const reviewPayload = {
      rating: 5,
      comment: "Awesome test review from script!"
    };

    const reviewRes = await axios.post(
      `${baseUrl}/reviews/${productId}`,
      reviewPayload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Review added:", reviewRes.data);
    const reviewId = reviewRes.data._id;

    // 4️⃣ Update review
    console.log("\n📝 Updating review...");
    const updateRes = await axios.put(
      `${baseUrl}/reviews/${reviewId}`,
      { rating: 4, comment: "Updated review from script!" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Review updated:", updateRes.data);

    // 5️⃣ (Optional) Delete review
    //console.log("\n🗑️ Deleting review...");
    //await axios.delete(`${baseUrl}/reviews/${reviewId}`, {
     // headers: { Authorization: `Bearer ${token}` }
    //});
    //console.log("✅ Review deleted successfully.");

  } catch (err) {
    console.error("\n❌ Review test failed");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
