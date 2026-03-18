// backend/testEmail.js
import { sendPasswordResetEmail, sendOrderNotification } from "./src/utils/emailService.js";
import { ADMIN_EMAIL } from "./src/config/env.js";

async function runTests() {
  console.log("🔎 Testing email service...");

  // Test 1: Password reset
  await sendPasswordResetEmail(
    ADMIN_EMAIL,
    "http://localhost:3000/reset/test-token"
  );

  // Test 2: Order notification
  await sendOrderNotification(ADMIN_EMAIL, {
    orderId: "TEST123",
    items: [
      { product: "Demo Phone", qty: 2, price: 199.99 },
      { product: "Demo Laptop", qty: 1, price: 899.99 },
    ],
    totalPrice: 1299.97,
    customer: "Test User",
    email: "customer@example.com",
  });

  console.log("✅ Email test completed (check your inbox / logs).");
}

runTests().catch((err) => {
  console.error("❌ Email test failed:", err.message);
});
