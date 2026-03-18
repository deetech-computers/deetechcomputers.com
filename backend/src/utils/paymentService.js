// backend/src/utils/paymentService.js
import { AppError } from "./errorHandler.js";

/**
 * Simulate processing a payment.
 * In real life, integrate with actual payment APIs (MTN, Hubtel, Vodafone, etc.)
 * @param {Object} paymentData
 * @param {string} paymentData.method - "mtn" | "vodafone" | "bank" | "hubtel"
 * @param {number} paymentData.amount - Total amount to charge
 * @param {string} paymentData.mobileNumber - Mobile number (required for mobile money)
 * @returns {Promise<Object>} Payment result
 */
export async function processPayment({ method, amount, mobileNumber }) {
  if (!method || !["mtn", "vodafone", "bank", "hubtel"].includes(method)) {
    throw new AppError("Invalid payment method", 400);
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("Invalid payment amount", 400);
  }

  if ((method === "mtn" || method === "vodafone") && !mobileNumber) {
    throw new AppError("Mobile number required for mobile payments", 400);
  }

  // Simulate API call with random success/failure
  const success = Math.random() > 0.1; // 90% success chance

  if (!success) {
    throw new AppError("Payment processing failed. Please try again.", 502);
  }

  // Return standardized response
  return {
    status: "success",
    method,
    amount,
    transactionId: `${method.toUpperCase()}-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Refund a payment (simulated)
 * @param {string} transactionId
 * @returns {Promise<Object>}
 */
export async function refundPayment(transactionId) {
  if (!transactionId) {
    throw new AppError("Transaction ID is required for refund", 400);
  }

  // Simulate refund success
  return {
    status: "refunded",
    transactionId,
    refundedAt: new Date().toISOString(),
  };
}
