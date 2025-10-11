// src/screens/Teacher/QRScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const QRScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Access QR Codes</Text>

      <View style={styles.qrContainer}>
        <Text style={styles.label}>Entry QR Code</Text>
        <View style={styles.qrBox}>
          <Image
            source={require('../../assets/images/qr-placeholder.png')} // placeholder image
            style={styles.qr}
          />
        </View>
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.label}>Exit QR Code</Text>
        <View style={styles.qrBox}>
          <Image
            source={require('../../assets/images/qr-placeholder.png')}
            style={styles.qr}
          />
        </View>
      </View>
    </View>
  );
};

export default QRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 20,
  },
  qrContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  qrBox: {
    backgroundColor: '#f7f9ff',
    borderRadius: 15,
    padding: 20,
  },
  qr: {
    width: 180,
    height: 180,
  },
});
