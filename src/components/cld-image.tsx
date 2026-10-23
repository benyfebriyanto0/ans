"use client";

import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary-url";

/** next/image dengan loader Cloudinary (resize + WebP/AVIF otomatis via URL transformation). */
export function CldImage(props: Omit<ImageProps, "loader">) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image loader={cloudinaryLoader} {...props} />;
}
