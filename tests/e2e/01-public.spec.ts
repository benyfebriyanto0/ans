import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

const PAGES = [
  "/",
  "/tentang",
  "/bidang-usaha",
  "/bidang-usaha/perdagangan",
  "/bidang-usaha/jasa",
  "/bidang-usaha/perdagangan-oli",
  "/bidang-usaha/rental-mobil",
  "/armada",
  "/kontak",
];

test.describe("Halaman publik", () => {
  for (const path of PAGES) {
    test(`render ${path} + metadata`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page).toHaveTitle(/Arsindo/);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
      expect(await page.locator('meta[property="og:title"]').count()).toBeGreaterThan(0);
      await expect(page.locator(`a[aria-label="Chat WhatsApp"]`)).toBeVisible(); // tombol WA melayang
    });
  }

  test("beranda menampilkan 4 kartu bidang usaha & CTA", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Perdagangan", "Jasa", "Perdagangan Oli", "Rental Mobil"]) {
      await expect(page.getByRole("heading", { name, exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: /Butuh part, servis mesin/ })).toBeVisible();
  });

  test("hero beranda: pemilih layanan bisa diklik & dinavigasi keyboard", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Pilih bidang usaha" });
    await tabs.getByRole("tab", { name: "Jasa" }).click();
    await expect(tabs.getByRole("tab", { name: "Jasa" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("link", { name: "Lihat Jasa" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab", { name: "Perdagangan Oli" })).toBeFocused();
    await expect(page.getByRole("link", { name: "Lihat Perdagangan Oli" })).toHaveAttribute(
      "href",
      "/bidang-usaha/perdagangan-oli",
    );
  });

  test("detail di HP: bar aksi WhatsApp & telepon menggantikan tombol melayang", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("/bidang-usaha/jasa");
    const bar = page.locator("[data-mobile-actionbar]");
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: /Laporkan kerusakan/ })).toHaveAttribute("href", /wa\.me/);
    await expect(page.locator("[data-floating-wa]")).toBeHidden();
    await page.close();
  });

  test("tentang: visi, 6 misi, 5 nilai, legalitas", async ({ page }) => {
    await page.goto("/tentang");
    await expect(page.getByRole("heading", { name: "Visi" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Daftar misi" }).getByRole("listitem")).toHaveCount(6);
    await expect(page.getByRole("heading", { name: "Legalitas Perusahaan" })).toBeVisible();
    await expect(page.getByText("Perum Semesta Blok L 13").first()).toBeVisible();
  });

  test("detail bidang usaha: landing, tanpa KBLI, layanan, form, FAQ, WA otomatis", async ({ page }) => {
    await page.goto("/bidang-usaha/perdagangan-oli");
    await expect(page.getByText(/KBLI/)).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Pelumas yang tepat");
    await expect(page.getByRole("heading", { name: "Produk yang kami pasok" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Alur pemesanan" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pertanyaan yang sering masuk" })).toBeVisible();
    await expect(page.getByLabel("Nama / perusahaan")).toBeVisible();
    const wa = page.getByRole("link", { name: /Tanya via WhatsApp/ }).first();
    const href = await wa.getAttribute("href");
    expect(href).toContain("https://wa.me/628117913336?text=");
    expect(decodeURIComponent(href!)).toMatch(/oli|pelumas/i);
  });

  test("detail rental mobil: kartu armada dengan tombol tanya harga", async ({ page }) => {
    await page.goto("/bidang-usaha/rental-mobil");
    await expect(page.getByRole("heading", { name: "Mau pergi naik apa?" })).toBeVisible();
    await expect(page.getByText(/KBLI/)).toHaveCount(0);
  });

  test("kontak: alamat, telepon, email, Google Maps & formulir", async ({ page }) => {
    await page.goto("/kontak");
    const main = page.locator("main");
    await expect(main.getByText("08117913336").first()).toBeVisible();
    await expect(main.getByText("arsindoniagasejahtera@outlook.com").first()).toBeVisible();
    await page.getByRole("region", { name: "Peta lokasi" }).scrollIntoViewIfNeeded();
    await expect(page.locator('iframe[title*="Google Maps"]')).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Kirim Pesan" })).toBeVisible();
  });

  test("navigasi menu bekerja", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Kontak" }).click();
    await expect(page).toHaveURL(/\/kontak$/);
    await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Tentang Kami" }).click();
    await expect(page).toHaveURL(/\/tentang$/);
  });

  test("SEO: sitemap & robots", async ({ request }) => {
    const sm = await (await request.get("/sitemap.xml")).text();
    expect(sm).toContain("/bidang-usaha/rental-mobil");
    const rb = await (await request.get("/robots.txt")).text();
    expect(rb).toContain("Disallow: /admin");
    expect(rb).toContain("Sitemap:");
  });

  test("halaman tidak ada → 404", async ({ page }) => {
    const res = await page.goto("/bidang-usaha/tidak-ada");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Halaman tidak ditemukan")).toBeVisible();
  });
});

test.describe("Responsif 360–1920 px", () => {
  for (const width of [360, 768, 1024, 1920]) {
    test(`tanpa scroll horizontal pada ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("menu mobile dapat dibuka di 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");
    await page.getByRole("button", { name: "Buka menu" }).click();
    const nav = page.getByRole("navigation", { name: "Navigasi mobile" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Rental Mobil" }).click();
    await expect(page).toHaveURL(/rental-mobil/);
  });
});
