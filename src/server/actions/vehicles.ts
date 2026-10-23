"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import {
  captionSchema,
  uploadedAssetSchema,
  vehicleSchema,
  type ActionResult,
  type VehicleInput,
} from "@/lib/validations";
import { destroyImage, destroyImages, ROOT_FOLDER, verifyUploadedAsset } from "@/lib/cloudinary";
import { UPLOAD_RULES } from "@/lib/cloudinary-url";
import { fromUnknownError, fromZodError, idSchema, idsSchema } from "../action-utils";

function refresh() {
  revalidatePublic();
  revalidatePath("/admin", "layout");
}

export async function saveVehicle(id: number | null, input: VehicleInput): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const parsed = vehicleSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  const { features, ...data } = parsed.data;
  try {
    const existing = id ? await db.vehicle.findUnique({ where: { id } }) : null;
    if (id && !existing) return { ok: false, error: "Armada tidak ditemukan." };
    if (data.coverImageId && data.coverImageUrl && data.coverImageId !== existing?.coverImageId) {
      const v = await verifyUploadedAsset(
        { publicId: data.coverImageId, url: data.coverImageUrl },
        `${ROOT_FOLDER}/covers`,
      );
      data.coverImageUrl = v.url;
    }
    const payload = { ...data, features: JSON.stringify(features) };
    const saved = id
      ? await db.vehicle.update({ where: { id }, data: payload })
      : await db.vehicle.create({ data: payload });
    if (existing?.coverImageId && existing.coverImageId !== saved.coverImageId)
      await destroyImage(existing.coverImageId);
    refresh();
    return { ok: true, message: "Data armada tersimpan.", data: { id: saved.id } };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteVehicle(rawId: number): Promise<ActionResult> {
  await requireAdmin();
  const id = idSchema.parse(rawId);
  try {
    const v = await db.vehicle.findUnique({ where: { id }, include: { photos: { select: { imagePublicId: true } } } });
    if (!v) return { ok: false, error: "Data tidak ditemukan." };
    await db.vehicle.delete({ where: { id } });
    await destroyImages([v.coverImageId, ...v.photos.map((p) => p.imagePublicId)]);
    refresh();
    return { ok: true, message: "Armada dihapus." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function toggleVehicle(rawId: number, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.vehicle.update({ where: { id: idSchema.parse(rawId) }, data: { isActive: Boolean(isActive) } });
    refresh();
    return { ok: true, message: isActive ? "Armada ditampilkan." : "Armada disembunyikan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function reorderVehicles(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const ids = idsSchema.parse(rawIds);
  try {
    await db.$transaction(ids.map((id, i) => db.vehicle.update({ where: { id }, data: { sortOrder: i + 1 } })));
    refresh();
    return { ok: true, message: "Urutan armada tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

// ===== Foto armada =====
const assetsSchema = z.array(uploadedAssetSchema).min(1).max(UPLOAD_RULES.maxFiles);

export async function addVehiclePhotos(
  rawVehicleId: number,
  rawAssets: z.input<typeof assetsSchema>,
): Promise<ActionResult<{ count: number }>> {
  await requireAdmin();
  const vehicleId = idSchema.parse(rawVehicleId);
  const parsed = assetsSchema.safeParse(rawAssets);
  if (!parsed.success) return { ok: false, error: `Maksimal ${UPLOAD_RULES.maxFiles} foto per upload.` };
  try {
    const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return { ok: false, error: "Armada tidak ditemukan." };
    const folder = `${ROOT_FOLDER}/fleet/${vehicle.slug}`;
    const verified = [];
    let rejected = 0;
    for (const a of parsed.data) {
      try {
        verified.push(await verifyUploadedAsset(a, folder));
      } catch {
        rejected++;
      }
    }
    const max = await db.vehiclePhoto.aggregate({ where: { vehicleId }, _max: { sortOrder: true } });
    let order = max._max.sortOrder ?? 0;
    await db.vehiclePhoto.createMany({
      data: verified.map((v) => ({
        vehicleId,
        imagePublicId: v.publicId,
        imageUrl: v.url,
        width: v.width,
        height: v.height,
        sortOrder: ++order,
      })),
    });
    refresh();
    return {
      ok: true,
      message: `${verified.length} foto ditambahkan${rejected ? `, ${rejected} ditolak` : ""}.`,
      data: { count: verified.length },
    };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function updateVehiclePhotoCaption(rawId: number, caption: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.vehiclePhoto.update({
      where: { id: idSchema.parse(rawId) },
      data: { caption: captionSchema.parse(caption) || null },
    });
    refresh();
    return { ok: true, message: "Caption tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function toggleVehiclePhoto(rawId: number, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.vehiclePhoto.update({ where: { id: idSchema.parse(rawId) }, data: { isActive: Boolean(isActive) } });
    refresh();
    return { ok: true, message: isActive ? "Foto ditampilkan." : "Foto disembunyikan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function reorderVehiclePhotos(rawVehicleId: number, rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const vehicleId = idSchema.parse(rawVehicleId);
  const ids = idsSchema.parse(rawIds);
  try {
    await db.$transaction(
      ids.map((id, i) => db.vehiclePhoto.updateMany({ where: { id, vehicleId }, data: { sortOrder: i + 1 } })),
    );
    refresh();
    return { ok: true, message: "Urutan foto tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteVehiclePhotos(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const ids = idsSchema.min(1).parse(rawIds);
  try {
    const photos = await db.vehiclePhoto.findMany({ where: { id: { in: ids } }, select: { imagePublicId: true } });
    await db.vehiclePhoto.deleteMany({ where: { id: { in: ids } } });
    await destroyImages(photos.map((p) => p.imagePublicId));
    refresh();
    return { ok: true, message: `${photos.length} foto dihapus.` };
  } catch (e) {
    return fromUnknownError(e);
  }
}
