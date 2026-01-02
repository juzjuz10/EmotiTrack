import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { getEmotions } from '../services/emotionService';
import { globalStyles } from '../utils/styles';

export default function WeeklyReportScreen() {
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getEmotions();
    setEmotions(data);
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Historial semanal</Text>

      <FlatList
        data={emotions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>
            {new Date(item.date).toLocaleDateString()} - {item.emotion} ({item.intensity})
          </Text>
        )}
      />
    </View>
  );
}
