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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/config';

export default function NotificationsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/notifications/${user.id}`,
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markNotificationAsRead = async notificationId => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/admin/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n)),
        );
      }
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) {
      Alert.alert('Info', 'All notifications are already read.');
      return;
    }

    try {
      await Promise.all(
        unread.map(n =>
          fetch(`${API_CONFIG.BASE_URL}/api/admin/notifications/${n.id}/read`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      Alert.alert('Success', 'All notifications marked as read.');
    } catch (err) {
      Alert.alert('Error', 'Failed to mark all as read.');
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60);

    if (diff < 1) {
      return `${Math.floor((now - date) / (1000 * 60))} min ago`;
    } else if (diff < 24) {
      return `${Math.floor(diff)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getNotificationIcon = role => {
    switch (role) {
      case 'all':
        return 'megaphone-outline';
      case 'student':
        return 'school-outline';
      case 'teacher':
        return 'person-outline';
      default:
        return 'notifications-outline';
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      {notifications.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {unreadCount} unread • {notifications.length} total
          </Text>
        </View>
      )}

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.isRead && styles.unreadNotification,
              ]}
              onPress={() => markNotificationAsRead(notif.id)}
            >
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={getNotificationIcon(notif.targetRole)}
                    size={22}
                    color={!notif.isRead ? '#1E3A8A' : '#6B7280'}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      !notif.isRead && styles.unreadTitle,
                    ]}
                  >
                    {notif.title}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(notif.createdAt)}
                  </Text>
                </View>

                {!notif.isRead && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.notificationMsg}>{notif.message}</Text>

              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  To:{' '}
                  {notif.targetRole === 'all' ? 'Everyone' : notif.targetRole}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={70}
              color="#9CA3AF"
            />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>You will receive updates here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#6B7280' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  markAllText: {
    color: '#1E3A8A',
    fontWeight: '600',
    fontSize: 14,
  },

  statsContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statsText: { color: '#6B7280', fontSize: 14 },

  scrollView: { paddingHorizontal: 18, paddingTop: 10 },

  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },

  row: { flexDirection: 'row', marginBottom: 8 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E3A8A',
    marginTop: 5,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  unreadTitle: { fontWeight: '700', color: '#1E3A8A' },

  dateText: { fontSize: 12, color: '#6B7280' },

  notificationMsg: {
    marginTop: 6,
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },

  tag: {
    marginTop: 10,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tagText: { color: '#1E3A8A', fontSize: 12, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#374151',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#6B7280',
    fontSize: 15,
  },
});
