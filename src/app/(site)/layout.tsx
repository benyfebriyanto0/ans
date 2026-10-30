import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingWhatsapp } from "@/components/site/floating-whatsapp";
import { RevealObserver } from "@/components/site/reveal-observer";
import { getSettings } from "@/lib/settings";
import { getActiveBusinessUnits } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, units] = await Promise.all([getSettings(), getActiveBusinessUnits()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName,
    description: settings.shortProfile,
    url: siteUrl(),
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Bandar Lampung",
      addressRegion: "Lampung",
      addressCountry: "ID",
    },
    logo: settings.logoUrl || siteUrl("/logo/logo-full.png"),
    openingHours: "Mo-Sa 08:00-17:00",
  };

  return (
    <div className="site">
      <a
        href="#konten"
        className="sr-only z-50 rounded bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Lewati ke konten
      </a>
      <SiteHeader
        companyName={settings.companyName}
        logoUrl={settings.logoUrl}
        units={units.map((u) => ({ slug: u.slug, menuName: u.menuName, icon: u.icon }))}
        whatsapp={settings.whatsapp}
        waMessage={settings.waDefaultMessage}
        phone={settings.phone}
      />
      <main id="konten">{children}</main>
      <SiteFooter settings={settings} units={units} />
      <RevealObserver />
      <FloatingWhatsapp number={settings.whatsapp} message={settings.waDefaultMessage} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
