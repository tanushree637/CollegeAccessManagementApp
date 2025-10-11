// src/screens/Guard/ScanQRScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanQRScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Scan QR Code</Text>
      <Text style={styles.text}>QR Scanner will appear here.</Text>
    </View>
  );
};

export default ScanQRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 10,
  },
  text: {
    color: '#555',
  },
});
