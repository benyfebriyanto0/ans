import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SliderManager } from "@/components/admin/slider-manager";
import { ROOT_FOLDER } from "@/lib/cloudinary";

export const metadata = { title: "Slider Beranda" };

export default async function AdminSliderPage() {
  const sliders = await db.slider.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <AdminPageHeader
        title="Slider Beranda"
        description="Banner besar di bagian atas beranda. Seret untuk mengatur urutan."
      />
      <SliderManager sliders={sliders} folder={`${ROOT_FOLDER}/sliders`} />
    </>
  );
}
