import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Penanda elemen yang dianimasikan saat masuk viewport (Server Component, tanpa JS per elemen).
 * Animasinya dijalankan oleh satu <RevealObserver /> di layout publik.
 * HTML awal selalu terlihat (aman untuk SEO, no-JS, dan Lighthouse).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}) {
  return (
    <Tag
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
