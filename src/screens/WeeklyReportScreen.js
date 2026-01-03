import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { getEmotions } from '../services/emotionService';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { globalStyles } from '../utils/styles';

export default function WeeklyReportScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const emotions = await getEmotions();

    const formatted = emotions.map((item, index) => ({
      x: index + 1,
      y: item.intensity
    }));

    setData(formatted);
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Historial emocional</Text>

      {data.length === 0 ? (
        <Text>No hay registros todavía.</Text>
      ) : (
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryBar data={data} />
        </VictoryChart>
      )}
    </View>
  );
}
