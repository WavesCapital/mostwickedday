import Link from "next/link";
import { Trophy, Medal } from "lucide-react";

export type LeaderboardRow = {
  slug: string;
  name: string;
  total: number;
  byEvent: Record<string, number>;
};

export type LeaderboardEventCol = { id: string; short: string };

function formatName(full: string) {
  const parts = full.split(" ");
  if (parts.length < 2) return full;
  return `${parts[0]} ${parts[parts.length - 1][0]}`;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <Trophy className="h-5 w-5 text-[#ffb347]" aria-label="First Place" />
    );
  if (rank === 2)
    return (
      <Medal className="h-5 w-5 text-[#cfcfcf]" aria-label="Second Place" />
    );
  if (rank === 3)
    return (
      <Medal className="h-5 w-5 text-[#d99847]" aria-label="Third Place" />
    );
  return null;
}

export function YearLeaderboard({
  rows,
  eventCols,
}: {
  rows: LeaderboardRow[];
  eventCols: LeaderboardEventCol[];
}) {
  return (
    <div className="w-full max-w-full mx-auto my-8">
      <div className="relative rounded-3xl border border-cyan-400/60 overflow-hidden after:absolute after:inset-0 after:rounded-3xl after:bg-cyan-400/10 after:blur-[6px] after:-z-10">
        <div className="overflow-hidden overflow-x-auto">
          <div className="px-4 md:px-6 pt-8 pb-4">
            <div className="flex items-center border-b border-white/10 pb-4">
              <div className="w-12 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center">
                Rank
              </div>
              <div className="flex-1 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider">
                Player
              </div>
              <div className="w-14 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center">
                Total
              </div>
              <div className="hidden md:contents">
                {eventCols.map((col) => (
                  <div
                    key={col.id}
                    className="w-14 md:w-16 text-gray-400 text-xs md:text-sm uppercase font-medium tracking-wider text-center"
                  >
                    {col.short}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-4 md:px-6 pb-8">
            {rows.map((row, idx) => (
              <div
                key={row.slug}
                className={`flex items-center py-3 md:py-4 group/row relative ${
                  idx < rows.length - 1 ? "border-b border-white/10" : ""
                } ${idx < 3 ? "bg-black/30" : ""} hover:bg-white/5 transition-colors duration-200`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-l-3xl bg-cyan-400 ${
                    idx < 3
                      ? "opacity-100"
                      : "opacity-0 group-hover/row:opacity-100"
                  }`}
                />
                <div className="w-12 md:w-16 flex justify-center items-center gap-1">
                  <RankIcon rank={idx + 1} />
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
                <div className="flex-1 group truncate pr-2">
                  <Link
                    href={`/players/${row.slug}`}
                    className={`font-medium tracking-wide hover:text-cyan-300 transition-colors flex items-center truncate text-gray-100 ${
                      idx < 3 ? "font-semibold" : ""
                    }`}
                  >
                    <span className="truncate">{formatName(row.name)}</span>
                  </Link>
                </div>
                <div
                  className={`w-14 md:w-16 text-center font-semibold ${
                    idx < 3 ? "text-cyan-300 text-lg" : "text-gray-100"
                  }`}
                >
                  {row.total}
                </div>
                <div className="hidden md:contents">
                  {eventCols.map((col) => (
                    <div
                      key={col.id}
                      className="w-14 md:w-16 text-center text-gray-300"
                    >
                      {row.byEvent[col.id] ?? 0}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
