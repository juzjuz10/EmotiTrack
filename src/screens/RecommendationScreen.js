import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { getEmotions } from '../services/emotionService';

import { globalStyles } from '../utils/styles'
// Aquí defines qué ejercicio corresponde a cada emoción.
const recommendationsData = [
  {
    id: '1',
    emotion: 'Ansioso',
    title: '¿Sientes Ansiedad?',
    subtitle: 'Prueba la respiración 4-7-8',
    color: '#E3F2FD', // Azul suave
    borderColor: '#2196F3',
    icon: '🌬️',
    steps: [
      'Siéntate con la espalda recta.',
      'Inhala por la nariz contando hasta 4.',
      'Aguanta la respiración contando hasta 7.',
      'Exhala por la boca contando hasta 8.',
      'Repite el ciclo 4 veces.'
    ]
  },
  {
    id: '2',
    emotion: 'Estresado',
    title: '¿Mucho Estrés?',
    subtitle: 'Relajación muscular progresiva',
    color: '#FFEBEE', // Rojo suave
    borderColor: '#EF5350',
    icon: '💪',
    steps: [
      'Cierra los ojos y respira profundo.',
      'Tensa fuerte los hombros por 5 segundos.',
      'Suelta de golpe y siente la relajación.',
      'Repite con los puños, luego las piernas.',
      'Siente cómo la tensión abandona tu cuerpo.'
    ]
  },
  {
    id: '3',
    emotion: 'Triste',
    title: '¿Te sientes triste?',
    subtitle: 'Diario de gratitud express',
    color: '#FFF3E0', // Naranja suave
    borderColor: '#FF9800',
    icon: '✍️',
    steps: [
      'Toma un papel o tu celular.',
      'Escribe 3 cosas pequeñas por las que estás agradecido hoy (un café, el sol, una canción).',
      'Lee la lista en voz alta.',
      'Permítete sonreír un poco.'
    ]
  },
];

export default function RecommendationScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Función para abrir el ejercicio
  const handleOpenExercise = (item) => {
    setSelectedExercise(item);
    setModalVisible(true);
  };

  // Función para cerrar
  const handleClose = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Recomendaciones para ti</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {recommendationsData.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, { backgroundColor: item.color, borderColor: item.borderColor }]}
            onPress={() => handleOpenExercise(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: item.borderColor }]}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              {/* Flechita indicando que se puede abrir */}
              <Text style={{ fontSize: 20, color: item.borderColor }}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- MODAL DEL EJERCICIO --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {selectedExercise && (
              <>
                <View style={[styles.modalHeader, { backgroundColor: selectedExercise.color }]}>
                  <Text style={styles.modalIcon}>{selectedExercise.icon}</Text>
                  <Text style={styles.modalTitle}>{selectedExercise.subtitle}</Text>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.instructionsTitle}>Sigue estos pasos:</Text>
                  
                  {selectedExercise.steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                      <View style={[styles.stepNumber, { backgroundColor: selectedExercise.borderColor }]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity 
                  style={[styles.closeButton, { backgroundColor: selectedExercise.borderColor }]} 
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>¡Me siento mejor!</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Ajusta según tu header
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // ESTILOS DE LA CARD
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    
    // Sombras suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  // ESTILOS DEL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro transparente
    justifyContent: 'flex-end', // El modal sale desde abajo
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '80%', // Ocupa el 80% de la pantalla
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  modalBody: {
    padding: 25,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#666',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    lineHeight: 24,
  },
  closeButton: {
    marginHorizontal: 25,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20, // Espacio seguro inferior
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
