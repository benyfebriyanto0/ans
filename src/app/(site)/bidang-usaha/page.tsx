import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  FileBadge2,
  Handshake,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { ConsultForm } from "@/components/site/consult-form";
import { MapEmbed } from "@/components/site/map-embed";
import { CldImage } from "@/components/cld-image";
import { UnitIcon, WhatsappIcon } from "@/components/icons";
import { getActiveBusinessUnits } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bidang Usaha",
  description:
    "Suku cadang mesin & peralatan industri, jasa reparasi mesin, oli & pelumas, serta rental mobil di Bandar Lampung — konsultasi cepat via WhatsApp bersama CV Arsindo Niaga Sejahtera.",
  alternates: { canonical: "/bidang-usaha" },
};

const STEPS = [
  {
    title: "Ceritakan kebutuhan Anda",
    text: "Isi formulir singkat atau chat langsung: jenis barang/layanan, jumlah, lokasi, dan kapan dibutuhkan.",
  },
  {
    title: "Terima penawaran",
    text: "Tim kami memeriksa ketersediaan dan mengirimkan rekomendasi serta penawaran harga terbaik.",
  },
  {
    title: "Konfirmasi & kami kerjakan",
    text: "Setelah disepakati, barang dikirim atau pekerjaan dijadwalkan — kami kabari setiap progresnya.",
  },
];

const FAQ = [
  {
    q: "Apakah CV Arsindo Niaga Sejahtera perusahaan resmi?",
    a: "Ya. Kami badan usaha berbentuk Persekutuan Komanditer (CV) yang terdaftar dengan kode KBLI untuk setiap bidang usaha. Detail legalitas dapat dilihat di halaman Tentang Kami.",
  },
  {
    q: "Bagaimana cara mengetahui harga?",
    a: "Harga bergantung pada spesifikasi, jumlah, dan lokasi. Kirimkan kebutuhan Anda lewat formulir atau WhatsApp, admin kami akan mengirim penawaran secepatnya pada jam kerja.",
  },
  {
    q: "Apakah melayani kebutuhan perusahaan dan proyek?",
    a: "Tentu. Kami terbiasa melayani pabrik, perkebunan, kontraktor, dan instansi — termasuk pengadaan rutin, kontrak perawatan berkala, maupun sewa kendaraan operasional jangka panjang.",
  },
  {
    q: "Area mana saja yang dilayani?",
    a: "Kami berbasis di Bandar Lampung dan melayani wilayah Provinsi Lampung serta sekitarnya. Untuk lokasi di luar area, silakan konsultasikan terlebih dahulu.",
  },
  {
    q: "Apakah mengisi formulir berarti pesanan sudah pasti?",
    a: "Belum. Formulir hanya menyiapkan pesan WhatsApp agar Anda tidak perlu mengetik ulang. Pesanan dinyatakan pasti setelah dikonfirmasi oleh admin kami.",
  },
];

export default async function BusinessUnitsPage() {
  const [units, s] = await Promise.all([getActiveBusinessUnits(), getSettings()]);
  const waGeneral = waLink(s.whatsapp, s.waDefaultMessage);
  const trust = [
    { icon: FileBadge2, label: "Berbadan hukum CV" },
    { icon: BadgeCheck, label: `${units.length} bidang usaha ber-KBLI` },
    { icon: Clock3, label: "Respons cepat via WhatsApp" },
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="bg-hero-light relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div
          className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <ShieldCheck className="size-3.5 text-gold-600" /> {s.companyName} · Lampung
            </p>
            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl lg:text-6xl">
              Kebutuhan industri & mobilitas.{" "}
              <em className="font-extrabold text-primary not-italic underline decoration-accent decoration-4 underline-offset-8 sm:decoration-[6px]">
                Serahkan ke kami.
              </em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Dari suku cadang mesin, jasa reparasi, pasokan oli & pelumas, hingga sewa kendaraan — satu mitra untuk
              kelancaran operasional bisnis Anda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <a href="#konsultasi">
                  Konsultasi Gratis <ArrowUpRight />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
                <a href="#layanan">
                  Lihat Bidang Usaha <ArrowDown />
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

          {/* Kolase bidang usaha */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {units.slice(0, 4).map((u, i) => (
                <a
                  key={u.slug}
                  href={`#${u.slug}`}
                  className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 ${i === 0 ? "aspect-[4/5]" : i === 3 ? "aspect-[4/5]" : "aspect-square"}`}
                >
                  {u.coverImageUrl ? (
                    <CldImage
                      src={u.coverImageUrl}
                      alt={u.menuName}
                      fill
                      sizes="(min-width:1024px) 20vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${i % 3 === 0 ? "from-primary to-navy-900" : "from-navy-900 to-primary"}`}
                    >
                      <UnitIcon
                        name={u.icon}
                        className="absolute -right-5 -bottom-5 size-32 text-white/10 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent p-4 pt-12">
                    <span className="mb-2 grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <UnitIcon name={u.icon} className="size-4.5" />
                    </span>
                    <p className="text-sm font-bold text-white">{u.menuName}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Strip keunggulan ===== */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              icon: Handshake,
              t: "Satu mitra",
              d: "Pengadaan, perbaikan, pelumas, dan transportasi dalam satu pintu.",
            },
            { icon: Clock3, t: "Respons cepat", d: s.businessHours || "Konsultasi & penawaran via WhatsApp." },
            { icon: MapPin, t: "Bandar Lampung", d: "Melayani Lampung dan sekitarnya." },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-gold-600">
                <x.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold text-navy-950">{x.t}</p>
                <p className="text-sm text-muted-foreground">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Daftar bidang usaha ===== */}
      <section id="layanan" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Bidang Usaha</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Butuh layanan apa hari ini?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pilih bidang usaha untuk melihat detail layanan dan dokumentasi pekerjaan, atau langsung tanyakan
            ketersediaan ke admin kami.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {units.map((u, i) => {
            const msg =
              u.waMessage || `Halo ${s.companyName}, saya ingin menanyakan layanan ${u.menuName} (${u.officialName}).`;
            return (
              <Reveal
                as="li"
                key={u.slug}
                delay={(i % 2) * 90}
                className="group flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-xl hover:shadow-primary/10 sm:flex-row"
              >
                <div
                  id={u.slug}
                  className="relative aspect-[16/10] shrink-0 scroll-mt-24 overflow-hidden bg-secondary sm:aspect-auto sm:w-2/5"
                >
                  {u.coverImageUrl ? (
                    <CldImage
                      src={u.coverImageUrl}
                      alt={`${u.menuName} — ${u.officialName}`}
                      fill
                      sizes="(min-width:768px) 20vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sky-soft via-white to-secondary">
                      <div className="bg-grid-light absolute inset-0" />
                      <UnitIcon name={u.icon} className="relative size-16 text-primary" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
                    KBLI {u.kbliCode}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-xs font-bold text-gold-600">0{i + 1}</span>
                  <h3 className="mt-1 text-xl font-bold text-navy-950">{u.menuName}</h3>
                  <p className="text-xs font-medium text-primary/70">{u.officialName}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{u.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild variant="accent" size="sm" className="h-9 px-4">
                      <a href={waLink(s.whatsapp, msg)} target="_blank" rel="noopener noreferrer">
                        <WhatsappIcon className="size-4" /> Tanya Ketersediaan
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-9 px-4">
                      <Link prefetch={false} href={`/bidang-usaha/${u.slug}`}>
                        Lihat Detail <ArrowUpRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ===== Cara kerja ===== */}
      <section className="bg-sky-soft py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Tidak perlu ribet</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Tiga langkah. Kebutuhan beres.
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((st, i) => (
              <Reveal
                as="li"
                key={st.title}
                delay={i * 90}
                className="relative rounded-2xl border bg-white p-6 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary text-lg font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-950">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Formulir konsultasi ===== */}
      <section id="konsultasi" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold tracking-[0.18em] text-gold-600 uppercase">Konsultasi</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Mulai rencanakan kebutuhan Anda
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Isi data singkat di samping, lalu kami arahkan ke WhatsApp dengan pesan yang sudah tersusun rapi.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition hover:border-primary/30"
              >
                <MessageCircle className="size-5 text-primary" />
                <span>
                  Lebih suka chat langsung? <strong className="text-primary">Hubungi admin</strong>
                </span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
              <ConsultForm
                units={units.map((u) => ({ slug: u.slug, menuName: u.menuName }))}
                whatsapp={s.whatsapp}
                companyName={s.companyName}
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
          {FAQ.map((f) => (
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
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-900 px-6 py-14 text-center text-white shadow-2xl shadow-primary/20 sm:px-12">
          <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Anda fokus pada bisnis. Kami bantu urusan teknis & kendaraan.
            </h2>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="accent" size="lg">
                <a href={waGeneral} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="size-5" /> Chat Admin Sekarang
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
