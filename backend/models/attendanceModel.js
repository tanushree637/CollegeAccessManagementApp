const admin = require('firebase-admin');
const db = admin.firestore();
const attendanceRef = db.collection('attendance');

module.exports = {
  async markAttendance(data) {
    const record = await attendanceRef.add(data);
    return { id: record.id, ...data };
  },

  async getAttendanceByUser(userId) {
    const snapshot = await attendanceRef.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAttendanceByDate(date) {
    const snapshot = await attendanceRef.where('date', '==', date).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
