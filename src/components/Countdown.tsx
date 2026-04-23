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

  const diff = mounted ? Math.max(0, new Date(target).getTime() - now) : 0;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  return (
    <div
      className="flex items-center justify-center gap-3 md:gap-5"
      aria-label="Countdown to event"
    >
      <Pill n={days} label="days" />
      <Pill n={hours} label="hours" />
      <Pill n={mins} label="minutes" />
      <Pill n={secs} label="seconds" />
    </div>
  );
}

function Pill({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="countdown-pill w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
        <span className="text-2xl md:text-3xl font-semibold tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-widest text-sand-200/70">
        {label}
      </span>
    </div>
  );
}
