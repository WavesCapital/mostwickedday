"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { sql } from "@/lib/db";

const EVENT_KEYS = [
  "hole_sports",
  "pickleball",
  "dodgeball",
  "wiffleball",
  "combine",
] as const;

const RsvpSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(40),
  lastName: z.string().trim().min(1, "Last name required").max(40),
  events: z.array(z.enum(EVENT_KEYS)).min(1, "Pick at least one event"),
});

export type RsvpState = {
  errors?: Record<string, string[]>;
  message?: string;
};

const CURRENT_RSVP_YEAR = 2025;

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const raw = {
    firstName: formData.get("firstName")?.toString() ?? "",
    lastName: formData.get("lastName")?.toString() ?? "",
    events: formData.getAll("events").map((e) => e.toString()),
  };
  const parsed = RsvpSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await sql`
    insert into rsvps (year, first_name, last_name, events)
    values (
      ${CURRENT_RSVP_YEAR},
      ${parsed.data.firstName},
      ${parsed.data.lastName},
      ${JSON.stringify(parsed.data.events)}::jsonb
    )
    on conflict (first_name, last_name, year)
    do update set events = excluded.events, created_at = now()
  `;

  updateTag(`rsvps:${CURRENT_RSVP_YEAR}`);
  updateTag("home");

  return { message: `You're in, ${parsed.data.firstName}. See you at the lake.` };
}
