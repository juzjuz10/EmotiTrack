import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
};
export const scheduleDailyReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'EmotiTrack',
      body: 'Recuerda registrar cómo te sientes hoy.',
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
      channelId: 'default'
    }
  });
};
