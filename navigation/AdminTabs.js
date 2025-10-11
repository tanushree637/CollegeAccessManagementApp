import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import ManageUsers from '../screens/Admin/ManageUsers';
import TimetableScreen from '../screens/Admin/TimetableScreen';
import LogsScreen from '../screens/Admin/LogsScreen';
import SettingsScreen from '../screens/Admin/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Users':
              iconName = 'people-outline';
              break;
            case 'Timetable':
              iconName = 'calendar-outline';
              break;
            case 'Logs':
              iconName = 'document-text-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Users" component={ManageUsers} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabs;
