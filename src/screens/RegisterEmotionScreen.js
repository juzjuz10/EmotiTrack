import { View, Text, Button } from 'react-native';

export default function RegisterEmotionScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Registrar emoción</Text>
      <Button title="Guardar emoción" onPress={() => alert('Emoción guardada')} />
    </View>
  );
}
