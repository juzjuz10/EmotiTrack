// App.js
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native'; // Para mostrar carga mientras se verifica sesión
import { supabase } from './src/config/superbase'; // Importamos la configuración
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen'; // Importamos la nueva pantalla
import { registerForPushNotificationsAsync, scheduleDailyReminder } from './src/services/notificationService';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Configurar notificaciones (Tu código original)
    registerForPushNotificationsAsync();
    scheduleDailyReminder();

    // 2. Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 3. Escuchar cambios de autenticación (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpieza al desmontar
    return () => subscription.unsubscribe();
  }, []);

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderizado condicional: Si hay sesión -> App, Si no -> Login
  return (
    session && session.user ? <AppNavigator key={session.user.id} /> : <LoginScreen />
  );
}