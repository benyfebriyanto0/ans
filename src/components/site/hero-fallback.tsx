import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArcMark } from "./arc-mark";
import { ServicePicker, type PickerUnit } from "./service-picker";

/** Hero default ketika admin belum mengunggah slider: judul + pemilih layanan interaktif. */
export function HeroFallback({ title, subtitle, units }: { title: string; subtitle: string; units: PickerUnit[] }) {
  return (
    <section className="bg-hero-light relative overflow-hidden pt-32 pb-24 text-foreground sm:pt-36 lg:pb-28">
      <ArcMark draw className="absolute -right-32 bottom-6 w-[40rem] opacity-30 lg:w-[60rem]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link prefetch={false} href="/bidang-usaha">
                Lihat Bidang Usaha
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/20 bg-white text-primary">
              <Link prefetch={false} href="/kontak">
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-6">
          <ServicePicker units={units} />
        </div>
      </div>
    </section>
  );
}
