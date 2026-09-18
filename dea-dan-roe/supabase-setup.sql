-- Jalankan script ini di Supabase Dashboard > SQL Editor

create table if not exists public.dea (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nama text not null,
  status_kehadiran text not null,
  ucapan text not null
);

alter table public.dea enable row level security;

grant select, insert on table public.dea to anon;

drop policy if exists "Allow public insert" on public.dea;
-- Izinkan siapa saja (pengunjung web) mengirim RSVP
create policy "Allow public insert" on public.dea
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public read" on public.dea;
-- Izinkan siapa saja membaca data (dipakai untuk lookup nama tamu dari link undangan)
create policy "Allow public read" on public.dea
  for select
  to anon
  using (true);
