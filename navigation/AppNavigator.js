import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AdminTab from './AdminTabs';
import StudentTab from './StudentTabs';
import TeacherTab from './TeacherTabs';
import GuardTab from './GuardTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  if (!user) return <AuthNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.role === 'admin' && (
        <Stack.Screen name="Admin" component={AdminTab} />
      )}
      {user.role === 'teacher' && (
        <Stack.Screen name="Teacher" component={TeacherTab} />
      )}
      {user.role === 'student' && (
        <Stack.Screen name="Student" component={StudentTab} />
      )}
      {user.role === 'guard' && (
        <Stack.Screen name="Guard" component={GuardTab} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
