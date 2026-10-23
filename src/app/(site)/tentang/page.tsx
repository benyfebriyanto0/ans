import type { Metadata } from "next";
import { Building2, CheckCircle2, FileBadge2, Handshake, MapPin, Target, Rocket } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { getSettings } from "@/lib/settings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Tentang Kami",
    description: `Profil, visi, misi, nilai, dan legalitas ${s.companyName}.`,
    alternates: { canonical: "/tentang" },
    openGraph: { title: `Tentang ${s.companyName}`, description: s.shortProfile, url: "/tentang" },
  };
}

export default async function AboutPage() {
  const s = await getSettings();
  const legal = [
    { label: "Nama Perusahaan", value: s.companyName },
    { label: "Bentuk Usaha", value: s.companyForm },
    { label: "NIB", value: s.nib },
    { label: "NPWP", value: s.npwp },
    { label: "Alamat", value: s.address },
  ].filter((r) => r.value);

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title={s.companyName}
        description={s.tagline}
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Tentang Kami" }]}
      />

      {/* Profil */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-7">
          <SectionHeading align="left" eyebrow="Profil Perusahaan" title="Tumbuh bersama industri di Lampung" />
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            {s.profile.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <div className="rounded-3xl border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <FileBadge2 className="size-5" />
              </span>
              <h2 className="text-lg font-bold">Legalitas Perusahaan</h2>
            </div>
            <dl className="mt-6 divide-y">
              {legal.map((l) => (
                <div key={l.label} className="grid grid-cols-3 gap-3 py-3 text-sm">
                  <dt className="font-medium text-muted-foreground">{l.label}</dt>
                  <dd className="col-span-2 font-semibold text-foreground">{l.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* Visi & Misi */}
      <section className="relative overflow-hidden bg-sky-soft py-20 sm:py-28">
        <div className="bg-grid-light absolute inset-0" aria-hidden />
        <div className="glow-accent absolute top-0 right-0 size-[28rem]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Target className="size-6" />
            </span>
            <h2 className="mt-6 text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Visi</h2>
            <p className="mt-4 text-2xl leading-relaxed font-bold text-balance sm:text-3xl">“{s.vision}”</p>
          </Reveal>
          <Reveal delay={120}>
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-white">
              <Rocket className="size-6" />
            </span>
            <h2 className="mt-6 text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Misi</h2>
            <ol aria-label="Daftar misi" className="mt-4 space-y-4">
              {s.missions.map((m, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white font-mono text-sm font-bold text-primary shadow-sm">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed text-foreground/80">{m}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Nilai */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <SectionHeading eyebrow="Nilai Perusahaan" title="Prinsip yang menjadi fondasi kami" />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {s.values.map((v, i) => (
            <Reveal
              as="li"
              key={v.title}
              delay={i * 70}
              className="rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent-foreground">
                <CheckCircle2 className="size-6 text-gold-600" />
              </span>
              <h3 className="mt-4 font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Komitmen */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="grid gap-8 rounded-3xl border bg-gradient-to-br from-secondary to-card p-8 sm:p-12 lg:grid-cols-3 lg:items-center">
          <div className="flex items-center gap-4 lg:col-span-1">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Handshake className="size-7" />
            </span>
            <h2 className="text-2xl font-extrabold">Komitmen Kami</h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-2">{s.commitment}</p>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Building2 className="size-4 text-primary" /> {s.companyForm}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> {s.address}
          </span>
        </div>
      </section>
    </>
  );
}
