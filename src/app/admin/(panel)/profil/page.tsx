import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";
import { ROOT_FOLDER } from "@/lib/cloudinary";

export const metadata = { title: "Profil Perusahaan" };

export default async function AdminProfilePage() {
  const s = await getSettings();
  return (
    <>
      <AdminPageHeader
        title="Profil Perusahaan"
        description="Konten halaman Tentang Kami, Kontak, footer, dan tombol WhatsApp."
      />
      <SettingsForm defaults={s} logoFolder={`${ROOT_FOLDER}/brand`} />
    </>
  );
}
