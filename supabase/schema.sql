-- =============================================================
-- Portfolio Eudes Johnson DJOGO — Schéma Supabase
-- À exécuter dans Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ---------- TABLES ----------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Projet',
  description text not null,
  tags text[] not null default '{}',
  link text,
  preview text,
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  created_at timestamptz not null default now()
);

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

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  icon text not null default '💡',
  title text not null,
  tags text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default 'Message du portfolio',
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- INDEX ----------

create index if not exists projects_order_idx on public.projects (display_order);
create index if not exists skills_order_idx on public.skills (display_order);
create index if not exists messages_created_idx on public.messages (created_at desc);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

-- Vue : visites par jour (pour les graphiques de l'admin)
create or replace view public.page_views_per_day as
  select current_date - i as day, count(pv.id)::int as count
  from generate_series(0, 90) i
  left join public.page_views pv
    on pv.created_at::date = current_date - i
  group by 1
  order by 1;

-- ---------- RLS ----------

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_views enable row level security;
alter table public.metrics enable row level security;
alter table public.metric_points enable row level security;

create policy "Anyone can track view"
  on public.page_views for insert
  with check (true);

create policy "Admin metrics"
  on public.metrics for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Admin metric points"
  on public.metric_points for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Lecture publique
create policy "Public read projects"
  on public.projects for select
  using (published = true);

create policy "Public read skills"
  on public.skills for select
  using (true);

create policy "Public read settings"
  on public.site_settings for select
  using (true);

-- Messages : insertion publique, lecture réservée à l'admin
create policy "Anyone can send message"
  on public.messages for insert
  with check (true);

create policy "Admin reads messages"
  on public.messages for select
  using (auth.uid() is not null);

create policy "Admin updates messages"
  on public.messages for update
  using (auth.uid() is not null);

create policy "Admin deletes messages"
  on public.messages for delete
  using (auth.uid() is not null);

-- Écriture admin sur projets / compétences
create policy "Admin full projects"
  on public.projects for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Admin full skills"
  on public.skills for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Admin full settings"
  on public.site_settings for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ---------- DONNÉES INITIALES ----------

insert into public.projects (title, category, description, tags, display_order, published) values
  ('Moniteur de sécurité électrique ESP32', 'MÉMOIRE',
   'Prototype de banc de test conforme à la norme CEI 62353 pour contrôler la sécurité électrique des équipements biomédicaux — de la mesure à l''interface.',
   array['ESP32','CEI 62353','Biomédical'], 1, true),
  ('CodeScan', 'OUTIL',
   'CLI d''analyse statique de code en Python : parcours AST, détection de secrets par entropie de Shannon et vérification des dépendances via OSV.dev.',
   array['Python','AST','OSV.dev','Shannon'], 2, true),
  ('Gbé Tché', 'NLP',
   'Système de traduction français–fon construit sur IBM Model 1 : 126 000+ paires de mots et 31 000 versets bibliques alignés. La technologie au service de la langue fon.',
   array['NLP','IBM Model 1','Français–Fon'], 3, true),
  ('EduSnap', 'PRODUIT',
   'Plateforme vidéo éducative au format court, inspirée de TikTok : apprendre en scrollant. Développée en React Native avec Supabase pour le backend.',
   array['React Native','Supabase','Éducation'], 4, true),
  ('Business digital', 'BUSINESS',
   'Packs réseaux sociaux et ebooks vendus en ligne : offre « De Zéro à 10 000 Abonnés » à 5 750 FCFA, ebook Facebook de 64 pages, campagnes Ads Facebook et funnel de vente en React/Vite.',
   array['Ebooks','Facebook Ads','Funnel','React/Vite'], 5, true),
  ('Sous le Masque', 'CRÉATION',
   'Série web dramatique béninoise : bible créative complète, script de l''épisode 1 et 24 clips produits avec Canva. Le storytelling numérique au service de la culture béninoise.',
   array['Série web','Script','Canva','Culture béninoise'], 6, true)
on conflict do nothing;

insert into public.skills (icon, title, tags, display_order) values
  ('web', 'Développement web full-stack',
   array['React','Node.js','Vite','Firebase','Supabase','Vercel','React Native'], 1),
  ('wrench', 'Maintenance & biomédical',
   array['Équipements biomédicaux','Maintenance industrielle','CEI 62353','ESP32','Sécurité électrique'], 2),
  ('code', 'Python & données',
   array['ReportLab','python-docx','AST','NLP / statistiques','IBM Model 1'], 3),
  ('chip', 'IA & outils en local',
   array['Claude Code (VS Code)','Codex CLI (DeepSeek V4 Flash)','Ollama','Gemma4:e2b','Qwen2.5-Coder:3b'], 4),
  ('chart', 'Entrepreneuriat digital',
   array['Packs réseaux sociaux','Ebooks','Facebook Ads','Funnels de vente','Marketing de contenu'], 5)
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('profile', '{"name": "Eudes Johnson DJOGO", "role": "Technicien de maintenance biomédicale & Entrepreneur digital", "location": "Cotonou / Lokossa, Bénin", "email": "eudesjohn650@gmail.com", "github": "https://github.com/EudesJohn", "linkedin": "https://www.linkedin.com/in/eudes-johnson-djogo-15a316397"}')
on conflict (key) do nothing;

-- ---------- MIGRATIONS ----------

-- Lien de chaque projet (aperçus et boutons « Voir le projet »)
update public.projects set link = '/previews/esp32-monitor.svg'  where title = 'Moniteur de sécurité électrique ESP32' and link is null;
update public.projects set link = '/previews/codescan.svg'       where title = 'CodeScan' and link is null;
update public.projects set link = '/previews/gbe-tche.svg'       where title = 'Gbé Tché' and link is null;
update public.projects set link = '/previews/edusnap.svg'        where title = 'EduSnap' and link is null;
update public.projects set link = '/previews/business-digital.svg' where title = 'Business digital' and link is null;
update public.projects set link = '/previews/sous-le-masque.svg' where title = 'Sous le Masque' and link is null;
