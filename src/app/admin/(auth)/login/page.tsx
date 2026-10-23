import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { BrandMark } from "@/components/site/brand-logo";

export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const cb = typeof sp.callbackUrl === "string" && sp.callbackUrl.startsWith("/admin") ? sp.callbackUrl : "/admin";
  return (
    <main className="bg-hero-light relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <div className="bg-grid-light absolute inset-0" aria-hidden />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-navy-950">
          <BrandMark className="h-14" />
          <h1 className="mt-4 text-2xl font-extrabold">Panel Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">CV Arsindo Niaga Sejahtera</p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
          <LoginForm callbackUrl={cb} />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </main>
  );
}
