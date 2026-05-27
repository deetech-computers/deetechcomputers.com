import { clearAffiliateAttribution } from "@/lib/affiliate-attribution";
import { readStoredUser } from "@/lib/session";

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
    logo: "/payment/telecel.png",
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
    logo: "/payment/hubtel.png",
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
    logo: "/payment/calbank.png",
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

function preferFilled(primaryValue, fallbackValue) {
  return String(primaryValue || "").trim() ? primaryValue : fallbackValue;
}

export function buildCheckoutDraftDefaults(activeUser) {
  const initialName = splitName(activeUser?.name);
  return {
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    companyName: "",
    shippingAddress: activeUser?.address || "",
    shippingCity: activeUser?.city || "",
    deliveryRegion: activeUser?.region || "",
    mobileNumber: activeUser?.phone || "",
    shippingEmail: activeUser?.email || "",
    affiliateCode: "",
    useShippingForBilling: true,
    billingAddress: "",
    paymentMethod: "mtn",
    paymentProofUrl: "",
    paymentProofName: "",
    paymentProofStorage: "",
    discountCode: "",
    discountPercent: 0,
    discountAmount: 0,
    clientOrderRef: "",
    affiliateCodeMode: "manual",
    affiliateCodeCleared: false,
    affiliateCodeClearedAt: 0,
  };
}

export function buildCheckoutFormState(activeUser, draft = {}) {
  const defaults = buildCheckoutDraftDefaults(activeUser);
  return {
    ...defaults,
    ...draft,
    firstName: preferFilled(draft?.firstName, defaults.firstName),
    lastName: preferFilled(draft?.lastName, defaults.lastName),
    shippingAddress: preferFilled(draft?.shippingAddress, defaults.shippingAddress),
    shippingCity: preferFilled(draft?.shippingCity, defaults.shippingCity),
    deliveryRegion: preferFilled(draft?.deliveryRegion, defaults.deliveryRegion),
    mobileNumber: preferFilled(draft?.mobileNumber, defaults.mobileNumber),
    shippingEmail: preferFilled(draft?.shippingEmail, defaults.shippingEmail),
  };
}

function normalizeDraftScopeInput(scopeInput) {
  if (scopeInput && typeof scopeInput === "object") {
    return scopeInput;
  }
  return readStoredUser();
}

function buildCheckoutDraftScopeKey(scopeInput) {
  const scope = normalizeDraftScopeInput(scopeInput);
  const userId = String(scope?._id || "").trim();
  if (userId) return `user:${userId}`;
  const email = String(scope?.email || "").trim().toLowerCase();
  if (email) return `email:${email}`;
  return "guest";
}

function safeParseCheckoutStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeCheckoutStorageEnvelope(parsed) {
  if (parsed && typeof parsed === "object" && parsed.version === 2 && parsed.drafts && typeof parsed.drafts === "object") {
    return parsed;
  }
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return {
      version: 2,
      drafts: {
        guest: parsed,
      },
    };
  }
  return {
    version: 2,
    drafts: {},
  };
}

function writeCheckoutStorageEnvelope(envelope) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(envelope));
}

export function readCheckoutDraft(scopeInput) {
  const envelope = normalizeCheckoutStorageEnvelope(safeParseCheckoutStorage());
  const scopeKey = buildCheckoutDraftScopeKey(scopeInput);
  const draft = envelope.drafts?.[scopeKey];
  return draft && typeof draft === "object" ? draft : null;
}

export function writeCheckoutDraft(value, scopeInput) {
  if (typeof window === "undefined") return;
  const envelope = normalizeCheckoutStorageEnvelope(safeParseCheckoutStorage());
  const scopeKey = buildCheckoutDraftScopeKey(scopeInput);
  envelope.drafts[scopeKey] = value;
  writeCheckoutStorageEnvelope(envelope);
}

export function clearCheckoutDraft(scopeInput) {
  if (typeof window === "undefined") return;
  const envelope = normalizeCheckoutStorageEnvelope(safeParseCheckoutStorage());
  const scopeKey = buildCheckoutDraftScopeKey(scopeInput);
  if (scopeKey in envelope.drafts) {
    delete envelope.drafts[scopeKey];
  }
  if (!Object.keys(envelope.drafts).length) {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return;
  }
  writeCheckoutStorageEnvelope(envelope);
}

export function clearCompletedCheckoutState(scopeInput) {
  clearCheckoutDraft(scopeInput);
  clearAffiliateAttribution();
}

export function buildClientOrderRef() {
  return `dc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
      selectedUpgrades: item.selectedUpgrades || {},
    }))
    .filter((item) => item.product && item.qty > 0);
}
