const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function buildImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/images/") || imagePath.startsWith("/svgs/")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    return `${STRAPI_URL}${imagePath}`;
  }

  return `/${imagePath}`;
}
