import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherDashboard from '../screens/Teacher/TeacherDashboard';
import TimetableScreen from '../screens/Teacher/TeacherTimetable.js';
import NoticesScreen from '../screens/Teacher/NotificationsScreen';
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

      <Tab.Screen name="Notices" component={NoticesScreen} />
    </Tab.Navigator>
  );
};

export default TeacherTabs;
