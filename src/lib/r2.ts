import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { serverEnv } from "./server-env";

const env = serverEnv();

export const r2 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  key: string,
  body: Uint8Array | Buffer,
  contentType: string,
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return `${env.R2_PUBLIC_BASE}/${key}`;
}

export function r2PublicUrl(key: string) {
  return `${env.R2_PUBLIC_BASE}/${key}`;
}
