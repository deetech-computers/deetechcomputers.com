import HomePageClient from "@/components/home/home-page-client";
import { APP_NAME, buildSiteUrl } from "@/lib/config";

const homeTitle = "Deetech Computers | Laptops, Phones, Monitors and Accessories in Ghana";
const homeDescription = "Shop trusted laptops, phones, monitors, accessories, and gadgets across Ghana.";
const socialImage = {
  url: buildSiteUrl("/logo.png"),
  width: 1200,
  height: 630,
  alt: APP_NAME,
};

export const metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: buildSiteUrl("/"),
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@deetechcomputers",
    creator: "@deetechcomputers",
    title: homeTitle,
    description: homeDescription,
    images: [socialImage],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
