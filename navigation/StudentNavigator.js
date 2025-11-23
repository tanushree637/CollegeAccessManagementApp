import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentDashboard from '../screens/Student/StudentDashboard';
import TimetableScreen from '../screens/Student/TimetableScreen';
import NotificationsScreen from '../screens/Student/NotificationsScreen';
import SettingsScreen from '../screens/Student/SettingsScreen';
import AttendanceReport from '../screens/Student/AttendanceReport';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5, height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Timetable':
              iconName = 'calendar-outline';
              break;
            case 'Notifications':
              iconName = 'notifications-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'Attendance':
              iconName = 'calendar-outline';
              break;
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Attendance" component={AttendanceReport} />
    </Tab.Navigator>
  );
};

export default StudentTabs;
