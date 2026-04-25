import { SITE_URL } from "@/lib/config";

const staticRoutes = [
  "",
  "/products",
  "/products/laptops",
  "/products/phones",
  "/products/monitors",
  "/products/accessories",
  "/products/storage",
  "/products/printers",
  "/products/others",
  "/about",
  "/contact",
  "/faq",
  "/warranty",
  "/delivery-policy",
  "/return-refund",
  "/payment-policy",
  "/privacy-policy",
  "/terms-of-use",
  "/affiliates",
  "/login",
  "/register",
];

export default function sitemap() {
  const now = new Date();

  return staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/products") ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/products") ? 0.9 : 0.7,
  }));
}
