import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../config/superbase';

export default function HomeScreen() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('emotions')   // tu tabla en Supabase
        .select('*');         // selecciona todos los registros

      console.log("Data:", data);
      console.log("Error:", error);
    }

    testConnection();
  }, []); // [] asegura que se ejecute solo una vez

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Probando conexión con Supabase...</Text>
    </View>
  );
}
