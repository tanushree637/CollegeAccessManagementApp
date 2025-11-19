// screens/Student/StudentDashboardScreen.js
import React, { useEffect, useState, useContext } from 'react';
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

// small in-memory cache similar to Admin's pattern (keeps dashboard snappy)
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

  // Use API_CONFIG for base URL and endpoints
  const BASE = API_CONFIG.BASE_URL;
  const NOTIF_ENDPOINT = `${BASE}${API_CONFIG.ENDPOINTS.ADMIN}/notifications`;
  const TASK_ENDPOINT = `${BASE}${API_CONFIG.ENDPOINTS.STUDENT}/tasks`;

  // Fetch on mount and when screen gets focus (like Admin)
  useEffect(() => {
    fetchDashboardData();
    // generate QR tokens for student (entry + exit)
    if (user) {
      generateQrToken('entry').catch(e => console.log(e));
      generateQrToken('exit').catch(e => console.log(e));
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Force refresh when coming back to screen
      if (!loading) {
        fetchDashboardData(true);
      }
    }, [loading]),
  );

  const fetchDashboardData = async (forceRefresh = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Use cache unless forced
      if (!forceRefresh && studentDashboardCache.isValid()) {
        const cached = studentDashboardCache.data;
        setTasks(cached.tasks || []);
        setNotifications(cached.notifications || []);
        setLoading(false);
        return;
      }

      setLoading(true);

      // fetch notifications (admin route returns notifications for this user)
      const notifRes = await fetch(`${NOTIF_ENDPOINT}/${user.id}`);
      let notifData = [];
      if (notifRes.ok) {
        const parsed = await notifRes.json();
        notifData = parsed.notifications || [];
      }

      // fetch tasks for student
      const taskRes = await fetch(`${TASK_ENDPOINT}/${user.id}`);
      let taskData = [];
      if (taskRes.ok) {
        const parsed = await taskRes.json();
        taskData = parsed.tasks || [];
      }

      setNotifications(notifData);
      setTasks(taskData);

      // cache
      studentDashboardCache.data = {
        notifications: notifData,
        tasks: taskData,
      };
      studentDashboardCache.timestamp = Date.now();
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      Alert.alert('Error', 'Failed to load dashboard. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateQrToken = async type => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/generate-qr`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, role: user?.role, type }),
        },
      );
      const data = await res.json();
      if (res.ok && data.token) {
        if (type === 'entry') setQrEntryToken(data.token);
        else setQrExitToken(data.token);
      }
    } catch (err) {
      console.error('Student QR token error:', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // clear local cache to force API fetch
    studentDashboardCache.clear();
    fetchDashboardData(true);
  };

  const markNotificationAsRead = async notificationId => {
    try {
      // use Admin endpoint to mark read (consistent with backend)
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/admin/notifications/${notificationId}/read`,
        { method: 'PATCH', headers: { 'Content-Type': 'application/json' } },
      );

      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n)),
        );
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = status => {
    switch ((status || '').toLowerCase()) {
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

  // loading skeleton consistent with Admin
  if (loading) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
          onPress={() => fetchDashboardData(true)}
        >
          <Ionicons name="refresh-outline" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* QR codes for student entry/exit */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Your QR Codes
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              width: '48%',
              alignItems: 'center',
              padding: 8,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: '600', marginBottom: 8 }}>Entry</Text>
            {qrEntryToken ? (
              <QRCode value={qrEntryToken} size={110} />
            ) : (
              <Text style={{ color: '#9CA3AF' }}>Generating...</Text>
            )}
          </View>

          <View
            style={{
              width: '48%',
              alignItems: 'center',
              padding: 8,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: '600', marginBottom: 8 }}>Exit</Text>
            {qrExitToken ? (
              <QRCode value={qrExitToken} size={110} />
            ) : (
              <Text style={{ color: '#9CA3AF' }}>Generating...</Text>
            )}
          </View>
        </View>
      </View>

      {/* Stat cards similar to Admin */}
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

      {/* Sections */}
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
          notifications.slice(0, 3).map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.isRead && styles.unreadNotification,
              ]}
              onPress={() => {
                markNotificationAsRead(notif.id);
                navigation.navigate('Notifications');
              }}
            >
              <View style={styles.notificationHeader}>
                <Text
                  style={[
                    styles.notificationTitle,
                    !notif.isRead && styles.unreadTitle,
                  ]}
                >
                  {notif.title}
                </Text>
                <Text style={styles.notificationDate}>
                  {formatDate(notif.createdAt)}
                </Text>
              </View>
              <Text style={styles.notificationText} numberOfLines={2}>
                {notif.message}
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
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {tasks.length > 0 ? (
          tasks.slice(0, 3).map((task, idx) => (
            <View key={task.id || idx} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(task.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {task.status || 'Unknown'}
                  </Text>
                </View>
              </View>
              <Text style={styles.taskText}>Due: {task.dueDate || '—'}</Text>
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

      {/* Optional quick links at bottom (Profile / Timetable / Settings) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <ActionCard
            icon="calendar-outline"
            label="My Timetable"
            onPress={() => navigation.navigate('Timetable')}
          />
          <ActionCard
            icon="list-outline"
            label="My Tasks"
            onPress={() => navigation.navigate('Tasks')}
          />
        </View>

        <View style={styles.actionsRow}>
          <ActionCard
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <ActionCard
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

/* small reusable components to keep layout consistent with Admin */
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

/* styles aligned with Admin Dashboard styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
  },
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
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E3A8A',
  },

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
});
