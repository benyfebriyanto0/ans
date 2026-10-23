import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(191),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-\s()]*$/, "Nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  businessUnitId: z.coerce.number().int().positive().optional().or(z.literal("")).or(z.literal(0)),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(3000, "Pesan maksimal 3000 karakter"),
  // anti-spam
  website: z.string().max(500).optional(), // honeypot: manusia tidak mengisi; dicek di server
  startedAt: z.coerce.number().optional(),
});
export type ContactInput = z.input<typeof contactSchema>;

export const businessUnitSchema = z.object({
  menuName: z.string().trim().min(2, "Wajib diisi").max(100),
  officialName: z.string().trim().min(2, "Wajib diisi").max(191),
  kbliCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "KBLI harus 5 digit angka"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung")
    .max(120),
  summary: z.string().trim().min(10, "Ringkasan minimal 10 karakter").max(500),
  description: z.string().trim().max(50000),
  services: z.array(z.string().trim().min(1).max(200)).max(30),
  icon: z.string().trim().max(50),
  waMessage: optionalText(500),
  coverImageId: optionalText(255),
  coverImageUrl: optionalText(500),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});
export type BusinessUnitInput = z.input<typeof businessUnitSchema>;

export const sliderSchema = z.object({
  imagePublicId: z.string().trim().min(1, "Gambar wajib diunggah").max(255),
  imageUrl: z.string().trim().url().max(500),
  title: z.string().trim().min(2, "Judul wajib diisi").max(191),
  subtitle: optionalText(500),
  buttonText: optionalText(60),
  buttonLink: z
    .string()
    .trim()
    .max(255)
    .regex(/^(\/|https?:\/\/|#|$)/, "Link harus diawali / atau http(s)://")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});
export type SliderInput = z.input<typeof sliderSchema>;

export const vehicleSchema = z.object({
  name: z.string().trim().min(2, "Nama wajib diisi").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung")
    .max(140),
  brand: optionalText(60),
  category: z.string().trim().min(2, "Jenis wajib diisi").max(60),
  transmission: z.enum(["Manual", "Otomatis"]),
  fuel: z.enum(["Bensin", "Diesel", "Listrik", "Hybrid"]),
  seats: z.coerce.number().int().min(1).max(60),
  year: z
    .union([z.coerce.number().int().min(1990).max(2100), z.literal(""), z.null()])
    .optional()
    .transform((v) => (typeof v === "number" ? v : null)),
  description: optionalText(5000),
  features: z.array(z.string().trim().min(1).max(100)).max(20),
  coverImageId: optionalText(255),
  coverImageUrl: optionalText(500),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});
export type VehicleInput = z.input<typeof vehicleSchema>;

export const uploadedAssetSchema = z.object({
  publicId: z.string().min(1).max(255),
  url: z.string().url().max(500),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

export const captionSchema = z.string().trim().max(255);

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(191),
  companyShortName: z.string().trim().max(60),
  tagline: z.string().trim().max(300),
  companyForm: z.string().trim().max(100),
  establishedYear: z
    .string()
    .trim()
    .max(4)
    .regex(/^(\d{4})?$/, "Tahun 4 digit"),
  shortProfile: z.string().trim().max(1000),
  profile: z.string().trim().max(10000),
  vision: z.string().trim().max(2000),
  missions: z.array(z.string().trim().min(1).max(500)).max(15),
  values: z
    .array(z.object({ title: z.string().trim().min(1).max(80), description: z.string().trim().max(400) }))
    .max(12),
  commitment: z.string().trim().max(3000),
  nib: z.string().trim().max(30),
  npwp: z.string().trim().max(30),
  address: z.string().trim().max(500),
  phone: z.string().trim().max(30),
  email: z.string().trim().email("Email tidak valid").max(191).or(z.literal("")),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]*$/, "Nomor WhatsApp hanya angka")
    .max(20),
  businessHours: z.string().trim().max(120),
  mapsEmbedUrl: z
    .string()
    .trim()
    .max(2000)
    .regex(
      /^(https:\/\/(www\.)?google\.[a-z.]+\/maps|https:\/\/maps\.google\.[a-z.]+\/|$)/,
      "Gunakan URL embed Google Maps",
    ),
  mapsLink: z
    .string()
    .trim()
    .max(1000)
    .regex(/^(https:\/\/|$)/, "Harus diawali https://"),
  logoUrl: z.string().trim().max(500),
  logoPublicId: z.string().trim().max(255),
  waDefaultMessage: z.string().trim().max(500),
});
export type SettingsInput = z.input<typeof settingsSchema>;

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().trim().toLowerCase().email("Email tidak valid").max(191),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100)
    .regex(/[A-Za-z]/, "Password harus mengandung huruf")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Wajib diisi"),
    newPassword: userCreateSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
