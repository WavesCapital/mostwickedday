import Link from "next/link";
import { YEAR_RECAPS } from "@/data/history";
import { allTimeLeaderboard, yearRecap, player } from "@/data/queries";

const CURRENT_YEAR = 2025;

export default function HomePage() {
  const top5 = allTimeLeaderboard().slice(0, 5);
  const thisYear = yearRecap(CURRENT_YEAR);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center space-y-6">
        <p
          className="text-sunset-200 tracking-[0.3em] text-sm"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Lake Tobesofkee · Macon GA
        </p>
        <h1 className="text-sunset-gradient text-6xl md:text-8xl">
          MOST&nbsp;WICKED&nbsp;DAY
        </h1>
        <p className="text-sand-200 text-lg max-w-2xl mx-auto">
          The ultimate summer showdown. Five events, one trophy,
          one champion who has to chug from it.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            href={`/${CURRENT_YEAR}`}
            className="bg-sunset-gradient px-8 py-3 rounded-retro font-semibold text-night-950 hover:scale-105 transition inline-block"
          >
            Register for {CURRENT_YEAR}
          </Link>
          <Link
            href="/all-time"
            className="px-6 py-3 rounded-retro border border-sunset-400/40 text-sunset-200 hover:bg-sunset-400/10 transition inline-block"
          >
            All-Time Leaderboard
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {YEAR_RECAPS.slice().reverse().map((y) => {
          const champ = player(y.championSlug);
          return (
            <Link
              key={y.year}
              href={`/${y.year}`}
              className="block rounded-retro bg-night-900/60 border border-sunset-700/30 p-6 hover:border-sunset-400/60 transition"
            >
              <div className="text-sunset-400 text-sm uppercase tracking-widest">
                {y.year === CURRENT_YEAR ? "Upcoming" : "Past Edition"}
              </div>
              <div className="text-4xl mt-3" style={{ fontFamily: "var(--font-display)" }}>
                {y.year}
              </div>
              <div className="mt-4 text-sand-200">
                <div className="text-xs uppercase text-sand-200/60">Champion</div>
                <div className="font-semibold">{champ?.name ?? "TBD"}</div>
                {y.championPoints > 0 && (
                  <div className="text-sunset-400 mt-1">🏅 {y.championPoints} pts</div>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mt-20">
        <h2 className="text-3xl mb-6 text-sunset-200">All-Time Top 5</h2>
        <ol className="space-y-2">
          {top5.map((entry, i) => (
            <li
              key={entry.player.slug}
              className="flex items-center gap-4 bg-night-900/60 border border-sunset-700/20 rounded-retro px-4 py-3"
            >
              <span className="text-sunset-400 font-bold w-8">#{i + 1}</span>
              <Link
                href={`/players/${entry.player.slug}`}
                className="flex-1 hover:text-sunset-200 transition"
              >
                {entry.player.emoji} {entry.player.name}
              </Link>
              <span className="text-sunset-200">{entry.total} pts</span>
              <span className="text-sand-200/60 text-sm hidden sm:inline">
                {entry.years}y · {entry.medals}🏅
              </span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-24 pt-8 border-t border-sunset-700/20 text-center text-sand-200/50 text-sm">
        Most Wicked Day · Year 4 coming in 2026
      </footer>
    </main>
  );
}
