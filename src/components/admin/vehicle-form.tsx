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
import { vehicleSchema, type VehicleInput } from "@/lib/validations";
import { saveVehicle } from "@/server/actions/vehicles";
import { slugify } from "@/lib/utils";
import { Field } from "./field";
import { ImageField } from "./image-field";
import { StringListField } from "./string-list-field";
import { toastResult } from "./toast-result";

const CATEGORIES = ["MPV", "SUV", "Sedan", "Hatchback", "Minibus", "Pick-up", "Double Cabin", "Bus", "Truk"];

export function VehicleForm({
  id,
  defaults,
  coverFolder,
}: {
  id: number | null;
  defaults: VehicleInput;
  coverFolder: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const form = useForm<VehicleInput, unknown, z.output<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaults,
  });
  const { register, control, handleSubmit, formState, setValue, watch, setError } = form;
  const e = formState.errors;

  const onSubmit = handleSubmit(() =>
    start(async () => {
      const values = form.getValues();
      const r = await saveVehicle(id, { ...values, features: (values.features ?? []).filter((s) => s.trim()) });
      if (toastResult(r)) {
        if (!id && r.data) router.push(`/admin/armada/${r.data.id}`);
        router.refresh();
      } else if (!r.ok && r.fieldErrors) {
        Object.entries(r.fieldErrors).forEach(
          ([k, v]) => v?.[0] && setError(k as keyof VehicleInput, { message: v[0] }),
        );
      }
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Data kendaraan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama kendaraan" htmlFor="name" error={e.name?.message} required>
            <Input
              id="name"
              placeholder="Toyota Innova Reborn"
              {...register("name", { onChange: (ev) => !id && setValue("slug", slugify(ev.target.value)) })}
            />
          </Field>
          <Field label="Merek" htmlFor="brand" error={e.brand?.message}>
            <Input id="brand" placeholder="Toyota" {...register("brand")} />
          </Field>
          <Field
            label="Slug URL"
            htmlFor="slug"
            error={e.slug?.message}
            hint={`URL: /armada/${watch("slug") || "…"}`}
            required
            className="sm:col-span-2"
          >
            <Input id="slug" {...register("slug")} />
          </Field>
          <Field label="Jenis / kategori" htmlFor="category" error={e.category?.message} required>
            <Input id="category" list="vehicle-categories" {...register("category")} />
            <datalist id="vehicle-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Kapasitas (penumpang)" htmlFor="seats" error={e.seats?.message} required>
            <Input id="seats" type="number" min={1} max={60} {...register("seats")} />
          </Field>
          <Field label="Transmisi" htmlFor="transmission">
            <NativeSelect id="transmission" {...register("transmission")}>
              <option>Manual</option>
              <option>Otomatis</option>
            </NativeSelect>
          </Field>
          <Field label="Bahan bakar" htmlFor="fuel">
            <NativeSelect id="fuel" {...register("fuel")}>
              <option>Bensin</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Listrik</option>
            </NativeSelect>
          </Field>
          <Field label="Tahun (opsional)" htmlFor="year" error={e.year?.message}>
            <Input id="year" type="number" min={1990} max={2100} {...register("year")} />
          </Field>
          <Field
            label="Deskripsi singkat"
            htmlFor="description"
            error={e.description?.message}
            className="sm:col-span-2"
          >
            <Textarea id="description" rows={3} {...register("description")} />
          </Field>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="features"
              render={({ field }) => (
                <StringListField
                  label="Fasilitas"
                  values={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="AC, Audio, Dengan pengemudi…"
                  max={20}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
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
                  Tampilkan di website <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
            <Field label="Urutan" htmlFor="sortOrder">
              <Input id="sortOrder" type="number" min={0} {...register("sortOrder")} />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foto utama</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageField
              folder={coverFolder}
              label="Foto sampul"
              aspect="aspect-[16/10]"
              hint="Opsional. Jika kosong, foto pertama galeri unit dipakai."
              value={{ publicId: watch("coverImageId") ?? null, url: watch("coverImageUrl") ?? null }}
              onChange={(v) => {
                setValue("coverImageId", v.publicId ?? "");
                setValue("coverImageUrl", v.url ?? "");
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
