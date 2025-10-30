import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function TimetableScreen() {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.7:5000'; // 🔹 Replace with your local backend IP

  useEffect(() => {
    if (user) fetchTimetable();
  }, [user]);

  const fetchTimetable = async () => {
    try {
      const response = await fetch(`${API_URL}/timetable/${user.email}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setTimetable(data);
      } else {
        setTimetable([]);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      Alert.alert('Error', 'Failed to load timetable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.day}>{item.day}</Text>
      {item.classes.map((cls, index) => (
        <View key={index} style={styles.classItem}>
          <Text style={styles.subject}>{cls.subject}</Text>
          <Text style={styles.detail}>Time: {cls.time}</Text>
          <Text style={styles.detail}>Teacher: {cls.teacher}</Text>
          <Text style={styles.detail}>Room: {cls.room}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading your timetable...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Weekly Timetable 📚</Text>
      {timetable.length > 0 ? (
        <FlatList
          data={timetable}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No timetable assigned yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  day: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E86DE',
    marginBottom: 8,
  },
  classItem: {
    marginBottom: 6,
  },
  subject: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
