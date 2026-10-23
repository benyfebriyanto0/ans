import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, MapPin, Phone, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/site/hero-slider";
import { HeroFallback } from "@/components/site/hero-fallback";
import { SectionHeading } from "@/components/site/section-heading";
import { UnitCard } from "@/components/site/unit-card";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Reveal } from "@/components/site/reveal";
import { WhatsappIcon } from "@/components/icons";
import { getSettings } from "@/lib/settings";
import { getActiveBusinessUnits, getActiveSliders, getActiveVehicles } from "@/lib/queries";
import { waLink } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { absolute: `${s.companyName} — ${s.tagline || "Company Profile"}` },
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
    { icon: Clock3, title: "Respons Cepat", text: settings.businessHours || "Konsultasi via WhatsApp" },
  ];

  return (
    <>
      {sliders.length ? (
        <HeroSlider slides={sliders} />
      ) : (
        <HeroFallback title={settings.tagline || settings.companyName} subtitle={settings.shortProfile} units={units} />
      )}

      {/* Highlights */}
      <section aria-label="Keunggulan" className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-xl shadow-primary/5 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 80} className="flex items-start gap-3 bg-card p-5 sm:p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                <h.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">{h.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ringkasan perusahaan */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Tentang Kami"
            title={`Mitra andal untuk kebutuhan industri & mobilitas Anda`}
          />
          <p className="mt-6 leading-relaxed text-muted-foreground">{settings.shortProfile}</p>
          {settings.commitment && <p className="mt-4 leading-relaxed text-muted-foreground">{settings.commitment}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/tentang">
                Profil Lengkap <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/kontak">Hubungi Kami</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white shadow-2xl sm:p-10">
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="glow-accent absolute -top-16 -right-16 size-56" aria-hidden />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Target className="size-6" />
              </span>
              <p className="mt-6 text-xs font-bold tracking-[0.18em] text-accent uppercase">Visi</p>
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
      <section className="relative bg-muted/50 py-20 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Bidang Usaha"
            title="Empat layanan, satu mitra terpercaya"
            description="Dari pengadaan suku cadang hingga penyewaan kendaraan, kami siap mendukung kelancaran operasional bisnis Anda."
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

      {/* Nilai perusahaan */}
      {settings.values.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <SectionHeading eyebrow="Mengapa Memilih Kami" title="Nilai yang kami pegang dalam setiap pekerjaan" />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {settings.values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title}
                delay={i * 70}
                className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
              >
                <span className="font-mono text-sm font-bold text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* Armada */}
      {vehicles.length > 0 && (
        <section className="bg-muted/50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading align="left" eyebrow="Rental Mobil" title="Armada siap mendukung perjalanan Anda" />
              <Button asChild variant="outline">
                <Link href="/armada">
                  Semua Armada <ArrowRight />
                </Link>
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
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-navy-900 to-navy-950 px-6 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">
          <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
          <div className="glow-accent absolute -bottom-24 left-1/2 size-96 -translate-x-1/2" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Siap bekerja sama dengan kami?
            </h2>
            <p className="mt-4 text-white/75">
              Konsultasikan kebutuhan suku cadang, jasa reparasi, pelumas, atau sewa kendaraan Anda. Tim kami siap
              membantu.
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
