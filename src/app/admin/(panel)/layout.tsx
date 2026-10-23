import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Arsindo" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const unread = await db.contactMessage.count({ where: { isRead: false } });
  return (
    <div className="min-h-dvh bg-muted/40">
      <AdminNav unread={unread} user={{ name: me.name, email: me.email }} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
