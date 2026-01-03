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

  // 2. Pedimos a Supabase registros creados entre el inicio y fin de hoy
  const { data, error } = await supabase
    .from('emotions') // Asegúrate que tu tabla se llama así
    .select('*')
    .gte('created_at', startOfDay) // Greater Than or Equal (Mayor o igual)
    .lte('created_at', endOfDay)   // Less Than or Equal (Menor o igual)
    .order('created_at', { ascending: false }); // Los más recientes primero

  if (error) {
    console.error('Error fetching today emotions:', error);
    return [];
  }
  return data;
};