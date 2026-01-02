import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'EMOTIONS';

export const saveEmotion = async (emotion) => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const emotions = data ? JSON.parse(data) : [];
  emotions.push(emotion);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
};

export const getEmotions = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
