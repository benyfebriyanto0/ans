"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { ActionResult } from "@/lib/validations";

export function ActiveSwitch({
  id,
  initial,
  action,
  label = "Aktif",
}: {
  id: number;
  initial: boolean;
  action: (id: number, v: boolean) => Promise<ActionResult>;
  label?: string;
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Switch
        checked={on}
        disabled={pending}
        aria-label={label}
        onCheckedChange={(v) =>
          start(async () => {
            setOn(v);
            const r = await action(id, v);
            if (r.ok) toast.success(r.message ?? "Tersimpan.");
            else {
              setOn(!v);
              toast.error(r.error);
            }
          })
        }
      />
      {on ? "Aktif" : "Nonaktif"}
    </label>
  );
}
