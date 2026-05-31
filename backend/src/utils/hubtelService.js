import {
  HUBTEL_API_ID,
  HUBTEL_API_KEY,
  HUBTEL_BASE_URL,
  HUBTEL_MERCHANT_ACCOUNT,
} from "../config/env.js";

function assertHubtelConfigured() {
  if (!HUBTEL_API_ID || !HUBTEL_API_KEY || !HUBTEL_MERCHANT_ACCOUNT) {
    const error = new Error(
      "Hubtel is not configured. Set HUBTEL_API_ID, HUBTEL_API_KEY and HUBTEL_MERCHANT_ACCOUNT."
    );
    error.statusCode = 500;
    throw error;
  }
}

function authHeader() {
  const token = Buffer.from(`${HUBTEL_API_ID}:${HUBTEL_API_KEY}`).toString("base64");
  return `Basic ${token}`;
}

export function getHubtelCheckoutUrl(response) {
  const direct = String(response?.data?.checkoutDirectUrl || "").trim();
  const checkout = String(response?.data?.checkoutUrl || "").trim();
  const paylink = String(response?.data?.paylinkUrl || "").trim();
  const topLevelCheckout = String(response?.checkoutUrl || "").trim();
  const topLevelPaylink = String(response?.paylinkUrl || "").trim();
  return direct || checkout || paylink || topLevelCheckout || topLevelPaylink || "";
}

export async function initiateHubtelCheckout({
  amount,
  description,
  clientReference,
  callbackUrl,
  returnUrl,
  cancellationUrl,
}) {
  assertHubtelConfigured();

  const totalAmount = Number(amount);
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    const error = new Error("Invalid Hubtel checkout amount.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    totalAmount: Number(totalAmount.toFixed(2)),
    description: String(description || "DEETECH order payment"),
    callbackUrl: String(callbackUrl || "").trim(),
    returnUrl: String(returnUrl || "").trim(),
    cancellationUrl: String(cancellationUrl || "").trim(),
    merchantAccountNumber: String(HUBTEL_MERCHANT_ACCOUNT || "").trim(),
    clientReference: String(clientReference || "").trim(),
  };

  const response = await fetch(`${HUBTEL_BASE_URL}/items/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const detailsText =
      typeof data === "string"
        ? data
        : JSON.stringify(data || {});
    const error = new Error(
      data?.message ||
        data?.Message ||
        data?.error ||
        `Hubtel payment initiation failed: ${detailsText}`
    );
    error.statusCode = response.status || 502;
    error.details = data;
    throw error;
  }

  return data;
}
