export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://deetechcomputers-com.vercel.app";

const assetBase =
  process.env.NEXT_PUBLIC_DEETECH_ASSET_BASE ||
  (process.env.NODE_ENV === "production"
    ? "https://deetechcomputers-com.onrender.com"
    : "");

export const BASE_URL = assetBase;
export const API_BASE = "/api";
export const API_BASE_AUTH = API_BASE + "/auth";
export const API_BASE_USERS = API_BASE + "/users";
export const API_BASE_PRODUCTS = API_BASE + "/products";
export const API_BASE_CART = API_BASE + "/cart";
export const API_BASE_ORDERS = API_BASE + "/orders";
export const API_BASE_SUPPORT = API_BASE + "/support";
export const APP_NAME = "Deetech Computers";
