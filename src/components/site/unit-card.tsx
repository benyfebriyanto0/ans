import { CldImage } from "@/components/cld-image";
import { ViewTransition } from "react";
import Link from "next/link";
import { Images } from "lucide-react";
import { ArcMark } from "./arc-mark";
import { UnitIcon } from "@/components/icons";

export type UnitCardData = {
  slug: string;
  menuName: string;
  officialName: string;
  kbliCode: string;
  summary: string;
  icon: string;
  coverImageUrl: string | null;
  _count?: { photos: number };
};

export function UnitCard({ unit, index = 0 }: { unit: UnitCardData; index?: number }) {
  return (
    <Link
      prefetch={false}
      href={`/bidang-usaha/${unit.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
    >
      <ViewTransition name={`unit-cover-${unit.slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {unit.coverImageUrl ? (
            <CldImage
              src={unit.coverImageUrl}
              alt={`${unit.menuName}, ${unit.officialName}`}
              fill
              sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-sky-soft">
              <ArcMark className="absolute -right-16 bottom-4 w-80 opacity-60 transition-transform duration-700 group-hover:-translate-x-2" />
            </div>
          )}
          {unit.coverImageUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-bold tabular-nums ${unit.coverImageUrl ? "text-white/80" : "text-primary/50"}`}
          >
            0{index + 1}
          </span>
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col p-5">
        <div className="relative z-10 -mt-11 mb-3 grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground ring-4 ring-card">
          <UnitIcon name={unit.icon} className="size-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">{unit.menuName}</h3>
        <p className="text-xs font-medium text-primary/70">{unit.officialName}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{unit.summary}</p>
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <span className="underline-offset-4 group-hover:underline">Lihat detail</span>
          </span>
          {unit._count && unit._count.photos > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Images className="size-3.5" /> {unit._count.photos} foto
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
