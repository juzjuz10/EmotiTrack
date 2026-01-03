import { supabase } from '../config/superbase';

export const saveEmotion = async ({ emotion, intensity, activityId }) => {
  const { error } = await supabase
    .from('emotions')
    .insert([{ emotion, intensity ,activity_id: activityId}]);

  if (error) throw error;
};

export const getEmotions = async () => {
 const { data, error } = await supabase
    .from('emotions')
    .select(`
      emotion,
      intensity,
      created_at,
      activities(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};