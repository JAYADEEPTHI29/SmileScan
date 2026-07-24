import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { ScanReport } from '../types/scan';
import { initialMockScans } from '../utils/mockData';

const REPORTS_COLLECTION = 'Reports';
const AI_RESULTS_COLLECTION = 'AIResults';

export const reportService = {
  async getAllReports(): Promise<ScanReport[]> {
    try {
      const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as ScanReport));
      }
    } catch (err) {
      console.warn('Firestore Reports query fallback.');
    }
    return initialMockScans;
  },

  async getReportById(id: string): Promise<ScanReport | null> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ScanReport;
      }
    } catch (err) {
      console.warn('Firestore Report getDoc fallback.');
    }
    return initialMockScans.find(s => s.id === id) || null;
  },

  async saveReport(report: ScanReport): Promise<ScanReport> {
    try {
      // Save report in Reports collection
      await setDoc(doc(db, REPORTS_COLLECTION, report.id), report);

      // Save AI analysis result in AIResults collection
      await setDoc(doc(db, AI_RESULTS_COLLECTION, `ai_${report.id}`), {
        scanId: report.id,
        patientId: report.patientId,
        predictions: report.predictions,
        overallConfidence: report.overallConfidence,
        overallSeverity: report.overallSeverity,
        createdAt: report.createdAt,
      });
    } catch (err) {
      console.warn('Firestore saveReport fallback.');
    }
    return report;
  }
};
