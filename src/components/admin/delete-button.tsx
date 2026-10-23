"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/validations";
import { ConfirmDialog } from "./confirm-dialog";
import { toastResult } from "./toast-result";

export function DeleteButton({
  id,
  action,
  title,
  description,
  redirectTo,
  label,
}: {
  id: number;
  action: (id: number) => Promise<ActionResult>;
  title: string;
  description?: string;
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <ConfirmDialog
      title={title}
      description={description}
      onConfirm={async () => {
        const r = await action(id);
        if (toastResult(r)) {
          if (redirectTo) router.push(redirectTo);
          router.refresh();
        }
      }}
      trigger={
        <Button
          variant="ghost"
          size={label ? "sm" : "icon"}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={title}
        >
          <Trash2 /> {label}
        </Button>
      }
    />
  );
}
