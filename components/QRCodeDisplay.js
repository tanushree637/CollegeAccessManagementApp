import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Card from './Card';

export default function QRCodeDisplay({ value, label }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.qrContainer}>
        {value ? (
          <QRCode value={value} size={160} />
        ) : (
          <Text style={styles.placeholder}>Generating QR...</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  qrContainer: {
    marginTop: 10,
  },
  placeholder: {
    color: '#888',
  },
});
