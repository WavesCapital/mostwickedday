-- mostwickedday.com — single Neon schema, all sources of truth.
-- Apply once: `pnpm db:apply`. Idempotent via IF NOT EXISTS.

-- === Historical ===

create table if not exists players (
  slug        text primary key,
  name        text not null,
  first_name  text not null,
  last_name   text not null,
  emoji       text,
  fun_fact    text
);

create table if not exists events (
  id       text primary key,
  year     int  not null,
  ordinal  int  not null,
  name     text not null,
  unique (year, ordinal)
);
create index if not exists events_by_year on events(year, ordinal);

create table if not exists performances (
  event_id     text not null references events(id)  on delete cascade,
  player_slug  text not null references players(slug) on delete cascade,
  points       int  not null default 0,
  place        int,
  medal        text check (medal in ('gold','silver','bronze')),
  primary key (event_id, player_slug)
);
create index if not exists performances_by_player on performances(player_slug);

create table if not exists year_recaps (
  year             int primary key,
  field_size       int not null default 0,
  champion_slug    text references players(slug) on delete set null,
  champion_points  int not null default 0,
  recap            text,
  hero_media_key   text
);

-- === Media (all photos/videos, legacy + new uploads) ===

create table if not exists media (
  id             serial primary key,
  year           int  not null,
  kind           text not null check (kind in ('photo','video')),
  r2_key         text not null unique,
  mime_type      text,
  uploader_name  text,
  caption        text,
  created_at     timestamptz not null default now()
);
create index if not exists media_by_year_created on media(year, created_at desc);

-- === RSVPs ===

create table if not exists rsvps (
  id          serial primary key,
  year        int  not null,
  first_name  text not null,
  last_name   text not null,
  events      jsonb not null,
  created_at  timestamptz not null default now(),
  unique (first_name, last_name, year)
);
