"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Expand, ImageOff } from "lucide-react";
import { cldUrl, cloudinaryLoader } from "@/lib/cloudinary-url";

export type GalleryItem = {
  id: number;
  imageUrl: string;
  caption: string | null;
  width: number | null;
  height: number | null;
};

export function GalleryGrid({
  photos,
  fallbackAlt,
  emptyText = "Galeri segera hadir",
}: {
  photos: GalleryItem[];
  fallbackAlt: string;
  emptyText?: string;
}) {
  const [index, setIndex] = useState(-1);

  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center">
        <ImageOff className="size-10 text-muted-foreground/60" aria-hidden />
        <p className="mt-3 text-lg font-semibold text-foreground">{emptyText}</p>
        <p className="mt-1 text-sm text-muted-foreground">Dokumentasi pekerjaan akan segera kami tampilkan di sini.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted focus-visible:ring-4 focus-visible:ring-ring/40"
              aria-label={`Perbesar foto: ${p.caption || fallbackAlt}`}
            >
              <Image
                loader={cloudinaryLoader}
                src={p.imageUrl}
                alt={p.caption || `${fallbackAlt} — foto ${i + 1}`}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/0 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-primary opacity-0 shadow transition-all group-hover:opacity-100">
                <Expand className="size-4" />
              </span>
              {p.caption && (
                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-medium text-white">
                  {p.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions, Counter, Zoom]}
        captions={{ descriptionTextAlign: "center" }}
        styles={{ container: { backgroundColor: "rgba(6, 14, 30, .95)" } }}
        slides={photos.map((p) => ({
          src: cldUrl(p.imageUrl, { width: 1600 }),
          alt: p.caption || fallbackAlt,
          description: p.caption || undefined,
          width: p.width ?? undefined,
          height: p.height ?? undefined,
        }))}
      />
    </>
  );
}
