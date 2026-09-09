-- =============================================================
-- Migration 2026-09-09 — Aperçus, analytics, métriques, stockage
-- À exécuter dans Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- 1) Colonne preview séparée du lien réel
alter table public.projects add column if not exists preview text;

-- 2) Suivi des visites
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  created_at timestamptz not null default now()
);
alter table public.page_views enable row level security;
create policy "Anyone can track view" on public.page_views for insert with check (true);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

-- Vue : visites par jour (pour les graphiques de l'admin)
create or replace view public.page_views_per_day as
  select current_date - i as day, count(pv.id)::int as count
  from generate_series(0, 90) i
  left join public.page_views pv
    on pv.created_at::date = current_date - i
  group by 1
  order by 1;

-- 3) Métriques de progression (saisies par l'admin)
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
create policy "Admin metrics" on public.metrics for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "Admin metric points" on public.metric_points for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- 4) Bucket de stockage pour les images de projets
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do nothing;

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

-- 5) Aperçus par défaut (SVG embarqués)
update public.projects set preview = '/previews/esp32-monitor.svg'    where title = 'Moniteur de sécurité électrique ESP32' and preview is null;
update public.projects set preview = '/previews/codescan.svg'         where title = 'CodeScan' and preview is null;
update public.projects set preview = '/previews/gbe-tche.svg'         where title = 'Gbé Tché' and preview is null;
update public.projects set preview = '/previews/edusnap.svg'          where title = 'EduSnap' and preview is null;
update public.projects set preview = '/previews/business-digital.svg' where title = 'Business digital' and preview is null;
update public.projects set preview = '/previews/sous-le-masque.svg'   where title = 'Sous le Masque' and preview is null;

-- 6) Textes éditables du site (valeurs par défaut côté code si absents)
insert into public.site_settings (key, value) values
  ('home_badge', '"Disponible pour collaborations · Cotonou / Lokossa, Bénin"'),
  ('hero_title', '"Eudes Johnson\nDJOGO."'),
  ('hero_subtitle', '"Technicien de maintenance biomédicale & Entrepreneur digital"'),
  ('cta_title', '"Travaillons ensemble"'),
  ('footer_note', '"Cotonou / Lokossa, Bénin"'),
  ('contact_email', '"eudesjohn650@gmail.com"'),
  ('contact_github', '"https://github.com/EudesJohn"'),
  ('contact_linkedin', '"https://www.linkedin.com/in/eudes-johnson-djogo-15a316397"'),
  ('contact_location', '"Cotonou / Lokossa, Bénin"')
on conflict (key) do nothing;
