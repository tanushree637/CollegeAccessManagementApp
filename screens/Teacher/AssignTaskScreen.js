import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { API_CONFIG } from '../../config/config';
import { apiPostJson } from '../../utils/network';
import { AuthContext } from '../../context/AuthContext';

export default function AssignTask({ navigation }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!title || !description || !className) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    try {
      setLoading(true);

      const endpoint = `${API_CONFIG.ENDPOINTS.TEACHER}/tasks/add`; // corrected route
      const result = await apiPostJson(endpoint, {
        title,
        description,
        className,
        teacherId: user?.id || null,
      });

      if (result.success) {
        Alert.alert('Success', 'Task Assigned Successfully');
      } else {
        const msg =
          result?.data?.message || result?.error || 'Failed to assign task.';
        Alert.alert('Error', msg);
        return;
      }

      // Reset fields
      setTitle('');
      setDescription('');
      setClassName('');

      navigation.goBack();
    } catch (err) {
      console.log('Task Assign Error:', err?.message || err);
      Alert.alert('Error', 'Unexpected error while assigning task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Assign a New Task</Text>

        <TextInput
          placeholder="Task Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Description"
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          placeholder="Class Name (e.g., 10A)"
          style={styles.input}
          value={className}
          onChangeText={setClassName}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleAssign}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Assigning...' : 'Assign Task'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f5ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
