import ProductsPageClient from "@/components/products/products-page-client";
import { APP_NAME, SITE_URL } from "@/lib/config";
import { redirect } from "next/navigation";
import { buildProductsHref, canonicalCategory, formatCategoryLabel, getStorefrontCategoryLabel, isStorefrontCategory } from "@/lib/products";

function getSearchParamValue(searchParams, key) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function getCatalogFilters(searchParams) {
  const promotionParam =
    getSearchParamValue(searchParams, "promotion") || getSearchParamValue(searchParams, "section");
  return {
    search: getSearchParamValue(searchParams, "q"),
    category: canonicalCategory(getSearchParamValue(searchParams, "category") || "all"),
    brand: String(getSearchParamValue(searchParams, "brand") || "all").trim().toLowerCase() || "all",
    promotion: String(promotionParam || "all").trim().toLowerCase() || "all",
    source: String(getSearchParamValue(searchParams, "source") || "").trim().toLowerCase(),
  };
}

function maybeRedirectLegacyCategory(searchParams) {
  const search = getSearchParamValue(searchParams, "q").trim();
  if (search) return;

  const rawCategory = getSearchParamValue(searchParams, "category");
  const category = canonicalCategory(rawCategory || "all");
  if (!category || category === "all" || !isStorefrontCategory(category)) return;

  const brand = String(getSearchParamValue(searchParams, "brand") || "").trim().toLowerCase();
  const source = String(getSearchParamValue(searchParams, "source") || "").trim().toLowerCase();
  const nextUrl = buildProductsHref({
    category,
    brand: brand && brand !== "all" ? brand : "",
    source,
  });
  redirect(nextUrl);
}

function buildCanonicalUrl(searchParams) {
  const search = getSearchParamValue(searchParams, "q").trim();
  const category = canonicalCategory(getSearchParamValue(searchParams, "category") || "all");

  if (search) return "/products";

  if (category && category !== "all" && isStorefrontCategory(category)) {
    return `/products/${category}`;
  }

  return "/products";
}

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const canonical = buildCanonicalUrl(resolvedSearchParams);
  const canonicalUrl = `${SITE_URL}${canonical}`;
  const search = getSearchParamValue(resolvedSearchParams, "q").trim();
  const category = canonicalCategory(getSearchParamValue(resolvedSearchParams, "category") || "all");
  const brand = String(getSearchParamValue(resolvedSearchParams, "brand") || "").trim();
  const hasSearch = Boolean(search);
  const hasBrandFacet = Boolean(brand && brand.toLowerCase() !== "all");
  const categoryLabel = getStorefrontCategoryLabel(category);
  const titleParts = [];

  if (search) titleParts.push(`Search: ${search}`);
  if (category && category !== "all") titleParts.push(categoryLabel);
  if (brand && brand.toLowerCase() !== "all") titleParts.push(brand);

  const pageTitle = titleParts.length ? `${titleParts.join(" - ")} Shop` : "Shop";
  const fullTitle = `${pageTitle} | ${APP_NAME}`;
  const description = search
    ? `Search results for "${search}" in the Deetech Computers shop.`
    : category && category !== "all"
      ? `Browse ${categoryLabel} products at Deetech Computers.`
      : "Browse laptops, phones, monitors, accessories, and more at Deetech Computers.";
  const ogImage = {
    url: `${SITE_URL}/logo.png`,
    width: 1200,
    height: 630,
    alt: APP_NAME,
  };

  return {
    title: pageTitle,
    alternates: {
      canonical,
    },
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@deetechcomputers",
      creator: "@deetechcomputers",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: hasSearch || hasBrandFacet ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  maybeRedirectLegacyCategory(resolvedSearchParams);
  return <ProductsPageClient initialFilters={getCatalogFilters(resolvedSearchParams)} />;
}
