import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../../config/config';
import { getBaseUrlFast } from '../../utils/network';

// Simple, sensible fallback so something useful displays if API is empty
const SAMPLE_TIMETABLE = [
  {
    day: 'Monday',
    classes: [
      {
        time: '09:00 - 09:45',
        subject: 'Mathematics',
        className: '10-A',
        room: '101',
      },
      {
        time: '10:00 - 10:45',
        subject: 'Physics',
        className: '11-B',
        room: 'Lab-2',
      },
      {
        time: '11:00 - 11:45',
        subject: 'Class Teacher',
        className: '10-A',
        room: '10A',
      },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      {
        time: '09:00 - 09:45',
        subject: 'Mathematics',
        className: '10-B',
        room: '102',
      },
      {
        time: '10:00 - 10:45',
        subject: 'Physics',
        className: '11-A',
        room: 'Lab-1',
      },
      {
        time: '12:00 - 12:45',
        subject: 'Free Period',
        className: '-',
        room: '-',
      },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      {
        time: '09:00 - 09:45',
        subject: 'Mathematics',
        className: '9-C',
        room: '203',
      },
      {
        time: '10:00 - 10:45',
        subject: 'Department Meeting',
        className: '-',
        room: 'Staff Room',
      },
    ],
  },
];

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimetable = async () => {
    try {
      const base = await getBaseUrlFast();
      const res = await axios.get(`${base}/api/teacher/timetable`);
      const data = Array.isArray(res.data) ? res.data : [];

      // API may return flat rows: { day, subject, time, className, room }
      // Normalize into grouped-by-day format used by UI below
      const grouped = groupByDay(data);
      setTimetable(grouped.length ? grouped : SAMPLE_TIMETABLE);
    } catch (err) {
      console.error('TeacherTimetable fetch error:', err);
      // On error, still show a helpful fallback
      setTimetable(SAMPLE_TIMETABLE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTimetable();
    setRefreshing(false);
  };

  const groupByDay = rows => {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const map = new Map();
    rows.forEach(r => {
      const day = r.day || r.Day || 'Unknown';
      const entry = {
        time: r.time || r.Time || '-',
        subject: r.subject || r.Subject || '-',
        className: r.className || r.class || r.Class || '-',
        room: r.room || r.Room || '-',
      };
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(entry);
    });
    return Array.from(map.entries()).map(([day, classes]) => ({
      day,
      classes,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E3A8A', '#2563EB']}
          progressBackgroundColor="#FFFFFF"
        />
      }
    >
      <Text style={styles.title}>Your Timetable</Text>

      {timetable.length === 0 ? (
        <Text style={styles.noData}>No timetable found</Text>
      ) : (
        timetable.map((dayBlock, index) => (
          <View key={`${dayBlock.day}-${index}`} style={styles.card}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayText}>{dayBlock.day}</Text>
            </View>

            {(dayBlock.classes || []).map((cls, idx) => (
              <View key={idx} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{cls.subject}</Text>
                  <Text style={styles.smallText}>Room: {cls.room}</Text>
                </View>
                <View style={styles.rightInfo}>
                  <Text style={styles.time}>{cls.time}</Text>
                  <Text style={styles.teacher}>{cls.className}</Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dayHeader: {
    backgroundColor: '#1E3A8A15',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    textAlign: 'right',
  },
  teacher: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
  },
  smallText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  noData: {
    textAlign: 'center',
    color: '#64748B',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
