import { View, Text, Button, Alert } from 'react-native';
import { useState } from 'react';
import EmotionSelector from '../components/EmotionSelector';
import IntensitySlider from '../components/IntensitySlider';
import { globalStyles } from '../utils/styles';

export default function RegisterEmotionScreen() {
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(3);

  const saveEmotion = () => {
    if (!emotion) {
      Alert.alert('Selecciona una emoción');
      return;
    }
    Alert.alert('Guardado', `Emoción: ${emotion} | Intensidad: ${intensity}`);
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>¿Cómo te sientes hoy?</Text>

      <EmotionSelector onSelect={setEmotion} />

      <IntensitySlider value={intensity} onChange={setIntensity} />

      <Button title="Guardar emoción" onPress={saveEmotion} />
    </View>
  );
}
