import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  title,
  description,
  crumbs,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-28 pb-16 text-white sm:pt-32 sm:pb-20">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="glow-accent absolute -top-24 -right-24 size-96" aria-hidden />
      <div className="glow-primary absolute -bottom-32 -left-20 size-96" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mt-6 text-xs font-bold tracking-[0.18em] text-accent uppercase">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-white/70">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
