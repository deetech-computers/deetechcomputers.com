import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Developer",
  path: "/developer",
  description: "About the DEETECH COMPUTERS platform and a link to the developer's portfolio.",
});

export default function DeveloperLayout({ children }) {
  return children;
}
