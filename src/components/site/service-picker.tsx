"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitIcon, WhatsappIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type PickerUnit = {
  slug: string;
  menuName: string;
  officialName: string;
  summary: string;
  icon: string;
  services: string[];
  waHref: string;
};

/**
 * Pemilih layanan di hero beranda: pengunjung langsung melihat ringkasan, daftar pekerjaan,
 * dan tombol WhatsApp khusus tiap bidang usaha tanpa pindah halaman.
 * Pola tab ARIA: panah kiri/kanan berpindah tab, Home/End ke ujung.
 */
export function ServicePicker({ units }: { units: PickerUnit[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  if (units.length === 0) return null;
  const u = units[Math.min(active, units.length - 1)];

  function onKey(e: React.KeyboardEvent, i: number) {
    const last = units.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      <div role="tablist" aria-label="Pilih bidang usaha" className="grid grid-cols-2 border-b sm:grid-cols-4">
        {units.map((x, i) => {
          const selected = i === active;
          return (
            <button
              key={x.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-2 px-3 py-4 text-center text-sm font-semibold transition-colors",
                selected ? "bg-sky-soft text-primary" : "text-muted-foreground hover:bg-sky-soft/60 hover:text-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl transition-colors",
                  selected ? "bg-primary text-white" : "bg-secondary text-primary",
                )}
              >
                <UnitIcon name={x.icon} className="size-5" />
              </span>
              {x.menuName}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-accent transition-opacity",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>
      <div
        key={u.slug}
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
        className="picker-panel p-6 sm:p-8"
      >
        <p className="text-sm font-semibold text-gold-600">{u.officialName}</p>
        <p className="mt-2 leading-relaxed text-foreground/80">{u.summary}</p>
        {u.services.length > 0 && (
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {u.services.slice(0, 4).map((sv) => (
              <li key={sv} className="flex items-start gap-2 text-foreground/80">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {sv}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/bidang-usaha/${u.slug}`}>Lihat {u.menuName}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={u.waHref} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="size-4" /> Tanya admin
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
