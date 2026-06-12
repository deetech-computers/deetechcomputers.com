import AppProviders from "@/components/providers/app-providers";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import RouteScrollTop from "@/components/navigation/route-scroll-top";
import GlobalStyles from "@/components/styles/global-styles";
import AffiliateLinkCapture from "@/components/tracking/affiliate-link-capture";
import UserBehaviorTracker from "@/components/tracking/user-behavior-tracker";
import { APP_NAME, SITE_URL, buildSiteUrl } from "@/lib/config";
import { Poppins } from "next/font/google";
import { Suspense } from "react";

const defaultOgImage = {
  url: buildSiteUrl("/logo.png"),
  width: 1200,
  height: 630,
  alt: "Deetech Computers",
};
const siteIconHref = "/favicon-removebg-preview-mobile.png?v=deetech-20260610a";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Standalone Next.js storefront for Deetech Computers.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: siteIconHref, type: "image/png", sizes: "96x96" },
    ],
    shortcut: [{ url: siteIconHref, type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: APP_NAME,
    description: "Standalone Next.js storefront for Deetech Computers.",
    url: buildSiteUrl("/"),
    siteName: APP_NAME,
    type: "website",
    locale: "en_GH",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: "Standalone Next.js storefront for Deetech Computers.",
    site: "@deetechcomputers",
    creator: "@deetechcomputers",
    images: [
      {
        url: defaultOgImage.url,
        alt: defaultOgImage.alt,
        width: defaultOgImage.width,
        height: defaultOgImage.height,
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GlobalStyles />
        <link rel="icon" href={siteIconHref} type="image/png" />
        <link rel="shortcut icon" href={siteIconHref} type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={poppins.className}>
        <AppProviders>
          <div className="app-shell">
            <Suspense fallback={null}>
              <AffiliateLinkCapture />
            </Suspense>
            <Suspense fallback={null}>
              <UserBehaviorTracker />
            </Suspense>
            <strong className="sr-only">
              Deetech Computers provides trusted laptops, phones, monitors, and accessories in Ghana.
            </strong>
            <SiteHeader />
            <RouteScrollTop />
            <div className="app-content">{children}</div>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
