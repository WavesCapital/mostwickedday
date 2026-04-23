import { allTimeLeaderboard, player, getAllYearRecaps } from "@/data/queries";
import { EVENTS_2025 } from "@/data/events-2025";
import { SunsetHero } from "@/components/SunsetHero";
import { SunsetCountdown } from "@/components/SunsetCountdown";
import { EventAccordion } from "@/components/EventAccordion";
import { EditionCard } from "@/components/EditionCard";
import { RsvpForm } from "@/components/RsvpForm";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default async function HomePage() {
  const [top5All, recaps, champ2023P, champ2024P] = await Promise.all([
    allTimeLeaderboard(),
    getAllYearRecaps(),
    player("kyle-steinmeyer"),
    player("austin-granger"),
  ]);
  const top5 = top5All.slice(0, 5);
  const champ2023 = champ2023P?.lastName?.toUpperCase() ?? "KYLE";
  const champ2024 = champ2024P?.lastName?.toUpperCase() ?? "GRANGER";

  return (
    <main className="min-h-screen bg-[#0C1225]">
      <SunsetHero />
      <SunsetCountdown />

      {/* 2025 EVENT SCHEDULE */}
      <section
        id="timeline"
        className="mx-auto px-4 pt-20 pb-4 max-w-[720px]"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-white">
            2025 Event Schedule
          </h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">
            Check out our exciting lineup of events for Most Wicked Day 2025
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 mx-auto">
          {EVENTS_2025.map((event, i) => (
            <EventAccordion
              key={event.eventTitle}
              timeShort={event.timeShort}
              eventTitle={event.eventTitle}
              venue={event.venue}
              tagline={event.tagline}
              content={event.content}
              accent={event.accent}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register-2025" className="mx-auto px-4 pt-20 scroll-mt-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-5xl text-white">2025 Registration</h2>
          <p className="mt-3 text-gray-400">
            Lock your spot. Uncheck any events you're sitting out.
          </p>
        </div>
        <div className="max-w-xl mx-auto bg-[#0E0F1D]/80 border-2 border-[#34F5FF]/40 rounded-3xl p-6 md:p-10 shadow-[0_0_35px_rgba(34,249,255,0.1)]">
          <RsvpForm />
        </div>
      </section>

      {/* PREVIOUS EDITIONS */}
      <section
        id="editions"
        className="relative mx-auto max-w-6xl pt-28 pb-24 px-4"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl text-white">Previous Editions</h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">
            Explore the history of Most Wicked Day competitions and see how
            it's evolved
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <EditionCard
            year="2023"
            status="PAST EDITION"
            champion={champ2023}
            points={String(recaps.find((y) => y.year === 2023)?.championPoints ?? 28)}
            cta="View Recap →"
            outline="#34F5FF"
          />
          <EditionCard
            year="2024"
            status="PAST EDITION"
            champion={champ2024}
            points={String(recaps.find((y) => y.year === 2024)?.championPoints ?? 31)}
            cta="View Recap →"
            outline="#9A7DFF"
          />
          <EditionCard
            year="2025"
            status="UPCOMING EVENT"
            champion="👀"
            points="X"
            cta="Register →"
            outline="#FF80CA"
          />
        </div>
      </section>

      {/* ALL-TIME TOP 5 TEASER */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl md:text-4xl text-white">All-Time Top 5</h2>
          <Link
            href="/all-time"
            className="text-[var(--color-primary)] hover:opacity-80 text-sm font-semibold"
          >
            See full leaderboard →
          </Link>
        </div>
        <ol className="space-y-2">
          {top5.map((entry, i) => (
            <li
              key={entry.player.slug}
              className="flex items-center gap-4 bg-[#0E0F1D]/80 border border-[#34F5FF]/15 rounded-2xl px-4 py-3 hover:border-[#34F5FF]/40 transition"
            >
              <span className="text-[var(--color-neon-orange)] font-bold w-8">
                #{i + 1}
              </span>
              <Link
                href={`/players/${entry.player.slug}`}
                className="flex-1 hover:text-[var(--color-primary)] transition"
              >
                {entry.player.emoji} {entry.player.name}
              </Link>
              <span className="text-[var(--color-primary)] font-semibold">
                {entry.total} pts
              </span>
              <span className="text-gray-400 text-sm hidden sm:inline">
                {entry.years}y · {entry.medals}🏅
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  );
}
