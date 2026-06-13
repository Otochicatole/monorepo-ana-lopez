#!/usr/bin/env node
/**
 * Cloudinary onboarding / smoke test.
 * Replace YOUR_* placeholders below, then run:
 *   node scripts/cloudinary-onboarding.mjs
 */

import { v2 as cloudinary } from "cloudinary";

// ← replace these three values from https://console.cloudinary.com/app/settings/api-keys
cloudinary.config({
  cloud_name: "drrlnnsuy",
  api_key: "753879437189371",
  api_secret: "YOUR_API_SECRET", // ← replace this
  secure: true,
});

const sampleImageUrl =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

async function main() {
  console.log("Uploading sample image...");

  const upload = await cloudinary.uploader.upload(sampleImageUrl, {
    folder: "ana-lopez/onboarding",
    public_id: `sample-${Date.now()}`,
  });

  console.log("Uploaded secure URL:", upload.secure_url);
  console.log("Public ID:", upload.public_id);

  const details = await cloudinary.api.resource(upload.public_id);
  console.log("Width:", details.width);
  console.log("Height:", details.height);
  console.log("Format:", details.format);
  console.log("Bytes:", details.bytes);

  // f_auto = best output format per browser; q_auto = automatic quality tuning
  const transformedUrl = cloudinary.url(upload.public_id, {
    secure: true,
    transformation: [{ fetch_format: "auto", quality: "auto" }],
  });

  console.log(
    "Done! Click link below to see optimized version of the image. Check the size and the format."
  );
  console.log("Transformed URL:", transformedUrl);
}

main().catch((error) => {
  console.error("Cloudinary onboarding failed:", error);
  process.exit(1);
});
