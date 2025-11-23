import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/config';
import { getBaseUrlFast, resolveBaseUrl } from '../../utils/network';

export default function TaskListScreen() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic base URL; fallback to config or discovery
  const getBase = async () => {
    let base = API_CONFIG.BASE_URL || (await getBaseUrlFast());
    if (!base) base = await resolveBaseUrl(true);
    return base;
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const base = await getBase();
      if (!base) throw new Error('Base URL unresolved');
      const url = `${base}/tasks/student/${user.email}`;
      console.log('[TaskListScreen] Fetching tasks:', url);
      const response = await fetch(url);
      const data = await response.json().catch(() => []);
      if (Array.isArray(data)) {
        console.log('[TaskListScreen] Received tasks count:', data.length);
        setTasks(data);
      } else {
        console.warn('[TaskListScreen] Unexpected tasks payload shape');
        setTasks([]);
      }
    } catch (error) {
      const msg = /Base URL unresolved/i.test(error?.message)
        ? 'Cannot reach server. Ensure backend running & same network.'
        : 'Unable to fetch tasks.';
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const base = await getBase();
      if (!base) throw new Error('Base URL unresolved');
      const url = `${base}/tasks/update/${taskId}`;
      console.log(
        '[TaskListScreen] Updating task:',
        taskId,
        'status ->',
        newStatus,
        'URL:',
        url,
      );
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log('[TaskListScreen] Update success for task:', taskId);
        Alert.alert('Success', `Task marked as ${newStatus}`);
        fetchTasks();
      } else {
        console.warn('[TaskListScreen] Update failed status:', response.status);
        Alert.alert('Error', 'Failed to update task.');
      }
    } catch (error) {
      const msg = /Base URL unresolved/i.test(error?.message)
        ? 'Cannot reach server for update.'
        : 'Error updating task.';
      console.error('Error updating task:', error);
      Alert.alert('Error', msg);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.title}</Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'Completed' ? '#16A34A20' : '#F59E0B20',
              borderColor: item.status === 'Completed' ? '#16A34A' : '#F59E0B',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'Completed' ? '#16A34A' : '#F59E0B',
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.detail}>📄 {item.description}</Text>
      <Text style={styles.detail}>👤 Assigned By: {item.assignedBy}</Text>
      <Text style={styles.detail}>⏳ Due: {item.dueDate}</Text>

      {item.status !== 'Completed' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateTaskStatus(item._id || item.id, 'Completed')}
        >
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) =>
            (item._id || item.id || index).toString()
          }
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No tasks assigned.</Text>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detail: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    marginTop: 14,
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
