import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site/brand-logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-4 text-center text-white">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        <BrandMark className="mx-auto size-16" />
        <p className="mt-6 font-mono text-6xl font-extrabold text-accent">404</p>
        <h1 className="mt-3 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-white/70">Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="accent">
            <Link href="/">Ke Beranda</Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/kontak">Hubungi Kami</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
