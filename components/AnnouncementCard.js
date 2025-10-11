// components/AnnouncementCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const AnnouncementCard = ({ title, description, date }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    <Text style={styles.date}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.text,
  },
  description: {
    color: colors.subText,
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: colors.accent,
    textAlign: 'right',
  },
});

export default AnnouncementCard;
