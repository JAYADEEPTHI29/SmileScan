import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Appointment } from '../types/appointment';
import { initialMockAppointments } from '../utils/mockData';

const APPOINTMENTS_COLLECTION = 'Appointments';

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      }
    } catch (err) {
      console.warn('Firestore Appointments query fallback.');
    }
    return initialMockAppointments;
  },

  async createAppointment(apt: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const newId = `apt_${Date.now()}`;
    const newApt: Appointment = {
      ...apt,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, APPOINTMENTS_COLLECTION, newId), newApt);
    } catch (err) {
      console.warn('Firestore Appointment setDoc fallback.');
    }

    return newApt;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.warn('Firestore Appointment updateDoc fallback.');
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore Appointment deleteDoc fallback.');
    }
  }
};
