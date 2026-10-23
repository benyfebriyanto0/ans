# Website Company Profile — CV Arsindo Niaga Sejahtera

Website resmi CV Arsindo Niaga Sejahtera (Bandar Lampung): profil & legalitas perusahaan, 4 bidang usaha
beserta galeri dokumentasi pekerjaan, daftar armada rental mobil, formulir kontak, dan **panel admin** untuk
mengelola seluruh konten tanpa mengubah kode.

|           |                                                                           |
| --------- | ------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript                           |
| UI        | Tailwind CSS 4 · komponen bergaya shadcn/ui (Radix UI) · lucide-react     |
| Data      | Prisma 7 (driver adapter MariaDB/MySQL) · MySQL 8 / TiDB Cloud Serverless |
| Auth      | Auth.js v5 (Credentials + bcrypt) · proxy (middleware) Next.js 16         |
| Media     | Cloudinary (signed upload langsung dari browser)                          |
| Hosting   | Netlify + GitHub                                                          |

📘 Dokumentasi teknis lengkap: [`docs/dokumentasi-teknis.html`](docs/dokumentasi-teknis.html)
🧪 Laporan pengujian & bukti acceptance criteria: [`docs/laporan-pengujian.html`](docs/laporan-pengujian.html)

## Menjalankan secara lokal

Prasyarat: **Node.js ≥ 20.9** (disarankan 22) dan **MySQL 8** (Laragon / XAMPP / Docker).

```bash
# 1. Install dependency (otomatis menjalankan prisma generate)
npm install

# 2. Salin & isi environment
copy .env.example .env        # Windows   (Linux/macOS: cp .env.example .env)
#    -> isi DATABASE_URL, AUTH_SECRET (npx auth secret), CLOUDINARY_*

# 3. Buat database "arsindo" di MySQL, lalu jalankan migration + seeder
npx prisma migrate deploy
npm run db:seed

# 4. Jalankan
npm run dev                   # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

Login admin awal mengikuti `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` pada `.env`
(default `admin@arsindoniaga.co.id` / `GantiPassword#2026`) — **segera ganti password setelah login pertama.**

## Skrip npm

| Perintah                                                | Fungsi                                                           |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                                           | Server development                                               |
| `npm run build` / `npm start`                           | Build & jalankan production (butuh koneksi database saat build)  |
| `npm run lint` · `npm run typecheck` · `npm run format` | Kualitas kode                                                    |
| `npm run db:migrate`                                    | Buat migration baru saat schema berubah (development)            |
| `npm run db:deploy`                                     | Terapkan migration (production)                                  |
| `npm run db:seed`                                       | Isi data awal (aman dijalankan ulang, tidak menimpa data)        |
| `npm run db:studio`                                     | Prisma Studio                                                    |
| `npm run test:e2e`                                      | Pengujian end-to-end Playwright (server harus berjalan di :3000) |

## Struktur singkat

```
prisma/                 schema.prisma, migrations/, seed.ts, seed-data.ts
src/app/(site)/         halaman publik (/, /tentang, /bidang-usaha, /armada, /kontak)
src/app/admin/          panel admin (login + menu pengelolaan)
src/app/api/            Auth.js & signature upload Cloudinary
src/server/actions/     Server Actions (CRUD, kontak, auth) — tervalidasi Zod + cek sesi
src/lib/                db, settings, queries, cloudinary, rate-limit, validasi
src/components/         komponen UI, situs publik, dan admin
src/proxy.ts            proteksi /admin & /api/admin
tests/e2e/              Playwright
docs/                   dokumentasi teknis & laporan pengujian (HTML)
```

## Deploy ke Netlify (ringkas)

1. Push repo ke GitHub → Netlify **Add new site → Import from Git**.
2. Isi environment variables (lihat `.env.example`), terutama `DATABASE_URL` (TiDB, `?sslaccept=strict`),
   `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, dan `CLOUDINARY_*`.
3. Build command sudah diatur di `netlify.toml` (`prisma migrate deploy && npm run build`).
4. Setelah deploy pertama, jalankan seeder sekali dari komputer lokal dengan `DATABASE_URL` production:
   `npm run db:seed`.
5. Pasang domain perusahaan di **Domain management**; HTTPS otomatis (Let's Encrypt).

Detail lengkap, termasuk backup mingguan via GitHub Actions, ada di dokumentasi teknis.
