import "server-only";
import { cache } from "react";
import { db } from "./db";

export const getActiveSliders = cache(() =>
  db.slider.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
);

export const getActiveBusinessUnits = cache(() =>
  db.businessUnit.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      menuName: true,
      officialName: true,
      kbliCode: true,
      slug: true,
      summary: true,
      icon: true,
      coverImageUrl: true,
      _count: { select: { photos: { where: { isActive: true } } } },
    },
  }),
);

export const getBusinessUnitBySlug = cache((slug: string) =>
  db.businessUnit.findFirst({
    where: { slug, isActive: true },
    include: {
      photos: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
  }),
);

export const getActiveVehicles = cache(() =>
  db.vehicle.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      photos: { where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], take: 1 },
    },
  }),
);

export const getVehicleBySlug = cache((slug: string) =>
  db.vehicle.findFirst({
    where: { slug, isActive: true },
    include: {
      photos: { where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
    },
  }),
);
