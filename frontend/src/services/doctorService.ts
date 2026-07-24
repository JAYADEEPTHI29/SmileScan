import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { User } from '../types/auth';

const DOCTORS_COLLECTION = 'Doctors';
const TREATMENTS_COLLECTION = 'Treatments';
const USER_SETTINGS_COLLECTION = 'UserSettings';

export const doctorService = {
  async getDoctorProfile(doctorId: string): Promise<User | null> {
    try {
      const docRef = doc(db, DOCTORS_COLLECTION, doctorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
    } catch (err) {
      console.warn('Firestore DoctorProfile getDoc fallback.');
    }
    return null;
  },

  async updateDoctorProfile(doctorId: string, updates: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, DOCTORS_COLLECTION, doctorId);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn('Firestore DoctorProfile updateDoc fallback.');
    }
  },

  async getAllDoctors(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, DOCTORS_COLLECTION));
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
      }
    } catch (err) {
      console.warn('Firestore Doctors query fallback.');
    }
    return [];
  },

  async saveUserSettings(userId: string, settings: any): Promise<void> {
    try {
      await setDoc(doc(db, USER_SETTINGS_COLLECTION, userId), {
        userId,
        ...settings,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore saveUserSettings fallback.');
    }
  }
};
