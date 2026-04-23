// One-shot codegen: reads migration-cache/*.json dumps from the live Supabase,
// emits src/data/history.ts with typed constants. Delete this file after use.
// Run with: node --experimental-strip-types scripts/generate-history.ts

import { readFileSync, writeFileSync } from "fs";

type RawPlayer = {
  id: string;
  name: string;
  emoji_avatar: string | null;
  fun_fact: string | null;
  first_name: string;
  last_name: string;
  slug: string;
  status: string;
};

type RawEvent = {
  id: string;
  year: number;
  name: string;
  order_index: number;
};

type RawEventResult = {
  id: string;
  event_id: string;
  player_id: string;
  place: number | null;
  year: number;
  points: number;
  total_participants: number;
};

type RawPerformance = {
  player_id: string;
  event_id: string;
  points: number;
};

type RawPhoto = {
  id: string;
  year: number;
  event_id: string | null;
  path: string;
  uploaded_at: string;
  type: "photo" | "video";
  uploaded_by: string | null;
};

const root = new URL("../migration-cache/", import.meta.url).pathname;
const read = <T>(f: string): T[] =>
  JSON.parse(readFileSync(root + f + ".json", "utf8"));

const rawPlayers = read<RawPlayer>("players");
const rawEvents = read<RawEvent>("events");
const rawResults = read<RawEventResult>("event_results");
const rawPerfs = read<RawPerformance>("performances");
const rawPhotos = read<RawPhoto>("photos");

const playerById = Object.fromEntries(rawPlayers.map((p) => [p.id, p]));

const players = rawPlayers
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    firstName: p.first_name,
    lastName: p.last_name,
    emoji: p.emoji_avatar ?? undefined,
    funFact: p.fun_fact ?? undefined,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const events = rawEvents
  .map((e) => ({
    id: e.id,
    year: e.year,
    ordinal: e.order_index,
    name: e.name,
  }))
  .sort((a, b) => a.year - b.year || a.ordinal - b.ordinal);

// Build per-(event,player) points: start from performances (full field coverage)
// then overlay event_results place/medal.
const perfByKey = new Map<string, number>();
for (const p of rawPerfs) {
  perfByKey.set(`${p.event_id}|${p.player_id}`, p.points);
}
const placeByKey = new Map<string, number>();
for (const r of rawResults) {
  if (r.place !== null) placeByKey.set(`${r.event_id}|${r.player_id}`, r.place);
}

const performances = [...perfByKey.entries()]
  .map(([k, pts]) => {
    const [eventId, playerId] = k.split("|");
    const place = placeByKey.get(k);
    const player = playerById[playerId];
    if (!player) return null;
    const medal =
      place === 1 ? "gold" : place === 2 ? "silver" : place === 3 ? "bronze" : undefined;
    return {
      eventId,
      playerSlug: player.slug,
      points: pts,
      place,
      medal,
    };
  })
  .filter(Boolean);

// Media referenced by R2 key (public base + key).
const media = rawPhotos
  .map((m) => ({
    id: m.id,
    year: m.year,
    kind: m.type,
    r2Key: `legacy/${m.path}`,
    uploadedBy: m.uploaded_by ?? undefined,
    uploadedAt: m.uploaded_at,
  }))
  .sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));

// Year recaps (hand-curated narrative + champion lookup).
// Champion = player with highest total across all events of that year.
const totalsByYearPlayer = new Map<string, number>();
for (const p of performances) {
  const year = rawEvents.find((e) => e.id === p!.eventId)?.year;
  if (!year) continue;
  const k = `${year}|${p!.playerSlug}`;
  totalsByYearPlayer.set(k, (totalsByYearPlayer.get(k) ?? 0) + p!.points);
}

const championByYear: Record<number, { slug: string; points: number }> = {};
for (const [k, pts] of totalsByYearPlayer) {
  const [yearStr, slug] = k.split("|");
  const year = Number(yearStr);
  if (!championByYear[year] || championByYear[year].points < pts) {
    championByYear[year] = { slug, points: pts };
  }
}

const yearRecaps = [2023, 2024, 2025].map((year) => {
  const champ = championByYear[year];
  const field = new Set(
    [...totalsByYearPlayer.keys()]
      .filter((k) => k.startsWith(`${year}|`))
      .map((k) => k.split("|")[1]),
  ).size;
  const hero = media.find((m) => m.year === year && m.kind === "photo")?.r2Key;
  const recapText: Record<number, string> = {
    2023:
      "The inaugural Most Wicked Day kicked off with 19 competitors across four signature events: Disc Golf, Pickleball, Wiffleball, and Spikeball. Kyle emerged victorious to take the first-ever Trophy chug.",
    2024:
      "The field expanded to 30 players with five events: Cornhole/Kan Jam, Pickleball, Dodgeball, Wiffle/Kick, and the Beach Race. Austin Granger took the crown in a back-and-forth battle.",
    2025:
      "The biggest field yet — 35+ competitors across six events, including the debut Most Wicked Combine. Kyle reclaimed the throne to even the score against Austin.",
  };
  return {
    year,
    fieldSize: field,
    championSlug: champ?.slug ?? "",
    championPoints: champ?.points ?? 0,
    recap: recapText[year] ?? "",
    heroMediaKey: hero,
  };
});

// Emit TS file.
const out = `// Generated from Supabase dump on 2026-04-23. Do not edit by hand —
// regenerate via scripts/generate-history.ts (then delete the script).

import type { Player, EventDef, Performance, YearRecap, MediaItem } from "./types";

export const PLAYERS: Player[] = ${JSON.stringify(players, null, 2)};

export const EVENTS: EventDef[] = ${JSON.stringify(events, null, 2)};

export const PERFORMANCES: Performance[] = ${JSON.stringify(performances, null, 2)};

export const YEAR_RECAPS: YearRecap[] = ${JSON.stringify(yearRecaps, null, 2)};

export const LEGACY_MEDIA: MediaItem[] = ${JSON.stringify(media, null, 2)};
`;

writeFileSync(new URL("../src/data/history.ts", import.meta.url).pathname, out);
console.log(
  `Wrote history.ts: ${players.length} players, ${events.length} events, ${performances.length} performances, ${yearRecaps.length} year recaps, ${media.length} media`,
);
