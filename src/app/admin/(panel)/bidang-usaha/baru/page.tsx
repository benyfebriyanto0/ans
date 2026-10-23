import { AdminPageHeader } from "@/components/admin/page-header";
import { BusinessUnitForm } from "@/components/admin/business-unit-form";
import { ROOT_FOLDER } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const metadata = { title: "Tambah Bidang Usaha" };

export default async function NewUnitPage() {
  const max = await db.businessUnit.aggregate({ _max: { sortOrder: true } });
  return (
    <>
      <AdminPageHeader title="Tambah Bidang Usaha" backHref="/admin/bidang-usaha" backLabel="Kembali ke Bidang Usaha" />
      <BusinessUnitForm
        id={null}
        coverFolder={`${ROOT_FOLDER}/covers`}
        defaults={{
          menuName: "",
          officialName: "",
          kbliCode: "",
          slug: "",
          summary: "",
          description: "",
          services: [],
          icon: "cog",
          waMessage: "",
          coverImageId: "",
          coverImageUrl: "",
          sortOrder: (max._max.sortOrder ?? 0) + 1,
          isActive: true,
        }}
      />
    </>
  );
}
