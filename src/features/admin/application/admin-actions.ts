"use server";

import { extname } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/shared/infrastructure/prisma";
import { uploadImageToCloudinary } from "@/shared/infrastructure/cloudinary";
import { loginAdmin, logoutAdmin, requireAdmin } from "../infrastructure/admin-auth";
import { LocaleIdSchema } from "@/features/content/presentation/public-content-schemas";

const optionalInt = z.preprocess((value) => {
  if (value === "" || value === null || typeof value === "undefined") return null;
  return Number(value);
}, z.number().int().positive().nullable());

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function recordAudit(input: {
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string | number;
  metadata?: Prisma.InputJsonObject;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      resource: input.resource,
      resourceId:
        typeof input.resourceId === "undefined"
          ? null
          : input.resourceId.toString(),
      metadata: input.metadata || {},
    },
  });
  revalidatePath("/admin/audit-logs");
}

export async function loginAction(formData: FormData) {
  const data = z
    .object({
      identifier: z.string().min(1),
      password: z.string().min(1),
    })
    .parse(Object.fromEntries(formData));

  const ok = await loginAdmin(data.identifier, data.password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function upsertHomeAction(formData: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      localeId: LocaleIdSchema,
      about: z.string().min(1),
      imageAboutId: z.coerce.number().int().positive(),
    })
    .parse(Object.fromEntries(formData));

  const record = await prisma.homeContent.upsert({
    where: { localeId: data.localeId },
    update: {
      about: data.about,
      imageAboutId: data.imageAboutId,
      deletedAt: null,
    },
    create: {
      localeId: data.localeId,
      about: data.about,
      imageAboutId: data.imageAboutId,
    },
  });

  await recordAudit({
    actorId: admin.id,
    action: "upsert",
    resource: "home",
    resourceId: record.id,
    metadata: { localeId: data.localeId },
  });

  revalidatePath("/");
  revalidatePath("/admin/home");
}

export async function upsertAboutAction(formData: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      localeId: LocaleIdSchema,
      text1: z.string().optional(),
      image1Id: optionalInt,
      text2: z.string().optional(),
      image2Id: optionalInt,
      text3: z.string().optional(),
      image3Id: optionalInt,
    })
    .parse(Object.fromEntries(formData));

  const record = await prisma.aboutContent.upsert({
    where: { localeId: data.localeId },
    update: {
      text1: data.text1 || null,
      image1Id: data.image1Id,
      text2: data.text2 || null,
      image2Id: data.image2Id,
      text3: data.text3 || null,
      image3Id: data.image3Id,
      deletedAt: null,
    },
    create: {
      localeId: data.localeId,
      text1: data.text1 || null,
      image1Id: data.image1Id,
      text2: data.text2 || null,
      image2Id: data.image2Id,
      text3: data.text3 || null,
      image3Id: data.image3Id,
    },
  });

  await recordAudit({
    actorId: admin.id,
    action: "upsert",
    resource: "about",
    resourceId: record.id,
    metadata: { localeId: data.localeId },
  });

  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function createMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      documentId: z.string().min(1),
      name: z.string().min(1),
      alternativeText: z.string().optional(),
      url: z.string().min(1),
      mime: z.string().min(1),
      ext: z.string().optional(),
      width: optionalInt,
      height: optionalInt,
      size: z.coerce.number().positive().default(1),
    })
    .parse(Object.fromEntries(formData));

  const record = await prisma.mediaFile.upsert({
    where: { documentId: data.documentId },
    update: {
      name: data.name,
      alternativeText: data.alternativeText || null,
      url: data.url,
      mime: data.mime,
      ext: data.ext || null,
      width: data.width,
      height: data.height,
      size: data.size,
      deletedAt: null,
    },
    create: {
      documentId: data.documentId,
      name: data.name,
      alternativeText: data.alternativeText || null,
      url: data.url,
      mime: data.mime,
      ext: data.ext || null,
      width: data.width,
      height: data.height,
      size: data.size,
      formats: {},
      provider: "local",
      providerMetadata: {},
    },
  });

  await recordAudit({
    actorId: admin.id,
    action: "upsert",
    resource: "media",
    resourceId: record.id,
    metadata: { documentId: data.documentId, url: data.url },
  });

  revalidatePath("/admin/media");
}

export type UploadMediaState = {
  error?: string;
  media?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText: string | null;
  };
};

function revalidateMediaPaths() {
  revalidatePath("/admin/media");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/home");
  revalidatePath("/admin/about");
}

export async function uploadMediaFileAction(
  _prevState: UploadMediaState | null,
  formData: FormData
): Promise<UploadMediaState> {
  try {
    const admin = await requireAdmin();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return { error: "File is required" };
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Only image uploads are supported" };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: "File must be 5MB or smaller" };
    }

    const id = randomUUID();
    const originalName = safeFileName(file.name || "upload");
    const extension = extname(originalName);
    const bytes = Buffer.from(await file.arrayBuffer());

    const upload = await uploadImageToCloudinary(bytes, {
      publicId: id,
      folder: "ana-lopez/cms",
    });

    const record = await prisma.mediaFile.create({
      data: {
        documentId: `media-${id}`,
        name: originalName,
        alternativeText:
          z.string().optional().parse(formData.get("alternativeText") || undefined) ||
          null,
        url: upload.secureUrl,
        mime: file.type || `image/${upload.format}`,
        ext: extension || `.${upload.format}`,
        width: upload.width,
        height: upload.height,
        size: Number((upload.bytes / 1024).toFixed(2)),
        formats: {},
        provider: "cloudinary",
        providerMetadata: {
          publicId: upload.publicId,
          version: upload.version,
          format: upload.format,
        },
      },
    });

    await recordAudit({
      actorId: admin.id,
      action: "upload",
      resource: "media",
      resourceId: record.id,
      metadata: {
        documentId: record.documentId,
        publicId: upload.publicId,
        mime: file.type,
        size: file.size,
      },
    });

    revalidateMediaPaths();

    return {
      media: {
        id: record.id,
        documentId: record.documentId,
        name: record.name,
        url: record.url,
        alternativeText: record.alternativeText,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  await prisma.mediaFile.update({ where: { id }, data: { deletedAt: new Date() } });
  await recordAudit({
    actorId: admin.id,
    action: "delete",
    resource: "media",
    resourceId: id,
  });
  revalidatePath("/admin/media");
}

export async function createGalleryTypeAction(formData: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      documentId: z.string().min(1),
      localeId: LocaleIdSchema,
      name: z.string().min(1),
    })
    .parse(Object.fromEntries(formData));

  const record = await prisma.galleryType.upsert({
    where: { documentId: data.documentId },
    update: { deletedAt: null },
    create: { documentId: data.documentId },
  });

  await prisma.galleryTypeTranslation.upsert({
    where: {
      galleryTypeId_localeId: {
        galleryTypeId: record.id,
        localeId: data.localeId,
      },
    },
    update: { name: data.name },
    create: {
      galleryTypeId: record.id,
      localeId: data.localeId,
      name: data.name,
    },
  });

  await recordAudit({
    actorId: admin.id,
    action: "upsert",
    resource: "gallery-type",
    resourceId: record.id,
    metadata: { documentId: data.documentId, localeId: data.localeId },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery-types");
}

export async function deleteGalleryTypeAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  await prisma.galleryType.update({ where: { id }, data: { deletedAt: new Date() } });
  await recordAudit({
    actorId: admin.id,
    action: "delete",
    resource: "gallery-type",
    resourceId: id,
  });
  revalidatePath("/admin/gallery-types");
}

export async function createGalleryItemAction(formData: FormData) {
  const admin = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const data = z
    .object({
      documentId: z.preprocess(
        (value) =>
          typeof value === "string" && value.trim() === "" ? undefined : value,
        z.string().min(1).optional()
      ),
      name: z.string().optional(),
      mediaId: z.coerce.number().int().positive(),
      galleryTypeId: optionalInt,
    })
    .parse(raw);

  const documentId = data.documentId ?? `gallery-${randomUUID()}`;

  const record = await prisma.galleryItem.upsert({
    where: { documentId },
    update: {
      name: data.name || null,
      mediaId: data.mediaId,
      galleryTypeId: data.galleryTypeId,
      deletedAt: null,
    },
    create: {
      documentId,
      name: data.name || null,
      mediaId: data.mediaId,
      galleryTypeId: data.galleryTypeId,
    },
  });

  await recordAudit({
    actorId: admin.id,
    action: "upsert",
    resource: "gallery",
    resourceId: record.id,
    metadata: { documentId },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItemAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  await prisma.galleryItem.update({ where: { id }, data: { deletedAt: new Date() } });
  await recordAudit({
    actorId: admin.id,
    action: "delete",
    resource: "gallery",
    resourceId: id,
  });
  revalidatePath("/admin/gallery");
}
