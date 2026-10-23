"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { cn, waLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UnitIcon, WhatsappIcon } from "@/components/icons";
import { BrandLogo } from "./brand-logo";

type NavUnit = { slug: string; menuName: string; icon: string };

export function SiteHeader({
  companyName,
  logoUrl,
  units,
  whatsapp,
  waMessage,
  phone,
}: {
  companyName: string;
  logoUrl?: string;
  units: NavUnit[];
  whatsapp: string;
  waMessage: string;
  phone: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Tema cerah: teks & logo selalu versi gelap; latar header makin solid saat di-scroll.
  const solid = true;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu mobile saat pindah halaman (pola "adjust state during render")
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/bidang-usaha", label: "Bidang Usaha", children: true },
    { href: "/armada", label: "Armada" },
    { href: "/kontak", label: "Kontak" },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || open
          ? "border-b border-border/60 bg-white/90 shadow-sm backdrop-blur-lg"
          : "border-b border-transparent bg-white/60 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link href="/" title="Beranda" className="shrink-0">
          <BrandLogo name={companyName} logoUrl={logoUrl} inverted={!solid} />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {links.map((l) =>
            l.children ? (
              <div key={l.href} className="group relative">
                <Link
                  href={l.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    solid
                      ? "text-foreground/80 hover:bg-secondary hover:text-primary"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                    isActive(l.href) && (solid ? "text-primary" : "text-white"),
                  )}
                >
                  {l.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute top-full left-1/2 w-80 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-2xl border bg-white p-2 shadow-xl">
                    {units.map((u) => (
                      <Link
                        key={u.slug}
                        href={`/bidang-usaha/${u.slug}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                      >
                        <span className="grid size-9 place-items-center rounded-lg bg-primary/8 text-primary">
                          <UnitIcon name={u.icon} className="size-4.5" />
                        </span>
                        {u.menuName}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  solid
                    ? "text-foreground/80 hover:bg-secondary hover:text-primary"
                    : "text-white/85 hover:bg-white/10 hover:text-white",
                  isActive(l.href) && (solid ? "text-primary" : "text-white"),
                  isActive(l.href) &&
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent",
                )}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="accent" size="sm" className="hidden h-9 px-4 sm:inline-flex">
            <a href={waLink(whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="size-4" /> Hubungi Kami
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className={cn(
              "grid size-10 place-items-center rounded-lg lg:hidden",
              solid ? "text-primary hover:bg-secondary" : "text-white hover:bg-white/10",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t bg-white transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[85dvh] overflow-y-auto" : "max-h-0 border-t-0",
        )}
      >
        <nav aria-label="Navigasi mobile" className="space-y-1 px-4 py-4">
          {links.map((l) => (
            <div key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "block rounded-lg px-3 py-2.5 font-semibold",
                  isActive(l.href) ? "bg-secondary text-primary" : "text-foreground/80",
                )}
              >
                {l.label}
              </Link>
              {l.children && (
                <div className="ml-3 border-l pl-3">
                  {units.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/bidang-usaha/${u.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <UnitIcon name={u.icon} className="size-4" /> {u.menuName}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="grid gap-2 pt-3 sm:grid-cols-2">
            <Button asChild variant="accent">
              <a href={waLink(whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="size-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${phone}`}>
                <Phone /> {phone}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
