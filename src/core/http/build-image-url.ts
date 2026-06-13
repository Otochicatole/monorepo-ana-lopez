const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const CLOUDINARY_UPLOAD_MARKER = "/upload/";

function applyCloudinaryTransforms(url: string): string {
  const index = url.indexOf(CLOUDINARY_UPLOAD_MARKER);
  if (index === -1) return url;

  const transforms = "f_auto,q_auto";
  const suffix = url.slice(index + CLOUDINARY_UPLOAD_MARKER.length);
  if (suffix.startsWith(`${transforms}/`) || suffix.includes(`/${transforms}/`)) {
    return url;
  }

  return `${url.slice(0, index + CLOUDINARY_UPLOAD_MARKER.length)}${transforms}/${suffix}`;
}

/**
 * Resolves media URLs for the public site.
 * Cloudinary URLs get f_auto,q_auto for optimized delivery.
 * Local CMS uploads live under /public (e.g. /uploads/cms/...) and must stay same-origin.
 * Legacy Strapi assets may be stored as relative paths without a leading slash.
 */
export function buildImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (imagePath.includes("res.cloudinary.com")) {
      return applyCloudinaryTransforms(imagePath);
    }
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

export function isRenderableMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}
