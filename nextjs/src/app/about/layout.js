import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "About Us",
  path: "/about",
  description: "Learn about Deetech Computers, our mission, values, and service coverage.",
});

export default function AboutLayout({ children }) {
  return children;
}
