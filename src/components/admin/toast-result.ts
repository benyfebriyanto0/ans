"use client";

import { toast } from "sonner";
import type { ActionResult } from "@/lib/validations";

/** Tampilkan toast berdasarkan hasil Server Action. Mengembalikan true jika sukses. */
export function toastResult<T>(
  res: ActionResult<T>,
  fallbackOk = "Berhasil disimpan.",
): res is { ok: true; message?: string; data?: T } {
  if (res.ok) {
    toast.success(res.message ?? fallbackOk);
    return true;
  }
  toast.error(res.error);
  return false;
}
