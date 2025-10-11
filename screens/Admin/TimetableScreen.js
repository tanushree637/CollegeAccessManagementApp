import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';

const timetableDataInitial = {
  IT: [
    { day: 'Monday', subject: 'Math' },
    { day: 'Tuesday', subject: 'Physics' },
  ],
  CSE: [
    { day: 'Monday', subject: 'Data Structures' },
    { day: 'Tuesday', subject: 'Algorithms' },
  ],
  AIDS: [
    { day: 'Monday', subject: 'Artificial Intelligence' },
    { day: 'Tuesday', subject: 'Machine Learning' },
  ],
};

const TimetableScreen = () => {
  const [tab, setTab] = useState('view'); // 'view' or 'upload'
  const [selectedClass, setSelectedClass] = useState('IT');
  const [timetableData, setTimetableData] = useState(timetableDataInitial);

  // Handle upload (for demo, just add a new entry)
  const handleUpload = () => {
    Alert.prompt(
      'Upload Timetable',
      `Add a subject for ${selectedClass}`,
      text => {
        if (!text) return;
        const newEntry = { day: 'New Day', subject: text };
        setTimetableData(prev => ({
          ...prev,
          [selectedClass]: [...prev[selectedClass], newEntry],
        }));
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timetable Management</Text>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'view' && styles.activeTab]}
          onPress={() => setTab('view')}
        >
          <Text
            style={[styles.tabText, tab === 'view' && styles.activeTabText]}
          >
            View Timetable
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'upload' && styles.activeTab]}
          onPress={() => setTab('upload')}
        >
          <Text
            style={[styles.tabText, tab === 'upload' && styles.activeTabText]}
          >
            Upload Timetable
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {tab === 'view' ? (
        <View style={styles.viewContainer}>
          {/* Class Selector */}
          <View style={styles.classContainer}>
            {Object.keys(timetableData).map(cls => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classBtn,
                  selectedClass === cls && styles.selectedClassBtn,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.classBtnText,
                    selectedClass === cls && styles.selectedClassBtnText,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Timetable List */}
          <FlatList
            data={timetableData[selectedClass]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.timetableCard}>
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.subjectText}>{item.subject}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          <Text style={styles.subtitle}>
            Upload a new subject for {selectedClass}
          </Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
            <Text style={styles.uploadBtnText}>Add Subject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#004aad',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#004aad',
  },
  tabText: {
    color: '#004aad',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  // View Timetable Styles
  viewContainer: {},
  classContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  classBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#004aad',
  },
  selectedClassBtn: {
    backgroundColor: '#004aad',
  },
  classBtnText: {
    color: '#004aad',
    fontWeight: 'bold',
  },
  selectedClassBtnText: {
    color: '#fff',
  },
  timetableCard: {
    backgroundColor: '#f5f6ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    fontWeight: '600',
    fontSize: 16,
  },
  subjectText: {
    fontSize: 16,
    color: '#004aad',
    fontWeight: '600',
  },
  // Upload Timetable Styles
  uploadContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  uploadBtn: {
    backgroundColor: '#004aad',
    padding: 15,
    borderRadius: 10,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
