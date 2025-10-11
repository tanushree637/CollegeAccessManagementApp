// src/screens/Student/LogsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const logs = [
  { id: '1', date: '10 Oct 2025', entry: '9:05 AM', exit: '4:00 PM' },
  { id: '2', date: '9 Oct 2025', entry: '9:00 AM', exit: '3:55 PM' },
];

const StudentLogsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.details}>
        Entry: {item.entry} | Exit: {item.exit}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Access Logs</Text>
      <FlatList data={logs} renderItem={renderItem} keyExtractor={i => i.id} />
    </View>
  );
};

export default StudentLogsScreen;

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
  logCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a237e',
  },
  details: {
    color: '#555',
    marginTop: 4,
  },
});
