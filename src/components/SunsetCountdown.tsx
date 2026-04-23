"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TARGET_ISO = "2026-06-07T08:00:00-04:00"; // placeholder until 2026 date locks

const UNITS = { days: 864e5, hours: 36e5, minutes: 6e4, seconds: 1e3 } as const;
type Unit = keyof typeof UNITS;

export function SunsetCountdown() {
  const [mounted, setMounted] = useState(false);
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const target = new Date(TARGET_ISO).getTime();
    const tick = () => {
      const diff = Math.max(target - Date.now(), 0);
      setLeft({
        days: Math.floor(diff / UNITS.days),
        hours: Math.floor(diff / UNITS.hours) % 24,
        minutes: Math.floor(diff / UNITS.minutes) % 60,
        seconds: Math.floor(diff / UNITS.seconds) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const unitDenominator: Record<Unit, number> = {
    days: 365,
    hours: 24,
    minutes: 60,
    seconds: 60,
  };
  const units = (Object.keys(UNITS) as Unit[]).map((u) => ({
    name: u,
    value: mounted ? left[u] : 0,
  }));

  return (
    <div className="relative -mt-[45vh] md:-mt-56 lg:-mt-[40vh] z-30 px-4 flex flex-col h-[50vh] justify-between">
      <div className="container mx-auto text-center">
        <ul
          role="timer"
          aria-label="Countdown to next Most Wicked Day"
          className="relative z-10 flex justify-center gap-2 sm:gap-6 md:gap-10 mb-8 sm:mb-10"
        >
          {units.map(({ name, value }) => (
            <li key={name} className="flex flex-col items-center">
              <div className="relative">
                <svg
                  className="w-[22vw] h-[22vw] max-w-[140px] max-h-[140px] sm:w-28 sm:h-28 md:w-32 md:h-32"
                  viewBox="0 0 120 120"
                  aria-hidden
                >
                  <circle cx="60" cy="60" r="50" className="ring-bg" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="ring-fg"
                    pathLength={100}
                    style={{
                      strokeDashoffset: String(
                        100 - (value / unitDenominator[name]) * 100,
                      ),
                    }}
                  />
                  <foreignObject x={0} y={0} width={120} height={120}>
                    <div className="h-full w-full flex flex-col items-center justify-center">
                      <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-white tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] md:text-xs tracking-tight sm:tracking-[0.1em] uppercase text-gray-300">
                        {name}
                      </span>
                    </div>
                  </foreignObject>
                </svg>
              </div>
            </li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center mt-auto"
        >
          <Link
            href="/#register-2025"
            className="text-base sm:text-lg md:text-2xl uppercase font-bold bg-gradient-to-r from-[#34F5FF] to-[#FF80CA] text-white px-8 sm:px-10 py-3 sm:py-6 h-auto rounded-full shadow-lg hover:shadow-[0_0_15px_rgba(52,245,255,0.6)] hover:scale-[1.02] transition-all w-full max-w-[380px] text-center"
            style={{ letterSpacing: "0.1em" }}
            aria-label="Register for Most Wicked Day 2025"
          >
            Register for 2025
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
