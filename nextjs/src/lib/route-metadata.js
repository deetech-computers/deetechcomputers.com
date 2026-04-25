import { APP_NAME, SITE_URL } from "@/lib/config";

function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildCanonical(path = "/") {
  const normalized = normalizePath(path);
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

export function createStaticRouteMetadata({ title, path, description }) {
  const canonical = buildCanonical(path);
  const pageTitle = `${title} | ${APP_NAME}`;
  const desc = description || `Explore ${title.toLowerCase()} at ${APP_NAME}.`;
  const socialImage = {
    url: `${SITE_URL}/logo.png`,
    width: 1200,
    height: 630,
    alt: APP_NAME,
  };

  return {
    title,
    description: desc,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description: desc,
      url: canonical,
      siteName: APP_NAME,
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@deetechcomputers",
      creator: "@deetechcomputers",
      title: pageTitle,
      description: desc,
      images: [socialImage],
    },
  };
}
