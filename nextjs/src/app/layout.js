import AppProviders from "@/components/providers/app-providers";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import GlobalStyles from "@/components/styles/global-styles";
import "./globals.css";

export const metadata = {
  title: "Deetech Computers",
  description: "Standalone Next.js storefront for Deetech Computers.",
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
