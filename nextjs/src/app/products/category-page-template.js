import ProductsPageClient from "@/components/products/products-page-client";
import { APP_NAME, SITE_URL } from "@/lib/config";
import { getStorefrontCategoryLabel } from "@/lib/products";

function getSearchParamValue(searchParams, key) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export function generateCategoryPageMetadata(category, searchParams) {
  const canonical = `/products/${category}`;
  const canonicalUrl = `${SITE_URL}${canonical}`;
  const search = getSearchParamValue(searchParams, "q").trim();
  const brand = String(getSearchParamValue(searchParams, "brand") || "").trim();
  const hasSearch = Boolean(search);
  const hasBrandFacet = Boolean(brand && brand.toLowerCase() !== "all");
  const categoryLabel = getStorefrontCategoryLabel(category);

  const titleParts = [categoryLabel];
  if (search) titleParts.unshift(`Search: ${search}`);
  if (brand && brand.toLowerCase() !== "all") titleParts.push(brand);

  const pageTitle = `${titleParts.join(" - ")} Shop`;
  const fullTitle = `${pageTitle} | ${APP_NAME}`;
  const description = search
    ? `Search results for "${search}" in ${categoryLabel} at Deetech Computers.`
    : `Browse ${categoryLabel} products at Deetech Computers.`;
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

export function CategoryPage({ category, searchParams }) {
  const brand = String(getSearchParamValue(searchParams, "brand") || "all").trim().toLowerCase() || "all";
  const promotionParam =
    getSearchParamValue(searchParams, "promotion") || getSearchParamValue(searchParams, "section");
  const promotion = String(promotionParam || "all").trim().toLowerCase() || "all";
  const source = String(getSearchParamValue(searchParams, "source") || "").trim().toLowerCase();
  const search = getSearchParamValue(searchParams, "q");

  return (
    <ProductsPageClient
      initialFilters={{
        search,
        category,
        brand,
        promotion,
        source,
      }}
    />
  );
}
