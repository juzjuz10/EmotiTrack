import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

export default function IntensitySlider({ value, onChange }) {
  return (
    <View>
      <Text>Intensidad: {value}</Text>
      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}
