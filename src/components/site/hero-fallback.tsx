import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitIcon } from "@/components/icons";

/** Hero default ketika admin belum mengunggah slider. */
export function HeroFallback({
  title,
  subtitle,
  units,
}: {
  title: string;
  subtitle: string;
  units: { slug: string; menuName: string; icon: string; kbliCode: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-32 pb-20 text-white sm:pt-40 lg:min-h-[88svh] lg:pb-28">
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden />
      <div className="glow-accent absolute -top-40 right-0 size-[34rem]" aria-hidden />
      <div className="glow-primary absolute bottom-0 -left-40 size-[30rem]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            <ShieldCheck className="size-3.5 text-accent" /> Perusahaan resmi berbadan hukum CV · Bandar Lampung
          </p>
          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 [animation-delay:200ms]">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3 [animation-delay:300ms]">
            <Button asChild variant="accent" size="lg">
              <Link prefetch={false} href="/bidang-usaha">
                Lihat Bidang Usaha <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link prefetch={false} href="/kontak">
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
        {/* Susunan berundak: kolom kanan diturunkan lewat pembungkus, sehingga efek hover
            pada kartu (naik 4px) tidak menimpa offset dan kartu tidak bertabrakan. */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          {units.map((u, i) => (
            <div key={u.slug} className={i % 2 === 1 ? "translate-y-6" : undefined}>
              <Link
                prefetch={false}
                href={`/bidang-usaha/${u.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:bg-white/10"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
                  <UnitIcon name={u.icon} className="size-6" />
                </span>
                <p className="mt-4 font-bold">{u.menuName}</p>
                <p className="mt-1 text-xs text-white/75">KBLI {u.kbliCode}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
