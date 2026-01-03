import { supabase } from './supabaseClient';

export const signUp = async (email, password) => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
};

export const signIn = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
