// Utilitas URL Cloudinary — aman dipakai di client maupun server.

type Opts = { width?: number; height?: number; crop?: "limit" | "fill" | "fit" | "thumb"; quality?: string };

/** Sisipkan transformasi Cloudinary (format & kualitas otomatis) ke URL delivery. */
export function cldUrl(url: string | null | undefined, opts: Opts = {}) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const t = [
    "f_auto",
    `q_${opts.quality ?? "auto"}`,
    `c_${opts.crop ?? "limit"}`,
    opts.width ? `w_${opts.width}` : "",
    opts.height ? `h_${opts.height}` : "",
    opts.crop === "fill" || opts.crop === "thumb" ? "g_auto" : "",
  ]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}

/** Loader next/image: biarkan Cloudinary yang melakukan resize & konversi WebP/AVIF. */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return cldUrl(src, { width, quality: quality ? String(quality) : "auto" });
}

export const UPLOAD_RULES = {
  maxBytes: 5 * 1024 * 1024,
  maxFiles: 20,
  accept: ["image/jpeg", "image/png", "image/webp"],
  formats: ["jpg", "jpeg", "png", "webp"],
} as const;
