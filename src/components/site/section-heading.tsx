import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  inverted,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase",
            inverted ? "text-accent" : "text-primary/70",
          )}
        >
          <span className="h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight text-balance sm:text-4xl",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-pretty",
            inverted ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
