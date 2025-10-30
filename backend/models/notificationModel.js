const admin = require('firebase-admin');
const db = admin.firestore();
const notificationRef = db.collection('notifications');

module.exports = {
  async sendNotification(data) {
    const notification = await notificationRef.add(data);
    return { id: notification.id, ...data };
  },

  async getUserNotifications(userId) {
    const snapshot = await notificationRef
      .where('recipient', '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markAsRead(id) {
    await notificationRef.doc(id).update({ isRead: true });
    return true;
  },
};
