import Image from "next/image";
import { cn } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary-url";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-10", className)} aria-hidden>
      {/* Warna solid (tanpa gradient ber-id) agar aman dirender berkali-kali dalam satu halaman */}
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="oklch(0.32 0.09 255)" />
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="none" stroke="oklch(0.79 0.16 70)" strokeWidth="2.5" />
      <path d="M15.5 33 24 13l8.5 20h-4.6l-1.7-4.3h-4.4L20.1 33z" fill="oklch(0.79 0.16 70)" />
      <path d="M22.9 25.2h2.2L24 22.3z" fill="oklch(0.32 0.09 255)" />
    </svg>
  );
}

export function BrandLogo({
  name,
  logoUrl,
  inverted = false,
  className,
}: {
  name: string;
  logoUrl?: string;
  inverted?: boolean;
  className?: string;
}) {
  const short = name.replace(/^CV\.?\s*/i, "");
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {logoUrl ? (
        <Image
          src={cldUrl(logoUrl, { height: 96 })}
          alt={name}
          width={40}
          height={40}
          className="size-10 object-contain"
          unoptimized
        />
      ) : (
        <BrandMark />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.2em] uppercase",
            inverted ? "text-accent" : "text-accent-foreground/70",
          )}
        >
          CV
        </span>
        <span
          className={cn(
            "text-[15px] font-extrabold tracking-tight sm:text-base",
            inverted ? "text-white" : "text-primary",
          )}
        >
          {short}
        </span>
      </span>
    </span>
  );
}
