import "dotenv/config";
import { createPrismaClient } from "../src/lib/prisma-factory";
import bcrypt from "bcryptjs";
import { businessUnits, settings, vehicles } from "./seed-data";

const prisma = createPrismaClient();

async function main() {
  // 1) Akun admin awal (tidak menimpa password jika akun sudah ada)
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@arsindoniaga.co.id").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "GantiPassword#2026";
  const name = process.env.SEED_ADMIN_NAME || "Administrator";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`✔ Admin dibuat: ${email}`);
  } else {
    console.log(`• Admin sudah ada: ${email}`);
  }

  // 2) Empat bidang usaha (upsert by slug, konten yang sudah diubah admin tidak ditimpa)
  for (const unit of businessUnits) {
    const { services, ...rest } = unit;
    await prisma.businessUnit.upsert({
      where: { slug: unit.slug },
      update: {},
      create: { ...rest, services: JSON.stringify(services) },
    });
  }
  console.log(`✔ ${businessUnits.length} bidang usaha siap`);

  // 3) Settings profil perusahaan (hanya membuat key yang belum ada)
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log(`✔ ${Object.keys(settings).length} pengaturan profil siap`);

  // 4) Contoh data armada — dibuat NONAKTIF; aktifkan setelah foto & data unit asli dilengkapi.
  for (const v of vehicles) {
    const { features, ...rest } = v;
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: { ...rest, features: JSON.stringify(features), isActive: false },
    });
  }
  console.log(`✔ ${vehicles.length} contoh armada (nonaktif) siap`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
