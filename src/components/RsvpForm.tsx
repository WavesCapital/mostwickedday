"use client";

import { useActionState } from "react";
import { submitRsvp, type RsvpState } from "@/app/actions/rsvp";

const EVENTS: { key: string; label: string }[] = [
  { key: "hole_sports", label: "Hole Sports (Cornhole · Kan Jam · Bucket Pong)" },
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
      <div className="rounded-retro bg-sunset-gradient p-6 text-night-950 text-center">
        <div className="text-2xl font-semibold">{state.message}</div>
        <p className="mt-2 text-sm opacity-80">
          Full schedule drops closer to game day.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="First name"
          name="firstName"
          errors={state.errors?.firstName}
        />
        <Field
          label="Last name"
          name="lastName"
          errors={state.errors?.lastName}
        />
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-widest text-sunset-400/80 mb-2">
          Events
        </legend>
        <div className="grid gap-2">
          {EVENTS.map((e) => (
            <label
              key={e.key}
              className="flex items-center gap-3 text-sand-200 bg-night-900/60 border border-sunset-700/30 rounded-retro px-3 py-2 hover:border-sunset-400/60 transition cursor-pointer"
            >
              <input
                type="checkbox"
                name="events"
                value={e.key}
                defaultChecked
                className="accent-sunset-500"
              />
              {e.label}
            </label>
          ))}
        </div>
        {state.errors?.events && (
          <p className="text-sunset-400 text-sm mt-2">
            {state.errors.events[0]}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="bg-sunset-gradient px-8 py-3 rounded-retro font-semibold text-night-950 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
      >
        {pending ? "Locking you in…" : "Lock my spot"}
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
      <span className="text-xs uppercase tracking-widest text-sunset-400/80">
        {label}
      </span>
      <input
        name={name}
        required
        className="mt-1 w-full bg-night-900/60 border border-sunset-700/30 rounded-retro px-3 py-2 text-sand-50 placeholder-sand-200/40 focus:outline-none focus:border-sunset-400/80 transition"
      />
      {errors && (
        <span className="text-sunset-400 text-sm mt-1 block">{errors[0]}</span>
      )}
    </label>
  );
}
