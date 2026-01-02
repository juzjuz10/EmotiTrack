import { View, TouchableOpacity, Text } from 'react-native';
import { colors } from '../utils/styles';

const emotions = ['Feliz', 'Triste', 'Estresado', 'Ansioso', 'Calmado'];

export default function EmotionSelector({ onSelect }) {
  return (
    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10 }}>
      {emotions.map(emotion => (
        <TouchableOpacity
          key={emotion}
          style={{
            backgroundColor: colors.secondary,
            padding:10,
            borderRadius:10,
          }}
          onPress={() => onSelect(emotion)}
        >
          <Text>{emotion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
