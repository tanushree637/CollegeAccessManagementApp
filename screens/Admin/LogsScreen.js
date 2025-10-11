// src/screens/Admin/LogsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyLogs = [
  {
    id: '1',
    name: 'Alice Smith',
    role: 'Student',
    action: 'Entry',
    time: '9:00 AM',
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Teacher',
    action: 'Exit',
    time: '4:15 PM',
  },
];

const LogsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logName}>{item.name}</Text>
      <Text style={styles.logDetails}>
        {item.role} - {item.action} - {item.time}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Logs</Text>
      <FlatList
        data={dummyLogs}
        renderItem={renderItem}
        keyExtractor={i => i.id}
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
    marginBottom: 20,
  },
  logItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  logName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  logDetails: {
    color: '#666',
  },
});
