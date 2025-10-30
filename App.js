import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, LogBox } from 'react-native';

// Context Providers
import { AuthProvider } from '././context/AuthContext';

// Main Navigator
import AppNavigator from './navigation/AppNavigator';

// Ignore common React Native warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'Setting a timer',
]);

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* Status bar styling */}
        <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

        {/* Navigation stack that handles all roles */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
