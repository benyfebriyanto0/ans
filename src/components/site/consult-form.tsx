"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { waLink } from "@/lib/utils";

/**
 * Formulir konsultasi cepat: hanya menyusun pesan WhatsApp (tidak disimpan ke database).
 * Pesan yang tersimpan di panel admin tetap melalui formulir di halaman Kontak.
 */
export function ConsultForm({
  whatsapp,
  companyName,
  unitName,
  items = [],
  itemLabel = "Pilihan",
  needPlaceholder = "Tuliskan kebutuhan Anda…",
}: {
  whatsapp: string;
  companyName: string;
  /** Nama bidang usaha (dimasukkan otomatis ke pesan). */
  unitName: string;
  /** Pilihan opsional, mis. daftar armada atau layanan. */
  items?: string[];
  itemLabel?: string;
  needPlaceholder?: string;
}) {
  const [f, setF] = useState({ name: "", item: "", need: "", location: "", date: "" });
  const set =
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((v) => ({ ...v, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Halo ${companyName}, saya ingin bertanya tentang layanan ${unitName}.`,
      "",
      `Nama: ${f.name || "-"}`,
      items.length > 0 && `${itemLabel}: ${f.item || "Belum tahu / konsultasi dulu"}`,
      f.need && `Kebutuhan: ${f.need}`,
      f.location && `Lokasi: ${f.location}`,
      f.date && `Tanggal: ${f.date}`,
    ].filter(Boolean);
    window.open(waLink(whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className={`space-y-2 ${items.length ? "" : "sm:col-span-2"}`}>
        <Label htmlFor="cs-name">Nama / perusahaan</Label>
        <Input id="cs-name" required value={f.name} onChange={set("name")} placeholder="Contoh: Budi — PT Maju Jaya" />
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="cs-item">{itemLabel}</Label>
          <NativeSelect id="cs-item" value={f.item} onChange={set("item")}>
            <option value="">Belum tahu / konsultasi dulu</option>
            {items.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </NativeSelect>
        </div>
      )}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="cs-need">Detail kebutuhan</Label>
        <Textarea id="cs-need" rows={3} value={f.need} onChange={set("need")} placeholder={needPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cs-loc">Lokasi</Label>
        <Input id="cs-loc" value={f.location} onChange={set("location")} placeholder="Kota / alamat" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cs-date">Tanggal dibutuhkan</Label>
        <Input id="cs-date" type="date" value={f.date} onChange={set("date")} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
          Lanjut ke WhatsApp <ArrowUpRight />
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Formulir ini hanya menyiapkan pesan WhatsApp — belum merupakan konfirmasi pesanan. Harga dan ketersediaan
          dikonfirmasi langsung oleh admin kami.
        </p>
      </div>
    </form>
  );
}
