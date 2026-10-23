import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MessagesList } from "@/components/admin/messages-list";

export const metadata = { title: "Pesan Masuk" };

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      isRead: true,
      createdAt: true,
      businessUnit: { select: { menuName: true } },
    },
  });
  return (
    <>
      <AdminPageHeader title="Pesan Masuk" description="Pesan dari formulir kontak website." />
      <MessagesList messages={messages} />
    </>
  );
}
