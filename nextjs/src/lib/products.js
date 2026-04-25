import { API_BASE_PRODUCTS, BASE_URL } from "./config";
import { requestJson } from "./http";

export const DEFAULT_STOREFRONT_CATEGORIES = [
  { slug: "laptops", label: "Laptops & Desktops" },
  { slug: "monitors", label: "Monitors" },
  { slug: "printers", label: "Printers" },
  { slug: "accessories", label: "Accessories" },
  { slug: "phones", label: "Mobile Phones" },
  { slug: "storage", label: "Storage Devices" },
  { slug: "others", label: "Other Gadgets" },
];

export const STOREFRONT_CATEGORY_SLUGS = new Set(
  DEFAULT_STOREFRONT_CATEGORIES.map((item) => item.slug)
);

export const DEFAULT_CATEGORY_BRANDS = {
  laptops: ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "Microsoft", "Samsung", "Toshiba", "MSI", "Other"],
  phones: ["Apple", "Samsung", "Google", "Huawei", "Xiaomi", "Oppo", "Vivo", "Tecno", "Infinix", "Nokia", "Other"],
  monitors: ["Dell", "HP", "Samsung", "LG", "Acer", "Asus", "BenQ", "ViewSonic", "Philips", "AOC", "Other"],
  accessories: ["Logitech", "Microsoft", "Apple", "Samsung", "Anker", "JBL", "Sony", "Razer", "Corsair", "HyperX", "Other"],
  storage: ["Seagate", "Western Digital", "Samsung", "Toshiba", "Kingston", "SanDisk", "Crucial", "Transcend", "Other"],
  printers: ["HP", "Canon", "Epson", "Brother", "Xerox", "Lexmark", "Ricoh", "Kyocera", "Other"],
  others: ["Generic", "Unbranded", "Other", "Multiple"],
};

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

export function getProductPrice(product) {
  return Number(product?.price || 0);
}

export function getProductReviewCount(product) {
  const numericCount = Number(
    product?.numReviews ??
      product?.reviewCount ??
      product?.reviewsCount ??
      product?.totalReviews
  );

  if (Number.isFinite(numericCount) && numericCount > 0) {
    return numericCount;
  }

  if (Array.isArray(product?.reviews)) {
    return product.reviews.length;
  }

  return 0;
}

export function getProductRating(product) {
  const reviewCount = getProductReviewCount(product);

  if (reviewCount < 1) {
    return 0;
  }

  const explicitRating = Number(product?.averageRating ?? product?.rating);
  if (Number.isFinite(explicitRating) && explicitRating > 0) {
    return explicitRating;
  }

  if (Array.isArray(product?.reviews) && product.reviews.length) {
    const ratings = product.reviews
      .map((review) => Number(review?.rating))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (ratings.length) {
      return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
    }
  }

  return 0;
}

export function canonicalCategory(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return "all";
  if (input.includes("laptop") || input.includes("desktop") || input.includes("workstation")) return "laptops";
  if (input.includes("phone") || input.includes("mobile") || input.includes("smartphone")) return "phones";
  if (input.includes("monitor") || input.includes("display")) return "monitors";
  if (input.includes("accessor") || input.includes("peripheral")) return "accessories";
  if (input.includes("stor") || input.includes("ssd") || input.includes("drive") || input.includes("hdd")) return "storage";
  if (input.includes("print")) return "printers";
  if (input.includes("other") || input.includes("gadget")) return "others";
  return input;
}

export function isStorefrontCategory(value) {
  const slug = canonicalCategory(value);
  return STOREFRONT_CATEGORY_SLUGS.has(slug);
}

export function buildProductsCategoryPath(value) {
  const slug = canonicalCategory(value);
  if (!isStorefrontCategory(slug)) return "/products";
  return `/products/${slug}`;
}

export function buildProductsHref({ category = "all", brand = "", query = "", source = "", promotion = "", hash = "" } = {}) {
  const normalizedCategory = canonicalCategory(category);
  const search = String(query || "").trim();
  const normalizedBrand = String(brand || "").trim().toLowerCase();
  const normalizedSource = String(source || "").trim().toLowerCase();
  const normalizedPromotion = String(promotion || "").trim().toLowerCase();
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }
  if (normalizedBrand && normalizedBrand !== "all") {
    params.set("brand", normalizedBrand);
  }
  if (normalizedSource) {
    params.set("source", normalizedSource);
  }
  if (normalizedPromotion && normalizedPromotion !== "all") {
    params.set("promotion", normalizedPromotion);
  }

  const path =
    !search && isStorefrontCategory(normalizedCategory)
      ? buildProductsCategoryPath(normalizedCategory)
      : "/products";
  const queryString = params.toString();
  const hashSuffix = hash ? `#${String(hash).replace(/^#/, "")}` : "";

  return `${path}${queryString ? `?${queryString}` : ""}${hashSuffix}`;
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

export function getStorefrontCategoryLabel(value) {
  const slug = canonicalCategory(value);
  const matched = DEFAULT_STOREFRONT_CATEGORIES.find((item) => item.slug === slug);
  if (matched?.label) return matched.label;
  return formatCategoryLabel(slug);
}

export function deriveCategories(products, options = {}) {
  const includeEmpty = options?.includeEmpty !== false;
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

  const categories = [...categoryMap.values()]
    .filter((item) => includeEmpty || item.count > 0);

  return categories.sort((a, b) => {
    const defaultIndexA = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === a.slug);
    const defaultIndexB = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === b.slug);

    if (defaultIndexA !== -1 && defaultIndexB !== -1) return defaultIndexA - defaultIndexB;
    if (defaultIndexA !== -1) return -1;
    if (defaultIndexB !== -1) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function deriveCategoryBrandStats(products, options = {}) {
  const includeEmpty = options?.includeEmpty === true;
  const brandMap = new Map(
    Object.entries(DEFAULT_CATEGORY_BRANDS).map(([slug, brands]) => [
      slug,
      new Map(brands.map((brand, index) => [brand.toLowerCase(), { value: brand, order: index, count: 0 }])),
    ])
  );

  for (const product of products || []) {
    const slug = canonicalCategory(product?.category);
    const brand = String(product?.subCategory || product?.brand || "").trim();
    if (!slug || slug === "all" || !brand) continue;

    if (!brandMap.has(slug)) {
      brandMap.set(slug, new Map());
    }

    const categoryBrands = brandMap.get(slug);
    const key = brand.toLowerCase();
    const current = categoryBrands.get(key);
    if (current) {
      current.count += 1;
    } else {
      categoryBrands.set(key, {
        value: brand,
        order: Number.MAX_SAFE_INTEGER,
        count: 1,
      });
    }
  }

  return Object.fromEntries(
    [...brandMap.entries()]
      .map(([slug, brands]) => [
        slug,
        [...brands.values()]
          .filter((entry) => includeEmpty || entry.count > 0)
          .sort((a, b) => a.order - b.order || b.count - a.count || a.value.localeCompare(b.value)),
      ])
      .filter(([, brands]) => includeEmpty || brands.length > 0)
  );
}

export function deriveCategoryBrands(products, options = {}) {
  const stats = deriveCategoryBrandStats(products, options);
  return Object.fromEntries(
    Object.entries(stats).map(([slug, entries]) => [slug, entries.map((entry) => entry.value)])
  );
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
    .sort((a, b) => getProductRating(b) - getProductRating(a))
    .slice(0, count);
}
