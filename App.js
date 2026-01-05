// App.js
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native'; 
import { supabase } from './src/config/superbase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen'; 
import { registerForPushNotificationsAsync, scheduleDailyReminder } from './src/services/notificationService';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    registerForPushNotificationsAsync();
    scheduleDailyReminder();

   
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

   
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    
    return () => subscription.unsubscribe();
  }, []);

 
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

 
  return (
    session && session.user ? <AppNavigator key={session.user.id} /> : <LoginScreen />
  );
}