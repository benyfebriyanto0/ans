import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Wajib dipanggil di setiap Server Action & halaman admin. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  return { id: Number(session.user.id), name: session.user.name ?? "", email: session.user.email ?? "" };
}

/** Versi untuk Route Handler: tidak redirect, mengembalikan null bila belum login. */
export async function getAdminOrNull() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: Number(session.user.id) };
}
