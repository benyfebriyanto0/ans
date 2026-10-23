"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import type { ActionResult } from "@/lib/validations";
import { fromUnknownError, idSchema, idsSchema } from "../action-utils";

export async function setMessageRead(rawId: number, isRead: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.contactMessage.update({ where: { id: idSchema.parse(rawId) }, data: { isRead: Boolean(isRead) } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function markAllMessagesRead(): Promise<ActionResult> {
  await requireAdmin();
  await db.contactMessage.updateMany({ where: { isRead: false }, data: { isRead: true } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Semua pesan ditandai sudah dibaca." };
}

export async function deleteMessages(rawIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  try {
    const ids = idsSchema.min(1).parse(rawIds);
    const r = await db.contactMessage.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `${r.count} pesan dihapus.` };
  } catch (e) {
    return fromUnknownError(e);
  }
}
