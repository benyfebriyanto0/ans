"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cldUrl, UPLOAD_RULES } from "@/lib/cloudinary-url";
import { uploadSingle } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

/** Field upload satu gambar (sampul, slider, logo). File langsung ke Cloudinary via signed upload. */
export function ImageField({
  folder,
  value,
  onChange,
  aspect = "aspect-video",
  label = "Gambar",
  hint,
  allowRemove = true,
}: {
  folder: string;
  value: { publicId: string | null; url: string | null };
  onChange: (v: { publicId: string | null; url: string | null }) => void;
  aspect?: string;
  label?: string;
  hint?: string;
  allowRemove?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setProgress(0);
    try {
      const r = await uploadSingle(file, folder, setProgress);
      onChange({ publicId: r.publicId, url: r.url });
      toast.success("Gambar terunggah. Jangan lupa klik Simpan.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProgress(null);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className={cn("relative overflow-hidden rounded-xl border bg-muted/40", aspect)}>
        {value.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldUrl(value.url, { width: 800 })} alt="" className="size-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted"
          >
            <ImagePlus className="size-8" />
            <span className="text-sm">Klik untuk unggah</span>
          </button>
        )}
        {progress !== null && (
          <div className="absolute inset-0 grid place-items-center bg-black/50 text-white">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Loader2 className="size-4 animate-spin" /> {progress}%
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => ref.current?.click()}
          disabled={progress !== null}
        >
          {value.url ? <RefreshCw /> : <ImagePlus />} {value.url ? "Ganti" : "Unggah"}
        </Button>
        {allowRemove && value.url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => onChange({ publicId: null, url: null })}
          >
            <Trash2 /> Hapus
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{hint ?? "JPG, PNG, atau WebP · maks 5 MB"}</p>
      <input
        ref={ref}
        type="file"
        accept={UPLOAD_RULES.accept.join(",")}
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
