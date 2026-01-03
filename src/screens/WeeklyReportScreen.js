import { View, Text, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { getEmotions } from '../services/emotionService';

const screenWidth = Dimensions.get('window').width;

// Configuración de Emojis y Valores
const MOOD_VALUES = { 'Feliz': 5, 'Calmado': 4, 'Ansioso': 3, 'Estresado': 2, 'Triste': 1 };
const MOOD_EMOJIS_GRAPH = ['😄', '🙂', '😐', '😟', '😫']; // Para el eje Y del gráfico
const EMOJI_MAP = { // Para la lista de abajo
  'Feliz': '😄',
  'Calmado': '🙂',
  'Ansioso': '😐',
  'Estresado': '😟',
  'Triste': '😫'
};

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [historyList, setHistoryList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getEmotions(); // Trae todo el historial
      
      if (data && data.length > 0) {
        setHistoryList(data); // Guardamos todo para la lista
        
        // Para el gráfico tomamos solo los últimos 7 y los invertimos (cronológico)
        const recentData = [...data].slice(0, 7).reverse(); 
        processDataForLineChart(recentData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processDataForLineChart = (data) => {
    const labels = data.map(item => new Date(item.created_at).getDate().toString());
    const values = data.map(item => MOOD_VALUES[item.emotion] || 3);

    setChartData({
      labels: labels,
      datasets: [{
        data: values,
        color: (opacity = 1) => `rgba(255, 110, 110, ${opacity})`,
        strokeWidth: 3
      }]
    });
  };

  // --- RENDERIZADO DE CADA ÍTEM DEL HISTORIAL ---
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      {/* 1. Emoji Grande a la izquierda */}
      <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor(item.emotion) }]}>
        <Text style={styles.itemEmoji}>{EMOJI_MAP[item.emotion] || '😐'}</Text>
      </View>

      {/* 2. Textos Centrales */}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.emotion}</Text>
        <Text style={styles.itemDate}>
          {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>

      {/* 3. Intensidad a la derecha */}
      <View style={styles.intensityBadge}>
        <Text style={styles.intensityText}>Nivel {item.intensity}</Text>
      </View>
    </View>
  );

  // Helper para colores de fondo suaves según emoción
  const getBackgroundColor = (emotion) => {
    switch (emotion) {
      case 'Feliz': return '#FFF9C4'; // Amarillo claro
      case 'Triste': return '#E3F2FD'; // Azul claro
      case 'Estresado': return '#FFEBEE'; // Rojo claro
      case 'Ansioso': return '#F3E5F5'; // Lila
      default: return '#F5F5F5';
    }
  };

  // --- CABECERA (GRÁFICO) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Tu Progreso</Text>
        <Text style={styles.screenSubtitle}>Últimos 7 días</Text>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartRow}>
          {/* Ejes Y (Emojis) */}
          <View style={styles.emojiColumn}>
             {MOOD_EMOJIS_GRAPH.map((emoji, index) => (
               <View key={index} style={styles.emojiContainer}>
                 <Text style={styles.emojiText}>{emoji}</Text>
               </View>
             ))}
          </View>
          {/* Gráfico */}
          {chartData.labels.length > 0 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 90}
              height={250}
              withVerticalLines={false}
              withHorizontalLabels={false}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                fillShadowGradient: '#FFEBEE', 
                fillShadowGradientOpacity: 0.5,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" },
              }}
              style={{ paddingRight: 30 }}
              fromZero={true}
              segments={5}
              max={5}
            />
          ) : <Text>Sin datos suficientes</Text>}
        </View>
      </View>

      <Text style={styles.historySectionTitle}>Historial Reciente</Text>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#FF6B6B" />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyList}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderHistoryItem}
        ListHeaderComponent={renderHeader} // <--- Aquí inyectamos el gráfico
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay registros aún.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: { flex: 1, justifyContent: 'center' },
  listContent: {
    padding: 20,
  },
  // ESTILOS DE CABECERA
  headerContainer: {
    marginBottom: 10,
  },
  titleSection: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  historySectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 15,
    color: '#333',
  },
  // ESTILOS GRÁFICO
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 15,
    elevation: 4, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  emojiColumn: { justifyContent: 'space-between', height: 200, marginRight: 10, paddingBottom: 25 },
  emojiContainer: { height: 30, justifyContent: 'center' },
  emojiText: { fontSize: 20 },
  
  // ESTILOS DE LA LISTA (HISTORIAL)
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Sombra suave para cada ítem
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 13,
    color: '#999',
  },
  intensityBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  }
});