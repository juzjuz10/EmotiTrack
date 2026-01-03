import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'EMOTITRACK_DATA';

export const saveEmotion = async (emotion) => {
  const existing = await AsyncStorage.getItem(KEY);
  const emotions = existing ? JSON.parse(existing) : [];
  emotions.push(emotion);
  await AsyncStorage.setItem(KEY, JSON.stringify(emotions));
};

export const getEmotions = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};
