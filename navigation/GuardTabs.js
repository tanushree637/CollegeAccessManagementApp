import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import all the necessary screens
import GuardDashboard from '../screens/Guard/GuardDashboard';
import ScanScreen from '../screens/Guard/ScanScreen';
import LogsScreen from '../screens/Guard/LogsScreen';
import SettingScreen from '../screens/Guard/SettingScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const GuardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard': // Icon for the new Dashboard tab
              iconName = 'home-outline';
              break;
            case 'Scan':
              iconName = 'qr-code-outline';
              break;
            case 'Logs':
              iconName = 'document-text-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Added the Dashboard screen as the first tab */}
      <Tab.Screen name="Dashboard" component={GuardDashboard} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Profile" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default GuardTabs;
