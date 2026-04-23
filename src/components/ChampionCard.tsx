import Link from "next/link";
import { Trophy } from "lucide-react";

export function ChampionCard({
  year,
  name,
  points,
  slug,
  badges = [],
}: {
  year: number;
  name: string;
  points: number;
  slug: string;
  badges?: string[];
}) {
  return (
    <div
      className="relative champion-card w-full max-w-xl mx-auto overflow-hidden rounded-3xl space-y-6 md:space-y-8 px-6 py-8 flex flex-col items-center text-center border border-cyan-400/60 after:absolute after:inset-0 after:rounded-3xl after:bg-cyan-400/10 after:blur-[6px] after:-z-10"
      data-year={year}
    >
      <h2 className="text-base md:text-lg font-semibold tracking-wider text-white/90">
        {year} CHAMPION
      </h2>
      <Trophy
        className="h-24 w-24 md:h-28 text-cyan-300 filter drop-shadow-[0_0_12px_rgba(34,249,255,0.45)]"
        aria-hidden
      />
      <h3 className="text-4xl md:text-5xl font-extrabold leading-tight text-cyan-300">
        {name}
      </h3>
      <p className="text-lg md:text-xl text-gray-300">{points} Total Points</p>
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {badges.map((b, i) => (
            <span
              key={b}
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium ring-1 ring-white/5 ${
                i % 2 === 0
                  ? "bg-cyan-900/60 text-cyan-200 shadow-[0_0_8px_rgba(34,249,255,0.3)]"
                  : "bg-rose-900/60 text-rose-300 shadow-[0_0_8px_rgba(255,107,107,0.3)]"
              }`}
            >
              {b}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/players/${slug}`}
        className="w-56 py-3 px-6 text-center rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 text-[#041016] font-semibold hover:scale-[1.03] transition-all hover:shadow-[0_0_14px_rgba(34,249,255,0.5)]"
      >
        View Profile
      </Link>
    </div>
  );
}
