"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { submitContact } from "@/server/actions/contact";

export function ContactForm({
  units,
  defaultUnitId,
}: {
  units: { id: number; menuName: string }[];
  defaultUnitId?: number;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessUnitId: defaultUnitId ?? "",
      message: "",
      website: "",
      startedAt: 0,
    },
  });
  const { register, handleSubmit, formState, reset, setValue, setError } = form;

  useEffect(() => setValue("startedAt", Date.now()), [setValue]);

  const onSubmit = handleSubmit((values) => {
    setResult(null);
    startTransition(async () => {
      const res = await submitContact(values);
      if (res.ok) {
        setResult({ ok: true, text: res.message ?? "Pesan terkirim." });
        reset({ name: "", email: "", phone: "", businessUnitId: "", message: "", website: "", startedAt: Date.now() });
      } else {
        setResult({ ok: false, text: res.error });
        Object.entries(res.fieldErrors ?? {}).forEach(
          ([k, v]) => v?.[0] && setError(k as keyof ContactInput, { message: v[0] }),
        );
      }
    });
  });

  const err = (k: keyof ContactInput) => formState.errors[k]?.message as string | undefined;

  if (result?.ok) {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl border border-success/30 bg-success/5 px-6 py-12 text-center"
      >
        <CheckCircle2 className="size-12 text-success" />
        <p className="mt-4 text-lg font-bold">Pesan terkirim!</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{result.text}</p>
        <Button variant="outline" className="mt-6" onClick={() => setResult(null)}>
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cf-name">
          Nama lengkap <span className="text-destructive">*</span>
        </Label>
        <Input id="cf-name" autoComplete="name" aria-invalid={!!err("name")} {...register("name")} />
        {err("name") && <p className="text-xs text-destructive">{err("name")}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="cf-email" type="email" autoComplete="email" aria-invalid={!!err("email")} {...register("email")} />
        {err("email") && <p className="text-xs text-destructive">{err("email")}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-phone">No. telepon / WhatsApp</Label>
        <Input
          id="cf-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={!!err("phone")}
          {...register("phone")}
        />
        {err("phone") && <p className="text-xs text-destructive">{err("phone")}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-unit">Bidang usaha yang diminati</Label>
        <NativeSelect id="cf-unit" {...register("businessUnitId")}>
          <option value="">— Pilih (opsional) —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.menuName}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="cf-message">
          Pesan <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="cf-message"
          rows={5}
          aria-invalid={!!err("message")}
          placeholder="Tuliskan kebutuhan Anda…"
          {...register("message")}
        />
        {err("message") && <p className="text-xs text-destructive">{err("message")}</p>}
      </div>
      {/* Honeypot anti-spam: disembunyikan dari manusia */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <input type="hidden" {...register("startedAt")} />
      {result && !result.ok && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
          {result.text}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? <Loader2 className="animate-spin" /> : <Send />} Kirim Pesan
        </Button>
      </div>
    </form>
  );
}
