import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import RegisterEmotionScreen from '../screens/RegisterEmotionScreen';
import WeeklyReportScreen from '../screens/WeeklyReportScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
 
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Registrar" component={RegisterEmotionScreen} />
        <Tab.Screen name="Historial" component={WeeklyReportScreen} />
        <Tab.Screen name="Recomendación" component={RecommendationScreen} />
      </Tab.Navigator>

  );
}
