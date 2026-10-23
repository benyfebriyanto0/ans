"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HIDDEN = ["translate-y-5", "opacity-0"];

/** Satu observer untuk semua elemen [data-reveal] pada halaman. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.remove(...HIDDEN);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // sudah terlihat saat dimuat
      el.classList.add(...HIDDEN);
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
