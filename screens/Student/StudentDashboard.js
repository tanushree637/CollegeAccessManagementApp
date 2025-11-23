// screens/Student/StudentDashboardScreen.js
// Rebuilt Student Dashboard (clean JSX) after previous patch corruption
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/config';
import {
  getBaseUrlFast,
  resolveBaseUrl,
  fetchWithTimeout,
} from '../../utils/network';

// In-memory cache
let studentDashboardCache = {
  data: null,
  timestamp: null,
  isValid(maxAge = 30000) {
    return this.data && this.timestamp && Date.now() - this.timestamp < maxAge;
  },
  clear() {
    this.data = null;
    this.timestamp = null;
  },
};
global.studentDashboardCache = studentDashboardCache;

export default function StudentDashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [qrEntryToken, setQrEntryToken] = useState('');
  const [qrExitToken, setQrExitToken] = useState('');
  const isFetchingRef = useRef(false);
  const TIMEOUT_MS = 12000;

  useEffect(() => {
    fetchDashboard(true);
    if (user) {
      generateQr('entry');
      generateQr('exit');
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboard(true);
    }, []),
  );

  const resolveBase = async () => {
    let base = API_CONFIG.BASE_URL || (await getBaseUrlFast());
    if (!base) base = await resolveBaseUrl(true);
    return base;
  };

  const fetchDashboard = async (force = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      if (!force && studentDashboardCache.isValid()) {
        const c = studentDashboardCache.data;
        setNotifications(c.notifications || []);
        setTasks(c.tasks || []);
        setLoading(false);
        return;
      }
      setLoading(true);
      const base = await resolveBase();
      if (!base) throw new Error('Base URL unresolved');

      const notifUrl = `${base}${API_CONFIG.ENDPOINTS.ADMIN}/notifications/${user.id}`;
      const tasksUrl = `${base}${API_CONFIG.ENDPOINTS.STUDENT}/tasks/${user.id}`;

      const [notifRes, taskRes] = await Promise.all([
        fetchWithTimeout(notifUrl, { timeout: TIMEOUT_MS }),
        fetchWithTimeout(tasksUrl, { timeout: TIMEOUT_MS }),
      ]);

      let notifData = [];
      if (notifRes.ok) {
        const nd = await notifRes.json();
        notifData = nd.notifications || [];
      }

      let taskData = [];
      if (taskRes.ok) {
        const td = await taskRes.json();
        taskData = td.tasks || [];
      }

      setNotifications(notifData);
      setTasks(taskData);
      studentDashboardCache.data = {
        notifications: notifData,
        tasks: taskData,
      };
      studentDashboardCache.timestamp = Date.now();
    } catch (e) {
      const msg = /Base URL unresolved/i.test(e.message)
        ? 'Cannot reach server. Ensure backend running & same network.'
        : 'Failed to load dashboard.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  };

  const generateQr = async type => {
    try {
      const base = await resolveBase();
      if (!base) return;
      const res = await fetch(
        `${base}${API_CONFIG.ENDPOINTS.ADMIN}/generate-qr`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, role: user?.role, type }),
        },
      );
      const data = await res.json();
      if (res.ok && data.token) {
        const scanUrl = `${base}${
          API_CONFIG.ENDPOINTS.ADMIN
        }/scan-attendance?token=${encodeURIComponent(data.token)}`;
        if (type === 'entry') setQrEntryToken(scanUrl);
        else setQrExitToken(scanUrl);
      }
    } catch {}
  };

  const onRefresh = () => {
    setRefreshing(true);
    studentDashboardCache.clear();
    fetchDashboard(true);
  };

  const markNotificationAsRead = async id => {
    try {
      const base = await resolveBase();
      if (!base) return;
      const res = await fetch(
        `${base}${API_CONFIG.ENDPOINTS.ADMIN}/notifications/${id}/read`,
        { method: 'PATCH' },
      );
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch {}
  };

  const formatDate = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = s => {
    switch ((s || '').toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
      case 'in progress':
        return '#F59E0B';
      case 'pending':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1E3A8A', '#2563EB']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Student Dashboard</Text>
        </View>
        <View style={styles.cardContainer}>
          {[1, 2].map(i => (
            <View key={i} style={styles.statCardSkeleton}>
              <View style={styles.skeletonIcon} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={styles.skeletonLineLarge} />
                <View
                  style={[styles.skeletonLine, { width: '50%', marginTop: 8 }]}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <ActivityIndicator
            size="small"
            color="#1E3A8A"
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const completedCount = tasks.filter(
    t => (t.status || '').toLowerCase() === 'completed',
  ).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E3A8A']}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome back, {user?.name || 'Student'}
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchDashboard(true)}
        >
          <Ionicons name="refresh-outline" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Your QR Codes
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.qrBlock}>
            <Text style={styles.qrLabel}>Entry</Text>
            {qrEntryToken ? (
              <QRCode value={qrEntryToken} size={110} />
            ) : (
              <Text style={styles.qrGenerating}>Generating...</Text>
            )}
          </View>
          <View style={styles.qrBlock}>
            <Text style={styles.qrLabel}>Exit</Text>
            {qrExitToken ? (
              <QRCode value={qrExitToken} size={110} />
            ) : (
              <Text style={styles.qrGenerating}>Generating...</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <StatCard
          icon="notifications-outline"
          label="New Notifications"
          value={unreadCount}
          color="#2563EB"
        />
        <StatCard
          icon="checkmark-done-outline"
          label="Completed Tasks"
          value={completedCount}
          color="#059669"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {notifications.length > 0 ? (
          notifications.slice(0, 3).map(n => (
            <TouchableOpacity
              key={n.id}
              style={[
                styles.notificationCard,
                !n.isRead && styles.unreadNotification,
              ]}
              onPress={() => {
                markNotificationAsRead(n.id);
                navigation.navigate('Notifications');
              }}
            >
              <View style={styles.notificationHeader}>
                <Text
                  style={[
                    styles.notificationTitle,
                    !n.isRead && styles.unreadTitle,
                  ]}
                >
                  {n.title}
                </Text>
                <Text style={styles.notificationDate}>
                  {formatDate(n.createdAt)}
                </Text>
              </View>
              <Text style={styles.notificationText} numberOfLines={2}>
                {n.message}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="notifications-off-outline"
            title="No notifications yet"
            subtitle="You'll see important updates here"
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
        </View>
        {tasks.length > 0 ? (
          tasks.slice(0, 3).map((t, i) => (
            <View key={t.id || i} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(t.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{t.status || 'Unknown'}</Text>
                </View>
              </View>
              <Text style={styles.taskText}>Due: {t.dueDate || '—'}</Text>
            </View>
          ))
        ) : (
          <EmptyState
            icon="document-outline"
            title="No tasks assigned yet"
            subtitle="Your assignments will appear here"
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <ActionCard
            icon="calendar-outline"
            label="Timetable"
            onPress={() => navigation.navigate('Timetable')}
          />
          <ActionCard
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>
        <View style={styles.actionsRow}>
          <ActionCard
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          <ActionCard
            icon="calendar"
            label="Attendance"
            onPress={() => navigation.navigate('Attendance')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionCard = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <Ionicons name={icon} size={28} color="#1E3A8A" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <View style={styles.emptyState}>
    <Ionicons name={icon} size={48} color="#9CA3AF" />
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubText}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1E3A8A' },
  refreshButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  statCardSkeleton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  skeletonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  skeletonLineLarge: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    width: '70%',
  },
  skeletonLine: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    width: '40%',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#1E3A8A',
  },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  section: { marginTop: 8, marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  seeAllText: { color: '#1E3A8A', fontWeight: '600' },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 2,
  },
  unreadNotification: { borderLeftWidth: 4, borderLeftColor: '#1E3A8A' },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: { color: '#1E3A8A' },
  notificationDate: { fontSize: 12, color: '#6B7280' },
  notificationText: { fontSize: 14, color: '#374151', marginTop: 6 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1E3A8A', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  taskText: { color: '#6B7280' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 6 },
  qrBlock: {
    width: '48%',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  qrLabel: { fontWeight: '600', marginBottom: 8 },
  qrGenerating: { color: '#9CA3AF' },
});
