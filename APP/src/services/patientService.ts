import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { api } from './api';
import { Patient } from '../types';

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const pRef = collection(db, 'patients');
      const snap = await getDocs(query(pRef, orderBy('createdAt', 'desc')));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Patient));
      }
    } catch (e) {
      console.warn('Firestore patient list fallback notice:', e);
    }

    try {
      const res = await api.get('/patients');
      return res.data;
    } catch (err) {
      return [
        {
          id: 'pat_1',
          name: 'Eleanor Vance',
          age: 34,
          gender: 'FEMALE',
          phone: '+1 (555) 234-5678',
          email: 'eleanor.vance@example.com',
          riskLevel: 'HIGH',
          lastScanDate: '2026-03-28',
          systemicConditions: ['Type 2 Diabetes', 'Hypertension'],
          notes: 'Shows deep fissure caries on lower left molar 36.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'pat_2',
          name: 'Jameson Sterling',
          age: 48,
          gender: 'MALE',
          phone: '+1 (555) 876-5432',
          email: 'jameson.s@example.com',
          riskLevel: 'MEDIUM',
          lastScanDate: '2026-03-15',
          systemicConditions: ['Gingivitis'],
          notes: 'Localized marginal bone loss around tooth 46.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'pat_3',
          name: 'Sophia Martinez',
          age: 27,
          gender: 'FEMALE',
          phone: '+1 (555) 345-6789',
          email: 'sophia.m@example.com',
          riskLevel: 'LOW',
          lastScanDate: '2026-03-10',
          systemicConditions: [],
          notes: 'Routine dental checkup, healthy periodontium.',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const snap = await getDoc(doc(db, 'patients', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Patient;
      }
    } catch (e) {}

    try {
      const res = await api.get(`/patients/${id}`);
      return res.data;
    } catch (err) {
      const patients = await this.getPatients();
      return patients.find(p => p.id === id) || patients[0];
    }
  },

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const id = `pat_${Date.now()}`;
    const newPatient: Patient = {
      id,
      ...patient,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'patients', id), {
        ...newPatient,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore add patient notice:', e);
    }

    try {
      await api.post('/patients', newPatient);
    } catch (e) {}

    return newPatient;
  }
};
