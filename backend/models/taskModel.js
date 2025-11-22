const admin = require('firebase-admin');
const db = admin.firestore();
const taskRef = db.collection('tasks');

module.exports = {
  async createTask(data) {
    const task = await taskRef.add(data);
    return { id: task.id, ...data };
  },

  async getTasksByUser(userId) {
    const snapshot = await taskRef.where('assignedTo', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAllTasks() {
    const snapshot = await taskRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getTasksByTeacher(teacherId) {
    const snapshot = await taskRef.where('teacherId', '==', teacherId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateTask(id, data) {
    await taskRef.doc(id).update(data);
    return { id, ...data };
  },

  async deleteTask(id) {
    await taskRef.doc(id).delete();
    return true;
  },
};
