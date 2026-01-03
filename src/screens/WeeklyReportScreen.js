import { View, Text, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, FlatList, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { getEmotions } from '../services/emotionService';

const screenWidth = Dimensions.get('window').width;

// 1. DICCIONARIO DE IMÁGENES
// Esto nos permite buscar la imagen usando el nombre de la emoción rápidamente
const EMOTION_IMAGES = {
  'Emocionado': require('../../assets/images/emocionado.png'),
  'Feliz': require('../../assets/images/feliz.png'),
  'Calmado': require('../../assets/images/calmado.png'),
  'Triste': require('../../assets/images/triste.png'),
  'Ansioso': require('../../assets/images/ansioso.png'), 
};

// Configuración de Valores Numéricos para el Gráfico
const MOOD_VALUES = { 'Emocionado':5,'Feliz': 4, 'Calmado': 3, 'Triste': 2,'Ansioso': 1  };


const CHART_Y_LABELS = [
  EMOTION_IMAGES['Emocionado'], //Nivel 5
  EMOTION_IMAGES['Feliz'],      // Nivel 5
  EMOTION_IMAGES['Calmado'],    // Nivel 4
   EMOTION_IMAGES['Triste'],     // Nivel 3
  EMOTION_IMAGES['Ansioso'],    // Nivel 2
];

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
      const data = await getEmotions();
      
      if (data && data.length > 0) {
        setHistoryList(data);
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
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // Cambié a azul para combinar mejor
        strokeWidth: 3
      }]
    });
  };

  // --- RENDERIZADO DE CADA ÍTEM DEL HISTORIAL ---
  const renderHistoryItem = ({ item }) => {
    // Buscamos la imagen, si no existe usamos una por defecto (ej. Feliz)
    const imageSource = EMOTION_IMAGES[item.emotion] || EMOTION_IMAGES['Feliz'];

    return (
      <View style={styles.historyItem}>
        {/* 1. IMAGEN a la izquierda */}
        <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor(item.emotion) }]}>
          <Image 
            source={imageSource} 
            style={styles.itemImage} // Estilo para controlar tamaño
            resizeMode="contain"
          />
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
  };

  const getBackgroundColor = (emotion) => {
    switch (emotion) {
      case 'Feliz': return '#cbffc4ff'; 
      case 'Triste': return '#fae7d7ff'; 
      case 'Estresado': return '#FFEBEE';
      case 'Ansioso': return '#F3E5F5';
      default: return '#faefaeff';
    }
  };

  // --- CABECERA (GRÁFICO) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Tu Progreso</Text>
        <Text style={styles.screenSubtitle}>Últimos 7 registros</Text>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartRow}>
          
          {/* COLUMNA EJE Y CON IMÁGENES */}
          <View style={styles.emojiColumn}>
             {CHART_Y_LABELS.map((imgSource, index) => (
               <View key={index} style={styles.emojiContainer}>
                 <Image 
                   source={imgSource} 
                   style={styles.axisImage} // Imagen pequeña para el gráfico
                   resizeMode="contain"
                 />
               </View>
             ))}
          </View>

          {/* Gráfico */}
          {chartData.labels.length > 0 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 80} // Ajustamos ancho para dar espacio a las imágenes
              height={250}
              withVerticalLines={false}
              withHorizontalLabels={false} // Ocultamos etiquetas de texto por defecto
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                fillShadowGradient: '#E3F2FD', 
                fillShadowGradientOpacity: 0.5,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#4A90E2" },
                labelColor: () => '#888', // Color de los números de fecha
              }}
              style={{ paddingRight: 30, paddingLeft: 10 }}
              fromZero={true}
              segments={5} // Importante para alinear con las 5 imágenes
              max={5}
            />
          ) : <Text>Sin datos suficientes</Text>}
        </View>
      </View>

      <Text style={styles.historySectionTitle}>Historial Reciente</Text>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#4A90E2" />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyList}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderHistoryItem}
        ListHeaderComponent={renderHeader}
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  
  // EJE Y PERSONALIZADO
  emojiColumn: { 
    justifyContent: 'space-between', 
    height: 200, // Debe coincidir aprox con la altura interna del gráfico
    marginRight: 5, 
    paddingBottom: 25 // Ajuste fino para alinear con las líneas del gráfico
  },
  emojiContainer: { 
    height: 30, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  axisImage: {
    width: 28,
    height: 28,
  },

  // ESTILOS DE LA LISTA
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemImage: {
    width: 35, // Tamaño de la imagen dentro de la lista
    height: 35,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
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