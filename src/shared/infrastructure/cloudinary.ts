import { v2 as cloudinary } from "cloudinary";

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  version: number;
};

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

export function configureCloudinary() {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env"
    );
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  return cloudinary;
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  options: { publicId: string; folder?: string }
): Promise<CloudinaryUploadResult> {
  const client = configureCloudinary();

  const result = await new Promise<Awaited<ReturnType<typeof client.uploader.upload>>>(
    (resolve, reject) => {
      const stream = client.uploader.upload_stream(
        {
          folder: options.folder ?? "ana-lopez/cms",
          public_id: options.publicId,
          resource_type: "image",
          overwrite: false,
          unique_filename: false,
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else if (!uploadResult) reject(new Error("Cloudinary upload returned no result"));
          else resolve(uploadResult);
        }
      );

      stream.end(buffer);
    }
  );

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    version: result.version,
  };
}

export function buildCloudinaryOptimizedUrl(
  url: string,
  transforms = "f_auto,q_auto"
): string {
  const marker = "/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return url;

  const suffix = url.slice(index + marker.length);
  if (suffix.startsWith(`${transforms}/`) || suffix.includes(`/${transforms}/`)) {
    return url;
  }

  return `${url.slice(0, index + marker.length)}${transforms}/${suffix}`;
}
