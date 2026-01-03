import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { getAllRecommendations } from '../services/recommendationService'; 

export default function RecommendationScreen() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllRecommendations();
    setRecommendations(data || []);
    setLoading(false);
  };

  const handleOpen = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Biblioteca de Bienestar</Text>
      <Text style={styles.subtitle}>Recursos disponibles para ti</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {recommendations.length === 0 ? (
          <Text style={styles.emptyText}>No hay recomendaciones disponibles en la base de datos.</Text>
        ) : (
          recommendations.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { backgroundColor: item.color || '#E3F2FD' }]} 
              onPress={() => handleOpen(item)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{item.icon }</Text>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: item.borderColor || '#333' }]}>
                    {item.emotion}
                  </Text>
                  <Text style={styles.cardSubtitle}>{item.title}</Text>
                </View>
                <Text style={[styles.arrow, { color: item.borderColor || '#272727ff' }]}>→</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* --- MODAL DE DETALLES --- */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                {/* Cabecera del Modal con el color del ítem */}
                <View style={[styles.modalHeader, { backgroundColor: selectedItem.color || '#E3F2FD' }]}>
                  <Text style={styles.modalIconGrande}>{selectedItem.icon }</Text>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedItem.subtitle}</Text>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.stepsTitle}>Pasos a seguir:</Text>
                  
                  {/* Verificamos que 'steps' sea un array antes de mapear */}
                  {Array.isArray(selectedItem.steps) ? (
                    selectedItem.steps.map((step, index) => (
                      <View key={index} style={styles.stepRow}>
                        <View style={[styles.stepBadge, { backgroundColor: selectedItem.borderColor || '#4A90E2' }]}>
                          <Text style={styles.stepNumber}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.stepText}>No hay pasos detallados para este ejercicio.</Text>
                  )}
                </ScrollView>

                <TouchableOpacity 
                  style={[styles.closeButton, { backgroundColor: selectedItem.borderColor || '#4A90E2' }]} 
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>Listo</Text>
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
    paddingTop: 60,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 24,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },

  // ESTILOS DE LA CARD
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
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
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // ESTILOS DEL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalIconGrande: {
    fontSize: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  modalBody: {
    padding: 25,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    lineHeight: 24,
  },
  closeButton: {
    margin: 25,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});