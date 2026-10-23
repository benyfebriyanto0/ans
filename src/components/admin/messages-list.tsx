"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCheck, ChevronDown, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteMessages, markAllMessagesRead, setMessageRead } from "@/server/actions/messages";
import { cn, formatDateTime, waLink } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons";
import { ConfirmDialog } from "./confirm-dialog";
import { toastResult } from "./toast-result";

type Msg = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
  businessUnit: { menuName: string } | null;
};

export function MessagesList({ messages }: { messages: Msg[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const [, start] = useTransition();
  const unread = messages.filter((m) => !m.isRead).length;

  function open(m: Msg) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.isRead)
      start(async () => {
        await setMessageRead(m.id, true);
        router.refresh();
      });
  }

  return (
    <div className="space-y-4">
      {unread > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              start(async () => {
                toastResult(await markAllMessagesRead());
                router.refresh();
              })
            }
          >
            <CheckCheck /> Tandai semua dibaca
          </Button>
        </div>
      )}
      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Belum ada pesan masuk.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {messages.map((m) => (
            <li key={m.id} className={cn(!m.isRead && "bg-primary/[0.03]")}>
              <button
                type="button"
                onClick={() => open(m)}
                aria-expanded={openId === m.id}
                className="flex w-full items-start gap-3 p-4 text-left hover:bg-muted/40"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
                    m.isRead ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {m.isRead ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={cn("font-semibold", !m.isRead && "text-primary")}>{m.name}</span>
                    {!m.isRead && <Badge variant="accent">Baru</Badge>}
                    {m.businessUnit && <Badge variant="secondary">{m.businessUnit.menuName}</Badge>}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">{m.message}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {formatDateTime(m.createdAt)}
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                    openId === m.id && "rotate-180",
                  )}
                />
              </button>
              {openId === m.id && (
                <div className="space-y-4 border-t bg-muted/20 px-4 py-4 sm:pl-16">
                  <p className="text-xs text-muted-foreground sm:hidden">{formatDateTime(m.createdAt)}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${m.email}`}>
                        <Mail /> {m.email}
                      </a>
                    </Button>
                    {m.phone && (
                      <>
                        <Button asChild size="sm" variant="outline">
                          <a href={`tel:${m.phone}`}>
                            <Phone /> {m.phone}
                          </a>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={waLink(m.phone, `Halo ${m.name}, terima kasih telah menghubungi kami.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WhatsappIcon className="size-4" /> Balas WA
                          </a>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        start(async () => {
                          await setMessageRead(m.id, false);
                          router.refresh();
                        })
                      }
                    >
                      Tandai belum dibaca
                    </Button>
                    <ConfirmDialog
                      title="Hapus pesan ini?"
                      onConfirm={async () => {
                        if (toastResult(await deleteMessages([m.id]))) router.refresh();
                      }}
                      trigger={
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 /> Hapus
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
