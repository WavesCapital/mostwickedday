import Link from "next/link";
import { notFound } from "next/navigation";
import { PLAYERS, EVENTS, PERFORMANCES } from "@/data/history";
import { careerStats, player } from "@/data/queries";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PLAYERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = player(slug);
  return {
    title: p ? `${p.name}` : "Player Not Found",
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
  const p = player(slug);
  if (!p) return notFound();

  const stats = careerStats(slug);
  const perfs = PERFORMANCES.filter((x) => x.playerSlug === slug);

  // Group performances by year, newest first
  const byYear = new Map<number, typeof perfs>();
  for (const perf of perfs) {
    const year = EVENTS.find((e) => e.id === perf.eventId)?.year;
    if (!year) continue;
    byYear.set(year, [...(byYear.get(year) ?? []), perf]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/all-time"
        className="text-sunset-400 hover:text-sunset-200 text-sm transition inline-block mb-6"
      >
        ← All-Time Stats
      </Link>

      <header className="mb-10">
        <div
          className="text-7xl md:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {p.emoji ?? "🔥"}
        </div>
        <h1 className="text-sunset-gradient text-5xl md:text-6xl mt-2">
          {p.name}
        </h1>
        {p.funFact && (
          <p className="text-sand-200 mt-4 italic">{p.funFact}</p>
        )}
      </header>

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

      <section className="space-y-8">
        {years.map((year) => {
          const yearPerfs = byYear.get(year)!;
          const total = yearPerfs.reduce((s, p) => s + p.points, 0);
          return (
            <div
              key={year}
              className="rounded-retro bg-night-900/60 border border-sunset-700/30 p-6"
            >
              <div className="flex items-baseline justify-between mb-4">
                <Link
                  href={`/${year}`}
                  className="text-3xl hover:text-sunset-200 transition"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {year}
                </Link>
                <div className="text-sunset-400 font-semibold">
                  {total} pts
                </div>
              </div>
              <ul className="space-y-2">
                {yearPerfs.map((perf) => {
                  const event = EVENTS.find((e) => e.id === perf.eventId);
                  return (
                    <li
                      key={perf.eventId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-sand-200">
                        {event?.name ?? "Unknown"}
                        {perf.medal && (
                          <span className="ml-2 text-sunset-400">
                            {perf.medal === "gold"
                              ? "🥇"
                              : perf.medal === "silver"
                                ? "🥈"
                                : "🥉"}
                          </span>
                        )}
                      </span>
                      <span className="text-sunset-200">{perf.points} pts</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-retro bg-night-900/60 border border-sunset-700/30 p-4">
      <div className="text-xs uppercase tracking-widest text-sunset-400/80">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-sunset-200">
        {value}
      </div>
    </div>
  );
}
