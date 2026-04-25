// testRegister.js
import axios from "axios";

const baseUrl = "http://localhost:5000/api";

async function testRegister() {
  try {
    const res = await axios.post(`${baseUrl}/auth/register`, {
      name: "Test User",
      email: "test@deetech.com",
      password: "123456",
    });

    console.log("✅ Register successful");
    console.log(res.data);
  } catch (err) {
    console.error("❌ Register failed:", err.response?.data || err.message);
  }
}

testRegister();
