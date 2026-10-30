"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cloudinaryLoader } from "@/lib/cloudinary-url";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner utama"
      className="relative h-[88svh] min-h-[560px] overflow-hidden bg-navy-950"
    >
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((s, i) => {
            const external = s.buttonLink?.startsWith("http");
            return (
              <div
                key={s.id}
                className="relative h-full min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} dari ${slides.length}`}
              >
                <Image
                  loader={cloudinaryLoader}
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  sizes="100vw"
                  className={cn("object-cover", index === i && "animate-ken-burns")}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/10" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
                <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                  <div key={index === i ? `on-${i}` : `off-${i}`} className="max-w-2xl pt-16 text-white">
                    <span className="mb-5 inline-block h-1 w-16 animate-fade-up rounded-full bg-accent" />
                    {i === 0 ? (
                      <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        {s.title}
                      </h1>
                    ) : (
                      <p className="animate-fade-up text-4xl leading-[1.08] font-extrabold tracking-tight text-balance [animation-delay:100ms] sm:text-5xl lg:text-6xl">
                        {s.title}
                      </p>
                    )}
                    {s.subtitle && (
                      <p className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-white/80 [animation-delay:200ms]">
                        {s.subtitle}
                      </p>
                    )}
                    {s.buttonText && s.buttonLink && (
                      <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
                        <Button asChild variant="accent" size="lg">
                          {external ? (
                            <a href={s.buttonLink} target="_blank" rel="noopener noreferrer">
                              {s.buttonText}
                            </a>
                          ) : (
                            <Link href={s.buttonLink}>{s.buttonText}</Link>
                          )}
                        </Button>
                        <Button asChild variant="glass" size="lg">
                          <Link href="/kontak">Hubungi Kami</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2" role="tablist" aria-label="Pilih slide">
            {slides.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={index === i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => embla?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === i ? "w-10 bg-accent" : "w-4 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => embla?.scrollPrev()}
              aria-label="Slide sebelumnya"
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              aria-label="Slide berikutnya"
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
