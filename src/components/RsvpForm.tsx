"use client";

import { useActionState } from "react";
import { CheckCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { submitRsvp, type RsvpState } from "@/app/actions/rsvp";

const EVENTS: { key: string; label: string }[] = [
  { key: "hole_sports", label: "Hole Sports (Cornhole, Kan Jam, Bucket Pong)" },
  { key: "pickleball", label: "Pickleball" },
  { key: "dodgeball", label: "Dodgeball" },
  { key: "wiffleball", label: "Wiffleball" },
  { key: "combine", label: "Most Wicked Combine" },
];

const INITIAL: RsvpState = {};

export function RsvpForm() {
  const [state, action, pending] = useActionState(submitRsvp, INITIAL);

  if (state.message) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-cyan-300" aria-hidden />
        </div>
        <h3 className="text-2xl md:text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white/90 to-fuchsia-300 mt-6">
          REGISTRATION CONFIRMED
        </h3>
        <p className="text-lg text-white/80 mt-3">
          {state.message} Lake-side glory awaits.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <div className="text-center mb-6">
        <Trophy className="mx-auto h-10 w-10 text-cyan-300" aria-hidden />
        <p className="text-white/70 text-sm uppercase tracking-[0.2em] mt-3">
          Lock Your Spot
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="First Name"
          name="firstName"
          errors={state.errors?.firstName}
        />
        <Field
          label="Last Name"
          name="lastName"
          errors={state.errors?.lastName}
        />
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 mb-3">
          Events
        </legend>
        <div className="grid gap-2">
          {EVENTS.map((e) => (
            <label
              key={e.key}
              className="flex items-center gap-3 text-white bg-[#0C1225]/60 border border-cyan-400/20 rounded-xl px-4 py-3 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition cursor-pointer"
            >
              <input
                type="checkbox"
                name="events"
                value={e.key}
                defaultChecked
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="text-sm md:text-base">{e.label}</span>
            </label>
          ))}
        </div>
        {state.errors?.events && (
          <p className="text-rose-400 text-sm mt-2">
            {state.errors.events[0]}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="primary-button w-full md:w-auto md:mx-auto md:block text-base md:text-lg uppercase font-bold tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Locking you in…" : "Register for 2025"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  errors,
}: {
  label: string;
  name: string;
  errors?: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </span>
      <input
        name={name}
        required
        className="mt-2 w-full bg-[#0C1225]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition"
      />
      {errors && (
        <span className="text-rose-400 text-sm mt-1 block">{errors[0]}</span>
      )}
    </label>
  );
}
