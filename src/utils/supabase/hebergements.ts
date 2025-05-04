import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Hebergement } from '@/types/hebergement';

export async function getHebergements(): Promise<Hebergement[]> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('hebergements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hebergements:', error);
    throw new Error('Failed to fetch hebergements');
  }

  return data as Hebergement[];
}

export async function getHebergementById(id: number): Promise<Hebergement | null> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('hebergements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching hebergement:', error);
    throw new Error('Failed to fetch hebergement');
  }

  return data as Hebergement | null;
} 