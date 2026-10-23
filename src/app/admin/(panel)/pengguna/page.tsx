import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminPageHeader } from "@/components/admin/page-header";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "Pengguna Admin" };

export default async function AdminUsersPage() {
  const me = await requireAdmin();
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return (
    <>
      <AdminPageHeader title="Pengguna Admin" description="Kelola akun yang dapat masuk ke panel admin." />
      <UsersManager users={users} meId={me.id} />
    </>
  );
}
