const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function buildImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${STRAPI_URL}${imagePath}`;
  }

  return `${STRAPI_URL}/${imagePath}`;
}

