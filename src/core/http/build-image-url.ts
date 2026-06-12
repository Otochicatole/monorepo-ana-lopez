const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Resolves media URLs for the public site.
 * Local CMS uploads live under /public (e.g. /uploads/cms/...) and must stay same-origin.
 * Legacy Strapi assets may be stored as relative paths without a leading slash.
 */
export function buildImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  // Legacy Strapi-relative paths (no leading slash)
  if (imagePath.startsWith("uploads/")) {
    return `${STRAPI_URL}/${imagePath}`;
  }

  return `/${imagePath}`;
}
