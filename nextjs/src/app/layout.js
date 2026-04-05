import AppProviders from "@/components/providers/app-providers";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import GlobalStyles from "@/components/styles/global-styles";
import { APP_NAME, SITE_URL } from "@/lib/config";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: APP_NAME,
  description: "Standalone Next.js storefront for Deetech Computers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: APP_NAME,
    description: "Standalone Next.js storefront for Deetech Computers.",
    url: SITE_URL,
    siteName: APP_NAME,
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GlobalStyles />
        <AppProviders>
          <div className="app-shell">
            <SiteHeader />
            <div className="app-content">{children}</div>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
