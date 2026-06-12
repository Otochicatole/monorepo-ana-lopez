import { z } from "zod";
import { DEFAULT_LOCALE } from "@/shared/domain/locale";

export const LocaleQuerySchema = z
  .enum(["en", "es-AR"])
  .optional()
  .default(DEFAULT_LOCALE);

export const OptionalLocaleQuerySchema = z.enum(["en", "es-AR"]).optional();

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export function getLocale(searchParams: URLSearchParams) {
  return LocaleQuerySchema.parse(searchParams.get("locale") ?? undefined);
}

export function getOptionalLocale(searchParams: URLSearchParams) {
  return OptionalLocaleQuerySchema.parse(searchParams.get("locale") ?? undefined);
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

