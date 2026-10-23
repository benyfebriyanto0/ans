"use server";

import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { SETTING_KEYS, type SiteSettings } from "@/lib/settings";
import { settingsSchema, type ActionResult, type SettingsInput } from "@/lib/validations";
import { destroyImage, ROOT_FOLDER, verifyUploadedAsset } from "@/lib/cloudinary";
import { normalizeWhatsapp } from "@/lib/utils";
import { fromUnknownError, fromZodError } from "../action-utils";

export async function saveSettings(input: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  const data = parsed.data;
  try {
    const oldLogo = await db.setting.findUnique({ where: { key: SETTING_KEYS.logoPublicId } });
    if (data.logoPublicId && data.logoPublicId !== oldLogo?.value) {
      const v = await verifyUploadedAsset({ publicId: data.logoPublicId, url: data.logoUrl }, `${ROOT_FOLDER}/brand`);
      data.logoUrl = v.url;
    }
    if (!data.logoPublicId) data.logoUrl = "";
    data.whatsapp = normalizeWhatsapp(data.whatsapp);

    const entries = Object.entries(data).map(([k, v]) => ({
      key: SETTING_KEYS[k as keyof SiteSettings],
      value: Array.isArray(v) ? JSON.stringify(v) : String(v ?? ""),
    }));
    // Satu query (INSERT ... ON DUPLICATE KEY UPDATE) agar cepat walau database jauh dari server.
    const now = new Date();
    await db.$executeRaw`
      INSERT INTO settings (\`key\`, \`value\`, created_at, updated_at)
      VALUES ${Prisma.join(entries.map((e) => Prisma.sql`(${e.key}, ${e.value}, ${now}, ${now})`))}
      ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = VALUES(updated_at)`;
    if (oldLogo?.value && oldLogo.value !== data.logoPublicId) await destroyImage(oldLogo.value);
    revalidatePublic();
    return { ok: true, message: "Profil perusahaan tersimpan." };
  } catch (e) {
    return fromUnknownError(e);
  }
}
