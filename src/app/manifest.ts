import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ayesha Umera",
    short_name: "Ayesha",
    description: "Portfolio of Ayesha Umera, AI and ML student.",
    start_url: "/",
    display: "standalone",
    background_color: "#ececec",
    theme_color: "#ececec",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
