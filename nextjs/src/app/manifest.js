import { APP_NAME } from "@/lib/config";

export default function manifest() {
  return {
    name: APP_NAME,
    short_name: "Deetech",
    description: "Deetech Computers online storefront.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
