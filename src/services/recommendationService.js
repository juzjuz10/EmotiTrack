import { supabase } from '../config/superbase'; 
export const getAllRecommendations = async () => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*'); // Trae todas las columnas y filas

  if (error) {
    console.error('Error al obtener recomendaciones:', error);
    return [];
  }
  return data;
};