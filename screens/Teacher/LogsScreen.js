// src/screens/Teacher/LogsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const logs = [
  { id: '1', date: '10 Oct 2025', entry: '8:55 AM', exit: '4:10 PM' },
  { id: '2', date: '9 Oct 2025', entry: '8:58 AM', exit: '4:05 PM' },
];

const LogsScreen = () => {
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
      <Text style={styles.title}>Access Logs</Text>
      <FlatList data={logs} renderItem={renderItem} keyExtractor={i => i.id} />
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
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#004aad',
  },
  details: {
    color: '#555',
    marginTop: 4,
  },
});
