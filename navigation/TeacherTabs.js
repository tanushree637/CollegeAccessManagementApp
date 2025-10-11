import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherDashboard from '../screens/Teacher/TeacherDashboard';
import TimetableScreen from '../screens/Teacher/TimetableScreen';
import QRScreen from '../screens/Teacher/QRScreen';
import NoticesScreen from '../screens/Teacher/NoticesScreen';
import LogsScreen from '../screens/Teacher/LogsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TeacherTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#9333EA',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Timetable':
              iconName = 'calendar-outline';
              break;
            case 'QR':
              iconName = 'qr-code-outline';
              break;
            case 'Notices':
              iconName = 'notifications-outline';
              break;
            case 'Logs':
              iconName = 'document-text-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TeacherDashboard} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
      <Tab.Screen name="QR" component={QRScreen} />
      <Tab.Screen name="Notices" component={NoticesScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
    </Tab.Navigator>
  );
};

export default TeacherTabs;
