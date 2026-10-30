import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons";
import { BrandLogo } from "./brand-logo";

export function SiteFooter({
  settings,
  units,
}: {
  settings: SiteSettings;
  units: { slug: string; menuName: string }[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-border bg-sky-soft text-muted-foreground">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <BrandLogo name={settings.companyName} logoUrl={settings.logoUrl} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{settings.shortProfile}</p>
          {(settings.nib || settings.npwp) && (
            <dl className="mt-4 grid gap-1 text-xs text-muted-foreground">
              {settings.nib && (
                <div>
                  <dt className="inline">NIB: </dt>
                  <dd className="inline font-medium text-foreground">{settings.nib}</dd>
                </div>
              )}
              {settings.npwp && (
                <div>
                  <dt className="inline">NPWP: </dt>
                  <dd className="inline font-medium text-foreground">{settings.npwp}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold tracking-wide text-navy-950 uppercase">Perusahaan</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link prefetch={false} className="hover:text-primary" href="/tentang">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link prefetch={false} className="hover:text-primary" href="/bidang-usaha">
                Bidang Usaha
              </Link>
            </li>
            <li>
              <Link prefetch={false} className="hover:text-primary" href="/armada">
                Armada Rental
              </Link>
            </li>
            <li>
              <Link prefetch={false} className="hover:text-primary" href="/kontak">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold tracking-wide text-navy-950 uppercase">Bidang Usaha</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {units.map((u) => (
              <li key={u.slug}>
                <Link prefetch={false} className="hover:text-primary" href={`/bidang-usaha/${u.slug}`}>
                  {u.menuName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold tracking-wide text-navy-950 uppercase">Kontak</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {settings.address}
            </li>
            {settings.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a className="hover:text-primary" href={`tel:${settings.phone}`}>
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.whatsapp && (
              <li className="flex gap-3">
                <WhatsappIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  className="hover:text-primary"
                  href={waLink(settings.whatsapp, settings.waDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a className="break-all hover:text-primary" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
            )}
            {settings.businessHours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                {settings.businessHours}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {settings.companyName}. Seluruh hak cipta dilindungi.
          </p>
          <p>Bandar Lampung, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
