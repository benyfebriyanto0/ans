import Link from "next/link";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BusinessUnitForm } from "@/components/admin/business-unit-form";
import { ROOT_FOLDER } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";

export const metadata = { title: "Ubah Bidang Usaha" };

export default async function EditUnitPage({ params }: PageProps<"/admin/bidang-usaha/[id]">) {
  const { id } = await params;
  const u = await db.businessUnit.findUnique({ where: { id: Number(id) || 0 } });
  if (!u) notFound();
  return (
    <>
      <AdminPageHeader
        title={`Ubah: ${u.menuName}`}
        backHref="/admin/bidang-usaha"
        backLabel="Kembali ke Bidang Usaha"
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/galeri?unit=${u.id}`}>
              <Images /> Kelola Galeri
            </Link>
          </Button>
        }
      />
      <BusinessUnitForm
        id={u.id}
        coverFolder={`${ROOT_FOLDER}/covers`}
        defaults={{
          menuName: u.menuName,
          officialName: u.officialName,
          kbliCode: u.kbliCode,
          slug: u.slug,
          summary: u.summary,
          description: u.description,
          services: parseJsonArray<string>(u.services),
          icon: u.icon,
          waMessage: u.waMessage ?? "",
          coverImageId: u.coverImageId ?? "",
          coverImageUrl: u.coverImageUrl ?? "",
          sortOrder: u.sortOrder,
          isActive: u.isActive,
        }}
      />
    </>
  );
}
