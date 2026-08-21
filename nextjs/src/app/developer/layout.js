import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Developer",
  path: "/developer",
  description: "Meet the developer behind DEETECH COMPUTERS and see what the platform does.",
});

export default function DeveloperLayout({ children }) {
  return children;
}
