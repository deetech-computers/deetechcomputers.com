import { API_BASE_PRODUCTS, BASE_URL } from "./config";
import { requestJson } from "./http";

export const DEFAULT_STOREFRONT_CATEGORIES = [
  { slug: "laptops", label: "Laptops" },
  { slug: "monitors", label: "Monitors" },
  { slug: "printers", label: "Printers" },
  { slug: "accessories", label: "Accessories" },
  { slug: "phones", label: "Phones" },
  { slug: "storage", label: "Storage" },
  { slug: "others", label: "Others" },
];

export function normalizeProductsPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  return [];
}

export function resolveProductImage(src) {
  if (!src) return "";
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;
  if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
    return `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
  }
  return src;
}

export function getProductStock(product) {
  return Number(
    product?.countInStock ??
      product?.stock_quantity ??
      product?.stock ??
      0
  );
}

export function canonicalCategory(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return "all";
  if (input.startsWith("laptop")) return "laptops";
  if (input.startsWith("phone")) return "phones";
  if (input.startsWith("monitor")) return "monitors";
  if (input.startsWith("access")) return "accessories";
  if (input.startsWith("stor")) return "storage";
  if (input.startsWith("print")) return "printers";
  if (input.startsWith("other")) return "others";
  return input;
}

export function formatCategoryLabel(value) {
  const input = String(value || "").trim();
  if (!input) return "General";
  return input
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function deriveCategories(products) {
  const categoryMap = new Map(
    DEFAULT_STOREFRONT_CATEGORIES.map((item) => [
      item.slug,
      {
        slug: item.slug,
        label: item.label,
        count: 0,
        image: "",
        product: null,
      },
    ])
  );

  for (const product of products || []) {
    const rawCategory = product?.category || "";
    const slug = canonicalCategory(rawCategory);
    if (!slug || slug === "all") continue;
    if (!categoryMap.has(slug)) {
      categoryMap.set(slug, {
        slug,
        label: formatCategoryLabel(rawCategory || slug),
        count: 0,
        image: resolveProductImage(product?.images?.[0] || product?.image),
        product: product || null,
      });
    }
    const current = categoryMap.get(slug);
    current.count += 1;
    if (!current.image) {
      current.image = resolveProductImage(product?.images?.[0] || product?.image);
    }
  }

  return [...categoryMap.values()].sort((a, b) => {
    const defaultIndexA = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === a.slug);
    const defaultIndexB = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === b.slug);

    if (defaultIndexA !== -1 && defaultIndexB !== -1) return defaultIndexA - defaultIndexB;
    if (defaultIndexA !== -1) return -1;
    if (defaultIndexB !== -1) return 1;
    return a.label.localeCompare(b.label);
  });
}

export async function fetchProducts() {
  const payload = await requestJson(API_BASE_PRODUCTS);
  return normalizeProductsPayload(payload);
}

export async function fetchProductById(id) {
  return requestJson(`${API_BASE_PRODUCTS}/${encodeURIComponent(id)}`);
}

export function pickFeaturedProducts(products, count = 6) {
  return [...(products || [])]
    .sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0))
    .slice(0, count);
}
