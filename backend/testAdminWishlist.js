// testAdminWishlist.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

(async () => {
  try {
    // 🔑 Step 1: Login as Admin
    console.log("🔑 Step 1: Logging in as admin...");
    const loginPayload = { email: "admin@deetech.com", password: "38454Daniel" };
    const loginRes = await axios.post(`${baseUrl}/auth/login`, loginPayload);

    const token = loginRes.data.token;
    console.log("✅ Logged in as Admin:", loginRes.data.email);

    // 📋 Step 2: Fetch all users
    console.log("\n📋 Step 2: Fetching all users...");
    const usersRes = await axios.get(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Users fetched:", usersRes.data.length);

    // Pick first non-admin user
    const user = usersRes.data.find((u) => u.role === "user");
    if (!user) throw new Error("⚠️ No test user found");

    console.log("👉 Using user:", user._id, "-", user.email);

    // 📦 Step 3: Fetch user’s wishlist
    console.log("\n📦 Step 3: Fetching user’s wishlist...");
    const wishlistRes = await axios.get(
      `${baseUrl}/admin/wishlist/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Wishlist items:", wishlistRes.data.length);
    console.log("📝 Wishlist data:", JSON.stringify(wishlistRes.data, null, 2));

    // 🗑️ Step 4: Remove first product (if exists)
    if (wishlistRes.data.length > 0) {
      const productId = wishlistRes.data[0]._id;
      console.log("\n🗑️ Step 4: Removing product from user’s wishlist...");
      await axios.delete(
        `${baseUrl}/admin/wishlist/${user._id}/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Product removed from user’s wishlist!");
    } else {
      console.log("⚠️ User wishlist empty, skipping removal step.");
    }

    // 🧹 Step 5: Clear entire wishlist
    console.log("\n🧹 Step 5: Clearing user’s wishlist...");
    await axios.delete(`${baseUrl}/admin/wishlist/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ User’s wishlist cleared!");

    console.log("\n🎉 Admin wishlist test completed successfully!");
  } catch (err) {
    console.error("\n❌ Error while testing admin wishlist");
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
