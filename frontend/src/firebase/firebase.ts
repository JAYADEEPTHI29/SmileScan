import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyASXxKqU4KfUQ-BD2a9_JmiyH2CKshABoE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smile-scan-d6681.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smile-scan-d6681',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smile-scan-d6681.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '662737404551',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:662737404551:web:1e34d939ba170995b26e22',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-7SHW7QRLBL',
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Firebase Analytics is not supported in this environment:', err);
  });
}

export { analytics };
export default app;
