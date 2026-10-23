"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import { captionSchema, uploadedAssetSchema, type ActionResult } from "@/lib/validations";
import { destroyImage, destroyImages, ROOT_FOLDER, verifyUploadedAsset } from "@/lib/cloudinary";
import { UPLOAD_RULES } from "@/lib/cloudinary-url";
import { fromUnknownError, idSchema, idsSchema } from "../action-utils";

const assetsSchema = z.array(uploadedAssetSchema).min(1).max(UPLOAD_RULES.maxFiles);

function refresh() {
  revalidatePublic();
  revalidatePath("/admin", "layout");
}

/** Simpan hasil multi-upload (maks 20) ke galeri bidang usaha. */
export async function addGalleryPhotos(
  rawUnitId: number,
  rawAssets: z.input<typeof assetsSchema>,
  captions?: string[],
): Promise<ActionResult<{ count: number }>> {
  await requireAdmin();
  const unitId = idSchema.parse(rawUnitId);
  const parsed = assetsSchema.safeParse(rawAssets);
  if (!parsed.success) return { ok: false, error: `Maksimal ${UPLOAD_RULES.maxFiles} foto per upload.` };

  try {
    const unit = await db.businessUnit.findUnique({ where: { id: unitId } });
    if (!unit) return { ok: false, error: "Bidang usaha tidak ditemukan." };
    const folder = `${ROOT_FOLDER}/gallery/${unit.slug}`;

    const verified = [];
    const rejected: string[] = [];
    for (const asset of parsed.data) {
      try {
        verified.push(await verifyUploadedAsset(asset, folder));
      } catch {
        rejected.push(asset.publicId);
      }
    }
    const max = await db.galleryPhoto.aggregate({ where: { businessUnitId: unitId }, _max: { sortOrder: true } });
    let order = max._max.sortOrder ?? 0;
    await db.galleryPhoto.createMany({
      data: verified.map((v, i) => ({
        businessUnitId: unitId,
        imagePublicId: v.publicId,
        imageUrl: v.url,
        width: v.width,
        height: v.height,
        caption: captions?.[i] ? captionSchema.parse(captions[i]) || null : null,
        sortOrder: ++order,
      })),
    });
    refresh();
    return {
      ok: true,
      message: `${verified.length} foto ditambahkan${rejected.length ? `, ${rejected.length} ditolak (format/ukuran)` : ""}.`,
      data: { count: verified.length },
    };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function updateGalleryCaption(rawId: number, caption: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.galleryPhoto.update({
      where: { id: idSchema.parse(rawId) },
      data: { caption: captionSchema.parse(caption) || null },
    });
    refresh();
    return { ok: true, message: "Caption tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function toggleGalleryPhoto(rawId: number, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.galleryPhoto.update({ where: { id: idSchema.parse(rawId) }, data: { isActive: Boolean(isActive) } });
    refresh();
    return { ok: true, message: isActive ? "Foto ditampilkan." : "Foto disembunyikan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function reorderGalleryPhotos(rawUnitId: number, rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const unitId = idSchema.parse(rawUnitId);
  const ids = idsSchema.parse(rawIds);
  try {
    await db.$transaction(
      ids.map((id, i) =>
        db.galleryPhoto.updateMany({ where: { id, businessUnitId: unitId }, data: { sortOrder: i + 1 } }),
      ),
    );
    refresh();
    return { ok: true, message: "Urutan foto tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteGalleryPhotos(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const ids = idsSchema.min(1).parse(rawIds);
  try {
    const photos = await db.galleryPhoto.findMany({ where: { id: { in: ids } }, select: { imagePublicId: true } });
    await db.galleryPhoto.deleteMany({ where: { id: { in: ids } } });
    if (photos.length === 1) await destroyImage(photos[0].imagePublicId);
    else await destroyImages(photos.map((p) => p.imagePublicId));
    refresh();
    return { ok: true, message: `${photos.length} foto dihapus.` };
  } catch (e) {
    return fromUnknownError(e);
  }
}
