import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherDashboard from '../screens/Teacher/TeacherDashboard';
import TimetableScreen from '../screens/Teacher/TeacherTimetable';
import NoticesScreen from '../screens/Teacher/NotificationsScreen';
import SettingsScreen from '../screens/Teacher/SettingsScreen';
import TeacherAttendanceReport from '../screens/Teacher/AttendanceReport';
import AssignTaskScreen from '../screens/Teacher/AssignTaskScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
            case 'Notices':
              iconName = 'notifications-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'Attendance':
              iconName = 'calendar-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TeacherDashboard} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
      <Tab.Screen name="Notices" component={NoticesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Attendance" component={TeacherAttendanceReport} />
    </Tab.Navigator>
  );
};

const TeacherNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      <Stack.Screen
        name="AssignTask"
        component={AssignTaskScreen}
        options={{
          headerShown: true,
          title: 'Assign Task',
          headerStyle: { backgroundColor: '#9333EA' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
