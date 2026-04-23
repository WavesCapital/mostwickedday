// One-shot seed: loads all history (players, events, performances, year_recaps,
// legacy media) into Neon. Idempotent via ON CONFLICT. Delete after first run.
// Run: node --experimental-strip-types scripts/seed-neon.ts
/* eslint-disable no-console */

import { neon } from "@neondatabase/serverless";
import {
  PLAYERS,
  EVENTS,
  PERFORMANCES,
  YEAR_RECAPS,
  LEGACY_MEDIA,
} from "../migration-cache/history-seed.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const sql = neon(url);

async function main() {
  console.log(
    `Seeding Neon: ${PLAYERS.length} players, ${EVENTS.length} events, ${PERFORMANCES.length} performances, ${YEAR_RECAPS.length} year_recaps, ${LEGACY_MEDIA.length} legacy media…`,
  );

  for (const p of PLAYERS) {
    await sql`
      insert into players (slug, name, first_name, last_name, emoji, fun_fact)
      values (${p.slug}, ${p.name}, ${p.firstName}, ${p.lastName}, ${p.emoji ?? null}, ${p.funFact ?? null})
      on conflict (slug) do update set
        name = excluded.name,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        emoji = excluded.emoji,
        fun_fact = excluded.fun_fact
    `;
  }
  console.log(`  ✓ players`);

  for (const e of EVENTS) {
    await sql`
      insert into events (id, year, ordinal, name)
      values (${e.id}, ${e.year}, ${e.ordinal}, ${e.name})
      on conflict (id) do update set
        year = excluded.year,
        ordinal = excluded.ordinal,
        name = excluded.name
    `;
  }
  console.log(`  ✓ events`);

  for (const perf of PERFORMANCES) {
    if (!perf) continue;
    await sql`
      insert into performances (event_id, player_slug, points, place, medal)
      values (${perf.eventId}, ${perf.playerSlug}, ${perf.points}, ${perf.place ?? null}, ${perf.medal ?? null})
      on conflict (event_id, player_slug) do update set
        points = excluded.points,
        place = excluded.place,
        medal = excluded.medal
    `;
  }
  console.log(`  ✓ performances`);

  for (const y of YEAR_RECAPS) {
    await sql`
      insert into year_recaps (year, field_size, champion_slug, champion_points, recap, hero_media_key)
      values (${y.year}, ${y.fieldSize}, ${y.championSlug || null}, ${y.championPoints}, ${y.recap}, ${y.heroMediaKey ?? null})
      on conflict (year) do update set
        field_size = excluded.field_size,
        champion_slug = excluded.champion_slug,
        champion_points = excluded.champion_points,
        recap = excluded.recap,
        hero_media_key = excluded.hero_media_key
    `;
  }
  console.log(`  ✓ year_recaps`);

  for (const m of LEGACY_MEDIA) {
    await sql`
      insert into media (year, kind, r2_key, mime_type, uploader_name, caption, created_at)
      values (${m.year}, ${m.kind}, ${m.r2Key}, ${m.kind === "photo" ? "image/jpeg" : "video/mp4"}, ${m.uploadedBy ?? null}, null, ${m.uploadedAt})
      on conflict (r2_key) do nothing
    `;
  }
  console.log(`  ✓ media (legacy)`);

  const counts = {
    players: (await sql`select count(*)::int as n from players`)[0].n as number,
    events: (await sql`select count(*)::int as n from events`)[0].n as number,
    performances: (await sql`select count(*)::int as n from performances`)[0]
      .n as number,
    year_recaps: (await sql`select count(*)::int as n from year_recaps`)[0]
      .n as number,
    media: (await sql`select count(*)::int as n from media`)[0].n as number,
    rsvps: (await sql`select count(*)::int as n from rsvps`)[0].n as number,
  };
  console.log("\nRow counts in Neon:");
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
