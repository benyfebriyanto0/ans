import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, CheckCircle2, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { ArcMark } from "@/components/site/arc-mark";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { ConsultForm } from "@/components/site/consult-form";
import { MapEmbed } from "@/components/site/map-embed";
import { UnitIcon, WhatsappIcon } from "@/components/icons";
import { CldImage } from "@/components/cld-image";
import { getActiveBusinessUnits, getActiveVehicles, getBusinessUnitBySlug } from "@/lib/queries";
import { getUnitLanding } from "@/lib/unit-landing";
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
    title: `${unit.menuName} | ${unit.officialName}`,
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
  const [unit, s, allUnits] = await Promise.all([getBusinessUnitBySlug(slug), getSettings(), getActiveBusinessUnits()]);
  if (!unit) notFound();

  const isRental = unit.slug === "rental-mobil";
  const vehicles = isRental ? await getActiveVehicles() : [];
  const showVehicles = isRental && vehicles.length > 0;
  const L = getUnitLanding(unit.slug);
  const services = parseJsonArray<string>(unit.services);
  const waMessage =
    unit.waMessage || `Halo ${s.companyName}, saya ingin menanyakan layanan ${unit.menuName} (${unit.officialName}).`;
  const waMain = waLink(s.whatsapp, waMessage);
  const heroImage = unit.coverImageUrl || unit.photos[0]?.imageUrl;
  const others = allUnits.filter((u) => u.slug !== unit.slug);
  const facts = [
    "Badan usaha CV di Bandar Lampung",
    s.businessHours ? `Admin aktif ${s.businessHours}` : "Konsultasi lewat WhatsApp",
    "Melayani Provinsi Lampung",
  ];
  const stepCols = L.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="bg-hero-light relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <ArcMark draw className="absolute -bottom-10 -left-40 w-[44rem] opacity-25" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Beranda
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" aria-hidden />
                  <Link href="/bidang-usaha" className="hover:text-primary">
                    Bidang Usaha
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" aria-hidden />
                  <span aria-current="page" className="font-medium text-foreground">
                    {unit.menuName}
                  </span>
                </li>
              </ol>
            </nav>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl">
              {L.headline} <span className="text-primary">{L.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{unit.summary || L.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <a href={waMain} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="size-5" /> Tanya via WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
                <a href="#pilihan">{showVehicles ? "Pilih mobil" : "Daftar layanan"}</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/75">
              {facts.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-gold-600" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <ViewTransition name={`unit-cover-${unit.slug}`} share="morph" default="none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-white">
                {heroImage ? (
                  <CldImage
                    src={heroImage}
                    alt={`${unit.menuName}, ${s.companyName}`}
                    fill
                    priority
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-navy-900">
                    <ArcMark className="absolute -top-4 -right-24 w-[30rem] opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
                      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                        <UnitIcon name={unit.icon} className="size-7" />
                      </span>
                      <p className="mt-4 text-xl font-extrabold sm:text-2xl">{unit.officialName}</p>
                      {services.length > 0 && (
                        <ul className="mt-4 hidden space-y-1.5 text-sm text-white/85 sm:block">
                          {services.slice(0, 4).map((sv) => (
                            <li key={sv}>{sv}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ViewTransition>
          </div>
        </div>
      </section>

      {/* ===== Keunggulan ===== */}
      <section aria-label="Keunggulan" className="border-y border-border bg-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 divide-y px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {L.features.map((x) => (
            <div key={x.title} className="py-6 sm:px-6 sm:first:pl-0">
              <dt className="font-bold text-navy-950">{x.title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{x.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ===== Pilihan: armada (rental) atau daftar layanan ===== */}
      {showVehicles ? (
        <section id="pilihan" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{L.servicesTitle}</h2>
            <p className="mt-3 text-muted-foreground">{L.servicesIntro}</p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => {
              const img = v.coverImageUrl || v.photos[0]?.imageUrl;
              return (
                <li key={v.slug} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden bg-sky-soft">
                    {img ? (
                      <CldImage
                        src={img}
                        alt={v.name}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <Car className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-primary/25" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-gold-600">{v.category}</p>
                    <h3 className="mt-1 text-lg font-bold text-navy-950">{v.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">
                      {v.seats} penumpang · {v.transmission} · {v.fuel}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild variant="accent" size="sm" className="h-9 px-4">
                        <a
                          href={waLink(
                            s.whatsapp,
                            `Halo ${s.companyName}, saya ingin menanyakan harga & ketersediaan ${v.name}.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsappIcon className="size-4" /> Tanya harga & jadwal
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="h-9 px-4">
                        <Link prefetch={false} href={`/armada/${v.slug}`}>
                          Spesifikasi
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Foto sebagai referensi. Detail unit, harga, dan ketersediaan dikonfirmasi oleh admin kami.
          </p>
        </section>
      ) : services.length > 0 ? (
        <section id="pilihan" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{L.servicesTitle}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{L.servicesIntro}</p>
              </div>
            </div>
            <ol className="divide-y border-y lg:col-span-8">
              {services.map((sv, i) => (
                <li key={sv} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6">
                  <span className="w-8 shrink-0 text-lg font-extrabold text-gold-600 tabular-nums">{i + 1}</span>
                  <p className="flex-1 text-lg font-semibold text-navy-950">{sv}</p>
                  <a
                    href={waLink(s.whatsapp, `Halo ${s.companyName}, saya ingin menanyakan: ${sv} (${unit.menuName}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white sm:self-auto"
                  >
                    <WhatsappIcon className="size-4" /> {L.itemCta}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {isRental && (
        <div className="mx-auto -mt-10 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Button asChild variant="outline">
            <Link href="/armada">Lihat semua armada</Link>
          </Button>
        </div>
      )}

      {/* ===== Tentang layanan (deskripsi dari admin) ===== */}
      <section className="bg-sky-soft py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl lg:col-span-5">
            {unit.officialName}
          </h2>
          <div className="prose-content lg:col-span-7" dangerouslySetInnerHTML={{ __html: unit.description }} />
        </div>
      </section>

      {/* ===== Alur ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{L.stepsTitle}</h2>
        <ol className={`mt-14 grid gap-10 ${stepCols} md:gap-6`}>
          {L.steps.map((st, i) => (
            <li key={st.title} className="relative border-t-2 border-primary/15 pt-8">
              <span className="absolute -top-5 left-0 grid size-10 place-items-center rounded-full bg-primary text-base font-extrabold text-white ring-4 ring-background">
                {i + 1}
              </span>
              <h3 className="text-lg font-bold text-navy-950">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Galeri dokumentasi ===== */}
      <section id="galeri" className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Dokumentasi pekerjaan {unit.menuName}
          </h2>
          <div className="mt-10">
            <GalleryGrid
              fallbackAlt={`${unit.menuName} ${s.companyName}`}
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

      {/* ===== Formulir + lokasi ===== */}
      <section id="konsultasi" className="scroll-mt-20 bg-sky-soft py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {isRental ? "Rencanakan perjalanan Anda" : "Ceritakan kebutuhan Anda"}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Isi data singkat, lalu kami arahkan ke WhatsApp dengan pesan yang sudah tersusun.
            </p>
            <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8">
              <ConsultForm
                whatsapp={s.whatsapp}
                companyName={s.companyName}
                unitName={unit.menuName}
                items={isRental ? vehicles.map((v) => v.name) : services}
                itemLabel={isRental ? "Pilihan mobil" : "Layanan"}
                needPlaceholder={
                  isRental
                    ? "Durasi sewa, lepas kunci atau dengan sopir, tujuan perjalanan"
                    : "Jenis barang atau mesin, spesifikasi, jumlah, atau kendala yang dialami"
                }
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-xl font-bold text-navy-950">Lokasi kami</h2>
            <p className="mt-2 flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {s.address}
            </p>
            {s.mapsEmbedUrl && (
              <div className="mt-5 overflow-hidden rounded-3xl border bg-white">
                <MapEmbed src={s.mapsEmbedUrl} title={`Lokasi ${s.companyName} di Google Maps`} link={s.mapsLink} />
              </div>
            )}
            {s.mapsLink && (
              <Button asChild variant="outline" className="mt-4 bg-white">
                <a href={s.mapsLink} target="_blank" rel="noopener noreferrer">
                  Buka di Google Maps
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl lg:col-span-4">
          Pertanyaan yang sering masuk
        </h2>
        <div className="divide-y border-y lg:col-span-8">
          {L.faq.map((f) => (
            <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-950">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== Penutup ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-900 px-6 py-14 text-white sm:px-12">
          <ArcMark className="absolute -right-24 -bottom-8 w-[32rem] opacity-80" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{L.closing}</h2>
            <Button asChild variant="accent" size="lg" className="shrink-0 self-start md:self-auto">
              <a href={waMain} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="size-5" /> {L.cta}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Bidang usaha lainnya ===== */}
      {others.length > 0 && (
        <nav aria-label="Bidang usaha lainnya" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-navy-950">Bidang usaha lainnya</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/bidang-usaha/${o.slug}`}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 font-semibold text-navy-950 transition hover:border-primary/30 hover:text-primary"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-primary text-white">
                    <UnitIcon name={o.icon} className="size-5" />
                  </span>
                  {o.menuName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <MobileActionBar waHref={waMain} phone={s.phone} waLabel={L.cta} />
    </>
  );
}
