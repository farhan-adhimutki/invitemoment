-- Jalankan script ini di Supabase Dashboard > SQL Editor

create table if not exists public.dea (
  id bigint generated always as identity primary key,
  nama text not null,
  status_kehadiran text not null,
  ucapan text not null,
  "timestamp" timestamptz not null default now()
);

alter table public.dea enable row level security;

-- Izinkan siapa saja (pengunjung web) mengirim RSVP
create policy "Allow public insert" on public.dea
  for insert
  to anon
  with check (true);

-- Izinkan siapa saja membaca data (dipakai untuk lookup nama tamu dari link undangan)
create policy "Allow public read" on public.dea
  for select
  to anon
  using (true);
