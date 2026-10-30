import Link from "next/link";
import {
  Building2,
  Car,
  CheckCircle2,
  Circle,
  ExternalLink,
  ImagePlus,
  Images,
  Mail,
  MonitorPlay,
  Plus,
} from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnitIcon } from "@/components/icons";
import { ArcMark } from "@/components/site/arc-mark";
import { cn, formatDateTime } from "@/lib/utils";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Dashboard" };

const MIN_PHOTOS = 3;

function greeting(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("id-ID", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(now),
  );
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export default async function DashboardPage() {
  const me = await requireAdmin();
  const [units, unread, totalMsg, sliders, vehicles, latest, s] = await Promise.all([
    db.businessUnit.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        menuName: true,
        icon: true,
        slug: true,
        isActive: true,
        coverImageUrl: true,
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
    getSettings(),
  ]);

  const now = new Date();
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(now);
  const activeUnits = units.filter((u) => u.isActive);
  const totalPhotos = units.reduce((a, u) => a + u._count.photos, 0);
  const withCover = activeUnits.filter((u) => u.coverImageUrl).length;
  const withPhotos = activeUnits.filter((u) => u.photos.length >= MIN_PHOTOS).length;

  const checks = [
    { label: "Logo perusahaan diunggah", done: Boolean(s.logoUrl), href: "/admin/profil" },
    { label: "NIB dan NPWP diisi", done: Boolean(s.nib && s.npwp), href: "/admin/profil" },
    { label: "Peta Google Maps dipasang", done: Boolean(s.mapsEmbedUrl), href: "/admin/profil" },
    { label: "Minimal 1 slider beranda aktif", done: sliders > 0, href: "/admin/slider" },
    {
      label: `Foto cover tiap bidang usaha (${withCover}/${activeUnits.length})`,
      done: activeUnits.length > 0 && withCover === activeUnits.length,
      href: "/admin/bidang-usaha",
    },
    {
      label: `Minimal ${MIN_PHOTOS} foto galeri per bidang usaha (${withPhotos}/${activeUnits.length})`,
      done: activeUnits.length > 0 && withPhotos === activeUnits.length,
      href: "/admin/galeri",
    },
    { label: "Minimal 1 armada rental aktif", done: vehicles > 0, href: "/admin/armada" },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  const stats = [
    {
      label: "Pesan belum dibaca",
      value: unread,
      sub: `dari ${totalMsg} pesan`,
      icon: Mail,
      href: "/admin/pesan",
      highlight: unread > 0,
    },
    {
      label: "Foto galeri",
      value: totalPhotos,
      sub: `${units.length} bidang usaha`,
      icon: Images,
      href: "/admin/galeri",
    },
    { label: "Slider aktif", value: sliders, sub: "Banner beranda", icon: MonitorPlay, href: "/admin/slider" },
    { label: "Armada aktif", value: vehicles, sub: "Tampil di website", icon: Car, href: "/admin/armada" },
  ];

  const quick = [
    { label: "Unggah foto galeri", href: "/admin/galeri", icon: ImagePlus },
    { label: "Tambah armada", href: "/admin/armada/baru", icon: Plus },
    { label: "Ubah profil", href: "/admin/profil", icon: Building2 },
  ];

  return (
    <>
      {/* Sambutan */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-navy-950 p-6 text-white sm:p-8">
        <ArcMark className="absolute -right-24 -bottom-6 w-[34rem] opacity-70" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/65 capitalize">{today}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {greeting(now)}, {me.name.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-xl text-white/75">
              {unread > 0
                ? `Ada ${unread} pesan baru dari calon pelanggan yang menunggu dibalas.`
                : "Semua pesan sudah dibaca. Saatnya melengkapi konten website."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => (
              <Button key={q.href} asChild variant="glass" size="sm" className="h-9">
                <Link href={q.href}>
                  <q.icon /> {q.label}
                </Link>
              </Button>
            ))}
            <Button asChild variant="accent" size="sm" className="h-9">
              <a href="/" target="_blank" rel="noopener">
                <ExternalLink /> Lihat website
              </a>
            </Button>
          </div>
        </div>
      </section>

      {!isCloudinaryConfigured() && (
        <div className="mt-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm">
          <strong>Cloudinary belum dikonfigurasi.</strong> Upload foto belum dapat digunakan. Isi variabel{" "}
          <code>CLOUDINARY_*</code> pada environment.
        </div>
      )}

      {/* Statistik */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((st) => (
          <Link
            key={st.label}
            href={st.href}
            className={cn(
              "group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",
              st.highlight && "border-accent bg-accent/10",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{st.label}</p>
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl",
                  st.highlight ? "bg-accent text-accent-foreground" : "bg-primary/8 text-primary",
                )}
              >
                <st.icon className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-extrabold text-navy-950 tabular-nums">{st.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{st.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        {/* Kelengkapan konten */}
        <Card className="rounded-2xl xl:col-span-1">
          <CardHeader>
            <CardTitle>Kelengkapan website</CardTitle>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Kelengkapan website"
              >
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold text-navy-950 tabular-nums">{pct}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {checks.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted/60">
                    {c.done ? (
                      <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" aria-label="Selesai" />
                    ) : (
                      <Circle className="mt-0.5 size-4.5 shrink-0 text-muted-foreground/50" aria-label="Belum" />
                    )}
                    <span
                      className={cn(
                        "flex-1",
                        c.done && "text-muted-foreground line-through decoration-muted-foreground/40",
                      )}
                    >
                      {c.label}
                    </span>
                    {!c.done && <span className="text-xs font-semibold text-primary">Lengkapi</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Foto per bidang usaha */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Foto per bidang usaha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {units.map((u) => {
              const max = Math.max(MIN_PHOTOS, ...units.map((x) => x.photos.length));
              return (
                <Link key={u.id} href={`/admin/galeri?unit=${u.id}`} className="block rounded-lg p-2 hover:bg-muted/60">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary text-white">
                      <UnitIcon name={u.icon} className="size-4" />
                    </span>
                    <span className="flex-1 font-medium">
                      {u.menuName} {!u.isActive && <Badge variant="muted">Nonaktif</Badge>}
                    </span>
                    <span className="text-sm tabular-nums">
                      <strong>{u.photos.length}</strong>
                      <span className="text-muted-foreground"> aktif</span>
                    </span>
                  </div>
                  <div className="mt-2 ml-12 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", u.photos.length >= MIN_PHOTOS ? "bg-primary" : "bg-accent")}
                      style={{ width: `${Math.max(4, (u.photos.length / max) * 100)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Pesan terbaru */}
        <Card className="rounded-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pesan terbaru</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/pesan">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {latest.length === 0 ? (
              <div className="grid place-items-center gap-2 py-8 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <Mail className="size-5" />
                </span>
                <p className="text-sm font-medium">Belum ada pesan</p>
                <p className="max-w-60 text-xs text-muted-foreground">
                  Pesan dari formulir halaman Kontak akan muncul di sini.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {latest.map((m) => (
                  <li key={m.id}>
                    <Link href="/admin/pesan" className="flex items-start gap-3 rounded-lg px-1 py-3 hover:bg-muted/40">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                        {m.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <span className="truncate">{m.name}</span>
                          {!m.isRead && (
                            <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Belum dibaca" />
                          )}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {m.businessUnit ? `${m.businessUnit.menuName}: ` : ""}
                          {m.message}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</span>
                    </Link>
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
