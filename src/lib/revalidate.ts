import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Revalidasi seluruh halaman publik (ISR on-demand) setelah admin menyimpan perubahan.
 * Situs ini kecil, sehingga revalidasi layout root paling sederhana & selalu konsisten.
 */
export function revalidatePublic() {
  revalidatePath("/", "layout");
}
