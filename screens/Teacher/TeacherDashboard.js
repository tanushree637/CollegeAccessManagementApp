import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {user?.name || 'Teacher'} 👩‍🏫</Text>

      <View style={styles.card}>
        <Ionicons name="book-outline" size={40} color="#9333EA" />
        <Text style={styles.text}>Subject: Data Structures</Text>
        <Text style={styles.text}>Dept: IT</Text>
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

export default TeacherDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#EDE9FE',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    color: '#5B21B6',
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333EA',
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
