"use client";

import { UPLOAD_RULES } from "./cloudinary-url";

export type UploadResult = { publicId: string; url: string; width: number; height: number; bytes: number };

type Signature = {
  timestamp: number;
  folder: string;
  allowed_formats: string;
  signature: string;
  apiKey: string;
  cloudName: string;
};

export function validateFile(file: File): string | null {
  if (!(UPLOAD_RULES.accept as readonly string[]).includes(file.type))
    return `${file.name}: format harus JPG, PNG, atau WebP.`;
  if (file.size > UPLOAD_RULES.maxBytes) return `${file.name}: ukuran melebihi 5 MB.`;
  return null;
}

/**
 * Kompres ringan di browser: perkecil sisi terpanjang ke 2400 px bila lebih besar.
 * Menghemat kuota Cloudinary & mempercepat upload. File kecil dibiarkan apa adanya.
 */
export async function compressImage(file: File, maxSide = 2400, quality = 0.85): Promise<File> {
  if (file.size < 600 * 1024 || typeof createImageBitmap === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 2 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const type = file.type === "image/png" ? "image/webp" : file.type;
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, type, quality));
    if (!blob || blob.size >= file.size) return file;
    const ext = type === "image/webp" ? "webp" : "jpg";
    return new File([blob], file.name.replace(/\.\w+$/, `.${ext}`), { type });
  } catch {
    return file;
  }
}

export async function getSignature(folder: string): Promise<Signature> {
  const res = await fetch("/api/admin/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Gagal mendapatkan izin upload.");
  return json as Signature;
}

export function uploadToCloudinary(
  file: File,
  sig: Signature,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);
    form.append("allowed_formats", sig.allowed_formats);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const j = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ publicId: j.public_id, url: j.secure_url, width: j.width, height: j.height, bytes: j.bytes });
        } else reject(new Error(j?.error?.message || "Upload gagal."));
      } catch {
        reject(new Error("Respons Cloudinary tidak valid."));
      }
    };
    xhr.onerror = () => reject(new Error("Koneksi upload terputus."));
    xhr.send(form);
  });
}

/** Upload satu file (validasi → kompres → upload). */
export async function uploadSingle(file: File, folder: string, onProgress?: (pct: number) => void) {
  const err = validateFile(file);
  if (err) throw new Error(err);
  const sig = await getSignature(folder);
  return uploadToCloudinary(await compressImage(file), sig, onProgress);
}
