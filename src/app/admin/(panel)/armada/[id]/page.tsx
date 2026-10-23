import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { ROOT_FOLDER } from "@/lib/cloudinary";
import { parseJsonArray } from "@/lib/utils";
import {
  addVehiclePhotos,
  deleteVehiclePhotos,
  reorderVehiclePhotos,
  toggleVehiclePhoto,
  updateVehiclePhotoCaption,
} from "@/server/actions/vehicles";

export const metadata = { title: "Ubah Armada" };

export default async function EditVehiclePage({ params }: PageProps<"/admin/armada/[id]">) {
  const { id } = await params;
  const v = await db.vehicle.findUnique({
    where: { id: Number(id) || 0 },
    include: {
      photos: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, imageUrl: true, caption: true, isActive: true },
      },
    },
  });
  if (!v) notFound();
  return (
    <>
      <AdminPageHeader title={`Ubah: ${v.name}`} />
      <VehicleForm
        id={v.id}
        coverFolder={`${ROOT_FOLDER}/covers`}
        defaults={{
          name: v.name,
          slug: v.slug,
          brand: v.brand ?? "",
          category: v.category,
          transmission: v.transmission as "Manual" | "Otomatis",
          fuel: v.fuel as "Bensin" | "Diesel" | "Listrik" | "Hybrid",
          seats: v.seats,
          year: v.year ?? "",
          description: v.description ?? "",
          features: parseJsonArray<string>(v.features),
          coverImageId: v.coverImageId ?? "",
          coverImageUrl: v.coverImageUrl ?? "",
          sortOrder: v.sortOrder,
          isActive: v.isActive,
        }}
      />
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Foto unit</h2>
        <PhotoManager
          ownerId={v.id}
          folder={`${ROOT_FOLDER}/fleet/${v.slug}`}
          photos={v.photos}
          actions={{
            add: addVehiclePhotos,
            reorder: reorderVehiclePhotos,
            toggle: toggleVehiclePhoto,
            caption: updateVehiclePhotoCaption,
            remove: deleteVehiclePhotos,
          }}
        />
      </section>
    </>
  );
}
