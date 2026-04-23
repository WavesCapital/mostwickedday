import Link from "next/link";
import { allTimeLeaderboard } from "@/data/queries";
import { YEAR_RECAPS } from "@/data/history";

export const metadata = {
  title: "All-Time Stats",
  description:
    "Every edition of Most Wicked Day, every champion, every career point. Click a name to view the full player profile.",
};

export default function AllTimePage() {
  const board = allTimeLeaderboard();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <Link
          href="/"
          className="text-sunset-400 hover:text-sunset-200 text-sm transition inline-block mb-6"
        >
          ← Home
        </Link>
        <h1 className="text-sunset-500 font-extrabold text-5xl md:text-7xl drop-shadow-[0_0_24px_rgba(255,140,70,0.3)]" style={{ fontFamily: "var(--font-display)" }}>ALL-TIME</h1>
        <p className="text-sand-200 mt-4 max-w-2xl">
          Every Most Wicked Day in one place. Career points, medals, and years
          active across {board.length} competitors.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-sunset-200 text-2xl mb-4">Event History</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {YEAR_RECAPS.slice()
            .sort((a, b) => a.year - b.year)
            .map((y) => (
              <Link
                key={y.year}
                href={`/${y.year}`}
                className="block rounded-retro bg-night-900/60 border border-sunset-700/30 p-5 hover:border-sunset-400/60 transition"
              >
                <div
                  className="text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {y.year}
                </div>
                <p className="text-sand-200/80 text-sm mt-2">{y.recap}</p>
                <p className="text-sunset-400 text-sm mt-3">View recap →</p>
              </Link>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-sunset-200 text-2xl mb-4">Career Leaderboard</h2>
        <div className="overflow-x-auto rounded-retro border border-sunset-700/30">
          <table className="w-full text-left">
            <thead className="bg-night-900/80">
              <tr className="text-sunset-400/80 text-xs uppercase tracking-widest">
                <th className="px-4 py-3 w-14">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Years</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Medals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunset-700/20">
              {board.map((entry, i) => (
                <tr
                  key={entry.player.slug}
                  className="bg-night-900/40 hover:bg-night-900/80 transition"
                >
                  <td className="px-4 py-3 text-sunset-400 font-bold">
                    #{i + 1}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/players/${entry.player.slug}`}
                      className="hover:text-sunset-200 transition"
                    >
                      {entry.player.emoji}{" "}
                      <span className="font-medium">{entry.player.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-sunset-200 font-semibold">
                    {entry.total}
                  </td>
                  <td className="px-4 py-3 text-right text-sand-200/80 hidden sm:table-cell">
                    {entry.years}
                  </td>
                  <td className="px-4 py-3 text-right text-sand-200/80 hidden sm:table-cell">
                    {entry.medals} 🏅
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
