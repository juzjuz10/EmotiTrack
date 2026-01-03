import { supabase } from '../config/superbase';

export const saveEmotion = async ({ emotion, intensity }) => {
  const { error } = await supabase
    .from('emotions')
    .insert([{ emotion, intensity }]);

  if (error) throw error;
};

export const getEmotions = async () => {
  const { data, error } = await supabase
    .from('emotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};