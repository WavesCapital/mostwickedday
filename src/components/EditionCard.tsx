import Link from "next/link";
import { Calendar } from "lucide-react";

interface EditionCardProps {
  year: string;
  status: string;
  champion: string | null;
  points: string | null;
  cta: string;
  outline: string; // hex
  link?: string;
}

export function EditionCard({
  year,
  status,
  champion,
  points,
  cta,
  outline,
  link,
}: EditionCardProps) {
  const cardLink = year === "2025" ? "/#register-2025" : link || `/${year}`;

  return (
    <article
      className="group relative flex flex-col items-center text-center rounded-xl p-8 bg-[rgba(12,18,37,.55)] backdrop-blur-lg border-2"
      style={{ borderColor: outline }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition"
        style={{ boxShadow: `0 0 20px ${outline}` }}
      />

      <Calendar
        className="w-8 h-8 mb-6"
        style={{ color: outline }}
        aria-hidden
      />

      <span
        className="text-6xl md:text-[84px] leading-none bungee-outline"
        style={{
          WebkitTextStrokeColor: outline,
          fontFamily: "var(--font-bungee-outline)",
        }}
      >
        {year}
      </span>

      <span
        className="mt-6 mb-10 px-4 py-2 rounded-md text-xs tracking-[0.15em] font-semibold uppercase"
        style={{
          border: `1px solid ${outline}`,
          color: outline,
          background: "rgba(255,255,255,.07)",
        }}
      >
        {status}
      </span>

      <p className="text-sm text-gray-400 tracking-wide">CHAMPION</p>
      <p className="font-semibold text-lg text-white mb-1">{champion}</p>

      <div
        className="flex items-center gap-2 px-4 py-1 mt-2 mb-8 rounded-full text-sm font-medium"
        style={{
          border: `1px solid ${outline}`,
          color: outline,
          background: "rgba(255,255,255,.05)",
        }}
      >
        🏅 {points}&nbsp;PTS
      </div>

      <Link
        href={cardLink}
        className="w-full py-2 rounded-full font-medium uppercase tracking-wide transition transform group-hover:-translate-y-0.5 text-[#0C1225]"
        style={{
          background: `linear-gradient(90deg, ${outline} 0%, #FF80CA 100%)`,
        }}
      >
        {cta}
      </Link>
    </article>
  );
}
