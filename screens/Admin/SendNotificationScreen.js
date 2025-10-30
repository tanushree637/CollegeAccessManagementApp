// screens/Admin/SendNotificationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_CONFIG } from '../../config/config';

export default function SendNotificationScreen() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !message || !targetRole) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN}/send-notification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, message, targetRole }),
        },
      );

      const data = await res.json();
      if (data.success) {
        Alert.alert(
          'Success',
          `Notification sent successfully to ${data.notification.recipientCount} users!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setTitle('');
                setMessage('');
                setTargetRole('');
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to send notification.');
      }
    } catch (error) {
      console.error('Send notification error:', error);
      Alert.alert(
        'Error',
        'Server connection failed. Please check your network.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Notification</Text>
      <Text style={styles.subtitle}>
        Send important updates to students and teachers
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="text-outline" size={22} color="#4B5563" />
        <TextInput
          style={styles.input}
          placeholder="Enter notification title..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { height: 100, alignItems: 'flex-start' },
        ]}
      >
        <Ionicons
          name="chatbox-outline"
          size={22}
          color="#4B5563"
          style={{ marginTop: 10 }}
        />
        <TextInput
          style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
          placeholder="Enter your notification message here..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="people-outline" size={22} color="#4B5563" />
        <Picker
          selectedValue={targetRole}
          style={styles.picker}
          onValueChange={itemValue => setTargetRole(itemValue)}
        >
          <Picker.Item label="Select recipients..." value="" color="#9CA3AF" />
          <Picker.Item label="All Users" value="all" />
          <Picker.Item label="Teachers Only" value="teacher" />
          <Picker.Item label="Students Only" value="student" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSend}
        disabled={loading}
      >
        <Ionicons
          name={loading ? 'hourglass-outline' : 'send-outline'}
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Notification'}
        </Text>
      </TouchableOpacity>

      {/* Info section */}
      <View style={styles.infoSection}>
        <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
        <Text style={styles.infoText}>
          Notifications will appear on the recipient's dashboard and
          notification screen.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    color: '#111827',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 12,
  },
  picker: {
    flex: 1,
    height: 45,
  },
  button: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
