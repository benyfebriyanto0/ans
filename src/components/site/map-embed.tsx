"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Google Maps dimuat hanya saat area peta mendekati viewport (atau diklik),
 * agar iframe pihak ketiga tidak membebani pemuatan awal halaman.
 */
export function MapEmbed({ src, title, link }: { src: string; title: string; link?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setLoad(true), io.disconnect()), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-[380px] w-full bg-muted sm:h-[440px]">
      {load ? (
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 size-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="bg-dots absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground"
        >
          <MapPin className="size-10 text-primary" />
          <span className="font-semibold text-foreground">Tampilkan peta lokasi</span>
          {link && <span className="text-xs">atau buka di Google Maps</span>}
        </button>
      )}
    </div>
  );
}
