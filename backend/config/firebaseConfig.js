// config/firebaseConfig.js
require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');

// Load the service account key you downloaded from Firebase
const serviceAccount = require(path.join(
  __dirname,
  '../serviceAccountKey.json',
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
