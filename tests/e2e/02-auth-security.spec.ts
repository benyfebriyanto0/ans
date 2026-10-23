import { expect, test } from "@playwright/test";
import { db, login, loginAsAdmin } from "./helpers";

test.describe("Autentikasi & keamanan", () => {
  test.beforeAll(async () => {
    await db.rateLimit.deleteMany({});
  });

  test("route /admin terkunci untuk tamu", async ({ page }) => {
    await page.goto("/admin/galeri");
    await expect(page).toHaveURL(/\/admin\/login\?callbackUrl=%2Fadmin%2Fgaleri/);
  });

  test("API admin menolak tanpa sesi (401)", async ({ request }) => {
    const r = await request.post("/api/admin/cloudinary/sign", { data: { folder: "arsindo/sliders" } });
    expect(r.status()).toBe(401);
  });

  test("login gagal menampilkan pesan error", async ({ page }) => {
    await login(page, "admin@arsindoniaga.co.id", "salah-password");
    await expect(page.locator("form [role=alert]")).toContainText("Email atau password salah");
  });

  test("rate limit: diblokir setelah 5 kali gagal per menit", async ({ page }) => {
    const email = `brute-${Date.now()}@example.com`;
    for (let i = 0; i < 5; i++) {
      await login(page, email, "salah");
      await expect(page.locator("form [role=alert]")).toBeVisible();
    }
    await login(page, email, "salah");
    await expect(page.locator("form [role=alert]")).toContainText("Terlalu banyak percobaan");
  });

  test("login berhasil & logout", async ({ page }) => {
    await db.rateLimit.deleteMany({});
    await loginAsAdmin(page);
    await expect(page.getByRole("heading", { name: /Halo/ })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await page.locator("aside").last().getByRole("button", { name: "Keluar" }).click();
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("password disimpan dalam bentuk hash bcrypt", async () => {
    const u = await db.user.findFirst();
    expect(u?.passwordHash).toMatch(/^\$2[aby]\$12\$/);
  });

  test("security headers aktif", async ({ request }) => {
    const r = await request.get("/");
    expect(r.headers()["x-frame-options"]).toBe("SAMEORIGIN");
    expect(r.headers()["x-content-type-options"]).toBe("nosniff");
    expect(r.headers()["x-powered-by"]).toBeUndefined();
  });
});
