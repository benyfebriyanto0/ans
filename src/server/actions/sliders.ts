"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import { sliderSchema, type ActionResult, type SliderInput } from "@/lib/validations";
import { destroyImage, ROOT_FOLDER, verifyUploadedAsset } from "@/lib/cloudinary";
import { fromUnknownError, fromZodError, idSchema, idsSchema } from "../action-utils";

function refresh() {
  revalidatePublic();
  revalidatePath("/admin/slider");
}

export async function saveSlider(id: number | null, input: SliderInput): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const parsed = sliderSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;
  try {
    const existing = id ? await db.slider.findUnique({ where: { id } }) : null;
    if (id && !existing) return { ok: false, error: "Slider tidak ditemukan." };
    if (data.imagePublicId !== existing?.imagePublicId) {
      const v = await verifyUploadedAsset(
        { publicId: data.imagePublicId, url: data.imageUrl },
        `${ROOT_FOLDER}/sliders`,
      );
      data.imageUrl = v.url;
    }
    if (!id) {
      const max = await db.slider.aggregate({ _max: { sortOrder: true } });
      if (!data.sortOrder) data.sortOrder = (max._max.sortOrder ?? 0) + 1;
    }
    const saved = id ? await db.slider.update({ where: { id }, data }) : await db.slider.create({ data });
    if (existing && existing.imagePublicId !== saved.imagePublicId) await destroyImage(existing.imagePublicId);
    refresh();
    return { ok: true, message: "Slider tersimpan.", data: { id: saved.id } };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteSlider(rawId: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    const s = await db.slider.delete({ where: { id: idSchema.parse(rawId) } });
    await destroyImage(s.imagePublicId);
    refresh();
    return { ok: true, message: "Slider dihapus." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function toggleSlider(rawId: number, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.slider.update({ where: { id: idSchema.parse(rawId) }, data: { isActive: Boolean(isActive) } });
    refresh();
    return { ok: true, message: isActive ? "Slider diaktifkan." : "Slider dinonaktifkan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function reorderSliders(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  const ids = idsSchema.parse(rawIds);
  try {
    await db.$transaction(ids.map((id, i) => db.slider.update({ where: { id }, data: { sortOrder: i + 1 } })));
    refresh();
    return { ok: true, message: "Urutan slider tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}
