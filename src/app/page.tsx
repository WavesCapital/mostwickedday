import Link from "next/link";
import { YEAR_RECAPS } from "@/data/history";
import { allTimeLeaderboard, player } from "@/data/queries";
import { SCHEDULE_2025, NEXT_EVENT_ISO } from "@/data/schedule";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";

const CURRENT_YEAR = 2025;

export default function HomePage() {
  const top5 = allTimeLeaderboard().slice(0, 5);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-24">
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
        <div className="pt-4">
          <Countdown target={NEXT_EVENT_ISO} />
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Link
            href="#register"
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

      <section>
        <h2 className="text-sunset-200 text-3xl mb-6">
          {CURRENT_YEAR} Event Schedule
        </h2>
        <ol className="space-y-4">
          {SCHEDULE_2025.map((item) => (
            <li
              key={item.name}
              className="rounded-retro bg-night-900/60 border border-sunset-700/30 p-5"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span
                  className="text-sunset-400 text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.startTime}
                </span>
                <h3 className="text-sunset-200 text-xl font-semibold">
                  {item.name}
                </h3>
                <span className="text-sand-200/60 text-sm">
                  {item.location}
                </span>
              </div>
              <p className="text-sand-200 mt-2">{item.blurb}</p>
              {item.rules && (
                <details className="mt-3 group">
                  <summary className="cursor-pointer text-sunset-400 text-sm select-none">
                    Show rules
                  </summary>
                  <div className="mt-3 space-y-3 border-t border-sunset-700/30 pt-3">
                    {item.rules.map((r) => (
                      <div key={r.title}>
                        <div className="text-xs uppercase tracking-widest text-sunset-400/80">
                          {r.title}
                        </div>
                        <p className="text-sand-200/90 text-sm mt-1">
                          {r.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section id="register" className="scroll-mt-24">
        <h2 className="text-sunset-200 text-3xl mb-2">
          {CURRENT_YEAR} Registration
        </h2>
        <p className="text-sand-200/80 mb-6">
          Lock your spot. Uncheck any events you're sitting out.
        </p>
        <RsvpForm />
      </section>

      <section>
        <h2 className="text-sunset-200 text-3xl mb-6">Previous Editions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {YEAR_RECAPS.slice()
            .reverse()
            .map((y) => {
              const champ = player(y.championSlug);
              return (
                <Link
                  key={y.year}
                  href={`/${y.year}`}
                  className="block rounded-retro bg-night-900/60 border border-sunset-700/30 p-6 hover:border-sunset-400/60 transition"
                >
                  <div className="text-sunset-400 text-sm uppercase tracking-widest">
                    Past Edition
                  </div>
                  <div
                    className="text-4xl mt-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {y.year}
                  </div>
                  <div className="mt-4 text-sand-200">
                    <div className="text-xs uppercase text-sand-200/60">
                      Champion
                    </div>
                    <div className="font-semibold">
                      {champ?.name ?? "TBD"}
                    </div>
                    {y.championPoints > 0 && (
                      <div className="text-sunset-400 mt-1">
                        🏅 {y.championPoints} pts
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-sunset-200 text-3xl">All-Time Top 5</h2>
          <Link
            href="/all-time"
            className="text-sunset-400 hover:text-sunset-200 text-sm transition"
          >
            See full leaderboard →
          </Link>
        </div>
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

      <footer className="pt-8 border-t border-sunset-700/20 text-center text-sand-200/50 text-sm">
        Most Wicked Day · Year 4 coming in 2026 ·{" "}
        <Link href="/upload" className="hover:text-sunset-200 transition">
          Share your moments
        </Link>
      </footer>
    </main>
  );
}
