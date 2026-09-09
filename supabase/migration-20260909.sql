-- =============================================================
-- Migration 2026-09-09 — VERSION SANS BLOCAGE
--
-- À exécuter MORCEAU par MORCEAU dans Supabase SQL Editor :
-- sélectionnez UN bloc entre les séparateurs, cliquez Run,
-- attendez le succès, puis passez au bloc suivant.
--
-- Si une erreur « deadlock detected » survient : attendez 5 secondes
-- et relancez le même bloc. Chaque bloc est ré-exécutable sans risque.
-- =============================================================


-- =============================================================
-- BLOC 1 — Colonne preview sur projects (transaction courte)
-- =============================================================
alter table public.projects add column if not exists preview text;


-- =============================================================
-- BLOC 2 — Table page_views + index + vue analytics
-- =============================================================
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  created_at timestamptz not null default now()
);
alter table public.page_views enable row level security;
drop policy if exists "Anyone can track view" on public.page_views;
create policy "Anyone can track view"
  on public.page_views for insert
  with check (true);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

create or replace view public.page_views_per_day as
  select current_date - i as day, count(pv.id)::int as count
  from generate_series(0, 90) i
  left join public.page_views pv
    on pv.created_at::date = current_date - i
  group by 1
  order by 1;


-- =============================================================
-- BLOC 3 — Tables metrics + metric_points
-- =============================================================
create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  unit text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.metric_points (
  id uuid primary key default gen_random_uuid(),
  metric_id uuid not null references public.metrics(id) on delete cascade,
  value numeric not null,
  point_date date not null default current_date,
  created_at timestamptz not null default now()
);
alter table public.metrics enable row level security;
alter table public.metric_points enable row level security;
drop policy if exists "Admin metrics" on public.metrics;
drop policy if exists "Admin metric points" on public.metric_points;
create policy "Admin metrics"
  on public.metrics for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
create policy "Admin metric points"
  on public.metric_points for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- =============================================================
-- BLOC 4 — Bucket de stockage (images de projets + diaporama)
-- =============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read project images" on storage.objects;
drop policy if exists "Admin upload project images" on storage.objects;
drop policy if exists "Admin update project images" on storage.objects;
drop policy if exists "Admin delete project images" on storage.objects;

create policy "Public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Admin upload project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.uid() is not null);

create policy "Admin update project images"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.uid() is not null);

create policy "Admin delete project images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.uid() is not null);


-- =============================================================
-- BLOC 5 — Aperçus par défaut des projets (données uniquement)
-- =============================================================
update public.projects set preview = '/previews/esp32-monitor.svg'    where title = 'Moniteur de sécurité électrique ESP32' and preview is null;
update public.projects set preview = '/previews/codescan.svg'         where title = 'CodeScan' and preview is null;
update public.projects set preview = '/previews/gbe-tche.svg'         where title = 'Gbé Tché' and preview is null;
update public.projects set preview = '/previews/edusnap.svg'          where title = 'EduSnap' and preview is null;
update public.projects set preview = '/previews/business-digital.svg' where title = 'Business digital' and preview is null;
update public.projects set preview = '/previews/sous-le-masque.svg'   where title = 'Sous le Masque' and preview is null;


-- =============================================================
-- BLOC 6 — Réglages éditables (textes + logo + diaporama)
-- =============================================================
insert into public.site_settings (key, value) values
  ('home_badge', '"Disponible pour collaborations · Cotonou / Lokossa, Bénin"'),
  ('hero_title', '"Eudes Johnson\nDJOGO."'),
  ('hero_subtitle', '"Technicien de maintenance biomédicale & Entrepreneur digital"'),
  ('cta_title', '"Travaillons ensemble"'),
  ('footer_note', '"Cotonou / Lokossa, Bénin"'),
  ('contact_email', '"eudesjohn650@gmail.com"'),
  ('contact_github', '"https://github.com/EudesJohn"'),
  ('contact_linkedin', '"https://www.linkedin.com/in/eudes-johnson-djogo-15a316397"'),
  ('contact_location', '"Cotonou / Lokossa, Bénin"'),
  ('logo_text', '"EJD"'),
  ('logo_image', '""'),
  ('hero_slides', '["/bg/slide-1.svg","/bg/slide-2.svg","/bg/slide-3.svg","/bg/slide-4.svg"]')
on conflict (key) do nothing;
