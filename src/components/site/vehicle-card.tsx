import Link from "next/link";
import { ArrowUpRight, Car, Fuel, Settings2, Users } from "lucide-react";
import { CldImage } from "@/components/cld-image";

export type VehicleCardData = {
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  coverImageUrl: string | null;
  photos?: { imageUrl: string }[];
};

export function VehicleCard({ v }: { v: VehicleCardData }) {
  const img = v.coverImageUrl || v.photos?.[0]?.imageUrl;
  return (
    <Link
      prefetch={false}
      href={`/armada/${v.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-muted">
        {img ? (
          <CldImage
            src={img}
            alt={v.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Car
            className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-primary/20"
            aria-hidden
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          {v.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {v.brand && <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{v.brand}</p>}
        <h3 className="text-lg font-bold">{v.name}</h3>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <li className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 py-2">
            <Users className="size-4 text-primary" />
            {v.seats} kursi
          </li>
          <li className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 py-2">
            <Settings2 className="size-4 text-primary" />
            {v.transmission}
          </li>
          <li className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 py-2">
            <Fuel className="size-4 text-primary" />
            {v.fuel}
          </li>
        </ul>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Lihat detail{" "}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
