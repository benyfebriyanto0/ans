import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PhotoManager } from "@/components/admin/photo-manager";
import { UnitIcon } from "@/components/icons";
import { ROOT_FOLDER } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  addGalleryPhotos,
  deleteGalleryPhotos,
  reorderGalleryPhotos,
  toggleGalleryPhoto,
  updateGalleryCaption,
} from "@/server/actions/gallery";

export const metadata = { title: "Galeri Foto" };

export default async function AdminGalleryPage({ searchParams }: PageProps<"/admin/galeri">) {
  const sp = await searchParams;
  const units = await db.businessUnit.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, menuName: true, slug: true, icon: true, _count: { select: { photos: true } } },
  });
  const selectedId = Number(sp.unit) || units[0]?.id;
  const unit = units.find((u) => u.id === selectedId) ?? units[0];
  const photos = unit
    ? await db.galleryPhoto.findMany({
        where: { businessUnitId: unit.id },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, imageUrl: true, caption: true, isActive: true },
      })
    : [];

  return (
    <>
      <AdminPageHeader
        title="Galeri Foto"
        description="Dokumentasi pekerjaan per bidang usaha. Upload banyak foto sekaligus, atur urutan dengan seret & lepas."
        actions={
          unit && (
            <Button asChild variant="outline">
              <a href={`/bidang-usaha/${unit.slug}#galeri`} target="_blank">
                <ExternalLink /> Lihat di website
              </a>
            </Button>
          )
        }
      />
      <nav aria-label="Pilih bidang usaha" className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {units.map((u) => (
          <Link
            key={u.id}
            href={`/admin/galeri?unit=${u.id}`}
            aria-current={u.id === unit?.id ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
              u.id === unit?.id
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-primary/40",
            )}
          >
            <UnitIcon name={u.icon} className="size-4" /> {u.menuName}
            <span className={cn("rounded-full px-1.5 text-xs", u.id === unit?.id ? "bg-white/20" : "bg-muted")}>
              {u._count.photos}
            </span>
          </Link>
        ))}
      </nav>
      {unit ? (
        <PhotoManager
          key={unit.id}
          ownerId={unit.id}
          folder={`${ROOT_FOLDER}/gallery/${unit.slug}`}
          photos={photos}
          actions={{
            add: addGalleryPhotos,
            reorder: reorderGalleryPhotos,
            toggle: toggleGalleryPhoto,
            caption: updateGalleryCaption,
            remove: deleteGalleryPhotos,
          }}
        />
      ) : (
        <p className="text-muted-foreground">Belum ada bidang usaha.</p>
      )}
    </>
  );
}
