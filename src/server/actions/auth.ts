"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");
  const safeCallback = callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: safeCallback,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as AuthError & { code?: string }).code;
      if (code === "too_many_attempts") {
        return { error: "Terlalu banyak percobaan gagal. Tunggu 1 menit lalu coba lagi." };
      }
      return { error: "Email atau password salah." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
