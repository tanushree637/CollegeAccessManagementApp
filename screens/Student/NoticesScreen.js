// src/screens/Student/NoticesScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const notices = [
  {
    id: '1',
    title: 'Assignment Submission',
    detail: 'Submit your Mathematics assignment by 5 PM today.',
  },
  {
    id: '2',
    title: 'Guest Lecture',
    detail: 'Guest lecture on AI at 2 PM in Room 105.',
  },
];

const StudentNoticesScreen = () => {
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

export default StudentNoticesScreen;

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
  noticeCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1a237e',
  },
  detailText: {
    color: '#555',
    marginTop: 5,
  },
});
