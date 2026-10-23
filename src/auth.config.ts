import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi Auth.js yang "edge-safe": TANPA database, bcrypt, atau modul Node lain.
 * Dipakai oleh proxy.ts (middleware) yang di Netlify dijalankan di Edge runtime.
 * Provider Credentials (yang mengakses database) hanya ada di src/auth.ts.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 jam
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) session.user.id = String(token.uid);
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/admin/login") return true;
      return Boolean(auth?.user);
    },
  },
} satisfies NextAuthConfig;
