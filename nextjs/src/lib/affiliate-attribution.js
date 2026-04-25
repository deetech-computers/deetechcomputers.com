const AFFILIATE_ATTRIBUTION_KEY = "deetech:affiliate-attribution";
const AFFILIATE_ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function normalizeAffiliateCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 20);
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function clearAffiliateAttribution() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AFFILIATE_ATTRIBUTION_KEY);
}

export function saveAffiliateAttribution(code, source = "share-link") {
  if (!isBrowser()) return "";
  const normalized = normalizeAffiliateCode(code);
  if (!normalized) return "";

  const payload = {
    code: normalized,
    source: String(source || "share-link"),
    capturedAt: Date.now(),
  };
  window.localStorage.setItem(AFFILIATE_ATTRIBUTION_KEY, JSON.stringify(payload));
  return normalized;
}

export function readAffiliateAttribution() {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(AFFILIATE_ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const code = normalizeAffiliateCode(parsed?.code);
    const capturedAt = Number(parsed?.capturedAt || 0);
    if (!code || !capturedAt) {
      clearAffiliateAttribution();
      return null;
    }
    if (Date.now() - capturedAt > AFFILIATE_ATTRIBUTION_TTL_MS) {
      clearAffiliateAttribution();
      return null;
    }
    return {
      code,
      source: String(parsed?.source || "share-link"),
      capturedAt,
    };
  } catch {
    clearAffiliateAttribution();
    return null;
  }
}

export function readAffiliateCode() {
  return readAffiliateAttribution()?.code || "";
}

export function getAffiliateCodeFromSearchParams(params) {
  if (!params || typeof params.get !== "function") return "";
  const direct = normalizeAffiliateCode(params.get("affiliate"));
  if (direct) return direct;
  const short = normalizeAffiliateCode(params.get("aff"));
  if (short) return short;
  const ref = normalizeAffiliateCode(params.get("ref"));
  if (ref) return ref;
  return "";
}
