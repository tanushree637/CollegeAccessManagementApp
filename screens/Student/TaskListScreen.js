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

export default function TaskListScreen() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.7:5000';

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/student/${user.email}`);
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Unable to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/update/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        Alert.alert('Success', `Task marked as ${newStatus}`);
        fetchTasks();
      } else {
        Alert.alert('Error', 'Failed to update task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
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
