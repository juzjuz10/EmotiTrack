import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../config/superbase';

export default function ActivitySelector({ onSelect, selected }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
  const { data, error } = await supabase.from('activities').select('*');

  if (error) {
    console.error('Error cargando actividades:', error);
    return;
  }

  console.log('Actividades:', data);
  setActivities(data);               
};


  return (
    <View style={styles.container}>
      {activities.map(act => (
        <TouchableOpacity
          key={act.id}
          style={[
            styles.item,
            selected === act.id && styles.selected
          ]}
          onPress={() => onSelect(act.id)}
        >
          <Text>{act.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: { padding: 10, borderRadius: 10, backgroundColor: '#eee' },
  selected: { backgroundColor: '#4A90E2' }
});
