import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../utils/styles';

// 1. Mapeo de emociones a sus imágenes (asegúrate de tener los archivos en tu carpeta assets)
const emotionsData = [
  { label: 'Emocionado', image: require('../../assets/images/emocionado.png') }, 
  { label: ' Feliz ', image: require('../../assets/images/feliz.png') },
  { label: 'Calmado', image: require('../../assets/images/calmado.png') },
  { label: 'Triste', image: require('../../assets/images/triste.png') },
  { label: 'Ansioso', image: require('../../assets/images/ansioso.png') },
];

// Agregué la prop 'selectedEmotion' para poder resaltar cuál está seleccionada
export default function EmotionSelector({ onSelect, selectedEmotion }) {
  return (
    <View style={styles.container}>
      {emotionsData.map((item) => {
        const isSelected = selectedEmotion === item.label;
        
        return (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.button,
              isSelected && styles.buttonSelected // Estilo extra si está seleccionado
            ]}
            onPress={() => onSelect(item.label)}
          >
            {/* 2. La Imagen va primero */}
            <Image 
              source={item.image} 
              style={styles.emotionImage} 
              resizeMode="contain"
            />
            
            {/* 3. El Texto va debajo */}
            <Text style={[
              styles.text,
              isSelected && styles.textSelected
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Centra los botones en la pantalla
    gap: 15,
  },
  button: {
    backgroundColor: colors.secondary || '#f0f0f0',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center', // Esto centra la imagen y el texto horizontalmente
    width: '40 px', 
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonSelected: {
    borderColor: '#4A90E2', 
    backgroundColor: '#ffffffff',
  },
  emotionImage: {
    width: 60,  // Tamaño de la imagen
    height: 60,
    marginBottom: 8, // Espacio entre la imagen y el texto
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  textSelected: {
    fontWeight: 'bold',
    color: '#4A90E2',
  }
});