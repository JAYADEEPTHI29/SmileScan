import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Patient } from '../types/patient';
import { initialMockPatients } from '../utils/mockData';

const PATIENTS_COLLECTION = 'Patients';

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const q = query(collection(db, PATIENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Patient));
      }
    } catch (err) {
      console.warn('Firestore Patients query fallback.');
    }
    return initialMockPatients;
  },

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, PATIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Patient;
      }
    } catch (err) {
      console.warn('Firestore Patient getDoc fallback.');
    }
    return initialMockPatients.find(p => p.id === id) || null;
  },

  async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'lastVisit'>): Promise<Patient> {
    const newId = `pat_${Date.now()}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, PATIENTS_COLLECTION, newId), newPatient);
    } catch (err) {
      console.warn('Firestore Patient setDoc fallback.');
    }

    return newPatient;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
    try {
      const docRef = doc(db, PATIENTS_COLLECTION, id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn('Firestore Patient updateDoc fallback.');
    }
  },

  async deletePatient(id: string): Promise<void> {
    try {
      const docRef = doc(db, PATIENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore Patient deleteDoc fallback.');
    }
  }
};
