import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { Reveal } from "@/components/site/reveal";
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
  const [unit, s, allUnits] = await Promise.all([getBusinessUnitBySlug(slug), getSettings(), getActiveBusinessUnits()]);
  if (!unit) notFound();

  const isRental = unit.slug === "rental-mobil";
  const vehicles = isRental ? await getActiveVehicles() : [];
  const L = getUnitLanding(unit.slug);
  const services = parseJsonArray<string>(unit.services);
  const waMessage =
    unit.waMessage || `Halo ${s.companyName}, saya ingin menanyakan layanan ${unit.menuName} (${unit.officialName}).`;
  const waMain = waLink(s.whatsapp, waMessage);
  const heroImage = unit.coverImageUrl || unit.photos[0]?.imageUrl;
  const others = allUnits.filter((u) => u.slug !== unit.slug);
  const trust = [
    { icon: ShieldCheck, label: "Perusahaan berbadan hukum" },
    { icon: Clock3, label: "Respons cepat via WhatsApp" },
    { icon: MapPin, label: "Bandar Lampung & sekitarnya" },
  ];
  const featureIcons = [BadgeCheck, Sparkles, Clock3];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="bg-hero-light relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div
          className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden
        />
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
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <UnitIcon name={unit.icon} className="size-3.5 text-gold-600" /> {unit.menuName} ·{" "}
              {s.companyShortName || "Arsindo"} Lampung
            </p>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl">
              {L.headline}{" "}
              <span className="text-primary underline decoration-accent decoration-4 underline-offset-8">
                {L.highlight}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{unit.summary || L.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <a href={waMain} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="size-5" /> {isRental ? "Cek Ketersediaan" : "Tanya via WhatsApp"}{" "}
                  <ArrowUpRight />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
                <a href="#pilihan">
                  {isRental ? "Lihat Armada" : "Lihat Layanan"} <ArrowDown />
                </a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {trust.map((t) => (
                <li key={t.label} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <t.icon className="size-4.5 text-primary" /> {t.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-primary/15">
              {heroImage ? (
                <CldImage
                  src={heroImage}
                  alt={`${unit.menuName} — ${s.companyName}`}
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-navy-900">
                  <div className="bg-grid absolute inset-0 opacity-40" />
                  <UnitIcon name={unit.icon} className="absolute -right-10 -bottom-10 size-72 text-white/10" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                      <UnitIcon name={unit.icon} className="size-7" />
                    </span>
                    <p className="mt-4 text-2xl font-extrabold">{unit.officialName}</p>
                    {services.length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-sm text-white/85">
                        {services.slice(0, 4).map((sv) => (
                          <li key={sv} className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-accent" /> {sv}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Strip keunggulan ===== */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {L.features.map((x, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            return (
              <div key={x.title} className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-gold-600">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-navy-950">{x.title}</p>
                  <p className="text-sm text-muted-foreground">{x.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Pilihan: armada (rental) atau layanan ===== */}
      <section id="pilihan" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">{isRental ? "Armada" : "Layanan"}</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{L.servicesTitle}</h2>

        {isRental && vehicles.length > 0 ? (
          <>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v, i) => {
                const img = v.coverImageUrl || v.photos[0]?.imageUrl;
                return (
                  <Reveal
                    as="li"
                    key={v.slug}
                    delay={(i % 3) * 80}
                    className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sky-soft to-secondary">
                      {img ? (
                        <CldImage
                          src={img}
                          alt={v.name}
                          fill
                          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <Car className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-primary/25" />
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
                        {v.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-navy-950">{v.name}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">
                        {v.description || `${v.seats} penumpang · ${v.transmission} · ${v.fuel}`}
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
                            Tanya Harga & Stok <ArrowUpRight />
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-9 px-4">
                          <Link prefetch={false} href={`/armada/${v.slug}`}>
                            Detail
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Foto sebagai referensi. Detail unit, harga, dan ketersediaan dikonfirmasi oleh admin kami.
            </p>
          </>
        ) : services.length > 0 ? (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((sv, i) => (
              <Reveal
                as="li"
                key={sv}
                delay={(i % 3) * 80}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="font-mono text-sm font-bold text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 flex-1 text-lg font-bold text-navy-950">{sv}</h3>
                <a
                  href={waLink(s.whatsapp, `Halo ${s.companyName}, saya ingin menanyakan: ${sv} (${unit.menuName}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <WhatsappIcon className="size-4" /> Tanyakan layanan ini <ArrowUpRight className="size-4" />
                </a>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {isRental && (
          <Button asChild variant="outline" className="mt-8">
            <Link href="/armada">
              Lihat semua armada <ArrowUpRight />
            </Link>
          </Button>
        )}
      </section>

      {/* ===== Tentang layanan (deskripsi dari admin) ===== */}
      <section className="bg-sky-soft py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Tentang layanan</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {unit.officialName}
            </h2>
          </div>
          <div className="prose-content lg:col-span-7" dangerouslySetInnerHTML={{ __html: unit.description }} />
        </div>
      </section>

      {/* ===== Cara kerja ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Tidak perlu ribet</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Tiga langkah. Langsung beres.
        </h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {L.steps.map((st, i) => (
            <Reveal as="li" key={st.title} delay={i * 90} className="rounded-2xl border bg-white p-6 shadow-sm">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-950">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ===== Galeri dokumentasi ===== */}
      <section id="galeri" className="scroll-mt-24 bg-sky-soft py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Galeri</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
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

      {/* ===== Formulir ===== */}
      <section id="konsultasi" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">
              {isRental ? "Pemesanan" : "Konsultasi"}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {isRental ? "Mulai rencanakan perjalanan" : "Ceritakan kebutuhan Anda"}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Isi data singkat, lalu kami arahkan ke WhatsApp dengan pesan yang sudah tersusun rapi.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
              <ConsultForm
                whatsapp={s.whatsapp}
                companyName={s.companyName}
                unitName={unit.menuName}
                items={isRental ? vehicles.map((v) => v.name) : services}
                itemLabel={isRental ? "Pilihan mobil" : "Layanan"}
                needPlaceholder={
                  isRental
                    ? "Durasi sewa, lepas kunci / dengan driver, tujuan perjalanan…"
                    : "Jenis barang/mesin, spesifikasi, jumlah, atau kendala yang dialami…"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Lokasi ===== */}
      {s.mapsEmbedUrl && (
        <section className="bg-sky-soft py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Temukan kami</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                  {s.companyName}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {s.address}
                </p>
              </div>
              {s.mapsLink && (
                <Button asChild variant="outline" className="bg-white">
                  <a href={s.mapsLink} target="_blank" rel="noopener noreferrer">
                    Buka Google Maps <ArrowUpRight />
                  </a>
                </Button>
              )}
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-lg">
              <MapEmbed src={s.mapsEmbedUrl} title={`Lokasi ${s.companyName} di Google Maps`} link={s.mapsLink} />
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-center text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Ada yang ingin ditanyakan?
        </h2>
        <div className="mt-10 divide-y rounded-2xl border bg-card">
          {L.faq.map((f) => (
            <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-950">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== CTA penutup ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-900 px-6 py-14 text-center text-white shadow-2xl shadow-primary/20 sm:px-12">
          <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{L.closing}</h2>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="accent" size="lg">
                <a href={waMain} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="size-5" /> Chat Admin Sekarang
                </a>
              </Button>
            </div>
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
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 font-semibold text-navy-950 transition hover:border-primary/30 hover:shadow-md"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-primary text-white">
                    <UnitIcon name={o.icon} className="size-5" />
                  </span>
                  {o.menuName}
                  <ArrowUpRight className="ml-auto size-4 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
