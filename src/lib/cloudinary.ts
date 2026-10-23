import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { UPLOAD_RULES } from "./cloudinary-url";

export const ROOT_FOLDER = process.env.CLOUDINARY_ROOT_FOLDER || "arsindo";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

/** Folder yang diizinkan untuk upload dari panel admin. */
export function isAllowedFolder(folder: string) {
  const r = ROOT_FOLDER.replace(/[^a-zA-Z0-9_-]/g, "");
  return new RegExp(`^${r}/(gallery|fleet)/[a-z0-9-]{1,120}$|^${r}/(sliders|covers|brand)$`).test(folder);
}

/** Membuat signature untuk signed upload langsung dari browser ke Cloudinary. */
export function signUpload(folder: string) {
  const c = configure();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder, allowed_formats: "jpg,jpeg,png,webp" };
  const signature = c.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return {
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

export type UploadedAsset = {
  publicId: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

/**
 * Validasi sisi server untuk aset yang baru di-upload: folder, format, dan ukuran (maks 5 MB).
 * Aset yang tidak valid langsung dihapus dari Cloudinary.
 */
export async function verifyUploadedAsset(asset: UploadedAsset, expectedFolder: string) {
  if (!asset.publicId.startsWith(`${expectedFolder}/`)) throw new Error("Folder upload tidak valid.");
  if (!/^https:\/\/res\.cloudinary\.com\//.test(asset.url)) throw new Error("URL gambar tidak valid.");
  const c = configure();
  const info = await c.api.resource(asset.publicId, { resource_type: "image" });
  const okFormat = (UPLOAD_RULES.formats as readonly string[]).includes(String(info.format).toLowerCase());
  if (!okFormat || info.bytes > UPLOAD_RULES.maxBytes) {
    await destroyImage(asset.publicId);
    throw new Error("Format harus JPG/PNG/WebP dengan ukuran maksimal 5 MB.");
  }
  return {
    publicId: info.public_id as string,
    url: info.secure_url as string,
    width: info.width as number,
    height: info.height as number,
  };
}

export async function destroyImage(publicId?: string | null) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await configure().uploader.destroy(publicId, { invalidate: true });
  } catch (e) {
    console.error("[cloudinary] gagal menghapus", publicId, e);
  }
}

export async function destroyImages(publicIds: (string | null | undefined)[]) {
  const ids = publicIds.filter((x): x is string => Boolean(x));
  if (!ids.length || !isCloudinaryConfigured()) return;
  // delete_resources menerima maks 100 public_id per panggilan
  for (let i = 0; i < ids.length; i += 100) {
    try {
      await configure().api.delete_resources(ids.slice(i, i + 100), { invalidate: true });
    } catch (e) {
      console.error("[cloudinary] gagal menghapus batch", e);
    }
  }
}
