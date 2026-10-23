import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { BrandMark } from "@/components/site/brand-logo";

export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const cb = typeof sp.callbackUrl === "string" && sp.callbackUrl.startsWith("/admin") ? sp.callbackUrl : "/admin";
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-4 py-12">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="glow-accent absolute -top-32 -right-32 size-96" aria-hidden />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <BrandMark className="size-14" />
          <h1 className="mt-4 text-2xl font-extrabold">Panel Admin</h1>
          <p className="mt-1 text-sm text-white/60">CV Arsindo Niaga Sejahtera</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-2xl sm:p-8">
          <LoginForm callbackUrl={cb} />
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-white">
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </main>
  );
}
