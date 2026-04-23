import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { YEAR_RECAPS, PERFORMANCES } from "@/data/history";
import {
  eventsByYear,
  yearRecap,
  yearScoreboard,
  eventPodium,
  player,
  mediaForYear,
} from "@/data/queries";
import { legacyMediaUrl } from "@/lib/media";

type Params = { year: string };

export function generateStaticParams(): Params[] {
  return YEAR_RECAPS.map((y) => ({ year: String(y.year) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year } = await params;
  return {
    title: `${year} Recap`,
    description: `Most Wicked Day ${year} — champion, event-by-event results, full scoreboard, and photos.`,
  };
}

// Short column labels for the scoreboard (live-site convention).
const EVENT_SHORT: Record<string, string> = {
  "Hole Sports": "Hole",
  Cornhole: "C/K",
  "Cornhole / Kan Jam": "C/K",
  "Kan Jam": "Kan",
  Pickleball: "Pickle",
  Dodgeball: "Dodge",
  Wiffleball: "Wiffle",
  "Wiffle Ball": "Wiffle",
  "Wiffle Ball / Kickball": "Wiffle",
  "Most Wicked Race": "Race",
  "Most Wicked Combine": "Combine",
  "Disc Golf": "DG",
  Spikeball: "Spike",
};

// Event start times per year — from the live site. Only partial; missing
// events get a blank time.
const EVENT_TIMES: Record<string, string> = {
  "2023|Disc Golf": "8:00 AM",
  "2023|Pickleball": "10:30 AM",
  "2023|Wiffleball": "1:00 PM",
  "2023|Spikeball": "4:30 PM",
  "2024|Cornhole / Kan Jam": "8:00 AM",
  "2024|Pickleball": "10:30 AM",
  "2024|Dodgeball": "1:00 PM",
  "2024|Wiffle Ball / Kickball": "3:30 PM",
  "2024|Most Wicked Race": "5:30 PM",
  "2025|Hole Sports": "8:00 AM",
  "2025|Pickleball": "9:30 AM",
  "2025|Dodgeball": "11:00 AM",
  "2025|Wiffleball": "1:00 PM",
  "2025|Most Wicked Combine": "4:30 PM",
};

const RANK_COLOR = [
  "text-[#34F5FF]", // 1st — cyan
  "text-[#FF3EBF]", // 2nd — pink
  "text-[#FF9F2B]", // 3rd — orange
];

export default async function YearPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  const recap = yearRecap(year);
  if (!recap) return notFound();

  // Only include events that actually have performance rows — live site
  // hides events with no results.
  const events = eventsByYear(year).filter((e) =>
    PERFORMANCES.some((p) => p.eventId === e.id),
  );
  const board = yearScoreboard(year).filter((row) =>
    events.some((e) => row.byEvent[e.id] !== undefined),
  );
  const champ = player(recap.championSlug);
  const champEventsPodium = champ
    ? events.filter((e) =>
        eventPodium(e.id, 3).some((p) => p.player.slug === champ.slug),
      )
    : [];
  const champBadges = champEventsPodium.slice(0, 3).map((e) => e.name);
  const media = mediaForYear(year);
  const photos = media.filter((m) => m.kind === "photo");
  const videos = media.filter((m) => m.kind === "video");

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = YEAR_RECAPS.some((y) => y.year === prevYear);
  const hasNext = YEAR_RECAPS.some((y) => y.year === nextYear);

  return (
    <main className="pb-24">
      {/* Giant year hero */}
      <section className="relative w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-sunset-900/20 via-transparent to-transparent" />
        <h1
          className="relative text-[clamp(6rem,26vw,22rem)] leading-none text-center py-12 font-extrabold text-sunset-500 drop-shadow-[0_0_32px_rgba(255,140,70,0.35)]"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: "0 0 64px rgba(255,120,60,0.15)",
          }}
        >
          {year}
        </h1>
      </section>

      <div className="mx-auto max-w-5xl px-6 -mt-4">
        <Link
          href="/"
          className="text-sunset-400 hover:text-sunset-200 text-sm transition inline-block mb-10"
        >
          ← Home
        </Link>

        {/* Champion card */}
        {champ && (
          <section className="relative max-w-xl mx-auto rounded-3xl p-8 text-center border border-sunset-400/60 bg-night-900/70 shadow-[0_0_24px_rgba(250,150,90,0.15)]">
            <div className="text-xs uppercase tracking-widest text-sunset-400/80 mb-4">
              {year} Champion
            </div>
            <div className="text-7xl mb-4">🏆</div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-sunset-200 drop-shadow-[0_0_14px_rgba(255,180,120,0.35)]"
            >
              {champ.name}
            </h2>
            <p className="mt-3 text-lg text-sand-200">
              {recap.championPoints} Total Points
            </p>
            {champBadges.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {champBadges.map((b) => (
                  <span
                    key={b}
                    className="inline-block px-4 py-1 rounded-full bg-sunset-700/40 text-sunset-200 text-sm font-medium border border-sunset-400/30"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/players/${champ.slug}`}
              className="inline-block mt-6 bg-sunset-gradient px-8 py-3 rounded-retro font-semibold text-night-950 hover:scale-[1.03] transition text-sm"
            >
              View Profile
            </Link>
          </section>
        )}

        {/* Event podium timeline */}
        <section className="relative mt-20 pl-10 md:pl-12">
          <span
            aria-hidden
            className="absolute left-2 top-2 h-[calc(100%-1rem)] w-[2px] bg-gradient-to-b from-[#34F5FF] via-[#FF3EBF] to-[#FF9F2B]"
          />
          <div className="space-y-14">
            {events.map((e) => {
              const podium = eventPodium(e.id, 3);
              const time = EVENT_TIMES[`${year}|${e.name}`];
              return (
                <div key={e.id} className="relative">
                  <span className="absolute -left-[42px] md:-left-[44px] top-1.5 w-4 h-4 rounded-full bg-[#34F5FF] ring-2 ring-[#34F5FF] shadow-[0_0_8px_rgba(52,245,255,0.6)]" />
                  <h3 className="text-xl font-bold text-sand-50 mb-3">
                    {time && <span className="text-sunset-400">{time} · </span>}
                    {e.name}
                  </h3>
                  <ol className="space-y-1 text-sm">
                    {podium.map((p, i) => (
                      <li
                        key={p.player.slug}
                        className="flex items-center gap-2"
                      >
                        <span className={`font-semibold ${RANK_COLOR[i]}`}>
                          {i + 1}.
                        </span>
                        <Link
                          href={`/players/${p.player.slug}`}
                          className="text-sand-200 hover:text-sand-50 hover:underline transition"
                        >
                          {p.player.name}
                        </Link>
                        <span className="text-sand-200/60">
                          ({p.points} pts)
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* Full scoreboard */}
        <section className="mt-20">
          <div className="rounded-3xl border border-sunset-400/40 bg-night-900/60 overflow-hidden shadow-[0_0_24px_rgba(250,150,90,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sunset-400/80 text-xs uppercase tracking-widest border-b border-sunset-400/20">
                    <th className="px-4 py-4 w-14 text-center">Rank</th>
                    <th className="px-2 py-4">Player</th>
                    <th className="px-2 py-4 text-center w-16">Total</th>
                    {events.map((e) => (
                      <th
                        key={e.id}
                        className="px-2 py-4 text-center w-16"
                      >
                        {EVENT_SHORT[e.name] ?? e.name.slice(0, 5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sunset-400/10">
                  {board.map((row, i) => {
                    const podiumIcon =
                      i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                    return (
                      <tr
                        key={row.player.slug}
                        className={
                          i < 3
                            ? "bg-sunset-900/10 hover:bg-sunset-900/30 transition"
                            : "hover:bg-night-900/40 transition"
                        }
                      >
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center gap-1">
                            {podiumIcon && <span>{podiumIcon}</span>}
                            <span
                              className={
                                i === 0
                                  ? "text-sunset-200 font-semibold"
                                  : i === 1
                                    ? "text-sand-200 font-semibold"
                                    : i === 2
                                      ? "text-sunset-400 font-semibold"
                                      : "text-sand-200/60"
                              }
                            >
                              {i + 1}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <Link
                            href={`/players/${row.player.slug}`}
                            className="text-sand-100 hover:text-sunset-200 transition font-medium truncate inline-block max-w-[14ch] md:max-w-none"
                          >
                            {row.player.emoji} {row.player.name}
                          </Link>
                        </td>
                        <td className="px-2 py-3 text-center text-sunset-200 font-semibold text-lg tabular-nums">
                          {row.total}
                        </td>
                        {events.map((e) => (
                          <td
                            key={e.id}
                            className="px-2 py-3 text-center text-sand-200/80 tabular-nums"
                          >
                            {row.byEvent[e.id] ?? 0}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="mt-24">
          <h2 className="text-center text-4xl mb-10 text-sand-50">PHOTOS</h2>
          {photos.length === 0 ? (
            <p className="text-center text-sand-200/60 py-6">No photos yet!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={legacyMediaUrl(p.r2Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-retro border border-sunset-700/30 hover:border-sunset-400/60 transition group"
                >
                  <Image
                    src={legacyMediaUrl(p.r2Key)}
                    alt={`${year} Most Wicked Day`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Videos */}
        <section className="mt-20">
          <h2 className="text-center text-4xl mb-10 text-sand-50">VIDEOS</h2>
          {videos.length === 0 ? (
            <p className="text-center text-sand-200/60 py-6">No videos yet!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => (
                <video
                  key={v.id}
                  src={legacyMediaUrl(v.r2Key)}
                  controls
                  preload="metadata"
                  className="w-full rounded-retro border border-sunset-700/30"
                />
              ))}
            </div>
          )}
        </section>

        {/* Share your moments */}
        <section className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-sand-50 mb-4">
            Share Your Moments
          </h2>
          <p className="text-sand-200/80 mb-6 max-w-xl mx-auto">
            Were you there? Upload your photos and videos to be part of the{" "}
            {year} memories.
          </p>
          <Link
            href="/upload"
            className="inline-block bg-sunset-gradient px-8 py-3 rounded-retro font-semibold text-night-950 hover:scale-[1.03] transition"
          >
            Upload Media
          </Link>
        </section>

        {/* Prev / next year nav */}
        <nav className="mt-16 flex flex-wrap justify-center gap-3">
          {hasPrev && (
            <Link
              href={`/${prevYear}`}
              className="px-6 py-3 rounded-retro border border-sunset-400/40 text-sunset-200 hover:bg-sunset-400/10 transition"
            >
              ← Recap {prevYear}
            </Link>
          )}
          {hasNext && (
            <Link
              href={`/${nextYear}`}
              className="px-6 py-3 rounded-retro bg-sunset-gradient font-semibold text-night-950 hover:scale-[1.02] transition"
            >
              See {nextYear} →
            </Link>
          )}
          {!hasNext && (
            <Link
              href="/"
              className="px-6 py-3 rounded-retro bg-sunset-gradient font-semibold text-night-950 hover:scale-[1.02] transition"
            >
              Home ↑
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
