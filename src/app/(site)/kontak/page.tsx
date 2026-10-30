import type { Metadata } from "next";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { MapEmbed } from "@/components/site/map-embed";
import { WhatsappIcon } from "@/components/icons";
import { getSettings } from "@/lib/settings";
import { getActiveBusinessUnits } from "@/lib/queries";
import { waLink } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Kontak",
    description: `Hubungi ${s.companyName}: ${s.address}. Telepon/WhatsApp ${s.phone}, email ${s.email}.`,
    alternates: { canonical: "/kontak" },
  };
}

export default async function ContactPage() {
  const [s, units] = await Promise.all([getSettings(), getActiveBusinessUnits()]);
  const items = [
    { icon: MapPin, label: "Alamat", value: s.address, href: s.mapsLink || undefined },
    { icon: Phone, label: "Telepon", value: s.phone, href: s.phone ? `tel:${s.phone}` : undefined },
    {
      icon: WhatsappIcon,
      label: "WhatsApp",
      value: s.phone || s.whatsapp,
      href: s.whatsapp ? waLink(s.whatsapp, s.waDefaultMessage) : undefined,
    },
    { icon: Mail, label: "Email", value: s.email, href: s.email ? `mailto:${s.email}` : undefined },
    { icon: Clock, label: "Jam operasional", value: s.businessHours },
  ].filter((i) => i.value);

  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Mari berdiskusi tentang kebutuhan Anda"
        description="Kirimkan pertanyaan atau permintaan penawaran, tim kami akan merespons secepatnya pada jam kerja."
        crumbs={[{ href: "/", label: "Beranda" }, { label: "Kontak" }]}
      />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8">
        <div className="min-w-0 space-y-4 lg:col-span-5">
          {items.map((i) => {
            const content = (
              <>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                  <i.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {i.label}
                  </span>
                  <span className="mt-0.5 block font-semibold [overflow-wrap:anywhere] text-foreground">{i.value}</span>
                </span>
                {i.href && <ExternalLink className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden />}
              </>
            );
            return i.href ? (
              <a
                key={i.label}
                href={i.href}
                target={i.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary/30 hover:shadow-md"
              >
                {content}
              </a>
            ) : (
              <div key={i.label} className="flex items-start gap-4 rounded-2xl border bg-card p-4">
                {content}
              </div>
            );
          })}
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold">Formulir Kontak</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Kolom bertanda * wajib diisi.</p>
            <ContactForm units={units.map((u) => ({ id: u.id, menuName: u.menuName }))} />
          </div>
        </div>
      </section>
      {s.mapsEmbedUrl && (
        <section aria-label="Peta lokasi" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border shadow-lg">
            <MapEmbed src={s.mapsEmbedUrl} title={`Lokasi ${s.companyName} di Google Maps`} link={s.mapsLink} />
          </div>
        </section>
      )}
    </>
  );
}
