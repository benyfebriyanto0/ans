"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import { sanitizeRichText } from "@/lib/sanitize";
import { businessUnitSchema, type ActionResult, type BusinessUnitInput } from "@/lib/validations";
import { destroyImage, destroyImages, ROOT_FOLDER, verifyUploadedAsset } from "@/lib/cloudinary";
import { fromUnknownError, fromZodError, idSchema, idsSchema } from "../action-utils";

export async function saveBusinessUnit(
  id: number | null,
  input: BusinessUnitInput,
): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const parsed = businessUnitSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  const { services, description, ...data } = parsed.data;

  try {
    const existing = id ? await db.businessUnit.findUnique({ where: { id } }) : null;
    if (id && !existing) return { ok: false, error: "Bidang usaha tidak ditemukan." };

    // Validasi gambar sampul baru di server
    if (data.coverImageId && data.coverImageUrl && data.coverImageId !== existing?.coverImageId) {
      const v = await verifyUploadedAsset(
        { publicId: data.coverImageId, url: data.coverImageUrl },
        `${ROOT_FOLDER}/covers`,
      );
      data.coverImageUrl = v.url;
    }

    const payload = { ...data, description: sanitizeRichText(description), services: JSON.stringify(services) };
    const saved = id
      ? await db.businessUnit.update({ where: { id }, data: payload })
      : await db.businessUnit.create({ data: payload });

    if (existing?.coverImageId && existing.coverImageId !== saved.coverImageId)
      await destroyImage(existing.coverImageId);

    revalidatePublic();
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Bidang usaha tersimpan.", data: { id: saved.id } };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteBusinessUnit(rawId: number): Promise<ActionResult> {
  await requireAdmin();
  const id = idSchema.parse(rawId);
  try {
    const unit = await db.businessUnit.findUnique({
      where: { id },
      include: { photos: { select: { imagePublicId: true } } },
    });
    if (!unit) return { ok: false, error: "Data tidak ditemukan." };
    await db.businessUnit.delete({ where: { id } }); // foto galeri ikut terhapus (cascade)
    await destroyImages([unit.coverImageId, ...unit.photos.map((p) => p.imagePublicId)]);
    revalidatePublic();
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Bidang usaha dihapus." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function toggleBusinessUnit(rawId: number, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.businessUnit.update({ where: { id: idSchema.parse(rawId) }, data: { isActive: Boolean(isActive) } });
    revalidatePublic();
    return { ok: true, message: isActive ? "Diaktifkan." : "Dinonaktifkan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function reorderBusinessUnits(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const ids = idsSchema.parse(rawIds);
  try {
    await db.$transaction(ids.map((id, i) => db.businessUnit.update({ where: { id }, data: { sortOrder: i + 1 } })));
    revalidatePublic();
    return { ok: true, message: "Urutan tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}
