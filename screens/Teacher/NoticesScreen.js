// src/screens/Teacher/NoticesScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notices = [
  {
    id: '1',
    title: 'Staff Meeting',
    detail: 'Meeting at 3 PM in Seminar Hall.',
  },
  {
    id: '2',
    title: 'Exam Duty',
    detail: 'Exam duty schedule has been updated.',
  },
];

const NoticesScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.noticeCard}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.detailText}>{item.detail}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notices</Text>
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={i => i.id}
      />
    </View>
  );
};

export default NoticesScreen;

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
  noticeCard: {
    backgroundColor: '#f4f7ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#004aad',
  },
  detailText: {
    color: '#555',
    marginTop: 5,
  },
});
