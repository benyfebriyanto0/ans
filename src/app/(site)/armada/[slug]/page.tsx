import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle2, Fuel, Settings2, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { WhatsappIcon } from "@/components/icons";
import { CldImage } from "@/components/cld-image";
import { getActiveVehicles, getVehicleBySlug } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { parseJsonArray, waLink } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary-url";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const vs = await getActiveVehicles();
  return vs.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/armada/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return { title: "Tidak ditemukan" };
  const img = v.coverImageUrl || v.photos[0]?.imageUrl;
  return {
    title: `Sewa ${v.name}`,
    description:
      v.description || `Sewa ${v.name} (${v.category}, ${v.seats} kursi, ${v.transmission}) di Bandar Lampung.`,
    alternates: { canonical: `/armada/${v.slug}` },
    openGraph: {
      title: `Sewa ${v.name}`,
      images: img ? [{ url: cldUrl(img, { width: 1200, height: 630, crop: "fill" }) }] : undefined,
    },
  };
}

export default async function VehicleDetailPage({ params }: PageProps<"/armada/[slug]">) {
  const { slug } = await params;
  const [v, settings] = await Promise.all([getVehicleBySlug(slug), getSettings()]);
  if (!v) notFound();
  const features = parseJsonArray<string>(v.features);
  const cover = v.coverImageUrl || v.photos[0]?.imageUrl;
  const msg = `Halo ${settings.companyName}, saya ingin menanyakan ketersediaan dan harga sewa ${v.name}.`;
  const specs = [
    { icon: Tag, label: "Jenis", value: v.category },
    { icon: Users, label: "Kapasitas", value: `${v.seats} penumpang` },
    { icon: Settings2, label: "Transmisi", value: v.transmission },
    { icon: Fuel, label: "Bahan bakar", value: v.fuel },
    ...(v.year ? [{ icon: Calendar, label: "Tahun", value: String(v.year) }] : []),
  ];

  return (
    <>
      <PageHero
        eyebrow={v.brand ?? "Armada"}
        title={v.name}
        description={v.description ?? undefined}
        crumbs={[{ href: "/", label: "Beranda" }, { href: "/armada", label: "Armada" }, { label: v.name }]}
      />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-lg">
            {cover && (
              <CldImage
                src={cover}
                alt={v.name}
                fill
                priority
                sizes="(min-width:1024px) 58vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <h2 className="text-xl font-bold">Spesifikasi</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <s.icon className="size-4 text-primary" />
                  {s.label}
                </dt>
                <dd className="mt-1 font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
          {features.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold">Fasilitas</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {features.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
                  >
                    <CheckCircle2 className="size-4" />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg" className="flex-1">
              <a href={waLink(settings.whatsapp, msg)} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="size-5" /> Tanya Sewa via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/armada">
                <ArrowLeft /> Armada lain
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Harga & ketersediaan dikonfirmasi langsung oleh tim kami. Pemesanan online belum tersedia.
          </p>
        </div>
      </section>
      {v.photos.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-extrabold">Foto {v.name}</h2>
            <GalleryGrid
              fallbackAlt={v.name}
              photos={v.photos.map((p) => ({
                id: p.id,
                imageUrl: p.imageUrl,
                caption: p.caption,
                width: p.width,
                height: p.height,
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
