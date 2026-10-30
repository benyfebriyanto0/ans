"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Car,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MonitorPlay,
  Shapes,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-logo";
import { ArcMark } from "@/components/site/arc-mark";
import { logoutAction } from "@/server/actions/auth";

type NavItem = { href: string; label: string; icon: typeof Shapes; exact?: boolean; badge?: boolean };

const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Ringkasan", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    label: "Konten website",
    items: [
      { href: "/admin/bidang-usaha", label: "Bidang Usaha", icon: Shapes },
      { href: "/admin/galeri", label: "Galeri Foto", icon: Images },
      { href: "/admin/slider", label: "Slider Beranda", icon: MonitorPlay },
      { href: "/admin/profil", label: "Profil Perusahaan", icon: Building2 },
    ],
  },
  { label: "Rental", items: [{ href: "/admin/armada", label: "Armada", icon: Car }] },
  {
    label: "Komunikasi & akses",
    items: [
      { href: "/admin/pesan", label: "Pesan Masuk", icon: Mail, badge: true },
      { href: "/admin/pengguna", label: "Pengguna Admin", icon: Users },
    ],
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function AdminNav({ unread, user }: { unread: number; user: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Menu admin" className="relative flex flex-1 flex-col overflow-y-auto px-3 pt-4 pb-3">
      {GROUPS.map((g) => (
        <div key={g.label} className="mb-5">
          <p className="px-3 pb-2 text-[11px] font-semibold text-white/40">{g.label}</p>
          <ul className="space-y-0.5">
            {g.items.map((n) => {
              const on = active(n.href, n.exact);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors",
                      on ? "bg-white text-navy-950" : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-lg transition-colors",
                        on ? "bg-accent text-accent-foreground" : "bg-white/6 text-white/80 group-hover:bg-white/10",
                      )}
                    >
                      <n.icon className="size-4" />
                    </span>
                    <span className="flex-1">{n.label}</span>
                    {n.badge && unread > 0 && (
                      <span className="min-w-6 rounded-full bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-accent-foreground tabular-nums">
                        {unread}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white"
        >
          <ExternalLink className="size-4" /> Lihat Website
        </a>
        <div className="flex items-center gap-3 rounded-xl bg-white/6 p-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-extrabold text-accent-foreground">
            {initials(user.name)}
          </span>
          <span className="min-w-0 flex-1 text-xs">
            <span className="block truncate font-semibold text-white">{user.name}</span>
            <span className="block truncate text-white/50">{user.email}</span>
          </span>
          <form action={logoutAction}>
            <button
              aria-label="Keluar"
              title="Keluar"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Topbar mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-navy-950 px-4 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <BrandMark inverted className="h-7" /> Admin
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="relative grid size-10 cursor-pointer place-items-center rounded-lg hover:bg-white/10"
        >
          <Menu className="size-5" />
          {unread > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-accent" />}
        </button>
      </div>
      {/* Drawer mobile */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}>
        <div
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-black/50 transition-opacity", open ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 flex-col overflow-hidden bg-navy-950 transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between px-4 text-white">
            <span className="flex items-center gap-2 font-bold">
              <BrandMark inverted className="h-7" /> Arsindo Admin
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </div>
          {nav}
        </aside>
      </div>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-hidden bg-navy-950 lg:flex">
        <ArcMark className="absolute -bottom-6 -left-24 w-[26rem] opacity-[0.12]" />
        <Link href="/admin" className="relative flex h-16 items-center gap-2.5 px-5 text-white">
          <BrandMark inverted className="h-8" />
          <span className="leading-tight">
            <span className="block text-sm font-extrabold">Arsindo Niaga</span>
            <span className="block text-[11px] text-white/50">Panel Admin</span>
          </span>
        </Link>
        {nav}
      </aside>
    </>
  );
}
