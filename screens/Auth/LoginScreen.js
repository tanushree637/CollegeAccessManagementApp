// screens/Auth/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { resolveBaseUrl, fetchWithTimeout } from '../../utils/network';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      setLoading(false);

      if (result && result.success) {
        const { role } = result;

        try {
          if (role === 'admin') navigation.replace('AdminNavigator');
          else if (role === 'teacher') navigation.replace('TeacherNavigator');
          else if (role === 'student') navigation.replace('StudentNavigator');
          else if (role === 'guard') navigation.replace('GuardNavigator');
          else Alert.alert('Error', 'Unknown role detected.');
        } catch (navErr) {
          console.error('Navigation error after login:', navErr);
          Alert.alert('Error', 'Navigation failed after login.');
        }
      } else {
        Alert.alert('Login Failed', result?.message || 'Unexpected error');
      }
    } catch (err) {
      setLoading(false);
      console.error('handleLogin error:', err);
      Alert.alert('Login Error', 'An unexpected error occurred.');
    }
  };

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      const base = await resolveBaseUrl(true);
      const res = await fetchWithTimeout(`${base}/`, {
        method: 'GET',
        timeout: 3000,
      });
      const ok = res.ok;
      setLoading(false);
      if (ok) {
        Alert.alert('Server Reachable', `Connected to: ${base}`);
      } else {
        Alert.alert(
          'Server Responded With Error',
          `URL: ${base} (status ${res.status})`,
        );
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Network Error', `${e?.message || e}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>College Access Management</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#555" />
        <TextInput
          placeholder="College email (e.g., s.john.doe.123@college.edu)"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#555" />
        <TextInput
          placeholder="Password (received via email)"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#718093', marginTop: 10 }]}
        onPress={handleTestConnection}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Test Connection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#2f3640',
  },
  button: {
    backgroundColor: '#273c75',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
