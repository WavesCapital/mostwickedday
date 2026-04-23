// Every binary served through our own origin — /api/media/<r2-key> proxies
// R2 via the server-side credentials. Zero third-party (Supabase) dependency.

export function legacyMediaUrl(r2Key: string): string {
  return `/api/media/${r2Key}`;
}
