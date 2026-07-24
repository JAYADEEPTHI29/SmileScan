import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AppNotification } from '../contexts/NotificationContext';

const NOTIFICATIONS_COLLECTION = 'Notifications';

export const notificationService = {
  async getNotifications(userId: string): Promise<AppNotification[]> {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      }
    } catch (err) {
      console.warn('Firestore Notifications query fallback.');
    }
    return [];
  },

  async createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): Promise<void> {
    const notifId = `notif_${Date.now()}`;
    try {
      await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notifId), {
        id: notifId,
        userId,
        title,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore createNotification fallback.');
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.warn('Firestore markAsRead fallback.');
    }
  }
};
