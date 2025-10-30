// src/screens/Guard/ScanQRScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { API_CONFIG } from '../../config/config';

const ScanQRScreen = () => {
  const [loading, setLoading] = useState(false);

  const recordAttendance = async (userId, type) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/record-attendance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            type,
            location: 'Main Gate',
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message || 'Failed to record attendance');
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      Alert.alert('Error', 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  // Demo function for testing - in real app this would be triggered by QR scan
  const handleDemoScan = type => {
    const demoUserId = 'demo-user-123'; // Replace with actual user ID from QR code
    recordAttendance(demoUserId, type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Scan QR Code</Text>
      <Text style={styles.subtitle}>Record Student Entry/Exit</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#004aad" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.entryButton]}
            onPress={() => handleDemoScan('entry')}
          >
            <Text style={styles.buttonText}>📝 Record Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exitButton]}
            onPress={() => handleDemoScan('exit')}
          >
            <Text style={styles.buttonText}>🚪 Record Exit</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.note}>
        Note: In a real implementation, this would scan QR codes to get user IDs
      </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  entryButton: {
    backgroundColor: '#059669',
  },
  exitButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 30,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
