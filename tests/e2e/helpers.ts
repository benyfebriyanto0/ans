import { expect, type Page } from "@playwright/test";
import "dotenv/config";
import { createPrismaClient } from "../../src/lib/prisma-factory";

export const db = createPrismaClient();

export const ADMIN = {
  email: (process.env.SEED_ADMIN_EMAIL || "admin@arsindoniaga.co.id").toLowerCase(),
  password: process.env.SEED_ADMIN_PASSWORD || "GantiPassword#2026",
};

export async function login(page: Page, email = ADMIN.email, password = ADMIN.password) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
}

export async function loginAsAdmin(page: Page) {
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
}

/** Pastikan tidak ada scroll horizontal (layout responsif). */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "halaman tidak boleh melebar melebihi viewport").toBeLessThanOrEqual(1);
}
