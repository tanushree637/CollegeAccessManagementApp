// screens/Admin/CreateUserScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_CONFIG } from '../../config/config';
import { resolveBaseUrl, fetchWithTimeout } from '../../utils/network';
import {
  validateUserData,
  formatName,
  formatEmail,
  generateEmailPreview,
} from '../../utils/validationUtils';

export default function CreateUserScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    // Validate form data
    const validation = validateUserData({ fullName, email, role });

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join('\n');
      Alert.alert('Validation Error', errorMessages);
      return;
    }

    setLoading(true);
    try {
      let base = API_CONFIG.BASE_URL || (await resolveBaseUrl(false));
      if (!base) base = await resolveBaseUrl(true);
      if (!base) throw new Error('Base URL unresolved');

      const url = `${base}${API_CONFIG.ENDPOINTS.ADMIN}/create-user`;
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formatName(fullName),
          email: formatEmail(email),
          role,
        }),
        timeout: 12000,
      });

      const data = await res.json();
      if (data.success) {
        // Clear dashboard cache to force refresh
        global.dashboardCache = null;

        Alert.alert(
          'Success',
          `User created successfully!\n\nLogin credentials have been sent to ${email}.\n\nCollege Email: ${
            data.user?.email || 'Generated automatically'
          }\n\nTotal Users: ${data.totalUsers || 'Updated'}`,
          [
            {
              text: 'Create Another User',
              onPress: () => {
                setFullName('');
                setEmail('');
                setRole('');
              },
            },
            {
              text: 'Done',
              style: 'default',
              onPress: () => {
                setFullName('');
                setEmail('');
                setRole('');
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('CreateUser error:', error);
      const msg = /Base URL unresolved/i.test(error?.message)
        ? 'Cannot reach server. Ensure backend is running and device shares the same network.'
        : 'Failed to connect to server. Please check your internet connection.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // Generate email preview
  const emailPreview = generateEmailPreview(fullName, role);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Ionicons name="person-add" size={32} color="#1E3A8A" />
          <Text style={styles.title}>Create New User</Text>
          <Text style={styles.subtitle}>
            Enter user details to create account and send login credentials
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#4B5563" />
            <TextInput
              style={styles.input}
              placeholder="Enter full name (e.g., John Doe)"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#4B5563" />
            <TextInput
              style={styles.input}
              placeholder="Enter personal email (e.g., john@gmail.com)"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="briefcase-outline" size={22} color="#4B5563" />
            <Picker
              selectedValue={role}
              style={styles.picker}
              onValueChange={itemValue => setRole(itemValue)}
            >
              <Picker.Item
                label="Select user role..."
                value=""
                color="#9CA3AF"
              />
              <Picker.Item label="👨‍🏫 Teacher" value="teacher" />
              <Picker.Item label="👨‍🎓 Student" value="student" />
              {/*<Picker.Item label="🛡️ Security Guard" value="guard" />*/}
            </Picker>
          </View>

          {/* Email Preview */}
          {emailPreview && (
            <View style={styles.previewContainer}>
              <Ionicons name="at-outline" size={20} color="#059669" />
              <View style={styles.previewContent}>
                <Text style={styles.previewLabel}>College Email Preview:</Text>
                <Text style={styles.previewEmail}>{emailPreview}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#3B82F6"
            />
            <Text style={styles.infoText}>
              Login credentials will be auto-generated and sent to the provided
              email address.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateUser}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <Ionicons name="hourglass-outline" size={20} color="#fff" />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#fff"
                />
              )}
              <Text style={styles.buttonText}>
                {loading ? 'Creating User...' : 'Create User Account'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: 12,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  previewContent: {
    flex: 1,
    marginLeft: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 2,
  },
  previewEmail: {
    fontSize: 14,
    color: '#047857',
    fontFamily: 'monospace',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
