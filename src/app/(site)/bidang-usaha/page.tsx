import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { UnitCard } from "@/components/site/unit-card";
import { Reveal } from "@/components/site/reveal";
import { getActiveBusinessUnits } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bidang Usaha",
  description:
    "Empat bidang usaha CV Arsindo Niaga Sejahtera: perdagangan suku cadang mesin, jasa reparasi mesin, perdagangan oli & pelumas, dan rental mobil.",
  alternates: { canonical: "/bidang-usaha" },
};

export default async function BusinessUnitsPage() {
  const units = await getActiveBusinessUnits();
  return (
    <>
      <PageHero
        eyebrow="Bidang Usaha"
        title="Layanan terpadu untuk kebutuhan bisnis Anda"
        description="Empat bidang usaha yang saling melengkapi untuk mendukung kelancaran operasional bisnis Anda."
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Bidang Usaha" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="sr-only">Daftar bidang usaha</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((u, i) => (
            <Reveal as="li" key={u.slug} delay={i * 90}>
              <UnitCard unit={u} index={i} />
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
