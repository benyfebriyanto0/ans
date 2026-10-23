import { waLink } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons";

export function FloatingWhatsapp({ number, message }: { number: string; message: string }) {
  if (!number) return null;
  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:shadow-xl sm:right-6 sm:bottom-6"
    >
      <span
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s] [animation-iteration-count:3]"
        aria-hidden
      />
      <WhatsappIcon className="size-7" />
      <span className="hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 sm:inline">
        Chat WhatsApp
      </span>
    </a>
  );
}
