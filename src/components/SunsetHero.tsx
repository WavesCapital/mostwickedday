"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function SunsetHero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[80vh] md:min-h-screen flex flex-col items-center text-center text-white overflow-hidden"
    >
      {/* Desktop bg */}
      <Image
        src="/hero/sunset-palms.png"
        alt="Retro sunset beach scene with palm trees"
        fill
        priority
        sizes="100vw"
        className="object-cover hidden md:block"
      />
      {/* Mobile bg */}
      <Image
        src="/hero/mobile-hero.png"
        alt="Most Wicked Day sunset hero"
        fill
        priority
        sizes="100vw"
        className="object-cover md:hidden"
      />
      {/* Mobile bottom fade into body */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C1225] via-transparent md:hidden pointer-events-none" />

      {/* Desktop logo lockup */}
      <div
        aria-label="Most Wicked Day — event title"
        className="relative z-10 flex flex-col items-center pt-[8vh] hidden md:flex"
      >
        <Image
          src="/hero/logo.png"
          alt="Most Wicked Day"
          width={1366}
          height={768}
          priority
          className="w-[min(90vw,800px)] h-auto"
        />
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-white opacity-80" />
      </motion.div>
    </section>
  );
}
