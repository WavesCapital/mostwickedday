import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Upload } from "lucide-react";
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
import { ChampionCard } from "@/components/ChampionCard";
import {
  YearLeaderboard,
  type LeaderboardEventCol,
} from "@/components/YearLeaderboard";
import { EventItem } from "@/components/EventItem";
import { Footer } from "@/components/Footer";

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
    description: `Most Wicked Day ${year} — champion, event-by-event podiums, full scoreboard, and photos.`,
  };
}

const EVENT_SHORT: Record<string, string> = {
  "Hole Sports": "Hole",
  Cornhole: "C/K",
  "Cornhole / Kan Jam": "C/K",
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

export default async function YearPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  const recap = yearRecap(year);
  if (!recap) return notFound();

  const events = eventsByYear(year).filter((e) =>
    PERFORMANCES.some((p) => p.eventId === e.id),
  );
  const board = yearScoreboard(year).filter((row) =>
    events.some((e) => row.byEvent[e.id] !== undefined),
  );
  const champ = player(recap.championSlug);
  const champBadges = champ
    ? events
        .filter((e) =>
          eventPodium(e.id, 3).some((p) => p.player.slug === champ.slug),
        )
        .slice(0, 3)
        .map((e) => `${e.name} Top 3`)
    : [];

  const media = mediaForYear(year);
  const photos = media.filter((m) => m.kind === "photo");
  const videos = media.filter((m) => m.kind === "video");

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = YEAR_RECAPS.some((y) => y.year === prevYear);
  const hasNext = YEAR_RECAPS.some((y) => y.year === nextYear);

  const eventCols: LeaderboardEventCol[] = events.map((e) => ({
    id: e.id,
    short: EVENT_SHORT[e.name] ?? e.name.slice(0, 5),
  }));

  const timelineItems = events.map((e, i) => {
    const hue: "from" | "via" | "to" =
      i < events.length / 3 ? "from" : i < (events.length * 2) / 3 ? "via" : "to";
    const podium = eventPodium(e.id, 3).map((p) => ({
      name: p.player.name,
      slug: p.player.slug,
      points: p.points,
    }));
    const time = EVENT_TIMES[`${year}|${e.name}`] ?? "";
    return { hue, time, game: e.name, winners: podium };
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#0C1225] pt-16">
      {/* Giant year hero on palm backdrop */}
      <section className="relative flex items-center justify-center w-full">
        <div className="relative w-full h-auto md:min-h-[75vh] overflow-hidden">
          <Image
            src="/hero/sunset-palms.png"
            alt="Background palms"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto md:h-full md:absolute md:inset-0 object-contain md:object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1
                className="font-extrabold text-[26vw] leading-none text-[#34F5FF] drop-shadow-[0_0_14px_rgba(52,245,255,0.35)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {year}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div id="timeline" className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Champion first on mobile */}
          {champ && (
            <div className="md:hidden">
              <ChampionCard
                year={year}
                name={champ.name}
                points={recap.championPoints}
                slug={champ.slug}
                badges={champBadges}
              />
            </div>
          )}

          {/* Event podium timeline */}
          <section className="relative pl-12">
            <span
              aria-hidden
              className="absolute left-2 top-0 h-full w-[2px] bg-gradient-to-b from-[#34F5FF] via-[#FF3EBF] to-[#FF9F2B]"
            />
            {timelineItems.map((item) => (
              <EventItem
                key={`${item.time}-${item.game}`}
                hue={item.hue}
                time={item.time}
                game={item.game}
                winners={item.winners}
              />
            ))}
          </section>

          {/* Right col: champion (desktop) + leaderboard */}
          <div className="space-y-8">
            {champ && (
              <div className="hidden md:block">
                <ChampionCard
                  year={year}
                  name={champ.name}
                  points={recap.championPoints}
                  slug={champ.slug}
                  badges={champBadges}
                />
              </div>
            )}
            <YearLeaderboard
              rows={board.map((r) => ({
                slug: r.player.slug,
                name: r.player.name,
                total: r.total,
                byEvent: r.byEvent,
              }))}
              eventCols={eventCols}
            />
          </div>
        </div>

        {/* Photos */}
        <section className="pt-32">
          <h2 className="text-center text-4xl mb-14 text-white">PHOTOS</h2>
          {photos.length === 0 ? (
            <div className="text-white/70 py-8 text-center">No photos yet!</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={legacyMediaUrl(p.r2Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-xl shadow hover:scale-[1.04] transition-transform"
                >
                  <Image
                    src={legacyMediaUrl(p.r2Key)}
                    alt={`Most Wicked Day ${year}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Videos */}
        <section className="pt-32">
          <h2 className="text-center text-4xl mb-14 text-white">VIDEOS</h2>
          {videos.length === 0 ? (
            <div className="text-red-400/80 py-8 text-center">
              No videos yet!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => (
                <video
                  key={v.id}
                  src={legacyMediaUrl(v.r2Key)}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl border border-white/10"
                />
              ))}
            </div>
          )}
        </section>

        {/* Share Your Moments */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-bold text-2xl mb-4 text-white">
              Share Your Moments
            </h2>
            <p className="text-white/80 mb-8">
              Were you there? Upload your photos and videos to be part of the{" "}
              {year} memories!
            </p>
            <Link
              href="/upload"
              className="primary-button inline-flex items-center gap-2 text-lg mb-10"
            >
              <Upload className="w-5 h-5" />
              Upload Media
            </Link>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {hasPrev && (
                <Link
                  href={`/${prevYear}`}
                  className="secondary-button min-w-[160px]"
                >
                  ← Recap {prevYear}
                </Link>
              )}
              {hasNext ? (
                <Link
                  href={`/${nextYear}`}
                  className="primary-button min-w-[160px]"
                >
                  See {nextYear} →
                </Link>
              ) : (
                <Link
                  href="/#register-2025"
                  className="primary-button min-w-[160px]"
                >
                  Register for 2026 →
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
