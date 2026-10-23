"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StringListField({
  label,
  values,
  onChange,
  placeholder,
  max = 30,
  error,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  max?: number;
  error?: string;
}) {
  const set = (i: number, v: string) => onChange(values.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: -1 | 1) => {
    const n = [...values];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <span className="grid w-7 shrink-0 place-items-center text-xs text-muted-foreground">{i + 1}.</span>
          <Input
            value={v}
            onChange={(e) => set(i, e.target.value)}
            placeholder={placeholder}
            aria-label={`${label} ${i + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => move(i, -1)}
            disabled={i === 0}
            aria-label="Naikkan"
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => move(i, 1)}
            disabled={i === values.length - 1}
            aria-label="Turunkan"
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            aria-label="Hapus"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      {values.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
          <Plus /> Tambah
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}
