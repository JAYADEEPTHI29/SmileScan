export interface User {
  id: string;
  email: string;
  name: string;
  role: 'DOCTOR' | 'ADMIN';
  hospital?: string;
  department?: string;
  specialization?: string;
  experienceYears?: number;
  photoUrl?: string;
  createdAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastScanDate?: string;
  systemicConditions?: string[];
  notes?: string;
  createdAt?: string;
}

export interface Scan {
  id: string;
  patientId: string;
  patientName?: string;
  imageUrl: string;
  segmentedUrl?: string;
  prediction: string;
  confidence: number;
  severity: 'NOT_AVAILABLE' | 'MILD' | 'MODERATE' | 'SEVERE';
  isToothImage?: boolean;
  toothAreaPercentage?: number;
  affectedTeeth?: number[];
  recommendations?: string[];
  suggestedMedicines?: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  homeRemedies?: string[];
  referralRecommended?: boolean;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface MedicalReportData {
  reportId: string;
  scanDate: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientId: string;
  prediction: string;
  confidence: number;
  severity: string;
  toothAreaPercentage: number;
  affectedTeeth: number[];
  recommendations: string[];
  suggestedMedicines: Array<{ name: string; dosage: string; duration: string }>;
  homeRemedies: string[];
  referralRecommended: boolean;
  doctorName: string;
  hospital: string;
}
