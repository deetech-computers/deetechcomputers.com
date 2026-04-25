import axios from "axios";
const baseUrl = "http://localhost:5000/api";
(async ()=>{
  try {
    // login admin
    const login = await axios.post(`${baseUrl}/auth/login`, {
      email: "admin@deetech.com",
      password: "38454Daniel"
    });
    const token = login.data.token;

    // create product
    const res = await axios.post(`${baseUrl}/products`, {
      name: "Test Gadget",
      brand: "DeeTech",
      category: "Electronics",
      description: "From automation script",
      price: 99.99,
      countInStock: 10
    }, { headers: { Authorization: `Bearer ${token}` }});

    console.log("✅ Product created:", res.data);
  } catch (err) {
    console.error("❌ Create product failed:", err.response?.data || err.message);
  }
})();
