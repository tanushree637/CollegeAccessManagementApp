import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getBaseUrlFast, resolveBaseUrl } from '../../utils/network';
import studentApi from './studentApi';

export default function TimetableScreen() {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resolve base URL dynamically with fallback retry
  const getApi = async () => {
    let base = await getBaseUrlFast();
    if (!base) base = await resolveBaseUrl(true);
    return base;
  };

  const SAMPLE_STUDENT_TIMETABLE = [
    {
      day: 'Monday',
      classes: [
        {
          subject: 'English',
          room: '204',
          time: '09:00 - 09:45',
          teacher: 'Ms. Roy',
        },
        {
          subject: 'Mathematics',
          room: '101',
          time: '10:00 - 10:45',
          teacher: 'Mr. Kumar',
        },
        {
          subject: 'Chemistry',
          room: 'Lab-1',
          time: '11:00 - 11:45',
          teacher: 'Dr. Sen',
        },
      ],
    },
    {
      day: 'Tuesday',
      classes: [
        {
          subject: 'Physics',
          room: 'Lab-2',
          time: '09:00 - 09:45',
          teacher: 'Dr. Bose',
        },
        {
          subject: 'History',
          room: '305',
          time: '10:00 - 10:45',
          teacher: 'Mr. Das',
        },
      ],
    },
  ];

  useEffect(() => {
    if (user) fetchTimetable();
  }, [user]);

  const fetchTimetable = async () => {
    try {
      const base = await getApi();
      if (!base) throw new Error('Base URL unresolved');
      // Use studentApi helper for consistency
      const { ok, data } = await studentApi.get(`/timetable/${user.email}`);
      if (ok && Array.isArray(data)) {
        setTimetable(data.length ? data : SAMPLE_STUDENT_TIMETABLE);
      } else if (Array.isArray(data)) {
        setTimetable(data.length ? data : SAMPLE_STUDENT_TIMETABLE);
      } else {
        setTimetable(SAMPLE_STUDENT_TIMETABLE);
      }
    } catch (error) {
      const baseErr = /Base URL unresolved/i.test(error?.message);
      console.error('Error fetching timetable:', error);
      if (baseErr) {
        // Provide clearer guidance for network issues
        console.warn(
          'Timetable base URL could not be resolved. Ensure backend on port 5000 and device shares network.',
        );
      }
      // Show a fallback instead of empty UI
      setTimetable(SAMPLE_STUDENT_TIMETABLE);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Day Title */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{item.day || ''}</Text>
      </View>

      {/* Class Rows */}
      {(item.classes || []).map((cls, index) => (
        <View key={index} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subject}>{cls.subject}</Text>
            <Text style={styles.smallText}>Room: {cls.room}</Text>
          </View>

          <View style={styles.rightInfo}>
            <Text style={styles.time}>{cls.time}</Text>
            <Text style={styles.teacher}>{cls.teacher}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text>Loading your timetable...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Timetable</Text>

      {timetable.length > 0 ? (
        <FlatList
          data={timetable}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No timetable assigned yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 14,
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

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
});
