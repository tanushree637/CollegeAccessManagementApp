// screens/Admin/AdminDashboard.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { API_CONFIG } from '../../config/config';
import {
  performanceMonitor,
  fetchWithTimeout,
} from '../../utils/performanceUtils';

// Simple cache to avoid unnecessary API calls
let dashboardCache = {
  data: null,
  timestamp: null,
  isValid: function (maxAge = 30000) {
    // 30 seconds cache
    return this.data && this.timestamp && Date.now() - this.timestamp < maxAge;
  },
  clear: function () {
    this.data = null;
    this.timestamp = null;
  },
};

// Make cache globally accessible for clearing
global.dashboardCache = dashboardCache;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEntriesToday: 0,
    totalExitsToday: 0,
    activeUsers: 0,
    managers: 0,
    employees: 0,
    students: 0,
    teachers: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data when screen comes into focus (e.g., after creating a user)
  useFocusEffect(
    React.useCallback(() => {
      // Only refresh if we already have data (not initial load)
      if (stats.totalUsers > 0 || !loading) {
        console.log('🔄 Screen focused - refreshing dashboard data');
        fetchAllData(true); // Force refresh on focus
      }
    }, [stats.totalUsers, loading]),
  );

  // Combined data fetch for better performance
  const fetchAllData = async (forceRefresh = false) => {
    try {
      // Check cache first unless force refresh
      if (!forceRefresh && dashboardCache.isValid()) {
        console.log('📦 Using cached dashboard data');
        setStats(dashboardCache.data.stats);
        setRecentActivity(dashboardCache.data.recentActivity || []);
        setLoading(false);
        return;
      }

      // Check if cache should be cleared (when new user is created)
      if (global.dashboardCache === null) {
        console.log('🗑️ Cache cleared - forcing refresh');
        dashboardCache.clear();
        global.dashboardCache = dashboardCache;
      }

      performanceMonitor.startTimer('Dashboard API Call');

      const res = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/dashboard-with-activity?limit=5`,
        {},
        8000, // 8 second timeout
      );

      const data = await res.json();
      performanceMonitor.endTimer('Dashboard API Call');

      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);

        // Cache the response
        dashboardCache.data = data;
        dashboardCache.timestamp = Date.now();
        console.log('💾 Dashboard data cached');
      } else {
        console.warn('Failed to fetch dashboard data:', data.message);
      }
    } catch (error) {
      performanceMonitor.endTimer('Dashboard API Call');
      console.error('Error fetching dashboard data:', error);

      // Show user-friendly error message
      if (error.message.includes('timeout')) {
        console.warn(
          '⚠️  Dashboard loading timed out. Please check your internet connection.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(true); // Force refresh
    setRefreshing(false);
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        {/* Skeleton loading for cards */}
        <View style={styles.cardContainer}>
          {[1, 2, 3, 4].map(item => (
            <Card key={item} style={styles.card}>
              <View style={styles.cardContent}>
                <View
                  style={[styles.skeletonIcon, { backgroundColor: '#E5E7EB' }]}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View
                    style={[styles.skeletonText, { width: '60%', height: 20 }]}
                  />
                  <View
                    style={[
                      styles.skeletonText,
                      { width: '40%', height: 14, marginTop: 4 },
                    ]}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ActivityIndicator
            size="small"
            color="#1E3A8A"
            style={{ marginVertical: 10 }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E3A8A']}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <StatCard
          icon="people-outline"
          label="Total Users"
          value={stats.totalUsers}
          color="#2563EB"
        />
        <StatCard
          icon="log-in-outline"
          label="Entries Today"
          value={stats.totalEntriesToday}
          color="#059669"
        />
        <StatCard
          icon="log-out-outline"
          label="Exits Today"
          value={stats.totalExitsToday}
          color="#DC2626"
        />
        <StatCard
          icon="pulse-outline"
          label="Active Users"
          value={stats.activeUsers}
          color="#F59E0B"
        />
      </View>

      {/* Role Breakdown Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Breakdown by Role</Text>
        <View style={styles.roleContainer}>
          <RoleCard
            icon="school-outline"
            label="Teachers"
            value={stats.teachers || 0}
            color="#8B5CF6"
          />
          <RoleCard
            icon="people-outline"
            label="Students"
            value={stats.students || 0}
            color="#06B6D4"
          />
          <RoleCard
            icon="shield-outline"
            label="Guards"
            value={stats.guards || 0}
            color="#EF4444"
          />
          <RoleCard
            icon="business-outline"
            label="Managers"
            value={stats.managers || 0}
            color="#10B981"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#1E3A8A"
            style={{ marginVertical: 10 }}
          />
        ) : recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons
                  name={
                    activity.type === 'entry'
                      ? 'log-in-outline'
                      : 'log-out-outline'
                  }
                  size={16}
                  color={activity.type === 'entry' ? '#059669' : '#DC2626'}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityName}>
                  {activity.userName || 'Unknown User'}
                </Text>
                <Text style={styles.activityDetails}>
                  {activity.type === 'entry' ? 'Entered' : 'Exited'} at{' '}
                  {formatTime(activity.timestamp)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>
            No recent activity to display yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <Card style={styles.card}>
    <View style={styles.cardContent}>
      <Ionicons name={icon} size={28} color={color} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </View>
    </View>
  </Card>
);

const RoleCard = ({ icon, label, value, color }) => (
  <Card style={styles.roleCard}>
    <View style={styles.roleCardContent}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.roleCardValue, { color }]}>{value}</Text>
      <Text style={styles.roleCardLabel}>{label}</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    paddingVertical: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    paddingVertical: 8,
  },
  roleCardContent: {
    alignItems: 'center',
    padding: 12,
  },
  roleCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2,
  },
  roleCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeholder: {
    color: '#6B7280',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  skeletonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  skeletonText: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
