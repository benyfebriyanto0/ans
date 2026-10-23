"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Car,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MonitorPlay,
  Shapes,
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-logo";
import { logoutAction } from "@/server/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bidang-usaha", label: "Bidang Usaha", icon: Shapes },
  { href: "/admin/galeri", label: "Galeri Foto", icon: Images },
  { href: "/admin/slider", label: "Slider Beranda", icon: MonitorPlay },
  { href: "/admin/armada", label: "Armada Rental", icon: Car },
  { href: "/admin/profil", label: "Profil Perusahaan", icon: Building2 },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: Mail, badge: true },
  { href: "/admin/pengguna", label: "Pengguna Admin", icon: Users },
];

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
    <nav aria-label="Menu admin" className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={active(n.href, n.exact) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active(n.href, n.exact) ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
          )}
        >
          <n.icon className={cn("size-4.5", active(n.href, n.exact) && "text-accent")} />
          <span className="flex-1">{n.label}</span>
          {n.badge && unread > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
              {unread}
            </span>
          )}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4.5" /> Lihat Website
        </a>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
            <LogOut className="size-4.5" /> Keluar
          </button>
        </form>
        <div className="px-3 pt-2 text-xs text-white/45">
          <p className="truncate font-semibold text-white/70">{user.name}</p>
          <p className="truncate">{user.email}</p>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Topbar mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-navy-950 px-4 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <BrandMark className="size-8" /> Admin
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="grid size-10 place-items-center rounded-lg hover:bg-white/10"
        >
          <Menu className="size-5" />
          {unread > 0 && <span className="absolute top-3 right-4 size-2 rounded-full bg-accent" />}
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
            "absolute inset-y-0 left-0 flex w-72 flex-col bg-navy-950 transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between px-4 text-white">
            <span className="flex items-center gap-2 font-bold">
              <BrandMark className="size-8" /> Arsindo Admin
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="grid size-9 place-items-center rounded-lg hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </div>
          {nav}
        </aside>
      </div>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy-950 lg:flex">
        <Link href="/admin" className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5 text-white">
          <BrandMark className="size-9" />
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
