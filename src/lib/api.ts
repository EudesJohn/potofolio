import { supabase } from './supabase';

// ---------- Types ----------

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string | null;
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

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

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
