import { supabase } from '../config/superbase'; 
export const getAllRecommendations = async () => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*'); 

  if (error) {
    console.error('Error al obtener recomendaciones:', error);
    return [];
  }
  return data;
};