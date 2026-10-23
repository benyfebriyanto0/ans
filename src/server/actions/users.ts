"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { passwordChangeSchema, userCreateSchema, type ActionResult } from "@/lib/validations";
import { fromUnknownError, fromZodError, idSchema } from "../action-utils";

export async function createAdminUser(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = userCreateSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  try {
    const { name, email, password } = parsed.data;
    await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
    revalidatePath("/admin/pengguna");
    return { ok: true, message: "Akun admin dibuat." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function deleteAdminUser(rawId: number): Promise<ActionResult> {
  const me = await requireAdmin();
  const id = idSchema.parse(rawId);
  if (id === me.id) return { ok: false, error: "Anda tidak dapat menghapus akun sendiri." };
  try {
    const total = await db.user.count();
    if (total <= 1) return { ok: false, error: "Minimal harus ada satu akun admin." };
    await db.user.delete({ where: { id } });
    revalidatePath("/admin/pengguna");
    return { ok: true, message: "Akun admin dihapus." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function changeOwnPassword(input: unknown): Promise<ActionResult> {
  const me = await requireAdmin();
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  try {
    const user = await db.user.findUnique({ where: { id: me.id } });
    if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
      return {
        ok: false,
        error: "Password saat ini salah.",
        fieldErrors: { currentPassword: ["Password saat ini salah"] },
      };
    }
    await db.user.update({
      where: { id: me.id },
      data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
    });
    return { ok: true, message: "Password berhasil diganti." };
  } catch (e) {
    return fromUnknownError(e);
  }
}

export async function resetAdminPassword(rawId: number, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const id = idSchema.parse(rawId);
  const parsed = userCreateSchema.shape.password.safeParse((input as { password?: string })?.password);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Password tidak valid" };
  try {
    await db.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(parsed.data, 12) } });
    return { ok: true, message: "Password akun diperbarui." };
  } catch (e) {
    return fromUnknownError(e);
  }
}
