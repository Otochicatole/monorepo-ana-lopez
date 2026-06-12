"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/shared/infrastructure/prisma";
import { requireAdmin } from "../infrastructure/admin-auth";
import { UpsertLocaleSchema } from "@/features/content/presentation/public-content-schemas";

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

async function ensureSingleDefault(excludeId?: string) {
  const defaults = await prisma.locale.findMany({
    where: {
      isDefault: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });

  if (defaults.length > 1) {
    const [, ...rest] = defaults;
    await prisma.locale.updateMany({
      where: { id: { in: rest.map((item) => item.id) } },
      data: { isDefault: false },
    });
  }
}

export async function upsertLocaleAction(formData: FormData) {
  const admin = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = UpsertLocaleSchema.safeParse({
    ...raw,
    isDefault: raw.isDefault === "on" || raw.isDefault === "true",
    isActive:
      raw.isActive === "on" ||
      raw.isActive === "true" ||
      (!("isActive" in raw) && !raw.id),
  });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid locale data";
    redirect(
      `/admin/locales?error=${encodeURIComponent(message)}${raw.id ? `&edit=${raw.id}` : ""}`
    );
  }

  const data = parsed.data;

  if (data.isDefault) {
    await prisma.locale.updateMany({
      where: data.id ? { id: { not: data.id } } : undefined,
      data: { isDefault: false },
    });
  }

  // Auto sortOrder for new locales: max existing + 1
  let sortOrder = data.sortOrder ?? 0;
  if (!data.id) {
    const maxRecord = await prisma.locale.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    sortOrder = (maxRecord?.sortOrder ?? -1) + 1;
  }

  const record = data.id
    ? await prisma.locale.update({
        where: { id: data.id },
        data: {
          code: data.code,
          name: data.name,
          isDefault: data.isDefault,
          isActive: data.isActive,
          sortOrder: data.sortOrder ?? 0,
        },
      })
    : await prisma.locale.create({
        data: {
          code: data.code,
          name: data.name,
          isDefault: data.isDefault,
          isActive: data.isActive,
          sortOrder,
        },
      });

  await ensureSingleDefault(record.id);

  await recordAudit({
    actorId: admin.id,
    action: data.id ? "update" : "create",
    resource: "locale",
    resourceId: record.id,
    metadata: { code: record.code },
  });

  revalidatePath("/admin/locales");
  revalidatePath("/admin");
  redirect("/admin/locales?saved=1");
}

export async function deleteLocaleAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.string().cuid().parse(formData.get("id"));

  const locale = await prisma.locale.findUnique({ where: { id } });
  if (!locale) throw new Error("Locale not found");

  if (locale.code === "en") {
    throw new Error('Cannot delete the base English locale ("en")');
  }
  if (locale.isDefault) {
    throw new Error("Cannot delete the default locale. Set another locale as default first.");
  }

  const activeCount = await prisma.locale.count({ where: { isActive: true } });
  if (locale.isActive && activeCount <= 1) {
    throw new Error("Cannot delete the only active locale.");
  }

  await prisma.locale.delete({ where: { id } });

  await recordAudit({
    actorId: admin.id,
    action: "delete",
    resource: "locale",
    resourceId: id,
    metadata: { code: locale.code },
  });

  revalidatePath("/admin/locales");
  revalidatePath("/admin");
}

export async function toggleLocaleActiveAction(formData: FormData) {
  const admin = await requireAdmin();
  const data = z
    .object({
      id: z.string().cuid(),
      isActive: z
        .string()
        .transform((value) => value === "true"),
    })
    .parse(Object.fromEntries(formData));

  const locale = await prisma.locale.findUnique({ where: { id: data.id } });
  if (!locale) throw new Error("Locale not found");

  if (locale.isDefault && !data.isActive) {
    throw new Error("Cannot deactivate the default locale");
  }

  const record = await prisma.locale.update({
    where: { id: data.id },
    data: { isActive: data.isActive },
  });

  await recordAudit({
    actorId: admin.id,
    action: data.isActive ? "activate" : "deactivate",
    resource: "locale",
    resourceId: record.id,
  });

  revalidatePath("/admin/locales");
}

export async function setDefaultLocaleAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.string().cuid().parse(formData.get("id"));

  await prisma.locale.updateMany({ data: { isDefault: false } });
  const record = await prisma.locale.update({
    where: { id },
    data: { isDefault: true, isActive: true },
  });

  await recordAudit({
    actorId: admin.id,
    action: "set-default",
    resource: "locale",
    resourceId: record.id,
  });

  revalidatePath("/admin/locales");
}
