import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  careerStats,
  player,
  getAllPlayers,
  getAllEvents,
  getAllPerformances,
} from "@/data/queries";
import { Footer } from "@/components/Footer";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const players = await getAllPlayers();
  return players.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = await player(slug);
  return {
    title: p ? p.name : "Player Not Found",
    description: p
      ? `${p.name}'s Most Wicked Day career — points, medals, and year-by-year results.`
      : undefined,
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [p, stats, allPerfs, allEvents] = await Promise.all([
    player(slug),
    careerStats(slug),
    getAllPerformances(),
    getAllEvents(),
  ]);
  if (!p) return notFound();

  const perfs = allPerfs.filter((x) => x.playerSlug === slug);
  const byYear = new Map<number, typeof perfs>();
  for (const perf of perfs) {
    const year = allEvents.find((e) => e.id === perf.eventId)?.year;
    if (!year) continue;
    byYear.set(year, [...(byYear.get(year) ?? []), perf]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <main className="min-h-screen flex flex-col bg-[#0C1225] pt-16">
      <section className="relative flex items-center justify-center w-full">
        <div className="relative w-full h-auto md:min-h-[45vh] overflow-hidden">
          <Image
            src="/hero/sunset-palms.png"
            alt="Background palms"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto md:h-full md:absolute md:inset-0 object-contain md:object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-6xl md:text-8xl mb-2">{p.emoji ?? "🔥"}</div>
              <h1
                className="font-extrabold text-5xl md:text-7xl leading-none text-[#34F5FF] drop-shadow-[0_0_14px_rgba(52,245,255,0.35)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {p.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl mt-12 md:mt-16">
        <div className="mb-8">
          <Link
            href="/all-time"
            className="text-cyan-300 hover:text-cyan-100 text-sm transition"
          >
            ← All-Time Stats
          </Link>
        </div>

        {p.funFact && (
          <p className="text-white/80 italic mb-10 text-center">{p.funFact}</p>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="Career Points" value={stats.points} />
          <Stat label="Years Active" value={stats.yearsActive} />
          <Stat label="Medals" value={`${stats.medals} 🏅`} />
          <Stat
            label="Championships"
            value={
              stats.championYears.length
                ? stats.championYears.join(", ")
                : "—"
            }
          />
        </section>

        <section className="space-y-8 mb-16">
          {years.map((year) => {
            const yearPerfs = byYear.get(year)!;
            const total = yearPerfs.reduce((s, p) => s + p.points, 0);
            return (
              <div
                key={year}
                className="rounded-3xl bg-[#0E0F1D]/80 border border-cyan-400/40 p-6"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <Link
                    href={`/${year}`}
                    className="text-3xl font-extrabold text-cyan-300 hover:text-cyan-100 transition"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {year}
                  </Link>
                  <div className="text-cyan-300 font-semibold">{total} pts</div>
                </div>
                <ul className="space-y-2">
                  {yearPerfs.map((perf) => {
                    const event = allEvents.find((e) => e.id === perf.eventId);
                    return (
                      <li
                        key={perf.eventId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-white/90">
                          {event?.name ?? "Unknown"}
                          {perf.medal && (
                            <span className="ml-2">
                              {perf.medal === "gold"
                                ? "🥇"
                                : perf.medal === "silver"
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          )}
                        </span>
                        <span className="text-cyan-300">{perf.points} pts</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </div>

      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[#0E0F1D]/80 border border-cyan-400/30 p-4">
      <div className="text-xs uppercase tracking-widest text-cyan-300/80">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
