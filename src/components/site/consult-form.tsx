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
 * Untuk pesan yang tersimpan di panel admin, pengunjung memakai formulir di halaman Kontak.
 */
export function ConsultForm({
  units,
  whatsapp,
  companyName,
}: {
  units: { slug: string; menuName: string }[];
  whatsapp: string;
  companyName: string;
}) {
  const [f, setF] = useState({ name: "", unit: "", need: "", location: "", date: "" });
  const set =
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((v) => ({ ...v, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Halo ${companyName}, saya ingin berkonsultasi.`,
      "",
      `Nama: ${f.name || "-"}`,
      `Bidang usaha: ${f.unit || "Belum tahu / konsultasi dulu"}`,
      `Kebutuhan: ${f.need || "-"}`,
      f.location && `Lokasi: ${f.location}`,
      f.date && `Waktu dibutuhkan: ${f.date}`,
    ].filter(Boolean);
    window.open(waLink(whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cs-name">Nama / perusahaan</Label>
        <Input id="cs-name" required value={f.name} onChange={set("name")} placeholder="Contoh: Budi — PT Maju Jaya" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cs-unit">Bidang usaha</Label>
        <NativeSelect id="cs-unit" value={f.unit} onChange={set("unit")}>
          <option value="">Belum tahu / konsultasi dulu</option>
          {units.map((u) => (
            <option key={u.slug} value={u.menuName}>
              {u.menuName}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="cs-need">Kebutuhan Anda</Label>
        <Textarea
          id="cs-need"
          required
          rows={3}
          value={f.need}
          onChange={set("need")}
          placeholder="Contoh: butuh bearing 6205 sebanyak 20 pcs / servis pompa hidrolik / sewa Innova 3 hari"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cs-loc">Lokasi</Label>
        <Input id="cs-loc" value={f.location} onChange={set("location")} placeholder="Kota / alamat proyek" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cs-date">Kapan dibutuhkan</Label>
        <Input id="cs-date" type="date" value={f.date} onChange={set("date")} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
          Lanjut ke WhatsApp <ArrowUpRight />
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Formulir ini hanya menyiapkan pesan WhatsApp. Penawaran, harga, dan ketersediaan dikonfirmasi langsung oleh
          admin kami.
        </p>
      </div>
    </form>
  );
}
