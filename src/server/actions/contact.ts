"use server";

import { db } from "@/lib/db";
import { contactSchema, type ActionResult, type ContactInput } from "@/lib/validations";
import { pruneRateLimits, rateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/request";
import { revalidatePath } from "next/cache";
import { fromZodError } from "../action-utils";

const MIN_FILL_MS = 3000; // form yang diisi < 3 detik dianggap bot

export async function submitContact(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);
  const d = parsed.data;

  // Honeypot & time-trap: balas sukses palsu agar bot tidak belajar
  if (d.website) return { ok: true, message: "Terima kasih, pesan Anda telah terkirim." };
  if (d.startedAt && Date.now() - d.startedAt < MIN_FILL_MS) {
    return { ok: true, message: "Terima kasih, pesan Anda telah terkirim." };
  }

  const ipHash = hashIp(await getClientIp());
  const rl = await rateLimit(`contact:${ipHash}`, 3, 600); // 3 pesan / 10 menit / IP
  if (!rl.ok) {
    return { ok: false, error: `Terlalu banyak pesan. Coba lagi dalam ${Math.ceil(rl.retryAfter / 60)} menit.` };
  }

  let businessUnitId: number | null =
    typeof d.businessUnitId === "number" && d.businessUnitId > 0 ? d.businessUnitId : null;
  if (businessUnitId) {
    const exists = await db.businessUnit.findUnique({ where: { id: businessUnitId }, select: { id: true } });
    if (!exists) businessUnitId = null;
  }

  try {
    await db.contactMessage.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone || null,
        businessUnitId,
        message: d.message,
        ipHash,
      },
    });
    revalidatePath("/admin", "layout");
    if (Math.random() < 0.05) await pruneRateLimits(); // bersihkan entri rate limit lama sesekali
    return { ok: true, message: "Terima kasih! Pesan Anda telah kami terima dan akan segera kami tindak lanjuti." };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Pesan gagal dikirim. Silakan coba lagi atau hubungi kami via WhatsApp." };
  }
}
