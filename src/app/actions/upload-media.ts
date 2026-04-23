"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { sql } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";

const MAX_PHOTO_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const MetaSchema = z.object({
  year: z.coerce.number().int().min(2023).max(2030),
  uploader: z.string().trim().min(1).max(60),
  caption: z.string().trim().max(280).optional(),
});

export type UploadState = {
  errors?: Record<string, string[]>;
  message?: string;
  uploadedR2Key?: string;
};

export async function uploadMedia(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const meta = MetaSchema.safeParse({
    year: formData.get("year"),
    uploader: formData.get("uploader"),
    caption: formData.get("caption") || undefined,
  });
  if (!meta.success) {
    return { errors: meta.error.flatten().fieldErrors };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { errors: { file: ["Pick a photo or video to upload"] } };
  }

  const isPhoto = PHOTO_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);
  if (!isPhoto && !isVideo) {
    return {
      errors: {
        file: [
          `Unsupported file type (${file.type || "unknown"}). JPEG/PNG/WEBP/HEIC or MP4/MOV/WEBM only.`,
        ],
      },
    };
  }
  const maxBytes = isPhoto ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    return {
      errors: { file: [`${mb} MB max — try compressing first.`] },
    };
  }

  const ext =
    file.name.split(".").pop()?.toLowerCase() ||
    (file.type.split("/")[1] ?? "bin");
  const uuid = crypto.randomUUID();
  const key = `${meta.data.year}/${uuid}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  await uploadToR2(key, bytes, file.type);

  await sql`
    insert into media (year, kind, r2_key, mime_type, uploader_name, caption)
    values (
      ${meta.data.year},
      ${isPhoto ? "photo" : "video"},
      ${key},
      ${file.type},
      ${meta.data.uploader},
      ${meta.data.caption ?? null}
    )
  `;

  updateTag(`media:${meta.data.year}`);

  return {
    message: `Uploaded ${file.name}. Thanks, ${meta.data.uploader}!`,
    uploadedR2Key: key,
  };
}
