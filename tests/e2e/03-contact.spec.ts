import { expect, test } from "@playwright/test";
import { db, loginAsAdmin } from "./helpers";

test.describe("Formulir kontak → Pesan Masuk", () => {
  test.beforeAll(async () => {
    await db.rateLimit.deleteMany({});
  });

  test("validasi sisi klien", async ({ page }) => {
    await page.goto("/kontak");
    await page.getByRole("button", { name: "Kirim Pesan" }).click();
    await expect(page.getByText("Nama minimal 2 karakter")).toBeVisible();
    await expect(page.getByText("Format email tidak valid")).toBeVisible();
  });

  test("pesan tersimpan ke database & tampil di admin", async ({ page }) => {
    const unique = `Uji E2E ${Date.now()}`;
    await page.goto("/kontak");
    await page.getByLabel(/Nama lengkap/).fill("Budi Santoso");
    await page.getByLabel(/^Email/).fill("budi@example.com");
    await page.getByLabel(/No. telepon/).fill("0812-3456-7890");
    await page.getByLabel(/Bidang usaha yang diminati/).selectOption({ label: "Rental Mobil" });
    await page.getByLabel(/^Pesan/).fill(`${unique} — saya ingin menyewa mobil untuk 3 hari.`);
    await page.waitForTimeout(3200); // lewati time-trap anti-bot
    await page.getByRole("button", { name: "Kirim Pesan" }).click();
    await expect(page.getByText("Pesan terkirim!")).toBeVisible();

    const saved = await db.contactMessage.findFirst({
      where: { message: { contains: unique } },
      include: { businessUnit: true },
    });
    expect(saved?.businessUnit?.slug).toBe("rental-mobil");
    expect(saved?.isRead).toBe(false);

    await loginAsAdmin(page);
    await page.goto("/admin/pesan");
    await expect(page.getByText(unique)).toBeVisible();
    await page.getByText(unique).click();
    await expect(page.getByRole("link", { name: /budi@example.com/ })).toBeVisible();
    await expect
      .poll(async () => (await db.contactMessage.findUnique({ where: { id: saved!.id } }))?.isRead)
      .toBe(true);
  });

  test("honeypot: bot tidak tersimpan", async ({ page }) => {
    const unique = `BOT ${Date.now()}`;
    await page.goto("/kontak");
    await page.getByLabel(/Nama lengkap/).fill("Spam Bot");
    await page.getByLabel(/^Email/).fill("bot@spam.com");
    await page.getByLabel(/^Pesan/).fill(`${unique} buy cheap stuff now`);
    await page.locator("#cf-website").fill("http://spam.example", { force: true });
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Kirim Pesan" }).click();
    await page.waitForTimeout(1500);
    expect(await db.contactMessage.count({ where: { message: { contains: unique } } })).toBe(0);
  });
});
