import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [units, vehicles] = await Promise.all([
    db.businessUnit.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.vehicle.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/tentang"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/bidang-usaha"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl("/armada"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: siteUrl("/kontak"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];
  return [
    ...statics,
    ...units.map((u) => ({
      url: siteUrl(`/bidang-usaha/${u.slug}`),
      lastModified: u.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...vehicles.map((v) => ({
      url: siteUrl(`/armada/${v.slug}`),
      lastModified: v.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
