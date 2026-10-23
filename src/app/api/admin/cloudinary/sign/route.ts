import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminOrNull } from "@/lib/auth-guard";
import { isAllowedFolder, isCloudinaryConfigured, signUpload } from "@/lib/cloudinary";

const bodySchema = z.object({ folder: z.string().min(1).max(200) });

/** Menghasilkan signature untuk signed upload langsung dari browser ke Cloudinary. */
export async function POST(req: Request) {
  if (!(await getAdminOrNull())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error: "Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !isAllowedFolder(parsed.data.folder)) {
    return NextResponse.json({ error: "Folder tidak diizinkan." }, { status: 400 });
  }
  return NextResponse.json(signUpload(parsed.data.folder), { headers: { "Cache-Control": "no-store" } });
}
