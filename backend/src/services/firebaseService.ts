import { db, storage, isFirebaseInitialized } from '../config/firebaseAdmin';
import { Patient, ScanReport, Appointment, User, AuditLog } from '../types';

// In-Memory Data Storage (Mock / Zero-Config Fallback)
let mockUsers: User[] = [
  {
    id: 'doc_101',
    email: 'doctor@smilescan.com',
    name: 'Dr. Sarah Jenkins, DDS',
    role: 'DOCTOR',
    hospital: 'St. Jude Dental & Maxillofacial Center',
    department: 'Department of Endodontics & Radiology',
    experienceYears: 12,
    specialization: 'Endodontics & AI Diagnostics',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'admin_101',
    email: 'admin@smilescan.com',
    name: 'Dr. Marcus Vance',
    role: 'ADMIN',
    hospital: 'SmileScan Enterprise Medical',
    department: 'Clinical Operations & IT Infrastructure',
    experienceYears: 18,
    specialization: 'Chief Medical Officer & Hospital Admin',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    createdAt: '2024-11-01T08:30:00Z',
  }
];

let mockPatients: Patient[] = [
  {
    id: 'pat_1',
    fullName: 'Robert Chen',
    age: 42,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    email: 'robert.chen@example.com',
    address: '742 Evergreen Terrace, Springfield',
    medicalHistory: ['Hypertension', 'Penicillin Allergy'],
    dentalHistory: ['Restoration #14 (2022)', 'Crown #19 (2023)'],
    createdAt: '2026-01-10T10:00:00Z',
    lastVisit: '2026-07-15T14:30:00Z',
    riskLevel: 'Medium',
  },
  {
    id: 'pat_2',
    fullName: 'Elena Rostova',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 876-5432',
    email: 'elena.r@example.com',
    address: '1088 Ocean Drive, Miami, FL',
    medicalHistory: ['None'],
    dentalHistory: ['Orthodontic Braces (2018-2020)'],
    createdAt: '2026-02-14T11:20:00Z',
    lastVisit: '2026-07-20T09:15:00Z',
    riskLevel: 'Low',
  },
  {
    id: 'pat_3',
    fullName: 'David Miller',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    email: 'dmiller@example.com',
    address: '450 Pine Avenue, Seattle, WA',
    medicalHistory: ['Type 2 Diabetes', 'Osteoarthritis'],
    dentalHistory: ['Periodontal Therapy (2024)', 'Extraction #32 (2021)'],
    createdAt: '2025-11-05T15:45:00Z',
    lastVisit: '2026-07-22T16:00:00Z',
    riskLevel: 'High',
  }
];

let mockScans: ScanReport[] = [
  {
    id: 'scan_101',
    patientId: 'pat_1',
    patientName: 'Robert Chen',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    imageType: 'X-Ray',
    overallSeverity: 'High',
    overallConfidence: 94,
    status: 'Completed',
    notes: 'Severe periapical radiolucency noted around Tooth #19 root apex.',
    createdAt: '2026-07-22T11:30:00Z',
    predictions: [
      {
        disease: 'Periapical Periodontitis & Bone Loss',
        confidence: 94,
        affectedTeeth: [19],
        severity: 'High',
        description: 'Well-defined radiolucent lesion surrounding root apex with localized horizontal alveolar bone resorption.',
        recommendedTreatment: [
          'Endodontic Therapy (Root Canal Treatment)',
          'Biomechanical preparation and sodium hypochlorite irrigation',
          'Crown lengthening & full coverage PFM/Zirconia crown'
        ],
        suggestedMedicines: [
          { name: 'Augmentin (Amoxicillin/Clavulanate)', dosage: '625 mg', duration: 'Every 8 hours for 7 days' },
          { name: 'Ketorolac Tromethamine', dosage: '10 mg', duration: 'Every 6 hours as needed for severe pain' }
        ],
        homeRemedies: [
          'Warm salt water rinses (1/2 tsp salt in 200ml warm water 4x daily)',
          'Avoid chewing hard foods on the affected quadrant'
        ],
        specialistRecommendation: 'Endodontist'
      }
    ]
  }
];

let mockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    patientId: 'pat_1',
    patientName: 'Robert Chen',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-25',
    time: '10:00 AM',
    type: 'Root Canal Follow-up',
    status: 'Scheduled',
    notes: 'Evaluate symptom relief and start canal obturation.',
    createdAt: '2026-07-22T12:00:00Z',
  },
  {
    id: 'apt_2',
    patientId: 'pat_2',
    patientName: 'Elena Rostova',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-25',
    time: '02:30 PM',
    type: 'Routine Hygiene & AI Scan',
    status: 'Scheduled',
    notes: 'Prophylaxis and full mouth radiograph screening.',
    createdAt: '2026-07-20T09:30:00Z',
  },
  {
    id: 'apt_3',
    patientId: 'pat_3',
    patientName: 'David Miller',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-24',
    time: '11:15 AM',
    type: 'Periodontal Evaluation',
    status: 'Completed',
    notes: 'Deep scaling performed on upper right quadrant.',
    createdAt: '2026-07-18T14:00:00Z',
  }
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'doc_101',
    userName: 'Dr. Sarah Jenkins, DDS',
    action: 'AI_SCAN_PERFORMED',
    details: 'Initiated dental radiograph AI prediction scan for Patient Robert Chen (pat_1)',
    timestamp: '2026-07-22T11:30:00Z',
    ipAddress: '192.168.1.105'
  },
  {
    id: 'log_2',
    userId: 'doc_101',
    userName: 'Dr. Sarah Jenkins, DDS',
    action: 'REPORT_GENERATED',
    details: 'Generated official clinical decision PDF report #scan_101',
    timestamp: '2026-07-22T11:32:00Z',
    ipAddress: '192.168.1.105'
  }
];

export const FirebaseService = {
  // --- USERS ---
  async getUserByEmail(email: string): Promise<User | null> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('users').where('email', '==', email).limit(1).get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(user: User): Promise<User> {
    if (isFirebaseInitialized && db) {
      await db.collection('users').doc(user.id).set(user);
      return user;
    }
    mockUsers.push(user);
    return user;
  },

  async getAllUsers(): Promise<User[]> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('users').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    }
    return mockUsers;
  },

  // --- PATIENTS ---
  async getPatients(): Promise<Patient[]> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('patients').orderBy('createdAt', 'desc').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    }
    return mockPatients;
  },

  async getPatientById(id: string): Promise<Patient | null> {
    if (isFirebaseInitialized && db) {
      const doc = await db.collection('patients').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as Patient;
    }
    return mockPatients.find(p => p.id === id) || null;
  },

  async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'lastVisit'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patientData,
      id: `pat_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
    };

    if (isFirebaseInitialized && db) {
      await db.collection('patients').doc(newPatient.id).set(newPatient);
      return newPatient;
    }

    mockPatients.unshift(newPatient);
    return newPatient;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    if (isFirebaseInitialized && db) {
      const ref = db.collection('patients').doc(id);
      await ref.update(updates);
      const updated = await ref.get();
      return { id: updated.id, ...updated.data() } as Patient;
    }

    const idx = mockPatients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockPatients[idx] = { ...mockPatients[idx], ...updates };
    return mockPatients[idx];
  },

  async deletePatient(id: string): Promise<boolean> {
    if (isFirebaseInitialized && db) {
      await db.collection('patients').doc(id).delete();
      return true;
    }

    const initialLen = mockPatients.length;
    mockPatients = mockPatients.filter(p => p.id !== id);
    return mockPatients.length < initialLen;
  },

  // --- SCANS & REPORTS ---
  async getScans(): Promise<ScanReport[]> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('scans').orderBy('createdAt', 'desc').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanReport));
    }
    return mockScans;
  },

  async getScanById(id: string): Promise<ScanReport | null> {
    if (isFirebaseInitialized && db) {
      const doc = await db.collection('scans').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as ScanReport;
    }
    return mockScans.find(s => s.id === id) || null;
  },

  async saveScanReport(report: ScanReport): Promise<ScanReport> {
    if (isFirebaseInitialized && db) {
      await db.collection('scans').doc(report.id).set(report);
      return report;
    }
    mockScans.unshift(report);
    return report;
  },

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('appointments').orderBy('date', 'asc').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    }
    return mockAppointments;
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const newApt: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseInitialized && db) {
      await db.collection('appointments').doc(newApt.id).set(newApt);
      return newApt;
    }

    mockAppointments.push(newApt);
    return newApt;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    if (isFirebaseInitialized && db) {
      const ref = db.collection('appointments').doc(id);
      await ref.update({ status });
      const updated = await ref.get();
      return { id: updated.id, ...updated.data() } as Appointment;
    }

    const idx = mockAppointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    mockAppointments[idx].status = status;
    return mockAppointments[idx];
  },

  async deleteAppointment(id: string): Promise<boolean> {
    if (isFirebaseInitialized && db) {
      await db.collection('appointments').doc(id).delete();
      return true;
    }

    const initialLen = mockAppointments.length;
    mockAppointments = mockAppointments.filter(a => a.id !== id);
    return mockAppointments.length < initialLen;
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLog[]> {
    if (isFirebaseInitialized && db) {
      const snap = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(100).get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    }
    return mockAuditLogs;
  },

  async logAuditAction(userId: string, userName: string, action: string, details: string, ipAddress?: string): Promise<void> {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress || '127.0.0.1',
    };

    if (isFirebaseInitialized && db) {
      await db.collection('audit_logs').doc(log.id).set(log);
    } else {
      mockAuditLogs.unshift(log);
    }
  }
};
