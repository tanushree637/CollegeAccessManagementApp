// src/screens/Student/TimetableScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const timetable = [
  {
    id: '1',
    time: '9:00 AM',
    subject: 'Mathematics',
    teacher: 'Prof. Sharma',
    classroom: 'Room 101',
  },
  {
    id: '2',
    time: '11:00 AM',
    subject: 'Data Structures',
    teacher: 'Prof. Verma',
    classroom: 'Room 205',
  },
  {
    id: '3',
    time: '2:00 PM',
    subject: 'Computer Networks',
    teacher: 'Prof. Singh',
    classroom: 'Room 303',
  },
];

const StudentTimetableScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.teacher}>Teacher: {item.teacher}</Text>
      <Text style={styles.classroom}>Classroom: {item.classroom}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Timetable</Text>
      <FlatList
        data={timetable}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default StudentTimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
  },
  item: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: 'bold',
  },
  subject: {
    fontSize: 18,
    marginTop: 4,
  },
  teacher: {
    color: '#555',
    marginTop: 4,
  },
  classroom: {
    color: '#555',
    marginTop: 2,
    fontStyle: 'italic',
  },
});
