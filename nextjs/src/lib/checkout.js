export const CHECKOUT_DRAFT_KEY = "deetech:checkout-draft";

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Western North",
  "Central",
  "Eastern",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
];

export const PAYMENT_METHODS = [
  {
    id: "mtn",
    label: "MTN Mobile Money",
    helper: "Merchant and direct MoMo payment",
    logo: "/payment/mtn.svg",
    lines: [
      "Merchant Number (ID): 694988",
      "Merchant Name: Deetek 360 Enterprise (DEETECH COMPUTERS)",
      "MoMo Number: 0591755964",
      "Account Name: Daniel Adjei Mensah (DEETECH COMPUTERS)",
    ],
  },
  {
    id: "vodafone",
    label: "Telecel Cash",
    helper: "Telecel / Vodafone merchant transfer",
    logo: "/payment/telecel.svg",
    lines: [
      "Merchant ID: 451444",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
      "Use your Telecel Cash app or shortcode and upload the successful transaction screen.",
    ],
  },
  {
    id: "hubtel",
    label: "Hubtel",
    helper: "Quick shortcode payment",
    logo: "/payment/hubtel.svg",
    lines: [
      "Dial: *713*5964#",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
      "After payment, upload the confirmation screen as proof.",
    ],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    helper: "Direct transfer to our business account",
    logo: "/payment/calbank.svg",
    lines: [
      "Bank: CALBANK",
      "Account Number: 1400009398769",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
    ],
  },
];

export function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

export function readCheckoutDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCheckoutDraft(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(value));
}

export function clearCheckoutDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

export function buildClientOrderRef() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `dc-${window.crypto.randomUUID()}`;
  }
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isPhaseOneComplete(form) {
  return [
    form.firstName,
    form.lastName,
    form.shippingAddress,
    form.shippingCity,
    form.deliveryRegion,
    form.mobileNumber,
    form.shippingEmail,
  ].every((value) => String(value || "").trim());
}

export function buildOrderItems(items) {
  return items
    .map((item) => ({
      product: String(item.productId || item._id || ""),
      qty: Number(item.qty || 0),
    }))
    .filter((item) => item.product && item.qty > 0);
}
