import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Pakai process.env (bukan env()) agar `prisma generate` saat `npm install`
  // tetap berhasil walau DATABASE_URL belum tersedia (mis. tahap install di CI/Netlify).
  // Perintah migrate/seed tetap membutuhkan DATABASE_URL yang valid.
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
