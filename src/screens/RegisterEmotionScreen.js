import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useState } from 'react';
import EmotionSelector from '../components/EmotionSelector';
import IntensitySlider from '../components/IntensitySlider';
// Asegúrate de que tus estilos globales no entren en conflicto, 
// o usa estos estilos locales que son más específicos.
import { colors } from '../utils/styles'; 

export default function RegisterEmotionScreen() {
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(3);

  const handleSave = async () => {
    if (!emotion) {
      Alert.alert('Falta información', 'Por favor selecciona una emoción primero.');
      return;
    }

    console.log("Guardando:", { emotion, intensity });
    // Aquí iría tu lógica de guardado...
    Alert.alert('¡Listo!', 'Tu emoción ha sido registrada.');
  };

  return (
    // SafeAreaView evita que el contenido toque la barra de estado o el notch del iPhone
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Título y Cabecera */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.subtitle}>Selecciona una emoción y su intensidad</Text>
        </View>
        
        {/* Sección de Selección de Emoción */}
        <View style={styles.section}>
          <EmotionSelector 
            onSelect={setEmotion} 
            selectedEmotion={emotion} 
          />
        </View>

        {/* Sección del Slider (con margen extra arriba) */}
        <View style={[styles.section, styles.sliderSection]}>
          <Text style={styles.label}>Nivel de intensidad: {intensity}</Text>
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </View>
        
        {/* Botón Guardar Personalizado */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              !emotion && styles.saveButtonDisabled // Estilo diferente si está deshabilitado
            ]} 
            onPress={handleSave}
            disabled={!emotion} // Deshabilita el click si no hay emoción
          >
            <Text style={styles.saveButtonText}>Guardar Registro</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Fondo limpio
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Contenedor genérico para separar bloques
  section: {
    marginBottom: 10,
  },
  // Estilo específico para separar más el slider del selector
  sliderSection: {
    marginTop: 30, 
    backgroundColor: '#f9f9f9', // Opcional: un fondo sutil para resaltar el slider
    padding: 15,
    borderRadius: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
  },
  // ESTILOS DEL BOTÓN PERSONALIZADO
  saveButton: {
    backgroundColor: '#4A90E2', // Color principal (puedes usar colors.primary)
    paddingVertical: 16,
    borderRadius: 25, // Bordes bien redondeados (tipo píldora)
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    width: '60%',        
    alignSelf: 'center',
    shadowRadius: 5,
    elevation: 6, // Sombra para Android
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc', // Gris cuando no se puede hacer click
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});