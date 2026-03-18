// testReviewAdmin.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

(async () => {
  try {
    // 1️⃣ Login as admin
    console.log("🔑 Logging in as admin...");
    const loginRes = await axios.post(`${baseUrl}/auth/login`, {
      email: "admin@deetech.com",   // make sure this admin exists
      password: "38454Daniel"       // your seeded admin password
    });
    const token = loginRes.data.token;
    console.log("✅ Logged in as admin:", loginRes.data.email);

    // 2️⃣ Fetch a product and its reviews
    console.log("\n📦 Fetching products...");
    const productsRes = await axios.get(`${baseUrl}/products`);
    const productId = productsRes.data[0]._id;

    console.log("🔎 Fetching reviews for product:", productId);
    const reviewsRes = await axios.get(`${baseUrl}/reviews/product/${productId}`);
    if (!reviewsRes.data.length) {
      throw new Error("⚠️ No reviews available. Run testReview.js first to add one.");
    }

    const reviewId = reviewsRes.data[0]._id;
    console.log("✅ Found review to moderate:", reviewId);

    // 3️⃣ Moderate (approve)
    console.log("\n✅ Approving review...");
    const approveRes = await axios.put(
      `${baseUrl}/reviews/${reviewId}/moderate`,
      { approved: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Review approved:", approveRes.data);

    // 4️⃣ Moderate (reject)
    console.log("\n❌ Rejecting review...");
    const rejectRes = await axios.put(
      `${baseUrl}/reviews/${reviewId}/moderate`,
      { approved: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Review rejected:", rejectRes.data);

  } catch (err) {
    console.error("\n❌ Admin review test failed");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
