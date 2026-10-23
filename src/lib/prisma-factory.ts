import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Membuat PrismaClient dengan driver adapter MariaDB/MySQL (Prisma 7, tanpa Rust engine).
 * DATABASE_URL format: mysql://user:pass@host:port/db?sslaccept=strict
 * Parameter `sslaccept=strict` atau `ssl=true` mengaktifkan TLS (wajib untuk TiDB Cloud).
 */
export function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL belum diisi pada environment variables.");
  const url = new URL(raw);
  const params = url.searchParams;
  const useSsl =
    params.get("sslaccept") === "strict" ||
    params.get("ssl") === "true" ||
    params.get("sslmode") === "require" ||
    /tidbcloud\.com$/.test(url.hostname);

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: Number(params.get("connection_limit") || 5),
    ssl: useSsl ? { rejectUnauthorized: true, minVersion: "TLSv1.2" } : undefined,
    allowPublicKeyRetrieval: !useSsl,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}
