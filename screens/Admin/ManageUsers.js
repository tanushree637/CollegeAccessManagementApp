import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';

const dummyUsers = [
  { id: '1', name: 'John Doe', role: 'Teacher' },
  { id: '2', name: 'Alice Smith', role: 'Student' },
  { id: '3', name: 'Rahul Patel', role: 'Student' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Add user
  const addUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: `New User ${users.length + 1}`,
      role: 'Student',
    };
    setUsers([...users, newUser]);
  };

  // Open edit modal
  const openEditModal = user => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setModalVisible(true);
  };

  // Save edited user
  const saveEdit = () => {
    if (!editName.trim()) return alert('Name cannot be empty');
    setUsers(prev =>
      prev.map(u =>
        u.id === selectedUser.id ? { ...u, name: editName, role: editRole } : u,
      ),
    );
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => openEditModal(item)}
      >
        <Text style={styles.btnText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity style={styles.addBtn} onPress={addUser}>
        <Text style={styles.btnText}>+ Add User</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              style={styles.input}
            />
            <TextInput
              value={editRole}
              onChangeText={setEditRole}
              placeholder="Role"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#004aad' }]}
                onPress={saveEdit}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#777' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userRole: {
    color: '#777',
  },
  editBtn: {
    backgroundColor: '#004aad',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#004aad',
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
});
