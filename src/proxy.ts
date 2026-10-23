import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Hanya konfigurasi edge-safe (tanpa database) — verifikasi JWT sesi saja.
const { auth } = NextAuth(authConfig);

/**
 * Proxy (pengganti middleware di Next.js 16): mengunci /admin dan /api/admin.
 * Pemeriksaan ulang tetap dilakukan di setiap Server Action / Route Handler (defense in depth).
 */
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const loggedIn = Boolean(req.auth?.user);

  if (isLogin && loggedIn) return NextResponse.redirect(new URL("/admin", req.nextUrl));
  if (isLogin) return NextResponse.next();

  if (!loggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/admin/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
