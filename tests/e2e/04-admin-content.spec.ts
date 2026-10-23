import { expect, test } from "@playwright/test";
import { db, loginAsAdmin } from "./helpers";

// URL contoh Cloudinary (akun "demo") untuk data uji galeri
const demo = (n: number) => `https://res.cloudinary.com/demo/image/upload/v1/samples/e2e-${n}.jpg`;

test.describe("Panel admin — konten & revalidation", () => {
  test.beforeAll(async () => {
    await db.rateLimit.deleteMany({});
  });

  test("dashboard menampilkan ringkasan", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByText("Pesan belum dibaca")).toBeVisible();
    await expect(page.getByText("Foto per bidang usaha")).toBeVisible();
  });

  test("ubah ringkasan bidang usaha → tampil di website (revalidation)", async ({ page }) => {
    const unit = await db.businessUnit.findUniqueOrThrow({ where: { slug: "jasa" } });
    const marker = `Ringkasan uji ${Date.now()} untuk layanan reparasi mesin.`;
    await loginAsAdmin(page);
    await page.goto(`/admin/bidang-usaha/${unit.id}`);
    await page.getByLabel(/Ringkasan/).fill(marker);
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page).toHaveURL(/\/admin\/bidang-usaha$/);
    await page.goto("/bidang-usaha/jasa");
    await expect(page.getByText(marker)).toBeVisible();
    await db.businessUnit.update({ where: { id: unit.id }, data: { summary: unit.summary } });
  });

  test("validasi: nama menu wajib diisi & KBLI tidak tampil", async ({ page }) => {
    const unit = await db.businessUnit.findUniqueOrThrow({ where: { slug: "jasa" } });
    await loginAsAdmin(page);
    await page.goto(`/admin/bidang-usaha/${unit.id}`);
    await expect(page.getByText(/KBLI/)).toHaveCount(0);
    await page.getByLabel(/Nama di menu/).fill("A");
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText("Wajib diisi").first()).toBeVisible();
  });

  test("galeri: urutan, nonaktif, dan hapus foto tercermin di website", async ({ page }) => {
    const unit = await db.businessUnit.findUniqueOrThrow({ where: { slug: "rental-mobil" } });
    await db.galleryPhoto.deleteMany({ where: { businessUnitId: unit.id } });
    await db.galleryPhoto.createMany({
      data: [1, 2, 3, 4].map((n) => ({
        businessUnitId: unit.id,
        imagePublicId: `arsindo/gallery/rental-mobil/e2e-${n}`,
        imageUrl: demo(n),
        caption: `Foto ${n}`,
        sortOrder: n,
        width: 1600,
        height: 1200,
      })),
    });

    await loginAsAdmin(page);
    await page.goto(`/admin/galeri?unit=${unit.id}`);
    await expect(page.getByPlaceholder("Caption / keterangan foto")).toHaveCount(4);

    // Ubah urutan via keyboard (dnd-kit): pindahkan foto #1 ke posisi #2
    const handle = page.getByRole("button", { name: "Seret untuk mengubah urutan foto 1" });
    await page.waitForLoadState("networkidle"); // pastikan dnd-kit sudah ter-hydrate
    await handle.focus();
    await page.keyboard.press("Space");
    await page.waitForTimeout(250);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(250);
    await page.keyboard.press("Space");
    await expect(page.getByText("Urutan foto tersimpan.")).toBeVisible();
    await expect
      .poll(async () =>
        (await db.galleryPhoto.findMany({ where: { businessUnitId: unit.id }, orderBy: { sortOrder: "asc" } })).map(
          (p) => p.caption,
        ),
      )
      .toEqual(["Foto 2", "Foto 1", "Foto 3", "Foto 4"]);

    // Nonaktifkan foto ke-3 (Foto 3)
    await page
      .locator("li", { has: page.locator('input[value="Foto 3"]') })
      .getByRole("switch")
      .click();
    await expect
      .poll(
        async () =>
          (await db.galleryPhoto.findFirst({ where: { caption: "Foto 3", businessUnitId: unit.id } }))?.isActive,
      )
      .toBe(false);

    // Hapus foto 4
    await page
      .locator("li", { has: page.locator('input[value="Foto 4"]') })
      .getByRole("button", { name: "Hapus" })
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Hapus" }).click();
    await expect.poll(async () => db.galleryPhoto.count({ where: { businessUnitId: unit.id } })).toBe(3);

    // Website: hanya foto aktif, sesuai urutan
    await page.goto("/bidang-usaha/rental-mobil");
    const items = page.locator("#galeri ul li button");
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveAttribute("aria-label", /Foto 2/);
    await expect(items.nth(1)).toHaveAttribute("aria-label", /Foto 1/);

    // Lightbox terbuka saat foto diklik & dapat digeser
    await items.nth(0).click();
    await expect(page.locator(".yarl__root")).toBeVisible();
    await expect(page.locator(".yarl__counter")).toContainText("1 / 2");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".yarl__counter")).toContainText("2 / 2");
    await page.keyboard.press("Escape");

    await db.galleryPhoto.deleteMany({ where: { businessUnitId: unit.id } });
  });

  test("galeri kosong menampilkan 'Galeri segera hadir'", async ({ page }) => {
    await page.goto("/bidang-usaha/perdagangan");
    await expect(page.getByText("Galeri segera hadir")).toBeVisible();
  });

  test("armada dikelola terpisah: aktifkan → tampil di /armada", async ({ page }) => {
    const v = await db.vehicle.findUniqueOrThrow({ where: { slug: "toyota-avanza" } });
    await loginAsAdmin(page);
    await page.goto("/admin/armada");
    const row = page.locator("li", { hasText: "Toyota Avanza" });
    await row.getByRole("switch").click();
    await expect.poll(async () => (await db.vehicle.findUnique({ where: { id: v.id } }))?.isActive).toBe(true);
    await page.goto("/armada");
    await expect(page.getByRole("heading", { name: "Toyota Avanza" })).toBeVisible();
    await page.getByRole("heading", { name: "Toyota Avanza" }).click();
    await expect(page).toHaveURL(/\/armada\/toyota-avanza$/);
    await expect(page.getByRole("heading", { name: "Spesifikasi" })).toBeVisible();
    expect(await db.galleryPhoto.count({ where: { imagePublicId: { contains: "fleet" } } })).toBe(0);
    await db.vehicle.update({ where: { id: v.id }, data: { isActive: false } });
  });

  test("profil perusahaan: ubah NIB → tampil di Tentang Kami", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/profil");
    await page.getByLabel("NIB").fill("1234567890123");
    await page.getByRole("button", { name: "Simpan Profil" }).click();
    await expect(page.getByText("Profil perusahaan tersimpan.")).toBeVisible();
    await page.goto("/tentang");
    await expect(page.getByText("1234567890123").first()).toBeVisible();
    await db.setting.update({ where: { key: "nib" }, data: { value: "" } });
  });

  test("pengguna admin: tambah, login sebagai user baru, hapus", async ({ page, browser }) => {
    const email = `staf-${Date.now()}@arsindoniaga.co.id`;
    await loginAsAdmin(page);
    await page.goto("/admin/pengguna");
    await page.getByLabel("Nama").fill("Staf Uji");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("Rahasia123");
    await page.getByRole("button", { name: "Tambah" }).click();
    await expect(page.getByRole("cell", { name: email })).toBeVisible();

    const ctx = await browser.newContext();
    const p2 = await ctx.newPage();
    await p2.goto("/admin/login");
    await p2.getByLabel("Email").fill(email);
    await p2.getByLabel("Password").fill("Rahasia123");
    await p2.getByRole("button", { name: "Masuk" }).click();
    await expect(p2).toHaveURL(/\/admin$/);
    await ctx.close();

    await page
      .getByRole("row", { name: new RegExp(email) })
      .getByRole("button", { name: /Hapus akun/ })
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Hapus" }).click();
    await expect(page.getByRole("cell", { name: email })).toHaveCount(0);
  });
});
