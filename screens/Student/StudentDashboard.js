import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'Student'} 👋</Text>

      <View style={styles.card}>
        <Ionicons name="school-outline" size={40} color="#2563EB" />
        <Text style={styles.text}>Class: B.Tech 3rd Year IT</Text>
        <Text style={styles.text}>Section: A</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Timetable')}
      >
        <Ionicons name="calendar-outline" size={20} color="white" />
        <Text style={styles.buttonText}>View Timetable</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('QR')}
      >
        <Ionicons name="qr-code-outline" size={20} color="white" />
        <Text style={styles.buttonText}>My QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#DBEAFE',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    color: '#1E3A8A',
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
