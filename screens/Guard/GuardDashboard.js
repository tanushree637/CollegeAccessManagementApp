// src/screens/Guard/GuardDashboard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const GuardDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Guard 👮</Text>
      <Text style={styles.sub}>Manage Entry and Exit</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.cardText}>📷 Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          Alert.alert('Logs', 'Attendance logs feature coming soon!');
        }}
      >
        <Text style={styles.cardText}>🕒 View Logs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.cardText}>⚙️ Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuardDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004aad',
  },
  sub: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
});
