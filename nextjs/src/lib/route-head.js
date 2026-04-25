import { APP_NAME, SITE_URL } from "@/lib/config";

function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildRouteTitle(title) {
  return `${title} | ${APP_NAME}`;
}

export function buildCanonicalUrl(path) {
  const normalizedPath = normalizePath(path);
  return normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
}

export function makeStaticRouteHead({ title, path, description }) {
  const fullTitle = buildRouteTitle(title);
  const canonicalUrl = buildCanonicalUrl(path);

  return function Head() {
    return (
      <>
        <title>{fullTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={fullTitle} />
        {description ? <meta name="description" content={description} /> : null}
        {description ? <meta property="og:description" content={description} /> : null}
        {description ? <meta name="twitter:description" content={description} /> : null}
      </>
    );
  };
}
