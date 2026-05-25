// Production SEO output should default to the live custom domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.deetechcomputers.com"
    : "http://localhost:3000");

const assetBase =
  process.env.NEXT_PUBLIC_DEETECH_ASSET_BASE ||
  (process.env.NODE_ENV === "production"
    ? "https://deetechcomputers-com.onrender.com"
    : "");

export const BASE_URL = assetBase;
export const API_ORIGIN =
  process.env.NEXT_PUBLIC_DEETECH_API_BASE ||
  process.env.NEXT_PUBLIC_DEETECH_API_ORIGIN ||
  (process.env.NODE_ENV === "production"
    ? "https://deetechcomputers-com.onrender.com"
    : "");

export function buildApiUrl(path = "") {
  const normalizedPath = String(path || "").trim();
  if (!normalizedPath) return `${API_ORIGIN}/api`;
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
  const withApiPrefix = normalizedPath.startsWith("/api")
    ? normalizedPath
    : `/api/${normalizedPath.replace(/^\/+/, "")}`;
  return `${API_ORIGIN}${withApiPrefix}`;
}

export const API_BASE = buildApiUrl("/api");
export const API_BASE_AUTH = API_BASE + "/auth";
export const API_BASE_USERS = API_BASE + "/users";
export const API_BASE_PRODUCTS = API_BASE + "/products";
export const API_BASE_CART = API_BASE + "/cart";
export const API_BASE_ORDERS = API_BASE + "/orders";
export const API_BASE_SUPPORT = API_BASE + "/support";
export const APP_NAME = "Deetech Computers";
