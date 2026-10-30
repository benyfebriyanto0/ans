import Link from "next/link";
import { ArcMark } from "@/components/site/arc-mark";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site/brand-logo";

export default function NotFound() {
  return (
    <main className="bg-hero-light relative grid min-h-dvh place-items-center overflow-hidden px-4 text-center text-foreground">
      <ArcMark className="absolute -right-32 bottom-0 w-[40rem] opacity-25" />
      <div className="relative">
        <BrandMark className="mx-auto h-16" />
        <p className="mt-6 text-6xl font-extrabold text-primary tabular-nums">404</p>
        <h1 className="mt-3 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="accent">
            <Link href="/">Ke Beranda</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/kontak">Hubungi Kami</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
