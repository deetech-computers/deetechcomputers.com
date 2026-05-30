import { canonicalCategory } from "./products";

export function buildBannerCategoryLink(category = "", brand = "") {
  const normalizedCategory = canonicalCategory(category);
  const normalizedBrand = String(brand || "").trim().toLowerCase();
  if (!normalizedCategory || normalizedCategory === "all") return "";

  const params = new URLSearchParams({
    category: normalizedCategory,
    ...(normalizedBrand && normalizedBrand !== "all" ? { brand: normalizedBrand } : {}),
  });

  return `/products?${params.toString()}#shop-results`;
}

export function normalizeProductsBannerLink(link = "") {
  const rawLink = String(link || "").trim();
  if (!rawLink) return "";

  try {
    const current = new URL(rawLink, "https://deetech.local");
    const parts = current.pathname.split("/").filter(Boolean);
    if (parts[0] !== "products") return rawLink;

    const linkedCategory = canonicalCategory(parts[1] || current.searchParams.get("category") || "all");
    if (!linkedCategory || linkedCategory === "all") return rawLink;

    const brand = String(current.searchParams.get("brand") || "").trim().toLowerCase();
    return buildBannerCategoryLink(linkedCategory, brand);
  } catch {
    return rawLink;
  }
}
