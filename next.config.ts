import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  cacheComponents: false,
  serverExternalPackages: ["playwright-core"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(pages
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/models/:file",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
              source: "/draco/:file",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
              source: "/:file(livery-.*\\.webp)",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
              source: "/hero-stage.webp",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
      }),
  images: {
    unoptimized: pages,
    remotePatterns: [
      { protocol: "https", hostname: "ir.ozone.ru" },
      { protocol: "https", hostname: "cdn1.ozonusercontent.com" },
    ],
  },
};

export default nextConfig;
