export type Player = {
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  emoji?: string;
  funFact?: string;
};

export type EventDef = {
  id: string;
  year: number;
  ordinal: number;
  name: string;
  startTime?: string;
  location?: string;
  description?: string;
  rules?: string;
};

export type Performance = {
  eventId: string;
  playerSlug: string;
  points: number;
  place?: number;
  medal?: "gold" | "silver" | "bronze";
};

export type YearRecap = {
  year: number;
  fieldSize: number;
  championSlug: string;
  championPoints: number;
  recap: string;
  heroMediaKey?: string;
};

export type MediaItem = {
  id: string;
  year: number;
  kind: "photo" | "video";
  r2Key: string;
  uploadedBy?: string;
  uploadedAt: string;
};
