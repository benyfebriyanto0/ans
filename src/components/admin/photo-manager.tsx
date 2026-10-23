"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import {
  CheckSquare,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Loader2,
  Square,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cldUrl, UPLOAD_RULES } from "@/lib/cloudinary-url";
import { compressImage, getSignature, uploadToCloudinary, validateFile } from "@/lib/upload-client";
import type { ActionResult } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./confirm-dialog";

export type ManagedPhoto = { id: number; imageUrl: string; caption: string | null; isActive: boolean };
type Asset = { publicId: string; url: string; width?: number | null; height?: number | null };

type Props = {
  ownerId: number;
  folder: string;
  photos: ManagedPhoto[];
  actions: {
    add: (ownerId: number, assets: Asset[]) => Promise<ActionResult<{ count: number }>>;
    reorder: (ownerId: number, ids: number[]) => Promise<ActionResult>;
    toggle: (id: number, active: boolean) => Promise<ActionResult>;
    caption: (id: number, caption: string) => Promise<ActionResult>;
    remove: (ids: number[]) => Promise<ActionResult>;
  };
};

type QueueItem = {
  key: string;
  name: string;
  preview: string;
  progress: number;
  status: "waiting" | "uploading" | "done" | "error";
  error?: string;
};

export function PhotoManager({ ownerId, folder, photos: initial, actions }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initial);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setPhotos(initial);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length) return;
    if (files.length > UPLOAD_RULES.maxFiles) {
      toast.error(`Maksimal ${UPLOAD_RULES.maxFiles} foto per upload. Anda memilih ${files.length}.`);
      return;
    }
    const errors = files.map(validateFile).filter(Boolean) as string[];
    const valid = files.filter((f) => !validateFile(f));
    errors.forEach((e) => toast.error(e));
    if (!valid.length) return;

    const items: QueueItem[] = valid.map((f, i) => ({
      key: `${Date.now()}-${i}`,
      name: f.name,
      preview: URL.createObjectURL(f),
      progress: 0,
      status: "waiting",
    }));
    setQueue(items);
    setUploading(true);
    const update = (key: string, patch: Partial<QueueItem>) =>
      setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...patch } : x)));

    try {
      const sig = await getSignature(folder);
      const results: Asset[] = [];
      // Upload paralel terbatas (3 sekaligus)
      let cursor = 0;
      const worker = async () => {
        while (cursor < valid.length) {
          const idx = cursor++;
          const item = items[idx];
          update(item.key, { status: "uploading" });
          try {
            const file = await compressImage(valid[idx]);
            const r = await uploadToCloudinary(file, sig, (p) => update(item.key, { progress: p }));
            results[idx] = r;
            update(item.key, { status: "done", progress: 100 });
          } catch (e) {
            update(item.key, { status: "error", error: (e as Error).message });
          }
        }
      };
      await Promise.all([worker(), worker(), worker()]);
      const ok = results.filter(Boolean);
      if (ok.length) {
        const res = await actions.add(ownerId, ok);
        if (res.ok) toast.success(res.message);
        else toast.error(res.error);
        router.refresh();
      }
      if (ok.length === items.length) setTimeout(() => setQueue([]), 1200);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      items.forEach((i) => URL.revokeObjectURL(i.preview));
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    const next = arrayMove(photos, oldIndex, newIndex);
    setPhotos(next);
    start(async () => {
      const res = await actions.reorder(
        ownerId,
        next.map((p) => p.id),
      );
      if (!res.ok) {
        toast.error(res.error);
        setPhotos(photos);
      } else toast.success("Urutan foto tersimpan.");
    });
  }

  function toggleSelect(id: number) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function removeSelected() {
    const ids = Array.from(selected);
    const res = await actions.remove(ids);
    if (res.ok) {
      toast.success(res.message);
      setPhotos((p) => p.filter((x) => !selected.has(x.id)));
      setSelected(new Set());
      router.refresh();
    } else toast.error(res.error);
  }

  const activeCount = photos.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30",
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <UploadCloud className="size-7" />
        </span>
        <p className="mt-4 font-semibold">Seret & lepas foto di sini, atau</p>
        <Button type="button" className="mt-3" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />} Pilih Foto
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          JPG, PNG, atau WebP · maks 5 MB per foto · maks {UPLOAD_RULES.maxFiles} foto per upload
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={UPLOAD_RULES.accept.join(",")}
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {queue.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {queue.map((q) => (
            <li key={q.key} className="overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-square bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.preview} alt="" className="size-full object-cover opacity-80" />
                {q.status === "error" && (
                  <span className="absolute inset-0 grid place-items-center bg-destructive/70 p-2 text-center text-xs text-white">
                    {q.error}
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-muted">
                <div
                  className={cn(
                    "h-full transition-all",
                    q.status === "error" ? "bg-destructive" : q.status === "done" ? "bg-success" : "bg-primary",
                  )}
                  style={{ width: `${q.progress}%` }}
                />
              </div>
              <p className="truncate px-2 py-1 text-[11px] text-muted-foreground">{q.name}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {photos.length} foto · <span className="text-success">{activeCount} tampil</span> · seret{" "}
          <GripVertical className="inline size-3.5" /> untuk mengatur urutan
        </p>
        <div className="flex gap-2">
          {photos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelected(selected.size === photos.length ? new Set() : new Set(photos.map((p) => p.id)))
              }
            >
              {selected.size === photos.length ? <X /> : <CheckSquare />}{" "}
              {selected.size === photos.length ? "Batal pilih" : "Pilih semua"}
            </Button>
          )}
          {selected.size > 0 && (
            <ConfirmDialog
              title={`Hapus ${selected.size} foto?`}
              description="Foto akan dihapus permanen dari website dan Cloudinary."
              onConfirm={removeSelected}
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 /> Hapus ({selected.size})
                </Button>
              }
            />
          )}
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Belum ada foto. Website akan menampilkan “Galeri segera hadir”.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((p, i) => (
                <SortablePhoto
                  key={p.id}
                  photo={p}
                  index={i}
                  selected={selected.has(p.id)}
                  onSelect={() => toggleSelect(p.id)}
                  actions={actions}
                  onLocalChange={(patch) =>
                    setPhotos((list) => list.map((x) => (x.id === p.id ? { ...x, ...patch } : x)))
                  }
                  onRemoved={() => setPhotos((list) => list.filter((x) => x.id !== p.id))}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortablePhoto({
  photo,
  index,
  selected,
  onSelect,
  actions,
  onLocalChange,
  onRemoved,
}: {
  photo: ManagedPhoto;
  index: number;
  selected: boolean;
  onSelect: () => void;
  actions: Props["actions"];
  onLocalChange: (p: Partial<ManagedPhoto>) => void;
  onRemoved: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [saving, start] = useTransition();
  const dirty = caption !== (photo.caption ?? "");

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group overflow-hidden rounded-xl border bg-card shadow-xs",
        isDragging && "z-10 scale-[1.02] shadow-2xl ring-2 ring-primary",
        selected && "ring-2 ring-destructive",
        !photo.isActive && "opacity-70",
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cldUrl(photo.imageUrl, { width: 400 })}
          alt={photo.caption ?? ""}
          loading="lazy"
          className={cn("size-full object-cover", !photo.isActive && "grayscale")}
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Seret untuk mengubah urutan foto ${index + 1}`}
          className="absolute top-2 left-2 grid size-8 cursor-grab place-items-center rounded-lg bg-white/90 text-foreground shadow active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <span className="absolute top-2 left-12 rounded-md bg-black/60 px-2 py-1 font-mono text-xs text-white">
          #{index + 1}
        </span>
        <button
          type="button"
          onClick={onSelect}
          aria-label="Pilih foto"
          className="absolute top-2 right-2 grid size-8 place-items-center rounded-lg bg-white/90 shadow"
        >
          {selected ? <CheckSquare className="size-4 text-destructive" /> : <Square className="size-4" />}
        </button>
        {!photo.isActive && (
          <Badge variant="muted" className="absolute bottom-2 left-2 bg-black/60 text-white">
            <EyeOff className="size-3" /> Disembunyikan
          </Badge>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex gap-2">
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption / keterangan foto"
            maxLength={255}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && dirty) {
                e.preventDefault();
                (e.currentTarget.nextElementSibling as HTMLButtonElement | null)?.click();
              }
            }}
          />
          {dirty && (
            <Button
              size="sm"
              disabled={saving}
              onClick={() =>
                start(async () => {
                  const r = await actions.caption(photo.id, caption);
                  if (r.ok) {
                    toast.success("Caption tersimpan.");
                    onLocalChange({ caption });
                  } else toast.error(r.error);
                })
              }
            >
              Simpan
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-medium">
            <Switch
              checked={photo.isActive}
              onCheckedChange={(v) =>
                start(async () => {
                  onLocalChange({ isActive: v });
                  const r = await actions.toggle(photo.id, v);
                  if (!r.ok) {
                    onLocalChange({ isActive: !v });
                    toast.error(r.error);
                  }
                })
              }
            />
            {photo.isActive ? (
              <>
                <Eye className="size-3.5" /> Aktif
              </>
            ) : (
              "Nonaktif"
            )}
          </label>
          <ConfirmDialog
            title="Hapus foto ini?"
            description="Foto dihapus permanen dari website dan Cloudinary."
            onConfirm={async () => {
              const r = await actions.remove([photo.id]);
              if (r.ok) {
                toast.success("Foto dihapus.");
                onRemoved();
              } else toast.error(r.error);
            }}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 /> Hapus
              </Button>
            }
          />
        </div>
      </div>
    </li>
  );
}
