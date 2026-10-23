import Link from "next/link";
import { ArrowRight, Car, Images, Mail, MonitorPlay } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { UnitIcon } from "@/components/icons";
import { formatDateTime } from "@/lib/utils";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const me = await requireAdmin();
  const [units, unread, totalMsg, sliders, vehicles, latest] = await Promise.all([
    db.businessUnit.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        menuName: true,
        icon: true,
        slug: true,
        isActive: true,
        _count: { select: { photos: true } },
        photos: { where: { isActive: true }, select: { id: true } },
      },
    }),
    db.contactMessage.count({ where: { isRead: false } }),
    db.contactMessage.count(),
    db.slider.count({ where: { isActive: true } }),
    db.vehicle.count({ where: { isActive: true } }),
    db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { businessUnit: { select: { menuName: true } } },
    }),
  ]);
  const totalPhotos = units.reduce((a, u) => a + u._count.photos, 0);
  const stats = [
    {
      label: "Pesan belum dibaca",
      value: unread,
      sub: `${totalMsg} total pesan`,
      icon: Mail,
      href: "/admin/pesan",
      accent: unread > 0,
    },
    {
      label: "Foto galeri",
      value: totalPhotos,
      sub: `${units.length} bidang usaha`,
      icon: Images,
      href: "/admin/galeri",
    },
    { label: "Slider aktif", value: sliders, sub: "Banner beranda", icon: MonitorPlay, href: "/admin/slider" },
    { label: "Armada aktif", value: vehicles, sub: "Unit rental tampil", icon: Car, href: "/admin/armada" },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Halo, ${me.name.split(" ")[0]} 👋`}
        description="Ringkasan konten website CV Arsindo Niaga Sejahtera."
      />
      {!isCloudinaryConfigured() && (
        <div className="mb-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm">
          <strong>Cloudinary belum dikonfigurasi.</strong> Upload foto belum dapat digunakan. Isi variabel{" "}
          <code>CLOUDINARY_*</code> pada environment.
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className={`mt-1 text-3xl font-extrabold ${s.accent ? "text-accent-foreground" : ""}`}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <span
                  className={`grid size-10 place-items-center rounded-xl ${s.accent ? "bg-accent text-accent-foreground" : "bg-primary/8 text-primary"}`}
                >
                  <s.icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Foto per bidang usaha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {units.map((u) => {
              const max = Math.max(1, ...units.map((x) => x._count.photos));
              return (
                <Link key={u.id} href={`/admin/galeri?unit=${u.id}`} className="block rounded-lg p-2 hover:bg-muted/60">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-accent/20 text-accent-foreground">
                      <UnitIcon name={u.icon} className="size-4" />
                    </span>
                    <span className="flex-1 font-medium">
                      {u.menuName} {!u.isActive && <Badge variant="muted">Nonaktif</Badge>}
                    </span>
                    <span className="text-sm">
                      <strong>{u.photos.length}</strong>{" "}
                      <span className="text-muted-foreground">/ {u._count.photos} aktif</span>
                    </span>
                  </div>
                  <div className="mt-2 ml-12 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(u._count.photos / max) * 100}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pesan terbaru</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/pesan">
                Semua <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {latest.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Belum ada pesan.</p>
            ) : (
              <ul className="divide-y">
                {latest.map((m) => (
                  <li key={m.id} className="flex items-start gap-3 py-3">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${m.isRead ? "bg-muted-foreground/30" : "bg-accent"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {m.name}{" "}
                        {m.businessUnit && (
                          <span className="font-normal text-muted-foreground">· {m.businessUnit.menuName}</span>
                        )}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
