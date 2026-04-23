// Read-path queries — all backed by Neon. Pages are statically prerendered
// and revalidate on-demand when content changes (media uploads, RSVPs).

import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";
import type {
  Player,
  EventDef,
  Performance,
  YearRecap,
  MediaItem,
} from "./types";

// ---------- Base fetchers (cached) ----------

export const getAllPlayers = unstable_cache(
  async (): Promise<Player[]> => {
    const rows = (await sql`
      select slug, name, first_name, last_name, emoji, fun_fact
      from players
      order by name asc
    `) as Array<{
      slug: string;
      name: string;
      first_name: string;
      last_name: string;
      emoji: string | null;
      fun_fact: string | null;
    }>;
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      firstName: r.first_name,
      lastName: r.last_name,
      emoji: r.emoji ?? undefined,
      funFact: r.fun_fact ?? undefined,
    }));
  },
  ["players"],
  { tags: ["players"] },
);

export const getAllEvents = unstable_cache(
  async (): Promise<EventDef[]> => {
    const rows = (await sql`
      select id, year, ordinal, name
      from events
      order by year asc, ordinal asc
    `) as Array<{ id: string; year: number; ordinal: number; name: string }>;
    return rows;
  },
  ["events"],
  { tags: ["events"] },
);

export const getAllPerformances = unstable_cache(
  async (): Promise<Performance[]> => {
    const rows = (await sql`
      select event_id, player_slug, points, place, medal
      from performances
    `) as Array<{
      event_id: string;
      player_slug: string;
      points: number;
      place: number | null;
      medal: "gold" | "silver" | "bronze" | null;
    }>;
    return rows.map((r) => ({
      eventId: r.event_id,
      playerSlug: r.player_slug,
      points: r.points,
      place: r.place ?? undefined,
      medal: r.medal ?? undefined,
    }));
  },
  ["performances"],
  { tags: ["performances"] },
);

export const getAllYearRecaps = unstable_cache(
  async (): Promise<YearRecap[]> => {
    const rows = (await sql`
      select year, field_size, champion_slug, champion_points, recap, hero_media_key
      from year_recaps
      order by year asc
    `) as Array<{
      year: number;
      field_size: number;
      champion_slug: string | null;
      champion_points: number;
      recap: string | null;
      hero_media_key: string | null;
    }>;
    return rows.map((r) => ({
      year: r.year,
      fieldSize: r.field_size,
      championSlug: r.champion_slug ?? "",
      championPoints: r.champion_points,
      recap: r.recap ?? "",
      heroMediaKey: r.hero_media_key ?? undefined,
    }));
  },
  ["year-recaps"],
  { tags: ["year-recaps"] },
);

export const getAllMedia = unstable_cache(
  async (): Promise<MediaItem[]> => {
    const rows = (await sql`
      select id, year, kind, r2_key, uploader_name, created_at
      from media
      order by created_at asc
    `) as Array<{
      id: number;
      year: number;
      kind: "photo" | "video";
      r2_key: string;
      uploader_name: string | null;
      created_at: string;
    }>;
    return rows.map((r) => ({
      id: String(r.id),
      year: r.year,
      kind: r.kind,
      r2Key: r.r2_key,
      uploadedBy: r.uploader_name ?? undefined,
      uploadedAt: r.created_at,
    }));
  },
  ["media"],
  { tags: ["media"] },
);

// ---------- Derived views ----------

export async function player(slug: string) {
  const players = await getAllPlayers();
  return players.find((p) => p.slug === slug);
}

export async function eventsByYear(year: number) {
  const events = await getAllEvents();
  return events.filter((e) => e.year === year).sort((a, b) => a.ordinal - b.ordinal);
}

export async function yearRecap(year: number) {
  const recaps = await getAllYearRecaps();
  return recaps.find((y) => y.year === year);
}

export async function yearScoreboard(year: number) {
  const [events, perfs, players] = await Promise.all([
    eventsByYear(year),
    getAllPerformances(),
    getAllPlayers(),
  ]);
  const eventIds = new Set(events.map((e) => e.id));
  const totals = new Map<
    string,
    { player: Player; total: number; byEvent: Record<string, number> }
  >();
  const playerBySlug = new Map(players.map((p) => [p.slug, p]));
  for (const perf of perfs) {
    if (!eventIds.has(perf.eventId)) continue;
    const p = playerBySlug.get(perf.playerSlug);
    if (!p) continue;
    const entry = totals.get(p.slug) ?? { player: p, total: 0, byEvent: {} };
    entry.total += perf.points;
    entry.byEvent[perf.eventId] = perf.points;
    totals.set(p.slug, entry);
  }
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export async function eventPodium(eventId: string, limit = 3) {
  const [perfs, players] = await Promise.all([
    getAllPerformances(),
    getAllPlayers(),
  ]);
  const playerBySlug = new Map(players.map((p) => [p.slug, p]));
  return perfs
    .filter((p) => p.eventId === eventId)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((p) => ({ ...p, player: playerBySlug.get(p.playerSlug)! }))
    .filter((p) => p.player);
}

export async function careerStats(slug: string) {
  const [perfs, events, recaps] = await Promise.all([
    getAllPerformances(),
    getAllEvents(),
    getAllYearRecaps(),
  ]);
  const mine = perfs.filter((p) => p.playerSlug === slug);
  const points = mine.reduce((s, p) => s + p.points, 0);
  const eventById = new Map(events.map((e) => [e.id, e]));
  const yearsActive = new Set(
    mine.map((p) => eventById.get(p.eventId)?.year).filter(Boolean),
  ).size;
  const medals = mine.filter((p) => p.medal).length;
  const championYears = recaps
    .filter((y) => y.championSlug === slug)
    .map((y) => y.year);
  return { points, yearsActive, medals, championYears };
}

export async function allTimeLeaderboard() {
  const [perfs, events, players] = await Promise.all([
    getAllPerformances(),
    getAllEvents(),
    getAllPlayers(),
  ]);
  const playerBySlug = new Map(players.map((p) => [p.slug, p]));
  const eventById = new Map(events.map((e) => [e.id, e]));
  const totals = new Map<
    string,
    { player: Player; total: number; years: number; medals: number }
  >();
  for (const perf of perfs) {
    const p = playerBySlug.get(perf.playerSlug);
    if (!p) continue;
    const entry = totals.get(p.slug) ?? { player: p, total: 0, years: 0, medals: 0 };
    entry.total += perf.points;
    if (perf.medal) entry.medals += 1;
    totals.set(p.slug, entry);
  }
  for (const [slug, entry] of totals) {
    entry.years = new Set(
      perfs
        .filter((p) => p.playerSlug === slug)
        .map((p) => eventById.get(p.eventId)?.year)
        .filter(Boolean),
    ).size;
  }
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export async function mediaForYear(year: number) {
  const media = await getAllMedia();
  return media
    .filter((m) => m.year === year)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}
