import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Ionicons name="people-outline" size={30} color="#1E3A8A" />
          <Text style={styles.cardText}>Total Students: 1200</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="person-outline" size={30} color="#1E3A8A" />
          <Text style={styles.cardText}>Total Teachers: 75</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="log-in-outline" size={30} color="#1E3A8A" />
          <Text style={styles.cardText}>Today's Entries: 1150</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Detailed Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
