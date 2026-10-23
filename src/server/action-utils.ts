import "server-only";
import { z } from "zod";
import type { ActionResult } from "@/lib/validations";

export function fromZodError(error: z.ZodError): ActionResult<never> {
  const flat = z.flattenError(error);
  return {
    ok: false,
    error: flat.formErrors[0] || "Periksa kembali isian formulir.",
    fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
  };
}

export function fromUnknownError(e: unknown, fallback = "Terjadi kesalahan. Silakan coba lagi."): ActionResult<never> {
  // Lewatkan error redirect/notFound milik Next.js
  if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_"))
    throw e;
  const code = (e as { code?: string })?.code;
  if (code === "P2002") return { ok: false, error: "Data dengan nilai unik tersebut sudah ada (mis. slug/email)." };
  if (code === "P2025") return { ok: false, error: "Data tidak ditemukan atau sudah dihapus." };
  console.error(e);
  return { ok: false, error: e instanceof Error && e.message.length < 200 ? e.message : fallback };
}

export const idSchema = z.coerce.number().int().positive();
export const idsSchema = z.array(idSchema).max(500);
