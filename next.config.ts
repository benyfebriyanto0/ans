import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Halaman publik memakai model caching ISR klasik (revalidate + revalidatePath)
  // sehingga kompatibel penuh dengan runtime Netlify.
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "cloudinary"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
