import { AdminPageHeader } from "@/components/admin/page-header";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { ROOT_FOLDER } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const metadata = { title: "Tambah Armada" };

export default async function NewVehiclePage() {
  const max = await db.vehicle.aggregate({ _max: { sortOrder: true } });
  return (
    <>
      <AdminPageHeader
        title="Tambah Armada"
        backHref="/admin/armada"
        backLabel="Kembali ke Armada"
        description="Simpan data terlebih dahulu, lalu unggah foto unit di halaman berikutnya."
      />
      <VehicleForm
        id={null}
        coverFolder={`${ROOT_FOLDER}/covers`}
        defaults={{
          name: "",
          slug: "",
          brand: "",
          category: "MPV",
          transmission: "Manual",
          fuel: "Bensin",
          seats: 7,
          year: "",
          description: "",
          features: [],
          coverImageId: "",
          coverImageUrl: "",
          sortOrder: (max._max.sortOrder ?? 0) + 1,
          isActive: true,
        }}
      />
    </>
  );
}
