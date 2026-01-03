import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getTodayEmotions } from '../services/emotionService';

const EMOTION_IMAGES = {
  'Emocionado': require('../../assets/images/emocionado.png'),
  'Feliz': require('../../assets/images/feliz.png'),
  'Calmado': require('../../assets/images/calmado.png'),
  'Triste': require('../../assets/images/triste.png'),
  'Ansioso': require('../../assets/images/ansioso.png'),
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [todaysRecords, setTodaysRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const date = new Date();
  const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  // useFocusEffect hace que se recarguen los datos cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchTodayData();
    }, [])
  );

  const fetchTodayData = async () => {
    setLoading(true);
    const data = await getTodayEmotions();
    setTodaysRecords(data || []);
    setLoading(false);
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register'); 
  };

  const renderItem = ({ item }) => {
    const imageSource = EMOTION_IMAGES[item.emotion] || EMOTION_IMAGES['Feliz'];
    
    return (
      <View style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: getEmotionColor(item.emotion) }]}>
          <Image source={imageSource} style={styles.emojiImage} resizeMode="contain" />
        </View>

        {/* Info Central */}
        <View style={styles.cardInfo}>
          <Text style={styles.emotionTitle}>{item.emotion}</Text>
          <View style={styles.metaContainer}>
            {/* Hora */}
            <Text style={styles.metaText}>
               {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {/* Actividad (si existe) */}
            {item.activity && (
              <Text style={styles.metaText}> •  {item.activity}</Text>
            )}
          </View>
        </View>

        
        <View style={styles.intensityBadge}>
          <Text style={styles.intensityLabel}>Nivel</Text>
          <Text style={styles.intensityValue}>{item.intensity}</Text>
        </View>
      </View>
    );
  };


  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'Feliz': return '#FFF9C4';
      case 'Triste': return '#fdece3ff';
      case 'Ansioso': return '#F3E5F5';
      case 'Calmado': return '#FFEBEE';
      default: return '#a1d6b3ff';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* CABECERA */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
        <Text style={styles.greeting}>Hola, ¿Cómo estás hoy?</Text>
      </View>

      {/* CUERPO */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus registros de hoy</Text>
          <Text style={styles.countBadge}>{todaysRecords.length}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={todaysRecords}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            // Componente cuando la lista está vacía
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyTitle}>Sin registros aún</Text>
                <Text style={styles.emptySubtitle}>
                  Comienza tu día registrando cómo te sientes.
                </Text>
                <TouchableOpacity style={styles.ctaButton} onPress={handleNavigateToRegister}>
                  <Text style={styles.ctaText}>+ Nuevo Registro</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fondo limpio
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 5,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Un gris muy suave para diferenciar del header
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    overflow: 'hidden', // Para asegurar que el radio se vea bien
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 80, // Espacio para que no choque con el bottom tab si tienes uno
  },
  
  // ESTILOS DE LA CARD (REGISTRO)
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emojiImage: {
    width: 35,
    height: 35,
  },
  cardInfo: {
    flex: 1,
  },
  emotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#999',
  },
  intensityBadge: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  intensityLabel: {
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
  },
  intensityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },

  // ESTILOS DE ESTADO VACÍO (EMPTY STATE)
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 25,
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});