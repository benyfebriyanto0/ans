import { cn } from "@/lib/utils";

/**
 * Motif identitas: lengkung emas dari logo AN.
 * Dipakai sebagai aksen tunggal (hero, sudut panel biru, kartu tanpa foto)
 * menggantikan pola grid dan glow dekoratif. `draw` menggoreskannya sekali saat halaman dibuka.
 */
export function ArcMark({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={cn("pointer-events-none text-accent", draw && "arc-draw", className)}
    >
      <path d="M4 114C88 44 214 8 396 8C232 22 110 60 4 114Z" />
    </svg>
  );
}
