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

function normalizeProductId(value) {
  return String(value || "").trim();
}

export function getAffiliateProductIdFromPath(pathname = "") {
  const normalizedPath = String(pathname || "").trim();
  const match = normalizedPath.match(/^\/products\/([^/?#]+)/i);
  return normalizeProductId(match?.[1] || "");
}

export function clearAffiliateAttribution() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AFFILIATE_ATTRIBUTION_KEY);
}

export function markAffiliateAttributionConsumed(attribution) {
  if (!isBrowser() || !attribution?.code) return;
  try {
    const raw = window.localStorage.getItem(AFFILIATE_ATTRIBUTION_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const sameAttribution =
      normalizeAffiliateCode(parsed?.code) === normalizeAffiliateCode(attribution.code) &&
      Number(parsed?.capturedAt || 0) === Number(attribution.capturedAt || 0);
    if (!sameAttribution) return;
    window.localStorage.setItem(
      AFFILIATE_ATTRIBUTION_KEY,
      JSON.stringify({
        ...parsed,
        consumedAt: Date.now(),
      })
    );
  } catch {
    clearAffiliateAttribution();
  }
}

export function saveAffiliateAttribution(code, source = "share-link", metadata = {}) {
  if (!isBrowser()) return "";
  const normalized = normalizeAffiliateCode(code);
  if (!normalized) return "";
  const pathname = String(metadata?.pathname || "").trim();
  const productId =
    normalizeProductId(metadata?.productId) || getAffiliateProductIdFromPath(pathname);

  const payload = {
    code: normalized,
    source: String(source || "share-link"),
    pathname,
    productId,
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
      pathname: String(parsed?.pathname || ""),
      productId: normalizeProductId(parsed?.productId || ""),
      capturedAt,
      consumedAt: Number(parsed?.consumedAt || 0),
    };
  } catch {
    clearAffiliateAttribution();
    return null;
  }
}

export function readAffiliateCode() {
  return readAffiliateAttribution()?.code || "";
}

export function shouldAutoApplyAffiliateAttribution(attribution, items = []) {
  if (!attribution?.code) return false;
  if (String(attribution?.source || "") !== "product-link") return false;
  if (Number(attribution?.consumedAt || 0) > 0) return false;
  const targetProductId = normalizeProductId(attribution?.productId);
  if (!targetProductId) return false;

  return items.some((item) => {
    const itemProductId = normalizeProductId(item?.productId || item?._id || item?.id || "");
    return itemProductId === targetProductId;
  });
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
