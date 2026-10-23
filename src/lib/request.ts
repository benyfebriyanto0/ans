import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

export function ipFromHeaders(h: Headers) {
  return (
    h.get("x-nf-client-connection-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function getClientIp() {
  return ipFromHeaders(await headers());
}

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT || process.env.AUTH_SECRET || "salt"}:${ip}`)
    .digest("hex");
}
