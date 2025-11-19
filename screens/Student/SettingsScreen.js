// screens/Student/SettingsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [attendanceReminders, setAttendanceReminders] = useState(true);

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = 'http://192.168.1.7:5000';

  // LOGOUT FUNCTION
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // CHANGE PASSWORD FUNCTION (Now connected to backend)
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Password updated successfully!');
        setChangePasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error. Try again.');
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need help?\n\n📧 Email: support@college.edu\n📞 Phone: +1 (555) 123-4567\n🕒 Mon–Fri, 9AM–5PM',
      [{ text: 'OK' }],
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About College Access Management',
      `Version: 1.0.0
Build: 2025.10.30

This app helps students manage class schedules, track attendance, and receive updates.

© 2025 College Management System`,
      [{ text: 'OK' }],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* USER PROFILE SECTION */}
      <View style={styles.userSection}>
        <View style={styles.userHeader}>
          {/* Profile Avatar */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Coming Soon', 'Profile Photo Upload Feature')
            }
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.fullName || 'Student User'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'student@college.edu'}
            </Text>

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role || 'Student'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              Alert.alert(
                'Edit Profile',
                'Profile editing feature coming soon!',
              );
            }}
          >
            <Ionicons name="create-outline" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ACCOUNT SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => setChangePasswordModal(true)}
        >
          <Ionicons name="key-outline" size={24} color="#6B7280" />
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-outline" size={24} color="#6B7280" />
          <Text style={styles.optionText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* NOTIFICATION SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>

        <View style={styles.switchContainer}>
          <Ionicons name="notifications-outline" size={24} color="#6B7280" />
          <Text style={styles.optionText}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
          />
        </View>

        <View style={styles.switchContainer}>
          <Ionicons name="alarm-outline" size={24} color="#6B7280" />
          <Text style={styles.optionText}>Attendance Reminders</Text>
          <Switch
            value={attendanceReminders}
            onValueChange={setAttendanceReminders}
            trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
          />
        </View>
      </View>

      {/* SUPPORT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={handleSupport}
        >
          <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
          <Text style={styles.optionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={handleAbout}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#6B7280"
          />
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 College Management System</Text>
      </View>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        visible={changePasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 24,
    marginTop: 40,
  },
  userSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 5,
  },
  userHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  roleBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: { fontSize: 12, color: '#0284C7', fontWeight: '600' },
  editButton: { padding: 8 },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: { fontSize: 16, color: '#374151', marginLeft: 12, flex: 1 },
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 16,
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingBottom: 40 },
  footerText: { fontSize: 12, color: '#9CA3AF' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  modalContent: { padding: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  modalButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
