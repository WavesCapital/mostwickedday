import Link from "next/link";
import Image from "next/image";
import { allTimeLeaderboard, player, getAllYearRecaps } from "@/data/queries";
import { Footer } from "@/components/Footer";
import { Trophy, Medal } from "lucide-react";

export const metadata = {
  title: "All-Time Stats",
  description:
    "Every Most Wicked Day, every champion, every career point. Click a name to view the full player profile.",
};

export default async function AllTimePage() {
  const [board, recaps] = await Promise.all([
    allTimeLeaderboard(),
    getAllYearRecaps(),
  ]);
  const recapsWithChamps = await Promise.all(
    recaps
      .slice()
      .sort((a, b) => a.year - b.year)
      .map(async (y) => ({
        ...y,
        champion: y.championSlug ? await player(y.championSlug) : undefined,
      })),
  );

  return (
    <main className="min-h-screen flex flex-col bg-[#0C1225] pt-16">
      <section className="relative flex items-center justify-center w-full">
        <div className="relative w-full h-auto md:min-h-[60vh] overflow-hidden">
          <Image
            src="/hero/sunset-palms.png"
            alt="Background palms"
            width={1536}
            height={1024}
            priority
            className="w-full h-auto md:h-full md:absolute md:inset-0 object-contain md:object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              className="font-extrabold text-[16vw] md:text-[14vw] leading-none text-[#34F5FF] drop-shadow-[0_0_14px_rgba(52,245,255,0.35)] text-center"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ALL-TIME
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl mt-16 md:mt-24">
        {/* Event history timeline */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl text-white mb-8">
            Event History
          </h2>
          <div className="space-y-6">
            {recapsWithChamps.map((y) => {
              return (
                <Link
                  key={y.year}
                  href={`/${y.year}`}
                  className="block rounded-2xl bg-[#0E0F1D]/80 border border-cyan-400/30 p-6 hover:border-cyan-400/60 transition"
                >
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span
                      className="text-4xl md:text-5xl text-cyan-300 font-extrabold"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {y.year}
                    </span>
                    <span className="text-white/60 text-sm uppercase tracking-widest">
                      Champion: {y.champion?.name ?? "—"}
                    </span>
                  </div>
                  <p className="mt-3 text-white/80 text-sm md:text-base">
                    {y.recap}
                  </p>
                  <span className="inline-block mt-4 text-cyan-300 text-sm font-semibold">
                    View full recap →
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* All-time career leaderboard */}
        <section className="mb-24">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl text-white">
              All-Time Leaderboard
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Click your name to view your player profile
            </p>
          </div>
          <div className="relative rounded-3xl border border-cyan-400/60 overflow-hidden after:absolute after:inset-0 after:rounded-3xl after:bg-cyan-400/10 after:blur-[6px] after:-z-10">
            <div className="overflow-x-auto">
              <div className="px-4 md:px-6 pt-8 pb-4">
                <div className="flex items-center border-b border-white/10 pb-4">
                  <div className="w-12 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center">
                    Rank
                  </div>
                  <div className="flex-1 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider">
                    Player
                  </div>
                  <div className="w-16 md:w-20 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center">
                    Points
                  </div>
                  <div className="w-14 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center">
                    Years
                  </div>
                  <div className="w-14 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center hidden sm:block">
                    Medals
                  </div>
                </div>
              </div>
              <div className="px-4 md:px-6 pb-8">
                {board.map((entry, idx) => (
                  <div
                    key={entry.player.slug}
                    className={`flex items-center py-3 md:py-4 relative border-b border-white/10 last:border-b-0 ${
                      idx < 3 ? "bg-black/30" : ""
                    } hover:bg-white/5 transition`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-l-3xl bg-cyan-400 ${
                        idx < 3 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="w-12 md:w-16 flex justify-center items-center gap-1">
                      {idx === 0 && (
                        <Trophy
                          className="h-5 w-5 text-[#ffb347]"
                          aria-label="1st"
                        />
                      )}
                      {idx === 1 && (
                        <Medal
                          className="h-5 w-5 text-[#cfcfcf]"
                          aria-label="2nd"
                        />
                      )}
                      {idx === 2 && (
                        <Medal
                          className="h-5 w-5 text-[#d99847]"
                          aria-label="3rd"
                        />
                      )}
                      <span
                        className={`font-medium ${
                          idx === 0
                            ? "text-[#ffb347]"
                            : idx === 1
                              ? "text-[#cfcfcf]"
                              : idx === 2
                                ? "text-[#d99847]"
                                : "text-gray-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 truncate pr-2">
                      <Link
                        href={`/players/${entry.player.slug}`}
                        className={`font-medium tracking-wide hover:text-cyan-300 transition-colors truncate text-gray-100 ${
                          idx < 3 ? "font-semibold" : ""
                        }`}
                      >
                        {entry.player.emoji} {entry.player.name}
                      </Link>
                    </div>
                    <div
                      className={`w-16 md:w-20 text-center font-semibold ${
                        idx < 3 ? "text-cyan-300 text-lg" : "text-gray-100"
                      }`}
                    >
                      {entry.total}
                    </div>
                    <div className="w-14 md:w-16 text-center text-gray-300">
                      {entry.years}
                    </div>
                    <div className="w-14 md:w-16 text-center text-gray-300 hidden sm:block">
                      {entry.medals}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
