import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrlFast, fetchWithTimeout } from '../../utils/network';
import { useFocusEffect } from '@react-navigation/native';

export default function TeacherDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrEntryToken, setQrEntryToken] = useState('');
  const [qrExitToken, setQrExitToken] = useState('');

  const API_URL = API_CONFIG.BASE_URL;
  const STORAGE_KEYS = {
    notifications: uid => `teacher:notifications:${uid}`,
    tasks: uid => `teacher:tasks:${uid}`,
  };

  useEffect(() => {
    if (user) {
      // 1) Show cached data instantly if available
      loadCachedData(user.id).finally(() => {
        // If we had anything cached, stop showing the full-screen loader
        setLoading(false);
      });

      // 2) Refresh live data and QR tokens in parallel (no blocking UI)
      fetchDashboard();
      Promise.allSettled([
        generateQrToken('entry'),
        generateQrToken('exit'),
      ]).catch(() => {});

      // 3) Dev-only connectivity test to avoid production slowdown
      if (__DEV__) testNetworkConnectivity();
    }
  }, [user]);

  const testNetworkConnectivity = async () => {
    try {
      console.log('Testing network connectivity...');
      const base = await getBaseUrlFast();
      const response = await fetch(`${base}/api/admin/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Network test - Status:', response.status);
      if (response.ok) {
        console.log('Network connectivity: OK');
      } else {
        console.log(
          'Network connectivity: Failed with status',
          response.status,
        );
      }
    } catch (error) {
      console.error('Network connectivity test failed:', error);
    }
  };

  // fetchWithTimeout imported from utils/network

  const loadCachedData = async uid => {
    try {
      const [cachedNotifStr, cachedTasksStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.notifications(uid)),
        AsyncStorage.getItem(STORAGE_KEYS.tasks(uid)),
      ]);
      if (cachedNotifStr) {
        const parsed = JSON.parse(cachedNotifStr);
        if (Array.isArray(parsed)) setNotifications(parsed);
      }
      if (cachedTasksStr) {
        const parsed = JSON.parse(cachedTasksStr);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (e) {
      console.log('Failed to load cached dashboard data', e);
    }
  };

  const generateQrToken = async type => {
    try {
      console.log('Generating QR token for:', {
        userId: user?.id,
        role: user?.role,
        type,
      });
      // Log target base for debugging
      const baseForLog = await getBaseUrlFast();
      console.log(
        'API URL:',
        `${baseForLog}${API_CONFIG.ENDPOINTS.ADMIN}/generate-qr`,
      );

      if (!user?.id || !user?.role) {
        console.error('Missing user data:', {
          userId: user?.id,
          role: user?.role,
        });
        return;
      }

      const base = await getBaseUrlFast();
      const res = await fetch(
        `${base}${API_CONFIG.ENDPOINTS.ADMIN}/generate-qr`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, role: user.role, type }),
        },
      );

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok && data.token) {
        const scanUrl = `${baseForLog}${
          API_CONFIG.ENDPOINTS.ADMIN
        }/scan-attendance?token=${encodeURIComponent(data.token)}`;
        if (type === 'entry') setQrEntryToken(scanUrl);
        else setQrExitToken(scanUrl);
        console.log(`${type} QR URL generated successfully`);
      } else {
        console.warn('Failed to get QR token', data);
      }
    } catch (err) {
      console.error('Error generating QR token:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    }
  };

  const fetchDashboard = async () => {
    try {
      // Generate QR seed (not network) just once per refresh
      setQrValue(`teacher:${user.id}:${Date.now()}`);

      const base = await getBaseUrlFast();
      const notifUrl = `${base}${API_CONFIG.ENDPOINTS.ADMIN}/notifications/${user.id}`;
      // Filter tasks by teacherId via query param
      const tasksUrl = `${base}${
        API_CONFIG.ENDPOINTS.TEACHER
      }/tasks?teacherId=${encodeURIComponent(user.id)}`;

      const [notifRes, tasksRes] = await Promise.allSettled([
        fetchWithTimeout(notifUrl, {
          headers: { 'Content-Type': 'application/json' },
        }),
        fetchWithTimeout(tasksUrl, {
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);

      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        const notifData = await notifRes.value.json();
        const items = Array.isArray(notifData?.notifications)
          ? notifData.notifications
          : [];
        setNotifications(items);
        AsyncStorage.setItem(
          STORAGE_KEYS.notifications(user.id),
          JSON.stringify(items),
        ).catch(() => {});
      } else if (notifRes.status === 'fulfilled') {
        console.log('Failed to fetch notifications:', notifRes.value.status);
      }

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const taskData = await tasksRes.value.json();
        const items = Array.isArray(taskData?.tasks) ? taskData.tasks : [];
        setTasks(items);
        AsyncStorage.setItem(
          STORAGE_KEYS.tasks(user.id),
          JSON.stringify(items),
        ).catch(() => {});
      } else if (tasksRes.status === 'fulfilled') {
        console.log('Failed to fetch tasks:', tasksRes.value.status);
      } else if (tasksRes.status === 'rejected') {
        console.log('Tasks endpoint not available yet:', tasksRes.reason);
      }
    } catch (err) {
      console.log('Error loading teacher dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh tasks/notifications whenever screen gains focus (after assigning new task)
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchDashboard();
      }
    }, [user]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const markNotificationAsRead = async notificationId => {
    try {
      const base = await getBaseUrlFast();
      const response = await fetch(
        `${base}${API_CONFIG.ENDPOINTS.ADMIN}/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.name || 'Teacher'} 👨‍🏫
        </Text>
        <Text style={styles.subText}>Manage your classes and stay updated</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="notifications-outline" size={24} color="#1E3A8A" />
          <Text style={styles.statNumber}>
            {notifications.filter(n => !n.isRead).length}
          </Text>
          <Text style={styles.statLabel}>New Notifications</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text-outline" size={24} color="#10B981" />
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Active Tasks</Text>
        </View>
      </View>

      {/* QR Code Section (Entry / Exit) */}
      <View style={styles.qrSection}>
        <Text style={styles.sectionTitle}>Your QR Codes</Text>
        <View style={styles.qrContainerRow}>
          <View style={styles.qrBlock}>
            <Text style={styles.qrLabel}>Entry</Text>
            {qrEntryToken ? (
              <QRCode value={qrEntryToken} size={120} />
            ) : (
              <Text style={styles.noQrText}>Generating...</Text>
            )}
          </View>

          <View style={styles.qrBlock}>
            <Text style={styles.qrLabel}>Exit</Text>
            {qrExitToken ? (
              <QRCode value={qrExitToken} size={120} />
            ) : (
              <Text style={styles.noQrText}>Generating...</Text>
            )}
          </View>
        </View>
        <Text style={styles.qrDescription}>
          Students can scan these QR codes to record entry or exit.
        </Text>
      </View>

      {/* Notifications Section */}
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
              onPress={() => markNotificationAsRead(notif.id)}
            >
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notif.title}</Text>
                <Text style={styles.notificationDate}>
                  {formatDate(notif.createdAt)}
                </Text>
              </View>
              <Text style={styles.notificationText} numberOfLines={2}>
                {notif.message}
              </Text>
              {!notif.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              You'll see important updates here
            </Text>
          </View>
        )}
      </View>

      {/* Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned Tasks</Text>

        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <View key={index} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.description}</Text>
              <Text style={styles.taskClass}>Class: {task.className}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No tasks assigned</Text>
            <Text style={styles.emptySubText}>
              Your assigned tasks will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AssignTask')}
        >
          <Ionicons name="add-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Assign New Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { marginTop: 12, backgroundColor: '#9333EA' },
          ]}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>View Attendance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  qrContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  qrDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  qrContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  qrBlock: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  qrLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  noQrText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    flex: 1,
    marginRight: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  notificationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  taskDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  taskClass: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
