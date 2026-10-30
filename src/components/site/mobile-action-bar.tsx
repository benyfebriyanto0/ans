import { Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";

/** Bar aksi tetap di bawah layar HP pada halaman detail: WhatsApp + telepon. */
export function MobileActionBar({ waHref, phone, waLabel }: { waHref: string; phone?: string; waLabel: string }) {
  return (
    <div
      data-mobile-actionbar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 py-3 backdrop-blur md:hidden"
    >
      <div className="flex gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground"
        >
          <WhatsappIcon className="size-5" /> {waLabel}
        </a>
        {phone && (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            aria-label={`Telepon ${phone}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 px-4 text-sm font-bold text-primary"
          >
            <Phone className="size-4" /> Telepon
          </a>
        )}
      </div>
    </div>
  );
}
