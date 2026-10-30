import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/site/hero-slider";
import { HeroFallback } from "@/components/site/hero-fallback";
import { SectionHeading } from "@/components/site/section-heading";
import { UnitCard } from "@/components/site/unit-card";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Reveal } from "@/components/site/reveal";
import { WhatsappIcon } from "@/components/icons";
import { ArcMark } from "@/components/site/arc-mark";
import { getSettings } from "@/lib/settings";
import { getActiveBusinessUnits, getActiveSliders, getActiveVehicles } from "@/lib/queries";
import { parseJsonArray, waLink } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { absolute: `${s.companyName} | ${s.tagline || "Company Profile"}` },
    description: s.shortProfile,
    alternates: { canonical: "/" },
    openGraph: {
      title: s.companyName,
      description: s.shortProfile,
      url: "/",
      type: "website",
      locale: "id_ID",
      siteName: s.companyName,
    },
  };
}

export default async function HomePage() {
  const [settings, sliders, units, vehicles] = await Promise.all([
    getSettings(),
    getActiveSliders(),
    getActiveBusinessUnits(),
    getActiveVehicles(),
  ]);

  const highlights = [
    { icon: BadgeCheck, title: `${units.length} Bidang Usaha`, text: "Solusi terpadu dalam satu mitra" },
    {
      icon: ShieldCheck,
      title: "Legal & Terdaftar",
      text: settings.nib ? `NIB ${settings.nib}` : "Badan usaha resmi berbentuk CV",
    },
    { icon: MapPin, title: "Bandar Lampung", text: "Melayani Lampung & sekitarnya" },
    { icon: Clock3, title: "Jam Operasional", text: settings.businessHours || "Konsultasi via WhatsApp" },
  ];

  return (
    <>
      {sliders.length ? (
        <HeroSlider slides={sliders} />
      ) : (
        <HeroFallback
          title={settings.tagline || settings.companyName}
          subtitle={settings.shortProfile}
          units={units.map((u) => ({
            slug: u.slug,
            menuName: u.menuName,
            officialName: u.officialName,
            summary: u.summary ?? "",
            icon: u.icon,
            services: parseJsonArray<string>(u.services),
            waHref: waLink(
              settings.whatsapp,
              u.waMessage || `Halo ${settings.companyName}, saya ingin menanyakan layanan ${u.menuName}.`,
            ),
          }))}
        />
      )}

      {/* Highlights */}
      <section aria-label="Keunggulan" className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="flex items-start gap-3 bg-card p-5 sm:p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                <h.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">{h.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ringkasan perusahaan */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Tentang Kami"
            title="Satu kontak untuk suku cadang, servis mesin, pelumas, dan kendaraan"
          />
          <p className="mt-6 leading-relaxed text-muted-foreground">{settings.shortProfile}</p>
          {settings.commitment && <p className="mt-4 leading-relaxed text-muted-foreground">{settings.commitment}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/tentang">Profil Lengkap</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/kontak">Hubungi Kami</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-900 p-8 text-white sm:p-10">
            <ArcMark className="absolute -top-2 -right-16 w-80 opacity-90" />
            <div className="relative">
              <p className="text-sm font-bold text-accent">Visi kami</p>
              <p className="mt-3 text-xl leading-relaxed font-semibold text-balance sm:text-2xl">“{settings.vision}”</p>
              {settings.values.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {settings.values.map((v) => (
                    <li
                      key={v.title}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85"
                    >
                      {v.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Bidang usaha */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-navy-950 py-20 sm:py-28">
        <ArcMark className="absolute -top-6 -left-40 w-[46rem] opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            inverted
            title="Jelajahi tiap bidang usaha"
            description="Setiap layanan punya halaman sendiri berisi daftar pekerjaan, alur pemesanan, dan kontak WhatsApp langsung ke admin."
          />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {units.map((u, i) => (
              <Reveal as="li" key={u.slug} delay={i * 90}>
                <UnitCard unit={u} index={i} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Armada */}
      {vehicles.length > 0 && (
        <section className="bg-muted/50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading align="left" eyebrow="Rental Mobil" title="Armada siap mendukung perjalanan Anda" />
              <Button asChild variant="outline">
                <Link href="/armada">Semua Armada</Link>
              </Button>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.slice(0, 3).map((v, i) => (
                <Reveal as="li" key={v.slug} delay={i * 90}>
                  <VehicleCard v={v} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-900 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <ArcMark className="absolute -right-20 -bottom-6 w-[30rem] opacity-80" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Butuh part, servis mesin, pelumas, atau mobil minggu ini?
            </h2>
            <p className="mt-4 text-white/75">
              Kirim kebutuhan Anda lewat WhatsApp. Admin kami membalas pada jam kerja dengan ketersediaan dan penawaran
              harga.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <a
                  href={waLink(settings.whatsapp, settings.waDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon className="size-5" /> Chat WhatsApp
                </a>
              </Button>
              {settings.phone && (
                <Button asChild variant="glass" size="lg">
                  <a href={`tel:${settings.phone}`}>
                    <Phone /> {settings.phone}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
