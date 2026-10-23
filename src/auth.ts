import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { hashIp, ipFromHeaders } from "@/lib/request";

class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

const LOGIN_LIMIT = 5; // maks 5 kali gagal
const LOGIN_WINDOW = 60; // per 60 detik

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  logger: {
    // Percobaan login gagal adalah hal wajar; jangan memenuhi log server dengan stack trace.
    error(error) {
      if (error.name === "CredentialsSignin" || (error as { type?: string }).type === "CredentialsSignin") return;
      console.error("[auth]", error);
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 jam
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = request instanceof Request ? ipFromHeaders(request.headers) : "unknown";
        const keys = [`login:ip:${hashIp(ip)}`, `login:email:${email}`];
        for (const key of keys) {
          if (await isRateLimited(key, LOGIN_LIMIT, LOGIN_WINDOW)) throw new TooManyAttempts();
        }

        const user = await db.user.findUnique({ where: { email } });
        // Bandingkan hash walau user tidak ada agar waktu respons seragam
        const ok = await bcrypt.compare(
          password,
          user?.passwordHash ?? "$2b$12$32dYNs484Li2vVf3FtC88.ogVuhk3VUtvqwoywN3B.fqMYn.Xf2du",
        );
        if (!user || !ok) {
          for (const key of keys) await rateLimit(key, LOGIN_LIMIT, LOGIN_WINDOW);
          return null;
        }
        await resetRateLimit(`login:email:${email}`);
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
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
});
