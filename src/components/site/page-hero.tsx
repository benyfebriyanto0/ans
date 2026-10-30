import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArcMark } from "./arc-mark";

export function PageHero({
  title,
  description,
  crumbs,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-hero-light relative overflow-hidden border-b border-border/60 pt-28 pb-14 text-foreground sm:pt-32 sm:pb-16">
      <ArcMark className="absolute -right-24 -bottom-6 w-[34rem] opacity-30 sm:w-[44rem]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-primary">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-foreground">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-navy-950 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
