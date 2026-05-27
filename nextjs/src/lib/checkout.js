import { clearAffiliateAttribution } from "@/lib/affiliate-attribution";
import { readStoredUser } from "@/lib/session";

export const CHECKOUT_DRAFT_KEY = "deetech:checkout-draft";
const LEGACY_CHECKOUT_DRAFT_STORAGE_KEY = CHECKOUT_DRAFT_KEY;

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

export function hasSavedCheckoutProfile(source) {
  return Boolean(
    String(source?.shippingAddress || source?.address || "").trim() &&
    String(source?.shippingCity || source?.city || "").trim() &&
    String(source?.deliveryRegion || source?.region || "").trim() &&
    String(source?.mobileNumber || source?.phone || "").trim()
  );
}

function preferFilled(primaryValue, fallbackValue) {
  return String(primaryValue || "").trim() ? primaryValue : fallbackValue;
}

export function buildCheckoutDraftDefaults(activeUser) {
  const hasProfileDefaults = hasSavedCheckoutProfile(activeUser);
  const initialName = hasProfileDefaults ? splitName(activeUser?.name) : { firstName: "", lastName: "" };
  return {
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    companyName: "",
    shippingAddress: hasProfileDefaults ? activeUser?.address || "" : "",
    shippingCity: hasProfileDefaults ? activeUser?.city || "" : "",
    deliveryRegion: hasProfileDefaults ? activeUser?.region || "" : "",
    mobileNumber: hasProfileDefaults ? activeUser?.phone || "" : "",
    shippingEmail: hasProfileDefaults ? activeUser?.email || "" : "",
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

function getCheckoutStorage() {
  if (typeof window === "undefined") return null;
  try {
    window.localStorage.removeItem(LEGACY_CHECKOUT_DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup issues and continue with session storage.
  }
  return window.sessionStorage;
}

function safeParseCheckoutStorage() {
  const storage = getCheckoutStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(CHECKOUT_DRAFT_KEY);
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
  const storage = getCheckoutStorage();
  if (!storage) return;
  storage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(envelope));
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
  const storage = getCheckoutStorage();
  if (!storage) return;
  const envelope = normalizeCheckoutStorageEnvelope(safeParseCheckoutStorage());
  const scopeKey = buildCheckoutDraftScopeKey(scopeInput);
  if (scopeKey in envelope.drafts) {
    delete envelope.drafts[scopeKey];
  }
  if (!Object.keys(envelope.drafts).length) {
    storage.removeItem(CHECKOUT_DRAFT_KEY);
    return;
  }
  writeCheckoutStorageEnvelope(envelope);
}

export function clearAllCheckoutDrafts() {
  const storage = getCheckoutStorage();
  if (!storage) return;
  storage.removeItem(CHECKOUT_DRAFT_KEY);
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
