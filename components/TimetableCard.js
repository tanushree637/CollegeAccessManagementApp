// components/TimetableCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const TimetableCard = ({ subject, time, teacher }) => (
  <View style={styles.card}>
    <Text style={styles.subject}>{subject}</Text>
    <Text style={styles.time}>{time}</Text>
    {teacher && <Text style={styles.teacher}>By: {teacher}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  subject: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 16,
  },
  time: {
    color: colors.subText,
  },
  teacher: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 3,
  },
});

export default TimetableCard;
