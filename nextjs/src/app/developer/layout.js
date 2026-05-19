import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Developer",
  path: "/developer",
  description: "Meet the developer behind DEETECH and explore his background, skills, and web development capabilities.",
});

export default function DeveloperLayout({ children }) {
  return children;
}
