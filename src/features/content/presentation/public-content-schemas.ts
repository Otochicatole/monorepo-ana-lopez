import { z } from "zod";
import { isValidLocaleCode, normalizeLocaleCode } from "@/shared/domain/locale";

export const LocaleCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(12)
  .transform(normalizeLocaleCode)
  .refine(isValidLocaleCode, "Invalid locale code format");

export const LocaleIdSchema = z.string().cuid();

export const UpsertLocaleSchema = z.object({
  id: z.string().cuid().optional(),
  code: LocaleCodeSchema,
  name: z.string().min(1).max(100),
  isDefault: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
});

export const LocaleQuerySchema = LocaleCodeSchema.optional();

export const OptionalLocaleQuerySchema = LocaleCodeSchema.optional();

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export function getLocaleCode(searchParams: URLSearchParams) {
  const raw = searchParams.get("locale");
  if (!raw) return undefined;
  return LocaleCodeSchema.parse(raw);
}

export function getOptionalLocaleCode(searchParams: URLSearchParams) {
  const raw = searchParams.get("locale");
  if (!raw) return undefined;
  return OptionalLocaleQuerySchema.parse(raw);
}

export function getPagination(searchParams: URLSearchParams) {
  return PaginationQuerySchema.parse({
    page: searchParams.get("pagination[page]") ?? undefined,
    pageSize: searchParams.get("pagination[pageSize]") ?? undefined,
  });
}

export function getGalleryTypeDocumentId(searchParams: URLSearchParams) {
  return (
    searchParams.get("filters[types_of_gallery][documentId][$eq]") ??
    undefined
  );
}
