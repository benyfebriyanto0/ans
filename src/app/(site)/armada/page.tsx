import type { Metadata } from "next";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Reveal } from "@/components/site/reveal";
import { WhatsappIcon } from "@/components/icons";
import { getActiveVehicles } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Armada Rental Mobil",
  description:
    "Daftar armada rental mobil CV Arsindo Niaga Sejahtera di Bandar Lampung — jenis kendaraan, kapasitas, dan foto unit.",
  alternates: { canonical: "/armada" },
};

export default async function FleetPage() {
  const [vehicles, settings] = await Promise.all([getActiveVehicles(), getSettings()]);
  const categories = Array.from(new Set(vehicles.map((v) => v.category)));
  return (
    <>
      <PageHero
        eyebrow="Rental Mobil"
        title="Armada Rental Mobil"
        description="Kendaraan bersih, terawat, dan siap pakai — tersedia sewa harian, mingguan, hingga bulanan, lepas kunci atau dengan pengemudi."
        crumbs={[
          { href: "/", label: "Beranda" },
          { href: "/bidang-usaha/rental-mobil", label: "Rental Mobil" },
          { label: "Armada" },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {categories.length > 1 && (
          <p className="mb-8 text-sm text-muted-foreground">
            Jenis tersedia: <span className="font-semibold text-foreground">{categories.join(" · ")}</span>
          </p>
        )}
        <h2 className="sr-only">Daftar armada</h2>
        {vehicles.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v, i) => (
              <Reveal as="li" key={v.slug} delay={(i % 3) * 90}>
                <VehicleCard v={v} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center">
            <Car className="size-10 text-muted-foreground/60" />
            <p className="mt-3 text-lg font-semibold">Daftar armada segera hadir</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Hubungi kami untuk informasi ketersediaan unit dan harga sewa terbaru.
            </p>
            <Button asChild variant="accent" className="mt-6">
              <a
                href={waLink(settings.whatsapp, "Halo, saya ingin menanyakan ketersediaan armada rental mobil.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon className="size-4" /> Tanya Ketersediaan
              </a>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
