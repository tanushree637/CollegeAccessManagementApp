// navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';

// Role-based Navigators
import AdminNavigator from './AdminNavigator';
import TeacherNavigator from './TeacherNavigator';
import StudentNavigator from './StudentNavigator';
import GuardNavigator from './GuardNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Not logged in → Show login screen
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : user.role === 'admin' ? (
        <Stack.Screen name="AdminNavigator" component={AdminNavigator} />
      ) : user.role === 'teacher' ? (
        <Stack.Screen name="TeacherNavigator" component={TeacherNavigator} />
      ) : user.role === 'student' ? (
        <Stack.Screen name="StudentNavigator" component={StudentNavigator} />
      ) : user.role === 'guard' ? (
        <Stack.Screen name="GuardNavigator" component={GuardNavigator} />
      ) : (
        // fallback in case of unknown role
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
