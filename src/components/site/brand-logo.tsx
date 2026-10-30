import Image from "next/image";
import { cn } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary-url";

/** Rasio logo-mark "AN" (lebar : tinggi). */
const MARK_RATIO = 356 / 192;

/**
 * Logo-mark "AN" CV Arsindo Niaga Sejahtera.
 * `inverted` memakai versi putih-emas untuk latar gelap.
 * Ukuran diatur lewat tinggi (mis. `h-8`), lebar mengikuti rasio.
 */
export function BrandMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={inverted ? "/logo/logo-mark-white.png" : "/logo/logo-mark.png"}
      alt=""
      aria-hidden
      width={Math.round(40 * MARK_RATIO)}
      height={40}
      className={cn("h-10 w-auto shrink-0 object-contain", className)}
    />
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
  const short = name.replace(/^CV\.?\s*/i, "").trim();
  const words = short.split(/\s+/);
  const main = words.slice(0, -1).join(" ") || short; // "Arsindo Niaga"
  const sub = words.length > 1 ? words[words.length - 1] : ""; // "Sejahtera"
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {logoUrl ? (
        <Image
          src={cldUrl(logoUrl, { height: 96 })}
          alt={name}
          width={74}
          height={40}
          className="h-10 w-auto object-contain"
          style={{ width: "auto" }}
          unoptimized
        />
      ) : (
        <BrandMark inverted={inverted} className="h-9 sm:h-10" />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[9px] font-semibold tracking-[0.3em] uppercase",
            inverted ? "text-accent" : "text-accent-foreground/80",
          )}
        >
          CV
        </span>
        <span
          className={cn(
            "mt-0.5 text-[15px] font-extrabold tracking-tight uppercase sm:text-base",
            inverted ? "text-white" : "text-primary",
          )}
        >
          {main}
        </span>
        {sub && (
          <span
            className={cn(
              "mt-0.5 text-[9px] font-medium tracking-[0.42em] uppercase",
              inverted ? "text-white/70" : "text-primary/75",
            )}
          >
            {sub}
          </span>
        )}
      </span>
    </span>
  );
}
