import { supabase } from './supabase';

// ---------- Types ----------

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string | null;
  preview: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  icon: string;
  title: string;
  tags: string[];
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Metric {
  id: string;
  label: string;
  unit: string;
  created_at: string;
}

export interface MetricPoint {
  id: string;
  metric_id: string;
  value: number;
  point_date: string;
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

// ---------- Projects ----------

export async function getProjects(opts: { includeUnpublished?: boolean } = {}) {
  let query = supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });
  if (!opts.includeUnpublished) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw error;
  return data as Project[];
}

export async function createProject(input: ProjectInput) {
  const { data, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Skills ----------

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data as Skill[];
}

export type SkillInput = Omit<Skill, 'id' | 'created_at'>;

export async function createSkill(input: SkillInput) {
  const { data, error } = await supabase
    .from('skills')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, input: Partial<SkillInput>) {
  const { data, error } = await supabase
    .from('skills')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Skill;
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Messages ----------

export async function sendMessage(input: {
  name: string;
  email: string;
  subject: string;
  body: string;
}) {
  const { error } = await supabase.from('messages').insert(input);
  if (error) throw error;
}

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Message[];
}

export async function markMessageRead(id: string, isRead: boolean) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: isRead })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Page views (analytics) ----------

export async function trackPageView(path: string) {
  const { error } = await supabase.from('page_views').insert({ path });
  if (error) console.error('trackPageView:', error.message);
}

export interface DailyCount {
  day: string;
  count: number;
}

/** Vue SQL : nombre de visites par jour sur les N derniers jours. */
export async function getPageViewsPerDay(days = 30): Promise<DailyCount[]> {
  const { data, error } = await supabase
    .from('page_views_per_day')
    .select('day, count')
    .order('day', { ascending: true });
  if (error) throw error;
  const rows = data as { day: string; count: number }[];
  // Compléter les jours manquants à zéro
  const map = new Map(rows.map(r => [r.day, Number(r.count)]));
  const out: DailyCount[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, count: map.get(key) ?? 0 });
  }
  return out;
}

// ---------- Métriques de progression ----------

export async function getMetrics() {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Metric[];
}

export async function createMetric(label: string, unit: string) {
  const { data, error } = await supabase
    .from('metrics')
    .insert({ label, unit })
    .select()
    .single();
  if (error) throw error;
  return data as Metric;
}

export async function deleteMetric(id: string) {
  const { error } = await supabase.from('metrics').delete().eq('id', id);
  if (error) throw error;
}

export async function getMetricPoints(metricId: string) {
  const { data, error } = await supabase
    .from('metric_points')
    .select('*')
    .eq('metric_id', metricId)
    .order('point_date', { ascending: true });
  if (error) throw error;
  return data as MetricPoint[];
}

export async function addMetricPoint(metricId: string, value: number, pointDate: string) {
  const { data, error } = await supabase
    .from('metric_points')
    .insert({ metric_id: metricId, value, point_date: pointDate })
    .select()
    .single();
  if (error) throw error;
  return data as MetricPoint;
}

export async function deleteMetricPoint(id: string) {
  const { error } = await supabase.from('metric_points').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Réglages du site (textes éditables) ----------

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) throw error;
  const out: Record<string, string> = {};
  (data as { key: string; value: unknown }[]).forEach(r => {
    out[r.key] = typeof r.value === 'string' ? r.value : JSON.stringify(r.value);
  });
  return out;
}

export async function updateSiteSettings(entries: Record<string, string>) {
  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) throw error;
}

// ---------- Stockage (images de projets) ----------

export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('project-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('project-images').getPublicUrl(path);
  return data.publicUrl;
}
