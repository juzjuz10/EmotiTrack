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


export const getTodayEmotions = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  
  const { data, error } = await supabase
    .from('emotions') 
    .select('*')
    .gte('created_at', startOfDay) 
    .lte('created_at', endOfDay)   
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Error fetching today emotions:', error);
    return [];
  }
  return data;
};