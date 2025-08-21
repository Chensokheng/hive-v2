import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hive Online Delivery",
    short_name: "Hive",
    description: "Fast and reliable food delivery service",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f6ff",
    theme_color: "#f2f6ff",
    icons: [
      {
        src: "/512.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
