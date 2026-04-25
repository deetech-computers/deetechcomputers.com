// testLogin.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

async function testLogin() {
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, {
      email: "admin@deetech.com",
      password: "38454Daniel",
    });

    console.log("✅ Login successful");
    console.log("Admin token:", res.data.token);
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

testLogin();
