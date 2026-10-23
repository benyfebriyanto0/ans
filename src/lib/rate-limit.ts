import "server-only";
import { db } from "./db";

/**
 * Fixed-window rate limiter berbasis database (konsisten di semua instance serverless).
 * @returns { ok, remaining, retryAfter (detik) }
 */
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const now = new Date();
  const windowStartMin = new Date(now.getTime() - windowSec * 1000);
  const row = await db.rateLimit.findUnique({ where: { key } });

  if (!row || row.windowStart < windowStartMin) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  const retryAfter = Math.max(1, Math.ceil((row.windowStart.getTime() + windowSec * 1000 - now.getTime()) / 1000));
  if (row.count >= limit) return { ok: false, remaining: 0, retryAfter };

  await db.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return { ok: true, remaining: limit - row.count - 1, retryAfter };
}

export async function resetRateLimit(key: string) {
  await db.rateLimit.deleteMany({ where: { key } });
}

/** Bersihkan entri kedaluwarsa (dipanggil sesekali). */
export async function pruneRateLimits(olderThanSec = 86400) {
  await db.rateLimit.deleteMany({
    where: { windowStart: { lt: new Date(Date.now() - olderThanSec * 1000) } },
  });
}

/** Cek apakah key sudah melewati batas tanpa menambah hitungan. */
export async function isRateLimited(key: string, limit: number, windowSec: number) {
  const row = await db.rateLimit.findUnique({ where: { key } });
  if (!row) return false;
  if (row.windowStart.getTime() < Date.now() - windowSec * 1000) return false;
  return row.count >= limit;
}
