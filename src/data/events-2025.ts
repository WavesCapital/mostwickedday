// 2025 event schedule — verbatim from Lovable source (src/pages/Index.tsx events array).
export type EventRule = {
  timeShort: string;
  eventTitle: string;
  venue: string;
  tagline: string;
  accent: string;
  content: string | null;
};

export const EVENTS_2025: EventRule[] = [
  {
    timeShort: "8:00 AM",
    eventTitle: "Hole Sports",
    venue: "Claystone Park",
    tagline:
      "Cornhole · Kan Jam · Bucket Pong rotation — rack up as many wins as you can",
    accent: "#34F5FF",
    content: `### EVENT DETAILS

#### Teams / Rotation
Random partners every game; **no repeat partner back-to-back**. After every result, both teams queue for a fresh board / can / bucket.

#### Session Timing
* Continuous play **08 : 00 – 09 : 00**
* **Hard stop 09 : 00** – no new game after **08 : 50**
* A new round begins only when **every** set has finished.

---

### GAME RULES
#### ① Cornhole — *ACO baseline*
Boards 27 ft ▸ play to 21 (no busting rule)

#### ② Kan Jam — *quick guide*
Kans 40 ft apart

| Action | Pts |
|--------|----|
| Dinger (tip hit) | **1** |
| Deuce (direct hit) | **2** |
| Bucket (tip-in) | **3** |
| Instant Win (slot) | 🏅 |

First to 21 wins no matter what.

#### ③ Bucket Pong — *final no-drama ruleset*

| Category | Rule |
|----------|------|
| **Equipment** | Six 5-gal buckets / side in **3-2-1** triangle · Front buckets **12 ft** apart · Two 8½-in rubber dodgeballs |
| **Teams & Turns** | 2-on-2; partners alternate throws |
| **Throw Style** | Feet **behind the baseline & touching sand** at release |
| **Shot Types** | Direct make = remove **1** bucket · Bounce make (1 ground bounce) = **2** buckets (defense may swat *after* bounce) |
| **Balls Back** | Both teammates score in a turn ➜ balls return; same-bucket double = **3** buckets gone |
| **Re-Rack** | One re-rack / team, called at turn start |
| **Stall Rule** | If Bucket Pong is last game running, the team with the least buckets remaining wins. If the teams have equal buckets then next bucket wins with no redemption. If still no buckets after 3 min timer then rock-paper-scissors will decide the winner. |
| **Win / Redemption** | First team to clear all buckets wins · Trailing team gets **one full turn** to force OT (redemption only if it's not the last game remaining) |
| **Foot Fault / Interference** | Foot over line or leaving sand = dead throw (can be called by non-throwing team); forfeits remaining ball that turn |

---

### SCORING (MWD points)
* **+2 pts** to *each* player for **every game won** (across all three Hole-Sports).
* Highest total wins **Hole Sports Leader medal +2 bonus pts**.
* Players who must sit out a round due to insufficient boards/equipment earn **+1 pt**.

Tie = sudden-death penalty kick style Bucket Pong shoot-out. Players take turns: make it and advance to the next round, miss and you're eliminated. If all players miss in a round, repeat until one winner remains.`,
  },
  {
    timeShort: "9:30 AM",
    eventTitle: "Pickleball",
    venue: "Sandy Beach",
    tagline: "Doubles — rotate partners every match",
    accent: "#55B5FF",
    content: `### EVENT DETAILS

#### Teams / Rotation
Random partners every game; **no repeat partner twice in a row**. Matches assigned across four side-by-side courts (16 max on-court).

#### Session Timing
* Continuous play **09 : 30 – 11 : 00**
* **No new game after 10 : 50** – a match already in progress may finish
* A fresh round starts only when **all 4 courts** have completed.

---

### CORE RULES
* Standard **USAPB doubles** to 11, win by 2
* **Foot-faults**: server's feet behind baseline; no volley in kitchen (incl. follow-through)
* **Line calls**: team nearest the ball calls in/out; if unsure ➜ rally replayed, no point
* Kitchen & foot-fault violations are **self-called**

---

### SCORING & MEDALS
* **+2 pts** to *each* player for **every match won**
* Highest total wins **Pickleball Leader medal +2 bonus pts**

**Tie-breaker** – 1 v 1 singles to 5 (win by 2); winner keeps only the **2 bonus pts** (no extra 4).

> **Court Overflow**
> ▸ If >16 players, some will sit a round.
> ▸ *Forced* sit-outs earn **+1 pt**; voluntary sit-outs earn **0**.`,
  },
  {
    timeShort: "11:00 AM",
    eventTitle: "Dodgeball",
    venue: "Sandy Beach",
    tagline: "Fast-paced 4-on-4 battles",
    accent: "#FF48B6",
    content: `### EVENT DETAILS

#### TEAMS / ROTATION
Random **4–5-person** sides; court sides chosen by a single pre-game Rock–Paper–Scissors.

#### TIMING
* Continuous play **11 : 00 – 12 : 30**
* **No new game** may start after **12 : 20**
* A new round begins only once **every** court has finished.

#### CORE RULES
* **Hit = out**   •   **Catch = thrower out + first teammate returns**
* **Blocking allowed** — ball (and fingers) count as shield; dropping it = out
* Kitchen is safe; stepping on **any** outside boundary line = out
* Only **out** players shag stray balls; balls must be set down on the back line only
* Contested calls resolved instantly by **1-shot Rock–Paper–Scissors**

#### SCORING & MEDALS 🏅
* **+1 pt** to each player on **every win**
* Day's win-leader earns the **Dodgeball Medal + 2 bonus pts**
* Players who must sit out a round due to insufficient court space earn **+1 pt**`,
  },
  {
    timeShort: "12:30 PM",
    eventTitle: "Lunch Break",
    venue: "Sandy Beach",
    tagline: "Jimmy John's subs delivered to Sandy. Eat, Chill, & Hydrate",
    accent: "#C04BFF",
    content: null,
  },
  {
    timeShort: "1:00 PM",
    eventTitle: "Wiffleball",
    venue: "Water's Edge",
    tagline: "Three inning showdowns",
    accent: "#FF9A3D",
    content: `### EVENT DETAILS

#### CAPTAINS / TEAMS
Predetermined captains repick squads before **every** 3-inning game.

#### TIMING
* Games roll **continuously 13 : 00 – 16 : 00**
* **No new game** may start after **15 : 30**
* Play stops hard at **16 : 00**

#### CORE RULES
* **Strike-zone frame hit = strike** (PVC only = ball)
* **Second foul w/ two strikes = out**
* **10-run mercy rule** ends the game
* **Hit-by-pitch = ball** (no free base)
* **No bunts**
* Disputes settled instantly by **1-shot Rock–Paper–Scissors**

#### SCORING & MVP 🏅
* **+1 pt** per player on **every win**
* **+1 bonus pt** for each **home run**
* **MVP Medal + 2 bonus pts** to the player with the most combined points`,
  },
  {
    timeShort: "4:30 PM",
    eventTitle: "Most Wicked Combine",
    venue: "Water's Edge",
    tagline: "Six-event showdown: one last shot to win the title",
    accent: "#FF8DA1",
    content: `### EVENT DETAILS

#### FORMAT
Each competitor completes the six stations **once**; raw points are totalled at the end.

#### STATIONS & SCORING
| # | Station | Attempt | Raw-Point Result | Max |
|---|---------|---------|-----------------|----|
| **1** | **Bucket-Pong Free Throw (12 ft)** | 1 toss | Make = **2** | 2 |
| **2** | **Soccer Kick** | 1 kick | Goal anywhere = **2** | 2 |
| **3** | **Frisbee Target (30 ft)** | 1 throw | Slot "bucket" = **3** · Direct can hit = **1** | 3 |
| **4** | **Wiffle HR Swing** | 1 swing | Over fence = **3** · Outfield grass = **2** · Fair infield = **1** | 3 |
| **5** | **Field-Goal Kick** | 1 ball | 35 yd = **3** · 25 yd = **2** · 15 yd = **1** | 3 |
| **6** | **QB Accuracy Throw** | 1 pass | 40 ft = **3** · 30 ft = **2** · 20 ft = **1** | 3 |

#### WINNER BONUS
* Winner of Most Wicked Combine gets **+2 bonus points**`,
  },
  {
    timeShort: "5:30 PM",
    eventTitle: "After-Party",
    venue: "Water's Edge",
    tagline: "🏆 Trophy-chug • 🍕 Pizza • 🍻 BYOB",
    accent: "#FF80CA",
    content: null,
  },
];
