"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessUnitSchema, type BusinessUnitInput } from "@/lib/validations";
import { saveBusinessUnit } from "@/server/actions/business-units";
import { slugify } from "@/lib/utils";
import { UNIT_ICON_OPTIONS, UnitIcon } from "@/components/icons";
import { Field } from "./field";
import { ImageField } from "./image-field";
import { RichTextEditor } from "./rich-text-editor";
import { StringListField } from "./string-list-field";
import { toastResult } from "./toast-result";

export function BusinessUnitForm({
  id,
  defaults,
  coverFolder,
}: {
  id: number | null;
  defaults: BusinessUnitInput;
  coverFolder: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const form = useForm<BusinessUnitInput, unknown, z.output<typeof businessUnitSchema>>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: defaults,
  });
  const { register, control, handleSubmit, formState, setValue, watch, setError } = form;
  const e = formState.errors;
  const icon = watch("icon");

  const onSubmit = handleSubmit(() =>
    start(async () => {
      const values = form.getValues();
      const r = await saveBusinessUnit(id, { ...values, services: (values.services ?? []).filter((s) => s.trim()) });
      if (toastResult(r)) {
        router.push("/admin/bidang-usaha");
        router.refresh();
      } else if (!r.ok && r.fieldErrors) {
        Object.entries(r.fieldErrors).forEach(
          ([k, v]) => v?.[0] && setError(k as keyof BusinessUnitInput, { message: v[0] }),
        );
      }
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi utama</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama di menu" htmlFor="menuName" error={e.menuName?.message} required>
              <Input
                id="menuName"
                {...register("menuName", {
                  onChange: (ev) => !id && setValue("slug", slugify(ev.target.value)),
                })}
              />
            </Field>
            <Field label="Kode KBLI" htmlFor="kbliCode" error={e.kbliCode?.message} required>
              <Input id="kbliCode" inputMode="numeric" maxLength={5} {...register("kbliCode")} />
            </Field>
            <Field
              label="Nama resmi"
              htmlFor="officialName"
              error={e.officialName?.message}
              required
              className="sm:col-span-2"
            >
              <Input id="officialName" {...register("officialName")} />
            </Field>
            <Field
              label="Slug URL"
              htmlFor="slug"
              error={e.slug?.message}
              hint={`URL: /bidang-usaha/${watch("slug") || "…"}`}
              required
              className="sm:col-span-2"
            >
              <Input id="slug" {...register("slug")} />
            </Field>
            <Field
              label="Ringkasan"
              htmlFor="summary"
              error={e.summary?.message}
              hint="Tampil di kartu bidang usaha (maks 500 karakter)."
              required
              className="sm:col-span-2"
            >
              <Textarea id="summary" rows={3} maxLength={500} {...register("summary")} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deskripsi lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="description"
              render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
            />
            {e.description && <p className="mt-2 text-xs text-destructive">{e.description.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Layanan & WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Controller
              control={control}
              name="services"
              render={({ field }) => (
                <StringListField
                  label="Daftar layanan"
                  values={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Contoh: Perbaikan pompa hidrolik"
                />
              )}
            />
            <Field
              label="Pesan WhatsApp otomatis"
              htmlFor="waMessage"
              hint="Teks yang otomatis terisi ketika pengunjung menekan tombol WhatsApp di halaman ini."
              error={e.waMessage?.message}
            >
              <Textarea id="waMessage" rows={2} maxLength={500} {...register("waMessage")} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 text-sm font-medium">
                  Tampilkan di website
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
            <Field label="Urutan" htmlFor="sortOrder" error={e.sortOrder?.message}>
              <Input id="sortOrder" type="number" min={0} {...register("sortOrder")} />
            </Field>
            <Field label="Ikon" htmlFor="icon">
              <div className="flex gap-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <UnitIcon name={String(icon)} className="size-5" />
                </span>
                <NativeSelect id="icon" {...register("icon")}>
                  {UNIT_ICON_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foto sampul</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageField
              folder={coverFolder}
              label="Gambar sampul kartu"
              aspect="aspect-[4/3]"
              value={{ publicId: watch("coverImageId") ?? null, url: watch("coverImageUrl") ?? null }}
              onChange={(v) => {
                setValue("coverImageId", v.publicId ?? "", { shouldDirty: true });
                setValue("coverImageUrl", v.url ?? "", { shouldDirty: true });
              }}
            />
          </CardContent>
        </Card>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Simpan
        </Button>
      </div>
    </form>
  );
}
