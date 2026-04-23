import { EVENTS, PERFORMANCES, PLAYERS, YEAR_RECAPS, LEGACY_MEDIA } from "./history";
import type { Player, EventDef, Performance } from "./types";

export function player(slug: string): Player | undefined {
  return PLAYERS.find((p) => p.slug === slug);
}

export function eventsByYear(year: number): EventDef[] {
  return EVENTS.filter((e) => e.year === year).sort((a, b) => a.ordinal - b.ordinal);
}

export function resultsForEvent(eventId: string): Performance[] {
  return PERFORMANCES.filter((p) => p.eventId === eventId).sort(
    (a, b) => b.points - a.points,
  );
}

export function yearScoreboard(year: number) {
  const events = eventsByYear(year);
  const eventIds = new Set(events.map((e) => e.id));
  const totals = new Map<string, { player: Player; total: number; byEvent: Record<string, number> }>();
  for (const perf of PERFORMANCES) {
    if (!eventIds.has(perf.eventId)) continue;
    const p = player(perf.playerSlug);
    if (!p) continue;
    const entry = totals.get(p.slug) ?? { player: p, total: 0, byEvent: {} };
    entry.total += perf.points;
    entry.byEvent[perf.eventId] = perf.points;
    totals.set(p.slug, entry);
  }
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export function eventPodium(eventId: string, limit = 3) {
  return resultsForEvent(eventId)
    .slice(0, limit)
    .map((p) => ({ ...p, player: player(p.playerSlug)! }))
    .filter((p) => p.player);
}

export function careerStats(slug: string) {
  const perfs = PERFORMANCES.filter((p) => p.playerSlug === slug);
  const points = perfs.reduce((s, p) => s + p.points, 0);
  const yearsActive = new Set(
    perfs.map((p) => EVENTS.find((e) => e.id === p.eventId)?.year).filter(Boolean),
  );
  const medals = perfs.filter((p) => p.medal).length;
  const championYears = YEAR_RECAPS.filter((y) => y.championSlug === slug).map((y) => y.year);
  return { points, yearsActive: yearsActive.size, medals, championYears };
}

export function allTimeLeaderboard() {
  const totals = new Map<string, { player: Player; total: number; years: number; medals: number }>();
  for (const perf of PERFORMANCES) {
    const p = player(perf.playerSlug);
    if (!p) continue;
    const year = EVENTS.find((e) => e.id === perf.eventId)?.year;
    const entry = totals.get(p.slug) ?? { player: p, total: 0, years: 0, medals: 0 };
    entry.total += perf.points;
    if (perf.medal) entry.medals += 1;
    totals.set(p.slug, entry);
  }
  // Count years active per player
  for (const [slug, entry] of totals) {
    entry.years = new Set(
      PERFORMANCES.filter((p) => p.playerSlug === slug).map(
        (p) => EVENTS.find((e) => e.id === p.eventId)?.year,
      ).filter(Boolean),
    ).size;
  }
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export function yearRecap(year: number) {
  return YEAR_RECAPS.find((y) => y.year === year);
}

export function mediaForYear(year: number) {
  return LEGACY_MEDIA.filter((m) => m.year === year).sort((a, b) =>
    b.uploadedAt.localeCompare(a.uploadedAt),
  );
}
