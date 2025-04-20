import { createClient } from './server';
import { redirect } from 'next/navigation';

export async function getUser() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    redirect('/auth/signin');
  }

  return session.user;
}

export async function getUserProfile() {
  const supabase =await  createClient();
  const user = await getUser();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    redirect('/auth/signin');
  }

  return profile;
}

export async function checkRole(requiredRole: 'founder' | 'investor') {
  const profile = await getUserProfile();

  if (profile.role !== requiredRole) {
    redirect('/unauthorized');
  }

  return profile;
} 