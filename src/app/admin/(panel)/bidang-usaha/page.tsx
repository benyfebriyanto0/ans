import Link from "next/link";
import { ExternalLink, Images, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SortableRows } from "@/components/admin/sortable-rows";
import { ActiveSwitch } from "@/components/admin/active-switch";
import { DeleteButton } from "@/components/admin/delete-button";
import { UnitIcon } from "@/components/icons";
import { deleteBusinessUnit, reorderBusinessUnits, toggleBusinessUnit } from "@/server/actions/business-units";

export const metadata = { title: "Bidang Usaha" };

export default async function AdminUnitsPage() {
  const units = await db.businessUnit.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      menuName: true,
      officialName: true,
      kbliCode: true,
      slug: true,
      icon: true,
      isActive: true,
      _count: { select: { photos: true } },
    },
  });
  return (
    <>
      <AdminPageHeader
        title="Bidang Usaha"
        description="Kelola bidang usaha, urutan tampil (seret ⋮⋮), dan status aktif."
        actions={
          <Button asChild>
            <Link href="/admin/bidang-usaha/baru">
              <Plus /> Tambah
            </Link>
          </Button>
        }
      />
      <SortableRows
        items={units.map((u) => ({
          id: u.id,
          content: (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-accent-foreground">
                <UnitIcon name={u.icon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {u.menuName}{" "}
                  <Badge variant="outline" className="ml-1 font-mono">
                    {u.kbliCode}
                  </Badge>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.officialName} · /bidang-usaha/{u.slug}
                </p>
              </div>
              <Link
                href={`/admin/galeri?unit=${u.id}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <Images className="size-3.5" /> {u._count.photos} foto
              </Link>
              <ActiveSwitch id={u.id} initial={u.isActive} action={toggleBusinessUnit} />
              <div className="flex">
                <Button asChild variant="ghost" size="icon" aria-label="Lihat">
                  <a href={`/bidang-usaha/${u.slug}`} target="_blank">
                    <ExternalLink />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" aria-label="Ubah">
                  <Link href={`/admin/bidang-usaha/${u.id}`}>
                    <Pencil />
                  </Link>
                </Button>
                <DeleteButton
                  id={u.id}
                  action={deleteBusinessUnit}
                  title={`Hapus ${u.menuName}?`}
                  description="Seluruh foto galeri bidang usaha ini juga akan dihapus permanen."
                />
              </div>
            </>
          ),
        }))}
        onReorder={reorderBusinessUnits}
      />
    </>
  );
}
