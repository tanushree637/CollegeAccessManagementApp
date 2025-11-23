import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/config';
import {
  getBaseUrlFast,
  resolveBaseUrl,
  fetchWithTimeout,
} from '../../utils/network';

export default function AttendanceReport() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAttendance = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      let base = API_CONFIG.BASE_URL || (await getBaseUrlFast());
      if (!base) base = await resolveBaseUrl(true);
      if (!base) throw new Error('Base URL unresolved');
      const url = `${base}${API_CONFIG.ENDPOINTS.ADMIN}/attendance/${user.id}`;
      const res = await fetchWithTimeout(url, { timeout: 10000 });
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data.attendance) ? data.attendance : []);
      }
    } catch (e) {
      // silent; could add toast
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance();
  };

  const formatTime = iso => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading attendance...</Text>
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
          colors={['#2563EB']}
        />
      }
    >
      <Text style={styles.title}>My Attendance</Text>
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyText}>No attendance records yet</Text>
        </View>
      ) : (
        records.map(r => (
          <View
            key={r.id}
            style={[
              styles.row,
              r.type === 'entry' ? styles.entry : styles.exit,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.type}>{r.type.toUpperCase()}</Text>
              <Text style={styles.time}>{formatTime(r.timestamp)}</Text>
            </View>
            <Ionicons
              name={r.type === 'entry' ? 'log-in-outline' : 'log-out-outline'}
              size={28}
              color={r.type === 'entry' ? '#059669' : '#DC2626'}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: { marginTop: 10, color: '#6B7280' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#6B7280' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  entry: { borderLeftWidth: 4, borderLeftColor: '#059669' },
  exit: { borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  type: { fontSize: 16, fontWeight: '600', color: '#111827' },
  time: { fontSize: 12, color: '#6B7280', marginTop: 4 },
});
