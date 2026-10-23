"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cldUrl } from "@/lib/cloudinary-url";
import { deleteSlider, reorderSliders, saveSlider, toggleSlider } from "@/server/actions/sliders";
import type { SliderInput } from "@/lib/validations";
import { SortableRows } from "./sortable-rows";
import { ActiveSwitch } from "./active-switch";
import { DeleteButton } from "./delete-button";
import { ImageField } from "./image-field";
import { Field } from "./field";
import { toastResult } from "./toast-result";

export type SliderRow = {
  id: number;
  imagePublicId: string;
  imageUrl: string;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  sortOrder: number;
  isActive: boolean;
};

const empty: SliderInput = {
  imagePublicId: "",
  imageUrl: "",
  title: "",
  subtitle: "",
  buttonText: "Lihat Layanan",
  buttonLink: "/bidang-usaha",
  sortOrder: 0,
  isActive: true,
};

export function SliderManager({ sliders, folder }: { sliders: SliderRow[]; folder: string }) {
  const [editing, setEditing] = useState<{ id: number | null; data: SliderInput } | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ id: null, data: empty })}>
          <Plus /> Tambah Slider
        </Button>
      </div>
      {sliders.length ? (
        <SortableRows
          items={sliders.map((s) => ({
            id: s.id,
            content: (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldUrl(s.imageUrl, { width: 240 })}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.subtitle || "—"}</p>
                </div>
                <ActiveSwitch id={s.id} initial={s.isActive} action={toggleSlider} />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ubah"
                  onClick={() =>
                    setEditing({
                      id: s.id,
                      data: {
                        ...s,
                        subtitle: s.subtitle ?? "",
                        buttonText: s.buttonText ?? "",
                        buttonLink: s.buttonLink ?? "",
                      },
                    })
                  }
                >
                  <Pencil />
                </Button>
                <DeleteButton
                  id={s.id}
                  action={deleteSlider}
                  title="Hapus slider ini?"
                  description="Gambar juga dihapus dari Cloudinary."
                />
              </>
            ),
          }))}
          onReorder={reorderSliders}
        />
      ) : (
        <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Belum ada slider. Beranda menampilkan hero default dengan 4 bidang usaha.
        </p>
      )}
      {editing && (
        <SliderDialog
          key={editing.id ?? "new"}
          id={editing.id}
          initial={editing.data}
          folder={folder}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function SliderDialog({
  id,
  initial,
  folder,
  onClose,
}: {
  id: number | null;
  initial: SliderInput;
  folder: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof SliderInput>(k: K, v: SliderInput[K]) => setData((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{id ? "Ubah slider" : "Tambah slider"}</DialogTitle>
          <DialogDescription>Rekomendasi gambar landscape minimal 1920×1080 px.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              const r = await saveSlider(id, data);
              if (toastResult(r)) {
                onClose();
                router.refresh();
              } else if (!r.ok) setErrors(r.fieldErrors ?? {});
            });
          }}
        >
          <ImageField
            folder={folder}
            label="Gambar banner *"
            allowRemove={false}
            value={{ publicId: data.imagePublicId || null, url: data.imageUrl || null }}
            onChange={(v) => setData((d) => ({ ...d, imagePublicId: v.publicId ?? "", imageUrl: v.url ?? "" }))}
          />
          {errors.imagePublicId && <p className="text-xs text-destructive">{errors.imagePublicId[0]}</p>}
          <Field label="Judul" htmlFor="sl-title" error={errors.title?.[0]} required>
            <Input id="sl-title" value={data.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Subjudul" htmlFor="sl-sub" error={errors.subtitle?.[0]}>
            <Textarea
              id="sl-sub"
              rows={2}
              value={data.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teks tombol" htmlFor="sl-bt" error={errors.buttonText?.[0]}>
              <Input id="sl-bt" value={data.buttonText ?? ""} onChange={(e) => set("buttonText", e.target.value)} />
            </Field>
            <Field label="Link tombol" htmlFor="sl-bl" error={errors.buttonLink?.[0]} hint="Contoh: /bidang-usaha/jasa">
              <Input id="sl-bl" value={data.buttonLink ?? ""} onChange={(e) => set("buttonLink", e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <Switch checked={data.isActive} onCheckedChange={(v) => set("isActive", v)} /> Tampilkan di beranda
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Save />} Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
