// Build a public URL for a legacy media key. R2 bucket is private until the
// custom domain/public dev URL is wired, so legacy photos fall back to the
// Supabase public bucket the site was originally served from. Both work —
// rerun once R2_PUBLIC_BASE resolves to flip.
const SUPABASE_FALLBACK =
  "https://iskjcokiuagrdhgldwcr.supabase.co/storage/v1/object/public/mwd-photos";

export function legacyMediaUrl(r2Key: string): string {
  // r2Key format: "legacy/2023/xxx.jpeg". Strip the `legacy/` prefix to get
  // the original Supabase key.
  const supaKey = r2Key.replace(/^legacy\//, "");
  return `${SUPABASE_FALLBACK}/${supaKey}`;
}
