// components/QRCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const QRCard = ({ qrValue }) => (
  <View style={styles.card}>
    <Text style={styles.label}>Your Access QR Code</Text>
    <View style={styles.qrPlaceholder}>
      <Text style={styles.qrText}>{qrValue || 'No QR Available'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  qrText: {
    color: colors.subText,
  },
});

export default QRCard;
