import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView, Modal } from 'react-native';
import { useState } from 'react';
import EmotionSelector from '../components/EmotionSelector';
import { saveEmotion } from '../services/emotionService';
import IntensitySlider from '../components/IntensitySlider';
import { colors } from '../utils/styles'; 
import ActivitySelector from '../components/ActivitySelector';

export default function RegisterEmotionScreen() {
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [activity, setActivity] = useState(null);

  // Esta función se ejecuta cuando el usuario toca una emoción en el Selector
  const handleEmotionSelect = (selectedEmotion) => {
    setEmotion(selectedEmotion);
    setIntensity(3); // Reiniciar intensidad a un valor medio por defecto
    setModalVisible(true); // Abrir el modal inmediatamente
  };

  const handleSave = async () => {
    if (!emotion) return;

    await saveEmotion({
      emotion,
      intensity,
      activityId: activity
    });

    setModalVisible(false); // Cerrar modal
    Alert.alert('Tu emoción ha sido registrada.');
    setEmotion(null); // Limpiar selección
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEmotion(null); 
  };

 return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.subtitle}>Toca una emoción para registrarla</Text>
        </View>
        
        <View style={styles.section}>
          <EmotionSelector 
            onSelect={handleEmotionSelect} 
            selectedEmotion={emotion} 
          />
        </View>

        {/* --- MODAL EXTENDIDO --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Usamos ScrollView dentro del modal por si la pantalla es pequeña */}
              <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* 1. Encabezado */}
                <Text style={styles.modalTitle}>
                  {emotion ? `Te sientes  ${emotion}` : 'Intensidad'}
                </Text>
              <Text style={styles.modalSubtitle}>¿Qué tan intensa es esta emoción?</Text>

              {/* Slider dentro del Modal */}
              <View style={styles.modalSliderContainer}>
                <Text style={styles.label}>Nivel: {intensity}</Text>
                <IntensitySlider value={intensity} onChange={setIntensity} />
              </View>

                {/* 3. Sección Actividad (NUEVO) */}
                <Text style={styles.modalSubtitle}>¿Qué estabas haciendo?</Text>
                <View style={styles.modalSection}>
                  <ActivitySelector onSelect={setActivity} selected={activity} />
                </View>

                {/* 4. Botones de Acción */}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleSave} 
                    style={[styles.saveButton, !activity && styles.saveButtonDisabled]} 
                      disabled={!activity}
                      >
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
 );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 30,
    marginTop: 20,
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
  section: {
    marginBottom: 10,
  },
  
  // --- ESTILOS DEL MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
    justifyContent: 'center', // Centrado verticalmente
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalSliderContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  // Botones del Modal
  modalButtonsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15, // Espacio entre botones
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
});