import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Car, CheckCircle2, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { UnitIcon, WhatsappIcon } from "@/components/icons";
import { CldImage } from "@/components/cld-image";
import { getActiveBusinessUnits, getBusinessUnitBySlug } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { parseJsonArray, stripHtml, waLink } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary-url";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const units = await getActiveBusinessUnits();
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/bidang-usaha/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getBusinessUnitBySlug(slug);
  if (!unit) return { title: "Tidak ditemukan" };
  const image = unit.coverImageUrl || unit.photos[0]?.imageUrl;
  return {
    title: `${unit.menuName} — ${unit.officialName}`,
    description: unit.summary || stripHtml(unit.description).slice(0, 160),
    alternates: { canonical: `/bidang-usaha/${unit.slug}` },
    openGraph: {
      title: `${unit.menuName} | ${unit.officialName}`,
      description: unit.summary,
      url: `/bidang-usaha/${unit.slug}`,
      images: image
        ? [{ url: cldUrl(image, { width: 1200, height: 630, crop: "fill" }), width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function BusinessUnitDetailPage({ params }: PageProps<"/bidang-usaha/[slug]">) {
  const { slug } = await params;
  const [unit, settings, allUnits] = await Promise.all([
    getBusinessUnitBySlug(slug),
    getSettings(),
    getActiveBusinessUnits(),
  ]);
  if (!unit) notFound();

  const services = parseJsonArray<string>(unit.services);
  const waMessage =
    unit.waMessage ||
    `Halo ${settings.companyName}, saya ingin menanyakan layanan ${unit.menuName} (${unit.officialName}).`;
  const others = allUnits.filter((u) => u.slug !== unit.slug);

  return (
    <>
      <PageHero
        eyebrow={`KBLI ${unit.kbliCode}`}
        title={unit.menuName}
        description={unit.officialName}
        crumbs={[
          { href: "/", label: "Beranda" },
          { href: "/bidang-usaha", label: "Bidang Usaha" },
          { label: unit.menuName },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <a href={waLink(settings.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="size-5" /> Tanya via WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
            <a href="#galeri">Lihat Galeri</a>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8">
        <article className="min-w-0 lg:col-span-8">
          {unit.coverImageUrl && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lg">
              <CldImage
                src={unit.coverImageUrl}
                alt={`${unit.menuName} — ${unit.officialName}`}
                fill
                priority
                sizes="(min-width:1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <h2 className="text-2xl font-extrabold tracking-tight">Tentang layanan {unit.menuName}</h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/80">{unit.summary}</p>
          <div className="prose-content mt-6" dangerouslySetInnerHTML={{ __html: unit.description }} />

          {services.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold">Daftar layanan</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm font-medium shadow-xs"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {unit.slug === "rental-mobil" && (
            <Link
              href="/armada"
              className="group mt-10 flex items-center gap-4 rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-5 transition hover:border-primary/50 hover:bg-primary/10"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Car className="size-6" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Lihat daftar armada rental</span>
                <span className="block text-sm text-muted-foreground">
                  Jenis kendaraan, kapasitas, dan foto setiap unit.
                </span>
              </span>
              <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </article>

        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-navy-900 p-6 text-white shadow-xl shadow-primary/20">
              <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <UnitIcon name={unit.icon} className="size-6" />
              </span>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-white/55">Nama resmi</dt>
                  <dd className="font-semibold">{unit.officialName}</dd>
                </div>
                <div>
                  <dt className="text-white/55">Kode KBLI</dt>
                  <dd className="font-mono text-lg font-bold text-accent">{unit.kbliCode}</dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-2">
                <Button asChild variant="accent" className="w-full">
                  <a href={waLink(settings.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="size-4" /> Chat WhatsApp
                  </a>
                </Button>
                {settings.phone && (
                  <Button asChild variant="glass" className="w-full">
                    <a href={`tel:${settings.phone}`}>
                      <Phone /> {settings.phone}
                    </a>
                  </Button>
                )}
                <Button asChild variant="glass" className="w-full">
                  <Link href="/kontak">
                    <FileText /> Kirim Formulir
                  </Link>
                </Button>
              </div>
            </div>
            {others.length > 0 && (
              <nav aria-label="Bidang usaha lainnya" className="rounded-2xl border bg-card p-5">
                <p className="text-sm font-bold">Bidang usaha lainnya</p>
                <ul className="mt-3 space-y-1">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/bidang-usaha/${o.slug}`}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-primary"
                      >
                        <UnitIcon name={o.icon} className="size-4" /> {o.menuName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>
      </section>

      <section id="galeri" className="scroll-mt-24 bg-muted/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="left" eyebrow="Galeri" title={`Dokumentasi pekerjaan ${unit.menuName}`} />
          <div className="mt-10">
            <GalleryGrid
              fallbackAlt={`${unit.menuName} ${settings.companyName}`}
              photos={unit.photos.map((p) => ({
                id: p.id,
                imageUrl: p.imageUrl,
                caption: p.caption,
                width: p.width,
                height: p.height,
              }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
