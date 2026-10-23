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
    <section className="bg-hero-light relative overflow-hidden pt-32 pb-20 text-foreground sm:pt-40 lg:min-h-[88svh] lg:pb-28">
      <div
        className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            <ShieldCheck className="size-3.5 text-gold-600" /> Perusahaan resmi berbadan hukum CV · Bandar Lampung
          </p>
          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3 [animation-delay:300ms]">
            <Button asChild variant="accent" size="lg">
              <Link prefetch={false} href="/bidang-usaha">
                Lihat Bidang Usaha <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
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
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <UnitIcon name={u.icon} className="size-6" />
                </span>
                <p className="mt-4 font-bold text-navy-950">{u.menuName}</p>
                <p className="mt-1 text-xs text-muted-foreground">Lihat layanan →</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
