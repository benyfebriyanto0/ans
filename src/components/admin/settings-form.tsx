"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsSchema, type SettingsInput } from "@/lib/validations";
import { saveSettings } from "@/server/actions/settings";
import { Field } from "./field";
import { ImageField } from "./image-field";
import { StringListField } from "./string-list-field";
import { toastResult } from "./toast-result";

export function SettingsForm({ defaults, logoFolder }: { defaults: SettingsInput; logoFolder: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const form = useForm<SettingsInput, unknown, z.output<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaults,
  });
  const { register, control, handleSubmit, formState, setValue, watch, setError } = form;
  const values = useFieldArray({ control, name: "values" });
  const e = formState.errors;

  const onSubmit = handleSubmit(() =>
    start(async () => {
      const v = form.getValues();
      const r = await saveSettings({
        ...v,
        missions: v.missions.filter((m) => m.trim()),
        values: v.values.filter((x) => x.title.trim()),
      });
      if (toastResult(r)) router.refresh();
      else if (!r.ok && r.fieldErrors)
        Object.entries(r.fieldErrors).forEach(
          ([k, m]) => m?.[0] && setError(k as keyof SettingsInput, { message: m[0] }),
        );
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identitas perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama perusahaan" htmlFor="companyName" error={e.companyName?.message} required>
              <Input id="companyName" {...register("companyName")} />
            </Field>
            <Field label="Nama singkat" htmlFor="companyShortName">
              <Input id="companyShortName" {...register("companyShortName")} />
            </Field>
            <Field
              label="Tagline"
              htmlFor="tagline"
              className="sm:col-span-2"
              hint="Tampil sebagai judul hero bila slider kosong."
            >
              <Input id="tagline" {...register("tagline")} />
            </Field>
            <Field
              label="Profil singkat"
              htmlFor="shortProfile"
              className="sm:col-span-2"
              hint="Dipakai di beranda, footer, dan deskripsi SEO."
            >
              <Textarea id="shortProfile" rows={3} {...register("shortProfile")} />
            </Field>
            <Field
              label="Profil lengkap"
              htmlFor="profile"
              className="sm:col-span-2"
              hint="Pisahkan paragraf dengan baris kosong."
            >
              <Textarea id="profile" rows={8} {...register("profile")} />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>Opsional. Jika kosong, logo bawaan dipakai.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageField
              folder={logoFolder}
              label="Logo perusahaan"
              aspect="aspect-square max-w-48"
              hint="PNG/WebP transparan, persegi, min 256×256 px"
              value={{ publicId: watch("logoPublicId") || null, url: watch("logoUrl") || null }}
              onChange={(v) => {
                setValue("logoPublicId", v.publicId ?? "");
                setValue("logoUrl", v.url ?? "");
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visi, misi, nilai & komitmen</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Field label="Visi" htmlFor="vision">
              <Textarea id="vision" rows={3} {...register("vision")} />
            </Field>
            <Controller
              control={control}
              name="missions"
              render={({ field }) => (
                <StringListField label="Misi" values={field.value} onChange={field.onChange} max={15} />
              )}
            />
            <Field label="Komitmen" htmlFor="commitment">
              <Textarea id="commitment" rows={4} {...register("commitment")} />
            </Field>
          </div>
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">Nilai perusahaan</legend>
            {values.fields.map((f, i) => (
              <div key={f.id} className="space-y-2 rounded-xl border p-3">
                <div className="flex gap-2">
                  <Input placeholder="Nama nilai" aria-label={`Nilai ${i + 1}`} {...register(`values.${i}.title`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => values.remove(i)}
                    aria-label="Hapus nilai"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <Textarea
                  rows={2}
                  placeholder="Penjelasan singkat"
                  aria-label={`Penjelasan nilai ${i + 1}`}
                  {...register(`values.${i}.description`)}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => values.append({ title: "", description: "" })}
            >
              <Plus /> Tambah nilai
            </Button>
          </fieldset>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Legalitas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Bentuk usaha" htmlFor="companyForm" className="sm:col-span-2">
              <Input id="companyForm" {...register("companyForm")} />
            </Field>
            <Field label="NIB" htmlFor="nib" error={e.nib?.message}>
              <Input id="nib" {...register("nib")} />
            </Field>
            <Field label="NPWP" htmlFor="npwp" error={e.npwp?.message}>
              <Input id="npwp" {...register("npwp")} />
            </Field>
            <Field label="Tahun berdiri" htmlFor="establishedYear" error={e.establishedYear?.message}>
              <Input id="establishedYear" inputMode="numeric" maxLength={4} {...register("establishedYear")} />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kontak & lokasi</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Alamat" htmlFor="address" className="sm:col-span-2">
              <Textarea id="address" rows={2} {...register("address")} />
            </Field>
            <Field label="Telepon" htmlFor="phone">
              <Input id="phone" type="tel" {...register("phone")} />
            </Field>
            <Field label="Nomor WhatsApp" htmlFor="whatsapp" error={e.whatsapp?.message} hint="Format 08xx atau 628xx">
              <Input id="whatsapp" type="tel" {...register("whatsapp")} />
            </Field>
            <Field label="Email" htmlFor="email" error={e.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </Field>
            <Field label="Jam operasional" htmlFor="businessHours">
              <Input id="businessHours" {...register("businessHours")} />
            </Field>
            <Field label="Pesan WhatsApp default" htmlFor="waDefaultMessage" className="sm:col-span-2">
              <Input id="waDefaultMessage" {...register("waDefaultMessage")} />
            </Field>
            <Field
              label="URL embed Google Maps"
              htmlFor="mapsEmbedUrl"
              error={e.mapsEmbedUrl?.message}
              className="sm:col-span-2"
              hint="Google Maps → Bagikan → Sematkan peta → salin nilai src dari iframe."
            >
              <Input id="mapsEmbedUrl" {...register("mapsEmbedUrl")} />
            </Field>
            <Field label="Link Google Maps" htmlFor="mapsLink" error={e.mapsLink?.message} className="sm:col-span-2">
              <Input id="mapsLink" {...register("mapsLink")} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button type="submit" size="lg" disabled={pending} className="shadow-xl">
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Simpan Profil
        </Button>
      </div>
    </form>
  );
}
