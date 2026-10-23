import "server-only";
import { cache } from "react";
import { db } from "./db";
import { parseJsonArray } from "./utils";

export type CompanyValue = { title: string; description: string };

export type SiteSettings = {
  companyName: string;
  companyShortName: string;
  tagline: string;
  companyForm: string;
  establishedYear: string;
  shortProfile: string;
  profile: string;
  vision: string;
  missions: string[];
  values: CompanyValue[];
  commitment: string;
  nib: string;
  npwp: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  businessHours: string;
  mapsEmbedUrl: string;
  mapsLink: string;
  logoUrl: string;
  logoPublicId: string;
  waDefaultMessage: string;
};

export const SETTING_KEYS: Record<keyof SiteSettings, string> = {
  companyName: "company_name",
  companyShortName: "company_short_name",
  tagline: "company_tagline",
  companyForm: "company_form",
  establishedYear: "established_year",
  shortProfile: "short_profile",
  profile: "profile",
  vision: "vision",
  missions: "missions",
  values: "values",
  commitment: "commitment",
  nib: "nib",
  npwp: "npwp",
  address: "address",
  phone: "phone",
  email: "email",
  whatsapp: "whatsapp",
  businessHours: "business_hours",
  mapsEmbedUrl: "maps_embed_url",
  mapsLink: "maps_link",
  logoUrl: "logo_url",
  logoPublicId: "logo_public_id",
  waDefaultMessage: "wa_default_message",
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.setting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const get = (k: keyof SiteSettings) => map.get(SETTING_KEYS[k]) ?? "";
  return {
    companyName: get("companyName") || "CV Arsindo Niaga Sejahtera",
    companyShortName: get("companyShortName") || "Arsindo",
    tagline: get("tagline"),
    companyForm: get("companyForm"),
    establishedYear: get("establishedYear"),
    shortProfile: get("shortProfile"),
    profile: get("profile"),
    vision: get("vision"),
    missions: parseJsonArray<string>(get("missions")),
    values: parseJsonArray<CompanyValue>(get("values")),
    commitment: get("commitment"),
    nib: get("nib"),
    npwp: get("npwp"),
    address: get("address"),
    phone: get("phone"),
    email: get("email"),
    whatsapp: get("whatsapp"),
    businessHours: get("businessHours"),
    mapsEmbedUrl: get("mapsEmbedUrl"),
    mapsLink: get("mapsLink"),
    logoUrl: get("logoUrl"),
    logoPublicId: get("logoPublicId"),
    waDefaultMessage: get("waDefaultMessage"),
  };
});
