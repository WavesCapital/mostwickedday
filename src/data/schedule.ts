// 2025 event schedule — content sourced from the live mostwickedday.com site.
// Kept as a typed constant because this rarely changes and is not in the
// historical Supabase dump (which only had names + ordering, not times/rules).

export type ScheduleItem = {
  startTime: string;
  name: string;
  location: string;
  blurb: string;
  rules?: { title: string; body: string }[];
};

export const SCHEDULE_2025: ScheduleItem[] = [
  {
    startTime: "8:00 AM",
    name: "Hole Sports",
    location: "Claystone Park",
    blurb:
      "Cornhole · Kan Jam · Bucket Pong rotation — rack up as many wins as you can.",
    rules: [
      {
        title: "Format",
        body: "Random partners every game, no repeat partner back-to-back. Continuous play 8:00–9:00, hard stop at 9:00 (no new game after 8:50).",
      },
      {
        title: "Cornhole",
        body: "ACO baseline. Boards 27 ft apart, play to 21, no busting.",
      },
      {
        title: "Kan Jam",
        body: "Kans 40 ft apart. Dinger (tip) = 1, Deuce (direct) = 2, Bucket (tip-in) = 3, Instant Win (slot) = 🏅. First to 21.",
      },
      {
        title: "Bucket Pong",
        body: "Six 5-gal buckets per side in 3-2-1. 2-on-2. Direct make removes 1 bucket, bounce make removes 2. One re-rack per team. First team to clear wins; trailing team gets one redemption.",
      },
      {
        title: "Scoring",
        body: "+2 pts per win (every game, all three sports). Hole Sports leader earns Leader Medal + 2 bonus pts. Forced sit-outs earn +1 pt.",
      },
    ],
  },
  {
    startTime: "9:30 AM",
    name: "Pickleball",
    location: "Sandy Beach",
    blurb: "Doubles — rotate partners every match.",
    rules: [
      {
        title: "Format",
        body: "Random partners, no repeat twice in a row. Four side-by-side courts, 16 max on-court. Continuous play 9:30–11:00, no new game after 10:50.",
      },
      {
        title: "Core rules",
        body: "USAPB doubles to 11, win by 2. Self-called foot-faults and kitchen violations. Line calls by nearest team.",
      },
      {
        title: "Scoring",
        body: "+2 pts per match win. Pickleball Leader earns Leader Medal + 2 bonus pts. Forced sit-out = +1 pt.",
      },
    ],
  },
  {
    startTime: "11:00 AM",
    name: "Dodgeball",
    location: "Sandy Beach",
    blurb: "Fast-paced 4-on-4 battles.",
  },
  {
    startTime: "12:30 PM",
    name: "Lunch Break",
    location: "Sandy Beach",
    blurb: "Jimmy John's subs delivered to Sandy. Eat, chill, hydrate.",
  },
  {
    startTime: "1:00 PM",
    name: "Wiffleball",
    location: "Water's Edge",
    blurb: "Three-inning showdowns.",
  },
  {
    startTime: "4:30 PM",
    name: "Most Wicked Combine",
    location: "Water's Edge",
    blurb: "Six-event showdown: one last shot to win the title.",
  },
  {
    startTime: "5:30 PM",
    name: "After-Party",
    location: "Water's Edge",
    blurb: "🏆 Trophy-chug · 🍕 Pizza · 🍻 BYOB",
  },
];

// Pick a plausible future-looking event date so the countdown has something
// real to chase. If no 2026 date is locked yet, point at a placeholder and
// Phase 2 will overwrite this when the inner-circle poll closes.
export const NEXT_EVENT_ISO = "2026-06-07T12:00:00-04:00";
