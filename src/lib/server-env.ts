import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_ENDPOINT: z.string().url(),
  R2_BUCKET: z.string().default("mwd-photos"),
  R2_PUBLIC_BASE: z.string().url(),
});

let cached: z.infer<typeof schema> | undefined;

export function serverEnv() {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      "Invalid server environment: " +
        JSON.stringify(parsed.error.flatten().fieldErrors),
    );
  }
  cached = parsed.data;
  return cached;
}
