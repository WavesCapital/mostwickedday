import Link from "next/link";

export type PodiumRow = { name: string; slug: string; points: number };

const HUE_COLOR = {
  from: "#34F5FF",
  via: "#FF3EBF",
  to: "#FF9F2B",
} as const;

const RANK_COLORS = ["#34F5FF", "#FF3EBF", "#FF9F2B"];

export function EventItem({
  hue,
  time,
  game,
  winners,
}: {
  hue: "from" | "via" | "to";
  time: string;
  game: string;
  winners: PodiumRow[];
}) {
  return (
    <div className="relative mb-20">
      <span
        className="absolute -left-[52px] top-1.5 w-4 h-4 rounded-full ring-2 bg-current shadow-[0_0_6px_currentColor]"
        style={{ color: HUE_COLOR[hue] }}
        aria-hidden
      />
      <div className="leading-snug text-white/90">
        <h3 className="text-xl font-bold mb-2">
          {time} · {game}
        </h3>
        <ol className="space-y-1 text-sm">
          {winners.map((w, i) => (
            <li key={`${w.slug}-${i}`} className="flex items-center gap-2">
              <span
                className="font-semibold"
                style={{ color: RANK_COLORS[i] }}
              >
                {i + 1}.
              </span>
              <Link
                href={`/players/${w.slug}`}
                className="hover:text-white hover:underline transition"
              >
                {w.name}
              </Link>
              <span className="text-gray-400">({w.points} pts)</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
