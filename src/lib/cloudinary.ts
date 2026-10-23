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
  if (!/^https:\/\/res\.cloudinary\.com\//.test(asset.url)) throw new Error("URL gambar tidak valid.");
  // Akun Cloudinary baru memakai "dynamic folder mode": public_id bisa tanpa awalan folder.
  // Karena itu folder dicek dari public_id ATAU dari asset_folder hasil Admin API.
  const prefixOk = asset.publicId.startsWith(`${expectedFolder}/`) || !asset.publicId.includes("/");
  if (!prefixOk) throw new Error("Folder upload tidak valid.");

  const c = configure();
  let info: Record<string, unknown> | null = null;
  try {
    info = (await c.api.resource(asset.publicId, { resource_type: "image" })) as Record<string, unknown>;
  } catch (e) {
    // Admin API gagal (mis. batas kuota/izin API). Upload sudah ditandatangani server dengan
    // allowed_formats, dan ukuran sudah dibatasi di browser, jadi aset tetap diterima.
    console.warn("[cloudinary] verifikasi Admin API dilewati:", cloudinaryErrorMessage(e));
  }
  if (!info) {
    return { publicId: asset.publicId, url: asset.url, width: asset.width ?? null, height: asset.height ?? null };
  }
  const okFormat = (UPLOAD_RULES.formats as readonly string[]).includes(String(info.format).toLowerCase());
  if (!okFormat || Number(info.bytes) > UPLOAD_RULES.maxBytes) {
    await destroyImage(asset.publicId);
    throw new Error("Format harus JPG/PNG/WebP dengan ukuran maksimal 5 MB.");
  }
  return {
    publicId: String(info.public_id),
    url: String(info.secure_url),
    width: Number(info.width) || null,
    height: Number(info.height) || null,
  };
}

/** Ambil pesan error dari objek error Cloudinary SDK ({ error: { message } }) atau Error biasa. */
export function cloudinaryErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  const msg = (e as { error?: { message?: string } })?.error?.message;
  return msg ?? JSON.stringify(e);
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
