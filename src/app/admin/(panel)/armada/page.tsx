import Link from "next/link";
import { Car, ExternalLink, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SortableRows } from "@/components/admin/sortable-rows";
import { ActiveSwitch } from "@/components/admin/active-switch";
import { DeleteButton } from "@/components/admin/delete-button";
import { cldUrl } from "@/lib/cloudinary-url";
import { deleteVehicle, reorderVehicles, toggleVehicle } from "@/server/actions/vehicles";

export const metadata = { title: "Armada Rental" };

export default async function AdminFleetPage() {
  const vehicles = await db.vehicle.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      seats: true,
      transmission: true,
      isActive: true,
      coverImageUrl: true,
      _count: { select: { photos: true } },
    },
  });
  return (
    <>
      <AdminPageHeader
        title="Armada Rental Mobil"
        description="Data armada dikelola terpisah dari galeri dokumentasi pekerjaan."
        actions={
          <Button asChild>
            <Link href="/admin/armada/baru">
              <Plus /> Tambah Armada
            </Link>
          </Button>
        }
      />
      {vehicles.length ? (
        <SortableRows
          items={vehicles.map((v) => ({
            id: v.id,
            content: (
              <>
                {v.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cldUrl(v.coverImageUrl, { width: 200 })}
                    alt=""
                    className="h-12 w-20 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="grid h-12 w-20 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Car className="size-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {v.name}{" "}
                    <Badge variant="secondary" className="ml-1">
                      {v.category}
                    </Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.seats} kursi · {v.transmission} · {v._count.photos} foto
                  </p>
                </div>
                <ActiveSwitch id={v.id} initial={v.isActive} action={toggleVehicle} />
                <div className="flex">
                  <Button asChild variant="ghost" size="icon" aria-label="Lihat">
                    <a href={`/armada/${v.slug}`} target="_blank">
                      <ExternalLink />
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Ubah">
                    <Link href={`/admin/armada/${v.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <DeleteButton
                    id={v.id}
                    action={deleteVehicle}
                    title={`Hapus ${v.name}?`}
                    description="Semua foto unit ini ikut dihapus."
                  />
                </div>
              </>
            ),
          }))}
          onReorder={reorderVehicles}
        />
      ) : (
        <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Belum ada data armada.
        </p>
      )}
    </>
  );
}
