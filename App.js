import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync, scheduleDailyReminder } from './src/services/notificationService';

export default function App() {

  useEffect(() => {
    registerForPushNotificationsAsync();
    scheduleDailyReminder();
  }, []);

  return <AppNavigator />;
}
