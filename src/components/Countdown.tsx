"use client";

import { useEffect, useState } from "react";

export function Countdown({ target }: { target: string }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // During SSR / first hydration frame, show a stable zeroed readout so the
  // render stays deterministic and Next.js Cache Components is happy.
  const diff = mounted ? Math.max(0, new Date(target).getTime() - now) : 0;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  return (
    <div
      className="flex items-center justify-center gap-3 md:gap-6 font-mono text-sunset-200"
      aria-label="Countdown to event"
    >
      <Unit n={days} label="days" />
      <Unit n={hours} label="hours" />
      <Unit n={mins} label="min" />
      <Unit n={secs} label="sec" />
    </div>
  );
}

function Unit({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-5xl font-semibold tabular-nums"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-sunset-400/70 mt-1">
        {label}
      </div>
    </div>
  );
}
