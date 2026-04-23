-- mostwickedday.com — runtime write tables only.
-- Historical data (years, players, events, event_results) lives in src/data/history.ts.

create table if not exists rsvps (
  id          serial primary key,
  year        int not null,
  first_name  text not null,
  last_name   text not null,
  events      jsonb not null,
  created_at  timestamptz not null default now(),
  unique(first_name, last_name, year)
);

create table if not exists media (
  id             serial primary key,
  year           int not null,
  kind           text not null check (kind in ('photo','video')),
  r2_key         text not null,
  mime_type      text not null,
  uploader_name  text,
  caption        text,
  created_at     timestamptz not null default now()
);

create index if not exists media_by_year_created on media(year, created_at desc);
