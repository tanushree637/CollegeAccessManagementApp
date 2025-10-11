import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { QRProvider } from './context/QRContext';

const App = () => {
  return (
    <AuthProvider>
      <QRProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
          <AppNavigator />
        </NavigationContainer>
      </QRProvider>
    </AuthProvider>
  );
};

export default App;
