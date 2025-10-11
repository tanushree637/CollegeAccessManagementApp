// src/screens/Guard/LogsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const logs = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Student',
    date: '10 Oct 2025',
    entry: '8:55 AM',
    exit: '4:10 PM',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Teacher',
    date: '10 Oct 2025',
    entry: '8:40 AM',
    exit: '3:45 PM',
  },
];

const LogsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Access Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <Text style={styles.name}>
              {item.name} ({item.role})
            </Text>
            <Text style={styles.details}>
              {item.date} | Entry: {item.entry} | Exit: {item.exit}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default LogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 15,
  },
  logCard: {
    backgroundColor: '#f6f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    color: '#555',
  },
});
