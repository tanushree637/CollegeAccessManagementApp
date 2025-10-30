const admin = require('firebase-admin');
const db = admin.firestore();
const userRef = db.collection('users');

module.exports = {
  async createUser(data) {
    const user = await userRef.add(data);
    return { id: user.id, ...data };
  },

  async getUserByEmail(email) {
    const snapshot = await userRef.where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async getAllUsers() {
    const snapshot = await userRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateUser(id, data) {
    await userRef.doc(id).update(data);
    return { id, ...data };
  },

  async deleteUser(id) {
    await userRef.doc(id).delete();
    return true;
  },
};
