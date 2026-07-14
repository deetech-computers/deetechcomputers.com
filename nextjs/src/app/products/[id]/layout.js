import { API_ORIGIN, APP_NAME, SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }) {
  const { id } = await params;
  let product = null;
  try {
    const res = await fetch(`${API_ORIGIN}/api/products/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) product = await res.json();
  } catch {}

  if (!product?.name) return { title: "Product" };

  const name = String(product.name || "").trim();
  const rawDesc = String(product.shortDescription || product.description || "").trim();
  const desc =
    rawDesc.length > 160
      ? rawDesc.slice(0, 157) + "…"
      : rawDesc || `${name} — available at ${APP_NAME}.`;
  const rawImage =
    product.image || (Array.isArray(product.images) ? product.images[0] : null) || "";
  const imageUrl = rawImage.startsWith("http")
    ? rawImage
    : rawImage
      ? `${API_ORIGIN}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : "";

  return {
    title: name,
    description: desc,
    openGraph: {
      title: `${name} | ${APP_NAME}`,
      description: desc,
      url: `${SITE_URL}/products/${id}`,
      siteName: APP_NAME,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${APP_NAME}`,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
