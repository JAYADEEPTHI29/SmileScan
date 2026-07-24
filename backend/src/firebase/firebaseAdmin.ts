import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

let isFirebaseInitialized = false;

try {
  const serviceAccountFilePath = path.join(__dirname, '../../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountFilePath)) {
    const serviceAccount = require(serviceAccountFilePath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id || 'smile-scan-d6681'}.firebasestorage.app`,
    });
    isFirebaseInitialized = true;
    console.log(`✅ Firebase Admin SDK initialized from serviceAccountKey.json for project: ${serviceAccount.project_id}`);
  } else if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey && !config.firebase.privateKey.includes('REPLACE')) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${config.firebase.projectId}.firebasestorage.app`,
    });
    isFirebaseInitialized = true;
    console.log(`✅ Firebase Admin SDK initialized from .env for project: ${config.firebase.projectId}`);
  } else {
    console.log(`ℹ️ Firebase Admin SDK: Credentials not set yet. Place downloaded JSON file at backend/serviceAccountKey.json or set variables in .env`);
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization notice:', error);
}

export const db = isFirebaseInitialized ? admin.firestore() : null;
export const auth = isFirebaseInitialized ? admin.auth() : null;
export const storage = isFirebaseInitialized ? admin.storage() : null;
export { isFirebaseInitialized, admin };
export default admin;
